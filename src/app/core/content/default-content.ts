import { SiteContent } from './content.model';

/**
 * First version of the site content. Facts come from the old site
 * (grupomaniadagua.com.br), printed folders and the owner's Instagram.
 * Everything here can be overwritten from the admin panel.
 */
export const DEFAULT_CONTENT: SiteContent = {
  version: 1,
  updatedAt: '2026-09-29T00:00:00.000Z',
  brand: {
    groupName: "Grupo Mania D'Água",
    foundedOn: '2003-03-03',
    city: 'Estância Velha · RS',
    landline: '(51) 3561-5782',
    whatsapp: '(51) 99662-1660',
    instagram: 'maniadiagua',
    linktree: 'https://linktr.ee/maniadeagua',
    footerLine: 'Precisou de gás ou água? Chama a Mania.',
  },
  hero: {
    title: 'Acabou o gás? A água? A gente leva.',
    lead:
      'Quatro depósitos do Grupo Mania D’Água em Estância Velha e Novo Hamburgo. Você chama no WhatsApp e o botijão ou o galão chega na sua porta, instalado por quem faz isso todo dia desde 2003.',
    videoUrl: 'media/patio.mp4',
    posterUrl: 'media/patio-poster.jpg',
    primaryLabel: 'Pedir pelo WhatsApp',
  },
  hours: {
    gas: {
      weekdays: { open: '08:00', close: '21:30' },
      saturday: { open: '08:00', close: '20:00' },
      sunday: { open: '08:00', close: '18:00' },
    },
    agua: {
      weekdays: { open: '08:00', close: '18:00' },
      saturday: { open: '08:00', close: '16:00' },
      sunday: { open: '08:00', close: '11:00' },
    },
    note: 'Feriados seguem o horário de domingo. Na Rincão, a estação de autoatendimento vende gás 24 horas.',
  },
  depots: [
    {
      id: 'mania',
      name: "Mania D'Água",
      tagline: 'Distribuidora de água mineral e gás',
      city: 'Estância Velha',
      street: 'R. Frederico Hugo Engelmann, 28',
      district: 'Bela Vista',
      zip: '93614-020',
      whatsapp: '(51) 99662-1660',
      landline: '(51) 3561-5782',
      instagram: 'maniadiagua',
      mapsUrl: 'https://www.google.com/maps?cid=10199775353830102748',
      logoUrl: 'logos/mania.png',
      neighborhoods: 'Estância Velha e arredores',
      selfService24h: false,
      isHeadquarters: true,
    },
    {
      id: 'guarani',
      name: 'Gás Guarani',
      tagline: 'Revenda Supergasbras',
      city: 'Novo Hamburgo',
      street: 'R. São Carlos, 71',
      district: 'Guarani',
      zip: '93520-150',
      whatsapp: '(51) 99770-3178',
      landline: '(51) 3527-4949',
      instagram: 'guaranigas',
      mapsUrl: 'https://www.google.com/maps?cid=18365416655200896276',
      logoUrl: 'logos/guarani.png',
      neighborhoods: 'Hamburgo Velho, Vila Nova, Guarani, Operário e Vila Rosa',
      selfService24h: false,
      isHeadquarters: false,
    },
    {
      id: 'rincao',
      name: 'Rincão Gás',
      tagline: 'Comércio de gás e água mineral',
      city: 'Novo Hamburgo',
      street: 'R. Rincão, 561',
      district: 'Rincão',
      zip: '93310-460',
      whatsapp: '(51) 99762-8361',
      landline: '',
      instagram: 'rincaogas',
      mapsUrl: 'https://www.google.com/maps?cid=6470544042084425247',
      logoUrl: 'logos/rincao.png',
      neighborhoods: 'Rincão e arredores',
      selfService24h: true,
      isHeadquarters: false,
    },
    {
      id: 'primavera',
      name: 'Primavera Gás',
      tagline: 'Comércio de gás · Conveniência',
      city: 'Novo Hamburgo',
      street: 'R. Saldanha da Gama, 221',
      district: 'Primavera',
      zip: '93344-290',
      whatsapp: '(51) 99798-1300',
      landline: '(51) 3556-2160',
      instagram: '',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=R.+Saldanha+da+Gama,+221+-+Primavera,+Novo+Hamburgo+-+RS,+93344-290',
      logoUrl: 'logos/primavera.png',
      neighborhoods: 'Primavera e arredores',
      selfService24h: false,
      isHeadquarters: false,
    },
  ],
  gas: {
    title: 'Gás de cozinha e de indústria, instalado.',
    lead:
      'Somos revenda autorizada Supergasbras. O entregador leva o botijão, faz a troca, confere a mangueira e o registro e só vai embora quando não tem vazamento.',
    sizes: [
      { code: 'P5', kg: '5 kg', use: 'Fogareiro, camping, espaço pequeno' },
      { code: 'P13', kg: '13 kg', use: 'O botijão de cozinha de casa' },
      { code: 'P20', kg: '20 kg', use: 'Empilhadeiras' },
      { code: 'P45', kg: '45 kg', use: 'Comércio, restaurante, central de gás' },
    ],
    services: [
      'Instalação inclusa na compra do gás',
      'Kit regulador Aliança instalado sem custo',
      'Conexões de latão para GLP',
      'Instalação e manutenção de redes de gás',
      'Maquininha de cartão vai até você',
    ],
    imageUrl: 'img/botijoes-empilhados.jpg',
    secondaryImageUrl: 'img/carregando.jpg',
  },
  water: {
    title: 'Água mineral de 20 litros, na hora que a sua acabar.',
    lead:
      'Galão cheio na porta de casa ou da empresa, com entrega combinada e o vasilhame trocado na hora. Também vendemos e higienizamos bebedouros.',
    brands: ['Água da Pedra', 'Brisa', 'Elan'],
    items: [
      'Galão de 20 L',
      'Fardo de água 500 ml (12 un.)',
      'Fardo de copos 200 ml (48 un.)',
      'Tiras de copos descartáveis (100 un.)',
      'Bomba manual para galão de 20 L',
      'Bebedouro de mesa',
      'Torneiras e suportes para galão',
    ],
    services: ['Venda de bebedouros elétricos', 'Higienização de bebedouros'],
    imageUrl: 'img/galoes-caixa.jpg',
    cutoutUrl: 'img/galao-suporte.webp',
  },
  station: {
    title: 'Acabou o gás de madrugada? Na Rincão tem.',
    lead:
      'A primeira estação de autoatendimento de gás 24 horas da região. Você escolhe na tela, paga e retira o botijão P13 cheio, sem depender de horário.',
    bullets: ['Aberta 24 horas, todos os dias', 'Pagamento por Pix ou cartão', 'Compra rápida, direto na máquina'],
    promo: '',
    address: 'Rua Rincão, 561',
    imageUrl: 'img/estacao-24h.webp',
  },
  safety: [
    {
      title: 'Teste de vazamento',
      body: 'Misture água com sabão e passe na conexão do botijão. Se formar bolha, tem vazamento: feche o registro, abra as janelas e chame a gente.',
    },
    {
      title: 'Regulador tem validade',
      body: 'Troque o regulador de gás a cada 5 anos. Comprando o kit com a gente, a instalação sai sem custo.',
    },
    {
      title: 'Trocar o botijão',
      body: 'Feche o registro, desconecte o botijão vazio, conecte o cheio e abra o registro. Na dúvida, o entregador faz para você.',
    },
  ],
  about: {
    title: 'Desde 3 de março de 2003, em Estância Velha.',
    body:
      'O Grupo Mania D’Água nasceu em Estância Velha e hoje são quatro depósitos: Mania D’Água, Gás Guarani, Rincão Gás e Primavera Gás. Mesma equipe, mesmo jeito de trabalhar: atender rápido, entregar com segurança e resolver o problema de quem ligou.',
    testimonial: 'A Mania D’Água sempre supera minhas expectativas. Serviço rápido e produtos de alta qualidade!',
    testimonialAuthor: 'Cliente',
    imageUrl: 'img/atendente.jpg',
    secondaryImageUrl: 'img/picape.jpg',
  },
  faq: [
    {
      question: 'Vocês entregam no fim de semana e feriado?',
      answer: 'Sim. O gás sai até 20h no sábado e até 18h no domingo e feriados. A água, até 16h no sábado e até 11h no domingo.',
    },
    {
      question: 'Qual o horário da tele-entrega de gás?',
      answer: 'Segunda a sexta das 8h às 21h30, sábado das 8h às 20h e domingo das 8h às 18h.',
    },
    {
      question: 'Qual o horário da tele-entrega de água?',
      answer: 'Segunda a sexta das 8h às 18h, sábado das 8h às 16h e domingo das 8h às 11h.',
    },
    {
      question: 'O que é gás GLP?',
      answer: 'É o Gás Liquefeito de Petróleo, uma mistura de propano e butano. É o gás do botijão de cozinha.',
    },
    {
      question: 'Como sei se o gás está vazando?',
      answer: 'Passe água com sabão na conexão do botijão. Se formar bolhas, há vazamento. Feche o registro e fale com a gente.',
    },
    {
      question: 'Posso pagar com cartão na entrega?',
      answer: 'Pode. O entregador leva a maquininha. Aceitamos também Pix.',
    },
  ],
  gallery: [
    { url: 'img/carregando.jpg', alt: 'Entregador com colete Supergasbras separando botijões no depósito' },
    { url: 'img/galoes-mao.jpg', alt: 'Galões de 20 litros sendo carregados na caçamba' },
    { url: 'img/picape-aerea.jpg', alt: 'Picape de entrega do grupo fazendo a curva numa rua de Estância Velha' },
    { url: 'img/dupla-botijoes.jpg', alt: 'Entregador levantando um botijão P45' },
    { url: 'img/placa-supergasbras.jpg', alt: 'Placa Supergasbras na fachada do depósito' },
  ],
  payments: ['Pix', 'Visa', 'Mastercard', 'Elo', 'Hipercard', 'Banricompras'],
};
