// Página de confirmação do pedido.
//
// O agente do WhatsApp envia um link como:
//   /pedido/principal?itens=2xAGUA20,1xGAS13&nome=Maria+Silva&tel=51999999999&end=Rua+X+100&pag=DINHEIRO&troco=100
// O cliente confere, ajusta se precisar e confirma. O pedido é gravado no Firestore
// (clientes/{cliente}/pedidos/{id})
// e o Gateway Mania, no PC da loja, busca, lança no ATEC e atualiza o status aqui.
//
// Sem SDK do Firebase: só a API REST, com a chave pública do app web (as regras do Firestore
// limitam o que pode ser gravado). Produtos e preços vêm de clientes/{cliente}/catalogo/{número}, publicado pelo Gateway.
//
// Os dados ficam separados por cliente (empresa) desde já — o mesmo formato da futura plataforma online,
// onde o cliente virá do endereço (/{cliente}/{número}). Aqui o site é de um cliente só.

const FIREBASE = {
  apiKey: 'AIzaSyBvs2dIQhB8SXEaIGERrnJ3GGP-PkmL4mI',
  projectId: 'grupomania',
};
/** Empresa dona deste site (identificador na plataforma). */
const CLIENTE = 'grupomania';
const BASE = `https://firestore.googleapis.com/v1/projects/${FIREBASE.projectId}/databases/(default)/documents`;
const ORDERS = `clientes/${CLIENTE}/pedidos`;
const CATALOG = `clientes/${CLIENTE}/catalogo`;
const LOOKUPS = `clientes/${CLIENTE}/consultas`;
/** Pedido não processado some sozinho do Firebase depois deste prazo (política de TTL no campo expiraEm). */
const EXPIRE_DAYS = 30;
const PAYMENTS = ['PIX', 'DINHEIRO', 'DEBITO', 'CREDITO'];
const STATUS_ORDER = ['novo', 'recebido', 'confirmado'];

