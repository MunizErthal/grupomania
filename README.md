# Site do Grupo Mania D'Água

Site em Angular 20 (componentes standalone, signals, zoneless) com painel escondido para editar textos e imagens.

- **Site público:** `/`
- **Painel (escondido, sem link no site):** `/painel` → pede login em `/painel/entrar`

## Rodar no computador

Precisa do Node 20.19+ ou 22.12+.

```bash
npm install
npm start          # abre em http://localhost:4200
```

Enquanto o Firebase não estiver configurado, o site roda em **modo local**:
- login do painel: `admin@grupomania.local` / `mania2003` (troque em `src/environments/*.ts`)
- o que você publica fica salvo só naquele navegador (bom para testar).

## Ligar o Firebase (para o painel valer para todo mundo)

1. Crie um projeto em https://console.firebase.google.com
2. **Authentication** → Método de login → ative *E-mail/senha* → aba Usuários → *Adicionar usuário* (esse é o seu login do painel).
3. **Firestore Database** → criar banco (modo produção).
4. **Storage** → começar.
5. Configurações do projeto → *Seus apps* → adicionar app **Web** → copie o objeto `firebaseConfig`.
6. Cole os valores em `src/environments/environment.ts` (e em `environment.development.ts` se quiser testar com o Firebase localmente). Pode apagar o `localAdmin` (deixe `null`).
7. Regras de segurança: abra `firestore.rules` e `storage.rules`, troque `SEU_EMAIL_DE_ADMIN@exemplo.com` pelo e-mail do passo 2 e cole cada arquivo na aba **Regras** do Firestore e do Storage.
8. Authentication → Configurações → **Domínios autorizados** → adicione o domínio do site (ex.: `grupomaniadagua.com.br` e o `*.pages.dev`).

Como funciona: visitantes leem o conteúdo com uma única chamada à API do Firestore (sem baixar o SDK do Firebase). O SDK só é carregado dentro do painel.

## Publicar no Cloudflare Pages

- **Build command:** `npm run build`
- **Build output directory:** `dist/grupo-mania-site/browser`
- **Variável de ambiente:** `NODE_VERSION = 22`

O Cloudflare Pages já serve o `index.html` para qualquer rota (SPA), então `/painel` funciona direto. O arquivo `public/_headers` impede que o Google indexe o painel.

## Como o código está organizado (SOLID)

```
src/app/
  core/
    content/   modelo do conteúdo, conteúdo padrão, ContentStore (signals)
               portas: ContentSource (ler), ContentPublisher (publicar), MediaStorage (enviar arquivos)
               adaptadores: Firestore REST (público), localStorage (modo local)
    backend/   escolhe as implementações (Firebase ou local) — trocar de backend = trocar um provider
    auth/      porta AuthService + guards; LocalAuthService (dev)
    hours/     cálculo de "aberto agora" no fuso de São Paulo (signals + relógio)
    order/     monta o link do WhatsApp e guarda o rascunho do pedido
  features/
    public/    uma pasta por seção da página
    admin/     painel: esquema declarativo das seções (sections.ts) + editor genérico recursivo
  shared/ui/   ícones desenhados à mão
```

- **Responsabilidade única:** cada serviço faz uma coisa (ler conteúdo, publicar, subir mídia, autenticar, calcular horário, montar pedido).
- **Aberto/Fechado:** para deixar um campo novo editável, acrescente uma linha em `features/admin/sections.ts`; o formulário aparece sozinho.
- **Segregação de interfaces:** o site público só depende de `ContentSource`; publicar e enviar arquivos existem só no painel (carregado sob demanda).
- **Inversão de dependência:** componentes dependem das classes abstratas; `provide-backend.ts` e `provide-admin-backend.ts` decidem Firebase ou local.
- **Signals:** conteúdo, estado do pedido, relógio, status de entrega, rascunho do painel e estado de publicação.

## O que ainda falta você me passar

- Endereço, cidade e Instagram da **Primavera Gás** (o site mostra "Endereço em breve" até lá; dá para preencher no painel em *Depósitos*).
- Confirmar o endereço e WhatsApp da **Rincão**: usei os do site antigo (R. Rincão, 561 – Novo Hamburgo, 99762-8361). O folder 2024 e o Instagram falam em Estância Velha e 99578-8432.
- Se quiser, depoimentos reais de clientes (o site só usa o do site antigo).

## Arquivos de mídia

Fotos e logos em `public/img`, `public/logos`; o vídeo do pátio em `public/media/patio.mp4` (recortado do vídeo institucional, sem as legendas). Pelo painel dá para trocar qualquer um deles.
