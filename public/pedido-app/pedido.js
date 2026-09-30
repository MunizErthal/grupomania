// Página de confirmação do pedido.
//
// O agente do WhatsApp envia um link como:
//   /pedido/principal?itens=2xAGUA20,1xGAS13&nome=Maria+Silva&tel=51999999999&end=Rua+X+100&pag=DINHEIRO&troco=100
// O cliente confere, ajusta se precisar e confirma. O pedido é gravado no Firestore (pedidos/{id})
// e o Gateway Mania, no PC da loja, busca, lança no ATEC e atualiza o status aqui.
//
// Sem SDK do Firebase: só a API REST, com a chave pública do app web (as regras do Firestore
// limitam o que pode ser gravado). Produtos e preços vêm de catalogo/{número}, publicado pelo Gateway.

const FIREBASE = {
  apiKey: 'AIzaSyBvs2dIQhB8SXEaIGERrnJ3GGP-PkmL4mI',
  projectId: 'grupomania',
};
const BASE = `https://firestore.googleapis.com/v1/projects/${FIREBASE.projectId}/databases/(default)/documents`;
const PAYMENTS = ['PIX', 'DINHEIRO', 'DEBITO', 'CREDITO'];
const STATUS_ORDER = ['novo', 'recebido', 'confirmado'];

const $ = (id) => document.getElementById(id);
const brl = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const state = {
  filial: '',
  catalog: null, // { nome, produtos: [{ codigo, nome, preco }] }
  items: [], // { codigo, qtd }
};

// ── Leitura do link ──────────────────────────────────────
function readLink() {
  const parts = location.pathname.split('/').filter(Boolean); // ['pedido', 'principal']
  const filial = decodeURIComponent(parts[1] ?? '').trim().toLowerCase();
  const q = new URLSearchParams(location.search);
  const get = (...names) => {
    for (const n of names) {
      const v = q.get(n);
      if (v && v.trim()) return v.trim();
    }
    return '';
  };
  return {
    filial,
    itens: parseItems(get('itens', 'items', 'i')),
    nome: get('nome', 'name'),
    tel: get('tel', 'telefone', 'fone'),
    cpf: get('cpf', 'doc'),
    end: get('end', 'endereco'),
    comp: get('comp', 'complemento'),
    pag: normalizePayment(get('pag', 'pagamento')),
    troco: parseMoney(get('troco')),
    obs: get('obs'),
  };
}

/** "2xAGUA20,1xGAS13" (tolerante a espaços, X maiúsculo, ";" e código sem quantidade). */
export function parseItems(text) {
  const out = new Map();
  for (const raw of text.split(/[,;]+/)) {
    const part = raw.trim().replace(/\s+/g, '');
    if (!part) continue;
    const m = /^(\d{1,2})?[xX*]?([A-Za-z][A-Za-z0-9]{0,29})$/.exec(part);
    if (!m) continue;
    const qtd = Math.min(99, Math.max(1, Number(m[1] ?? 1)));
    const codigo = m[2].toUpperCase();
    out.set(codigo, Math.min(99, (out.get(codigo) ?? 0) + qtd));
  }
  return [...out].map(([codigo, qtd]) => ({ codigo, qtd }));
}

export function normalizePayment(text) {
  const t = text.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase();
  if (!t) return '';
  if (t.includes('PIX')) return 'PIX';
  if (t.includes('DINHEIRO')) return 'DINHEIRO';
  if (t.includes('DEBITO')) return 'DEBITO';
  if (t.includes('CREDITO')) return 'CREDITO';
  return '';
}

export function parseMoney(text) {
  if (!text) return null;
  let t = String(text).replace(/[R$\s]/g, '');
  if (t.includes(',')) t = t.replace(/\./g, '').replace(',', '.');
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? n : null;
}

// ── Firestore (REST) ─────────────────────────────────────
function decode(v) {
  if (!v) return null;
  if ('stringValue' in v) return v.stringValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return Number(v.doubleValue);
  if ('booleanValue' in v) return v.booleanValue;
  if ('nullValue' in v) return null;
  if ('timestampValue' in v) return v.timestampValue;
  if ('mapValue' in v) return decodeFields(v.mapValue.fields ?? {});
  if ('arrayValue' in v) return (v.arrayValue.values ?? []).map(decode);
  return null;
}
const decodeFields = (fields) => Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, decode(v)]));