const $ = (id) => document.getElementById(id);
const brl = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const state = {
  filial: '',
  catalog: null, // { nome, produtos: [{ codigo, nome, preco }] }
  items: [], // { codigo, qtd, escolha? } — escolha = marca escolhida quando o código é um produto genérico (ex.: AGUA)
  // cadastro pelo telefone: 'idle' | 'searching' | 'found' | 'new' | 'unknown' (sem resposta da loja)
  lookup: { status: 'idle', phone: '', id: '', nome: '', endereco: null },
  linkAddress: '',
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
  if (v instanceof Date) return { timestampValue: v.toISOString() };
  if (typeof v === 'string') return { stringValue: v };
  if (typeof v === 'boolean') return { booleanValue: v };
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
// O WhatsApp não passa o número do cliente para o link: depois do 1º pedido, este celular lembra
// o telefone (e o nome) e preenche sozinho nos próximos. Fica só neste aparelho.
const CLIENT_KEY = 'gm-cliente';
function rememberClient(tel, nome) {
  try {
    localStorage.setItem(CLIENT_KEY, JSON.stringify({ tel, nome }));
  } catch {
    /* sem armazenamento */
  }
}
function savedClient() {
  try {
    const v = JSON.parse(localStorage.getItem(CLIENT_KEY) || 'null');
    return v && typeof v.tel === 'string' ? { tel: v.tel, nome: typeof v.nome === 'string' ? v.nome : '' } : null;
  } catch {
    return null;
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
/** Produto genérico (ex.: AGUA = "Água 20 litros", o cliente escolhe a marca). */
const group = (codigo) => state.catalog?.grupos?.find((g) => g.codigo === codigo) ?? null;
/** Código que vai no pedido: a marca escolhida, se o item for genérico. */
const effective = (item) => (group(item.codigo) ? item.escolha ?? '' : item.codigo);

/** Marca a mesma opção do último pedido do cliente (ou a única opção) nos itens genéricos ainda sem escolha. */
function applySuggestions() {
  const last = state.lookup.ultimoPedido ?? [];
  for (const item of state.items) {
    const g = group(item.codigo);
    if (!g || item.escolha) continue;
    if (g.opcoes.length === 1) {
      item.escolha = g.opcoes[0];
      continue;
    }
    const previous = last.find((l) => g.opcoes.includes(l.codigo));
    if (previous) {
      item.escolha = previous.codigo;
      item.sugerido = true;
    }
  }
}

function renderItems() {
  const list = $('items');
  list.replaceChildren(
    ...state.items.map((item, index) => {
      const g = group(item.codigo);
      const p = product(effective(item));
      const li = document.createElement('li');
      li.className = g ? 'item item--group' : 'item';
      const info = document.createElement('div');
      const name = document.createElement('div');
      name.className = 'item__name';
      name.textContent = g ? (p ? p.nome : g.nome) : p ? p.nome : item.codigo;
      const price = document.createElement('div');
      price.className = 'item__price';
      price.textContent =
        p && typeof p.preco === 'number' ? `${brl(p.preco)} cada` : g ? 'Escolha a marca abaixo' : state.catalog ? '' : 'Preço confirmado pela loja';
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
      if (g) li.append(brandPicker(item, g));
      if (state.catalog && !g && !p) {
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

/** Opções de marca de um item genérico (ex.: "Água 20 litros"). */
function brandPicker(item, g) {
  const box = document.createElement('div');
  box.className = 'brands';
  box.setAttribute('role', 'radiogroup');
  box.setAttribute('aria-label', `Marca — ${g.nome}`);
  if (item.sugerido && item.escolha) {
    const tag = document.createElement('p');
    tag.className = 'brands__hint';
    tag.textContent = 'Igual ao seu último pedido. Pode trocar se quiser.';
    box.append(tag);
  }
  for (const codigo of g.opcoes) {
    const p = product(codigo);
    if (!p) continue;
    const label = document.createElement('label');
    label.className = 'brand';
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = `marca-${state.items.indexOf(item)}`;
    input.value = codigo;
    input.checked = item.escolha === codigo;
    input.addEventListener('change', () => {
      item.escolha = codigo;
      item.sugerido = false;
      renderItems();
    });
    const text = document.createElement('span');
    const n = document.createElement('b');
    n.textContent = p.nome;
    text.append(n);
    if (typeof p.preco === 'number') {
      const v = document.createElement('span');
      v.textContent = brl(p.preco);
      text.append(v);
    }
    label.append(input, text);
    box.append(label);
  }
  return box;
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
    const p = product(effective(item));
    if (p && typeof p.preco === 'number') total += p.preco * item.qtd;
    else complete = false;
  }
  const pending = state.items.some((i) => group(i.codigo) && !i.escolha);
  $('total').textContent = state.items.length === 0 || (pending && total === 0) ? '—' : complete ? brl(total) : total > 0 ? `${brl(total)} +` : 'A confirmar';
  $('total-note').textContent = pending
    ? 'Escolha a marca para ver o total.'
    : complete
      ? 'O valor final é confirmado pela loja.'
      : 'Alguns preços serão confirmados pela loja.';
}

const form = $('order-form');
const field = (name) => form.elements.namedItem(name);

function updateTroco() {
  const pag = form.querySelector('input[name="pagamento"]:checked')?.value;
  $('troco-box').hidden = pag !== 'DINHEIRO';
}
form.querySelectorAll('input[name="pagamento"]').forEach((r) => r.addEventListener('change', updateTroco));

function fill(link) {
  // o telefone vem no link (a IA põe o número do WhatsApp da conversa); sem ele, usa o que este celular lembrou
  const fromLink = mobileWithNine(phoneDigits(link.tel));
  const saved = fromLink.length >= 10 ? null : savedClient();
  const tel = fromLink.length >= 10 ? fromLink : saved ? mobileWithNine(phoneDigits(saved.tel)) : '';
  link = { ...link, tel, nome: link.nome || saved?.nome || '' };
  field('nome').value = link.nome;
  field('telefone').value = formatPhone(link.tel);
  setPhoneLinked(link.tel.length === 10 || link.tel.length === 11);
  field('cpf').value = link.cpf;
  field('endereco').value = link.end;
  field('complemento').value = link.comp;
  field('obs').value = link.obs;
  state.linkAddress = link.end;
  if (link.pag) form.querySelector(`input[name="pagamento"][value="${link.pag}"]`).checked = true;
  if (link.troco) field('troco').value = String(link.troco).replace('.', ',');
  // informações adicionais já vêm abertas se o atendimento preencheu alguma
  if (link.cpf || link.comp || link.obs) $('more').open = true;
  updateTroco();
  renderDelivery();
  if (phoneDigits(link.tel).length >= 10) void lookupCustomer();
}

// ── Cadastro pelo telefone ───────────────────────────────
// A página pergunta à loja (Firestore → Gateway → ATEC) se o WhatsApp já tem cadastro;
// se tiver, o cliente só confirma o endereço. Sem resposta em alguns segundos, pede o endereço.
const phoneDigits = (text) => {
  let d = String(text ?? '').replace(/\D/g, '');
  if (d.length > 11 && d.startsWith('55')) d = d.slice(2);
  return d;
};

// Celular que veio sem o nono dígito (o WhatsApp informa assim números antigos: 51 8608-0783) → com o 9.
// Só para o telefone do link/lembrado: no que o cliente digita, 10 dígitos podem ser um número pela metade.
const mobileWithNine = (d) => (d.length === 10 && /[6-9]/.test(d[2]) ? `${d.slice(0, 2)}9${d.slice(2)}` : d);

// Telefone já conhecido (link ou este celular): mostra "vinculado ao WhatsApp …" em vez do campo,
// com "Trocar" para quem quiser usar outro número (ou se a IA errou o número).
function setPhoneLinked(linked) {
  $('phone-linked').hidden = !linked;
  $('phone-field').hidden = linked;
  if (linked) $('phone-linked-number').textContent = formatPhone(field('telefone').value);
}
$('phone-change').addEventListener('click', () => {
  setPhoneLinked(false);
  field('telefone').value = '';
  state.lookup = { status: 'idle', phone: '', id: '', nome: '', endereco: null };
  renderDelivery();
  field('telefone').focus();
});

let lookupTimer = null;
field('telefone').addEventListener('input', () => {
  clearTimeout(lookupTimer);
  const digits = phoneDigits(field('telefone').value);
  if (digits !== state.lookup.phone && state.lookup.status !== 'idle') {
    state.lookup = { status: 'idle', phone: '', id: '', nome: '', endereco: null };
    renderDelivery();
  }
  if (digits.length === 10 || digits.length === 11) lookupTimer = setTimeout(() => void lookupCustomer(), 600);
});
field('telefone').addEventListener('blur', () => {
  field('telefone').value = formatPhone(field('telefone').value);
});

async function lookupCustomer() {
  const digits = phoneDigits(field('telefone').value);
  if (digits.length < 10 || digits.length > 11 || digits === state.lookup.phone) return;
  const id = newId();
  state.lookup = { status: 'searching', phone: digits, id, nome: '', endereco: null };
  renderDelivery();
  try {
    await createDoc(LOOKUPS, id, {
      filial: state.filial,
      telefone: digits,
      status: 'nova',
      criadoEm: new Date().toISOString(),
      expiraEm: new Date(Date.now() + 60 * 60_000),
    });
  } catch {
    if (state.lookup.id === id) ((state.lookup.status = 'unknown'), renderDelivery());
    return;
  }
  const started = Date.now();
  while (state.lookup.id === id && Date.now() - started < 15_000) {
    await new Promise((r) => setTimeout(r, 1500));
    if (state.lookup.id !== id) return; // o cliente mudou o telefone
    try {
      const doc = await getDoc(`${LOOKUPS}/${id}`);
      if (doc?.status === 'respondida') {
        const ultimoPedido = Array.isArray(doc.ultimoPedido) ? doc.ultimoPedido : [];
        if (doc.encontrado && doc.endereco && (doc.endereco.rua || doc.endereco.bairro)) {
          state.lookup = { ...state.lookup, status: 'found', nome: doc.nome ?? '', endereco: doc.endereco, ultimoPedido };
        } else {
          state.lookup = { ...state.lookup, status: 'new', ultimoPedido };
        }
        renderDelivery();
        // "água" sem marca: marca a mesma do último pedido
        applySuggestions();
        renderItems();
        return;
      }
    } catch {
      /* tenta de novo */
    }
  }
  if (state.lookup.id === id) ((state.lookup.status = 'unknown'), renderDelivery());
}

const titleCase = (t) =>
  String(t ?? '')
    .toLowerCase()
    .replace(/(^|\s)(\p{L})/gu, (m, sp, ch) => sp + ch.toUpperCase())
    .replace(/\s(De|Da|Do|Das|Dos|E)\s/g, (m) => m.toLowerCase());

function formatAddress(e) {
  const street = [titleCase(e.rua), e.numero].filter(Boolean).join(', ');
  return [street, e.complemento, titleCase(e.bairro), titleCase(e.cidade)].filter(Boolean).join(' — ');
}

function destino() {
  return form.querySelector('input[name="destino"]:checked')?.value ?? 'cadastro';
}

function renderDelivery() {
  const { status, nome, endereco } = state.lookup;
  const msg = $('lookup-status');
  const found = status === 'found';
  msg.hidden = status === 'idle' || found;
  msg.className = `lookup lookup--${status}`;
  msg.textContent =
    status === 'searching'
      ? 'Procurando seu cadastro…'
      : status === 'new'
        ? 'Primeiro pedido por aqui? Informe seu nome e o endereço de entrega.'
        : status === 'unknown'
          ? 'Informe o endereço de entrega.'
          : '';
  $('found-box').hidden = !found;
  if (found) {
    const first = titleCase(String(nome).split(/\s+/)[0] ?? '');
    $('found-hello').textContent = first ? `Olá, ${first}! Encontramos seu cadastro.` : 'Encontramos seu cadastro.';
    $('found-address').textContent = formatAddress(endereco);
    // endereço que o cliente passou no WhatsApp tem preferência: deixa "outro endereço" marcado
    if (state.linkAddress && !$('found-box').dataset.touched) {
      form.querySelector('input[name="destino"][value="outro"]').checked = true;
    }
  }
  const needsAddress = !found || destino() === 'outro';
  $('address-field').hidden = !needsAddress;
  // nome só é pedido para quem ainda não tem cadastro
  $('name-field').hidden = found || status === 'idle' || status === 'searching';
}
form.querySelectorAll('input[name="destino"]').forEach((r) =>
  r.addEventListener('change', () => {
    $('found-box').dataset.touched = '1';
    renderDelivery();
    if (destino() === 'outro') field('endereco').focus();
  }),
);

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
  if (state.items.some((i) => group(i.codigo) && !i.escolha)) {
    problems.push('Escolha a marca da água.');
    document.querySelector('.item--group .brands')?.classList.add('invalid');
  }
  if (state.catalog && state.items.some((i) => !group(i.codigo) && !product(i.codigo))) problems.push('Remova o produto que não encontramos.');
  const phone = phoneDigits(field('telefone').value);
  if (phone.length < 10 || phone.length > 11) (problems.push('Informe seu WhatsApp com DDD.'), mark('telefone'));
  const found = state.lookup.status === 'found';
  if ((!found || destino() === 'outro') && !field('endereco').value.trim()) (problems.push('Informe o endereço de entrega.'), mark('endereco'));
  if (!found && !field('nome').value.trim() && state.lookup.status !== 'searching') {
    if (!$('name-field').hidden) (problems.push('Informe seu nome.'), mark('nome'));
  }
  if (state.lookup.status === 'searching') problems.push('Aguarde um instante: estamos procurando seu cadastro.');
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
  const found = state.lookup.status === 'found';
  const useRegistered = found && destino() === 'cadastro';
  const data = {
    filial: state.filial,
    status: 'novo',
    origem: 'link',
    telefone: phoneDigits(field('telefone').value).slice(0, 30),
    pagamento: pag,
    itens: state.items.map((i) => {
      const codigo = effective(i);
      const p = product(codigo);
      return p && typeof p.preco === 'number' ? { codigo, qtd: i.qtd, preco: p.preco } : { codigo, qtd: i.qtd };
    }),
    criadoEm: new Date().toISOString(),
    expiraEm: new Date(Date.now() + EXPIRE_DAYS * 86_400_000),
  };
  const nome = (found ? state.lookup.nome : field('nome').value).trim().slice(0, 80);
  if (nome) data.nome = nome;
  if (useRegistered) data.usarCadastro = true;
  else data.endereco = field('endereco').value.trim().slice(0, 200);
  if (state.lookup.id && state.lookup.status !== 'idle') data.consulta = state.lookup.id;
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
    await createDoc(ORDERS, id, data);
  } catch {
    btn.disabled = false;
    btn.lastChild.textContent = ' Confirmar pedido';
    errorBox.textContent = 'Não conseguimos enviar agora. Confira sua internet e tente de novo — ou responda no WhatsApp que a gente anota.';
    errorBox.hidden = false;
    return;
  }
  remember(id);
  rememberClient(data.telefone, data.nome ?? '');
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
      const doc = await getDoc(`${ORDERS}/${id}`);
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
      const doc = await getDoc(`${ORDERS}/${previous}`);
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
    state.catalog = await getDoc(`${CATALOG}/${link.filial}`);
  } catch {
    state.catalog = null; // sem catálogo: mostra os códigos e a loja confirma
  }
  if (state.catalog?.nome) $('store-name').textContent = state.catalog.nome;
  state.items = link.itens;
  applySuggestions();
  fill(link);
  renderItems();
  show('view-review');
}

void init();
