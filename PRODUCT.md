# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Angular (standalone components, signals), SOLID-oriented services. Hosting: Cloudflare Pages (static front) + Firebase (Auth, Firestore, Storage) for the hidden admin panel that edits texts and images. Confirmed by the owner.

## Users

- Primary: households and small businesses in Estância Velha and Novo Hamburgo (RS) who ran out of cooking gas (GLP) or drinking water and want a refill delivered fast. Usually on a phone, often mid-task (stove went out, cooler empty).
- Secondary: people checking hours, the nearest depot, or whether there is delivery on Sunday/holiday.
- Operator: the owner (Ismael) editing texts and photos through a hidden admin panel.

## Product Purpose

Institutional + ordering site for Grupo Mania D'Água, a family group of gas and water depots. Success = the visitor reaches the right depot's WhatsApp with a ready message in as few taps as possible. The primary action is **Pedir pelo WhatsApp**.

## Positioning

Local, founded 03/03/2003 in Estância Velha; four neighborhood depots under one group; Supergasbras authorized reseller; a 24h self-service gas vending machine at the Rincão depot; delivery also weekends and holidays; card machine taken to the door.

## Operating Context

Depots (source: old site, owner confirmed old-site data wins where conflicting):

- **Mania D'Água** (matriz) — R. Frederico Hugo Engelmann, 28 – Bela Vista, Estância Velha – RS, 93614-020 — WhatsApp (51) 99662-1660 — fixo 3561-5782 — @maniadiagua — pedido: contate.me/maniadagua
- **Gás Guarani** — R. São Carlos, 71 – Guarani, Novo Hamburgo – RS, 93520-150 — WhatsApp (51) 99770-3178 — fixo 3527-4949 — @guaranigas — contate.me/gasguarani. Priority neighborhoods: Hamburgo Velho, Vila Nova, Guarani, Operário, Vila Rosa.
- **Rincão Gás** — R. Rincão, 561 – Rincão, Novo Hamburgo – RS, 93310-460 — WhatsApp (51) 99762-8361 — @rincaogas — contate.me/rincaogas. Has the 24h self-service gas machine ("Portaria 24h").
- **Primavera Gás** — newest depot (owner confirmed), with a Conveniência store front (Supergasbras). Phones from Instagram signage: (51) 99798-1300 and 3556-2160. Street address: OPEN (fill in via admin).

Hours (old site): gas delivery Mon–Fri 8:00–21:30, Sat 8:00–20:00, Sun 8:00–18:00; water delivery Mon–Fri 8:00–18:00, Sat 8:00–16:00, Sun 8:00–11:00. Weekend/holiday delivery yes.

Rincão 24h self-service machine (Instagram, June 2026): first 24h gas self-service in the region; Pix or card; works 24h; Rua Rincão, Estância Velha. Promotions (e.g. P13 price at the machine) are time-limited and must be admin-editable, never hard-coded.

Instagram bio: "Distribuidora de água mineral e gás · Há 22 anos abastecendo a energia do seu lar"; linktr.ee/maniadeagua.

## Capabilities and Constraints

- Products: GLP cylinders P5, P13, P20, P45; installation included; regulator kit (Aliança 506.01) installed free; brass GLP connections; mineral water 20L (brands Água da Pedra, Brisa, Elan); 500 ml packs (12), 200 ml cups (48), cup strips (100), manual pump for 20L, table-top dispenser, faucets and stand supports; sale and sanitising of electric water coolers; installation and maintenance of gas networks.
- Payment: card machine brought to the door (Visa, Mastercard, Elo, Hipercard, Banricompras), Pix.
- All public text and images must be editable from the hidden admin panel (login not linked from the public UI).
- No prices on the site (they change; old site did not list current prices).

## Brand Commitments

- Names: Grupo Mania D'Água; Mania D'Água – Distribuidora de Água Mineral e Gás; Gás Guarani; Rincão – Comércio de gás e água mineral; Primavera – Comércio de gás e água mineral.
- Existing logos (orange + grey) are kept as assets. The owner asked NOT to carry over the old site's design, and for a site that does not look AI-made.
- Owner-pinned visual constraints (2026-09-29 feedback): accent colour is exactly #d33100; no ochre/gold page backgrounds and no hue-switching between sections (neutral light grounds + dark grey only); photos without frames/borders; the feel should be young and modern. Owner liked: the video band, the dark footer, the section divisions.
- Language: Brazilian Portuguese, plain and warm, gaúcho neighborhood-business tone.

## Evidence on Hand

- Real photos: `Arquivos para usar/Mania d Agua/Sicredi Juntos/interna guarani 1-3.jpg` (stacked cylinders, 20L jugs, cylinders carried by hand), `IMG_20210512_150541.jpg` (delivery car with cylinders), `Maquina 24h/Layout Rincao.jpg` (Rincão storefront), `Maquina 24h/layout maquina.png` (24h station render), `Publicações/Imagens/gas.png`, `Suporte+Bombona.png` (cutouts).
- Logos: `Logos grupo e todas empresas/*` (white/black variants with "grupo"), `Primavera Gás/Logo.jpg`, Supergasbras logo, water brand logos.
- One testimonial from the old site: "A Mania D'água sempre supera minhas expectativas. Serviço rápido e produtos de alta qualidade!" (anonymous). Do not invent more testimonials, numbers or reviews.
- Owner-supplied Instagram screenshots and the brand film (`video.mp4`, 42s: aerial of the depot, Supergasbras sign, team loading P13s, attendant with headset, delivery pickups, 20L jugs; burned-in subtitles in lower band). Film line: "Segurança, agilidade e confiança é na Mania D'Água" / "Precisou de gás ou água? Chame Mania D'Água".

## Product Principles

1. The fastest path is the product: WhatsApp to the right depot within two taps from any screen.
2. Local and real over generic: real depots, real streets, real photos, real hours.
3. Safety is service: gas safety tips (leak test, regulator every 5 years) are part of the offer, not fine print.
4. Everything the owner might change lives in the admin, never hard-coded.

## Accessibility & Inclusion

WCAG 2.2 AA; large tap targets for one-handed phone use; readable for older customers (generous type size, strong contrast).