function encode(v) {
  if (v === null || v === undefined) return { nullValue: null };
  if (typeof v === 'string') return { stringValue: v };
  if (typeof v === 'number') return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(encode) } };
  return { mapValue: { fields: encodeFields(v) } };
}
const encodeFields = (obj) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, encode(v)]));

async function getDoc(path) {
  const res = await fetch(`${BASE}/${path}?key=${FIREBASE.apiKey}`, { cache: 'no-store' });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const body = await res.json();
  return decodeFields(body.fields ?? {});
}

async function createDoc(collection, id, data) {
  const res = await fetch(`${BASE}/${collection}?documentId=${id}&key=${FIREBASE.apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: encodeFields(data) }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

function newId() {
  const bytes = crypto.getRandomValues(new Uint8Array(15));
  return Array.from(bytes, (b) => 'abcdefghijklmnopqrstuvwxyz0123456789'[b % 36]).join('');
}

// ── Memória local: evita confirmar duas vezes o mesmo link ─
const memoKey = () => `gm-pedido:${location.pathname}${location.search}`;
function remember(id) {
  try {
    localStorage.setItem(memoKey(), id);
  } catch {
    /* navegador sem armazenamento: segue sem lembrar */
  }
}
function recall() {
  try {
    return localStorage.getItem(memoKey());
  } catch {
    return null;
  }
}

// ── Tela de revisão ──────────────────────────────────────
const product = (codigo) => state.catalog?.produtos?.find((p) => p.codigo === codigo) ?? null;

function renderItems() {
  const list = $('items');
  list.replaceChildren(
    ...state.items.map((item, index) => {
      const p = product(item.codigo);
      const li = document.createElement('li');
      li.className = 'item';
      const info = document.createElement('div');
      const name = document.createElement('div');
      name.className = 'item__name';
      name.textContent = p ? p.nome : item.codigo;
      const price = document.createElement('div');
      price.className = 'item__price';
      price.textContent = p && typeof p.preco === 'number' ? `${brl(p.preco)} cada` : state.catalog ? '' : 'Preço confirmado pela loja';
      info.append(name, price);

      const qty = document.createElement('div');
      qty.className = 'qty';
      const minus = button('−', `Diminuir ${name.textContent}`, () => changeQty(index, -1));
      const out = document.createElement('output');
      out.textContent = String(item.qtd);
      out.setAttribute('aria-label', 'Quantidade');
      const plus = button('+', `Aumentar ${name.textContent}`, () => changeQty(index, +1));
      qty.append(minus, out, plus);

      li.append(info, qty);
      if (state.catalog && !p) {
        const warn = document.createElement('div');
        warn.className = 'item__warn';
        warn.textContent = 'Não encontramos este produto. Remova e escolha na lista abaixo.';
        li.append(warn);
      }
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'item__remove';
      remove.textContent = 'Remover';
      remove.addEventListener('click', () => {
        state.items.splice(index, 1);
        renderItems();
      });
      li.append(remove);
      return li;
    }),
  );
  if (state.items.length === 0) {
    const li = document.createElement('li');
    li.className = 'item muted';
    li.textContent = 'Nenhum item. Escolha abaixo o que você quer pedir.';
    list.append(li);
  }
  renderAddOptions();
  renderTotal();
}

function button(label, aria, onClick) {
  const b = document.createElement('button');
  b.type = 'button';
  b.textContent = label;
  b.setAttribute('aria-label', aria);
  b.addEventListener('click', onClick);
  return b;
}

function changeQty(index, delta) {
  const item = state.items[index];
  item.qtd = Math.min(99, item.qtd + delta);
  if (item.qtd <= 0) state.items.splice(index, 1);
  renderItems();
}

function renderAddOptions() {
  const box = $('add-box');
  const produtos = state.catalog?.produtos ?? [];
  box.hidden = produtos.length === 0;
  const select = $('add-select');
  select.replaceChildren(
    new Option('Adicionar outro produto…', ''),
    ...produtos.map((p) => new Option(typeof p.preco === 'number' ? `${p.nome} — ${brl(p.preco)}` : p.nome, p.codigo)),
  );
}

$('add-btn').addEventListener('click', () => {
  const codigo = $('add-select').value;
  if (!codigo) return;
  const existing = state.items.find((i) => i.codigo === codigo);
  if (existing) existing.qtd = Math.min(99, existing.qtd + 1);
  else state.items.push({ codigo, qtd: 1 });
  renderItems();
});

function renderTotal() {
  let total = 0;
  let complete = state.items.length > 0;
  for (const item of state.items) {
    const p = product(item.codigo);
    if (p && typeof p.preco === 'number') total += p.preco * item.qtd;
    else complete = false;
  }
  $('total').textContent = state.items.length === 0 ? '—' : complete ? brl(total) : total > 0 ? `${brl(total)} +` : 'A confirmar';
  $('total-note').textContent = complete ? 'O valor final é confirmado pela loja.' : 'Alguns preços serão confirmados pela loja.';
}

const form = $('order-form');
const field = (name) => form.elements.namedItem(name);

function updateTroco() {
  const pag = form.querySelector('input[name="pagamento"]:checked')?.value;
  $('troco-box').hidden = pag !== 'DINHEIRO';
}
form.querySelectorAll('input[name="pagamento"]').forEach((r) => r.addEventListener('change', updateTroco));

function fill(link) {
  field('nome').value = link.nome;
  field('telefone').value = formatPhone(link.tel);
  field('cpf').value = link.cpf;
  field('endereco').value = link.end;
  field('complemento').value = link.comp;
  field('obs').value = link.obs;
  if (link.pag) form.querySelector(`input[name="pagamento"][value="${link.pag}"]`).checked = true;
  if (link.troco) field('troco').value = String(link.troco).replace('.', ',');
  updateTroco();
}

function formatPhone(text) {
  let d = text.replace(/\D/g, '');
  if (d.length > 11 && d.startsWith('55')) d = d.slice(2);
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return text;
}

function validate() {
  const problems = [];
  form.querySelectorAll('.invalid').forEach((el) => el.classList.remove('invalid'));
  const mark = (name) => field(name).closest('.field').classList.add('invalid');
  if (state.items.length === 0) problems.push('Escolha pelo menos um produto.');
  if (state.catalog && state.items.some((i) => !product(i.codigo))) problems.push('Remova o produto que não encontramos.');
  if (!field('nome').value.trim()) (problems.push('Informe seu nome.'), mark('nome'));
  const phone = field('telefone').value.replace(/\D/g, '');
  if (phone.length < 10 || phone.length > 13) (problems.push('Informe o telefone com DDD.'), mark('telefone'));
  if (!field('endereco').value.trim()) (problems.push('Informe o endereço de entrega.'), mark('endereco'));
  const pag = form.querySelector('input[name="pagamento"]:checked')?.value;
  if (!pag) {
    problems.push('Escolha a forma de pagamento.');
    form.querySelector('.pays').classList.add('invalid');
  }
  const trocoText = field('troco').value.trim();
  if (pag === 'DINHEIRO' && trocoText && parseMoney(trocoText) === null) (problems.push('Troco inválido.'), mark('troco'));
  return problems;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const errorBox = $('form-error');
  const problems = validate();
  if (problems.length) {
    errorBox.textContent = problems.join(' ');
    errorBox.hidden = false;
    form.querySelector('.invalid input, .invalid')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  errorBox.hidden = true;
  const btn = $('confirm-btn');
  btn.disabled = true;
  btn.lastChild.textContent = ' Enviando…';

  const pag = form.querySelector('input[name="pagamento"]:checked').value;
  const data = {
    filial: state.filial,
    status: 'novo',
    origem: 'link',
    nome: field('nome').value.trim().slice(0, 80),
    telefone: field('telefone').value.replace(/[^\d+]/g, '').slice(0, 30),
    endereco: field('endereco').value.trim().slice(0, 200),
    pagamento: pag,
    itens: state.items.map((i) => {
      const p = product(i.codigo);
      return p && typeof p.preco === 'number' ? { codigo: i.codigo, qtd: i.qtd, preco: p.preco } : { codigo: i.codigo, qtd: i.qtd };
    }),
    criadoEm: new Date().toISOString(),
  };
  const optional = {
    cpf: field('cpf').value.trim().slice(0, 18),
    complemento: field('complemento').value.trim().slice(0, 120),
    obs: field('obs').value.trim().slice(0, 300),
  };
  for (const [k, v] of Object.entries(optional)) if (v) data[k] = v;
  const troco = pag === 'DINHEIRO' ? parseMoney(field('troco').value) : null;
  if (troco) data.troco = troco;

  const id = newId();
  try {
    await createDoc('pedidos', id, data);
  } catch {
    btn.disabled = false;
    btn.lastChild.textContent = ' Confirmar pedido';
    errorBox.textContent = 'Não conseguimos enviar agora. Confira sua internet e tente de novo — ou responda no WhatsApp que a gente anota.';
    errorBox.hidden = false;
    return;
  }
  remember(id);
  showDone(id);
});

// ── Depois de confirmar: acompanha o status ──────────────
const DONE_TEXT = {
  novo: ['Pedido enviado', 'Já avisamos a loja. Esta página mostra quando o pedido for confirmado.'],
  recebido: ['Pedido recebido', 'A loja recebeu seu pedido e está conferindo.'],
  confirmado: ['Pedido confirmado', 'Tudo certo! Seu pedido já está com a equipe de entrega.'],
  cancelado: ['Pedido não aceito', 'A loja não pôde aceitar este pedido. Responda no WhatsApp que a gente resolve.'],
  erro: ['Não deu certo', 'Houve um problema com o pedido. Responda no WhatsApp que a gente resolve.'],
};

let pollTimer = null;

function showDone(id) {
  show('view-done');
  window.scrollTo({ top: 0 });
  renderStatus({ status: 'novo' });
  const started = Date.now();
  const poll = async () => {
    try {
      const doc = await getDoc(`pedidos/${id}`);
      if (doc) renderStatus(doc);
      if (doc && ['confirmado', 'cancelado', 'erro'].includes(doc.status)) return;
    } catch {
      /* sem internet: tenta de novo */
    }
    if (Date.now() - started < 30 * 60_000) pollTimer = setTimeout(poll, 5000);
  };
  clearTimeout(pollTimer);
  pollTimer = setTimeout(poll, 1500);
}

function renderStatus(doc) {
  const status = DONE_TEXT[doc.status] ? doc.status : 'novo';
  const [title, text] = DONE_TEXT[status];
  $('done-title').replaceChildren(title, Object.assign(document.createElement('span'), { className: 'hl', textContent: '.' }));
  $('done-text').textContent = status === 'erro' && doc.mensagem ? `${doc.mensagem} Responda no WhatsApp que a gente resolve.` : text;
  $('done-code').textContent = doc.codigo ? `Código do pedido: ${doc.codigo}` : '';
  const reached = STATUS_ORDER.indexOf(status);
  document.querySelectorAll('#steps li').forEach((li, i) => {
    li.classList.toggle('on', reached >= 0 && i <= reached);
    li.classList.toggle('current', reached >= 0 && i === reached + 1);
  });
  $('steps').hidden = status === 'cancelado' || status === 'erro';
}

function show(view) {
  for (const v of ['view-review', 'view-done', 'view-error']) $(v).hidden = v !== view;
  $('loading').hidden = true;
}

function fail(text) {
  $('error-text').textContent = text;
  show('view-error');
}

// ── Início ───────────────────────────────────────────────
async function init() {
  const link = readLink();
  state.filial = link.filial;
  if (!/^[a-z0-9-]{1,60}$/.test(link.filial)) return fail('Este link está incompleto. Peça um novo link no WhatsApp.');

  const previous = recall();
  if (previous) {
    try {
      const doc = await getDoc(`pedidos/${previous}`);
      if (doc) {
        $('store-name').textContent = '';
        showDone(previous);
        renderStatus(doc);
        return;
      }
    } catch {
      /* segue para a revisão */
    }
  }

  try {
    state.catalog = await getDoc(`catalogo/${link.filial}`);
  } catch {
    state.catalog = null; // sem catálogo: mostra os códigos e a loja confirma
  }
  if (state.catalog?.nome) $('store-name').textContent = state.catalog.nome;
  state.items = link.itens;
  fill(link);
  renderItems();
  show('view-review');
}

void init();
