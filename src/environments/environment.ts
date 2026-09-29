import type { FirebaseOptions } from '../app/core/backend/firebase-options';

/**
 * Produção.
 * A configuração do Firebase é pública por natureza (vai para o navegador);
 * quem protege os dados são as regras em firestore.rules e storage.rules.
 */
export const environment = {
  production: true,
  /** Endereço público do site: usado no link canônico e nos dados estruturados. */
  siteUrl: 'https://www.grupomaniadagua.com.br',
  firebase: {
    apiKey: 'AIzaSyBvs2dIQhB8SXEaIGERrnJ3GGP-PkmL4mI',
    authDomain: 'grupomania.firebaseapp.com',
    projectId: 'grupomania',
    storageBucket: 'grupomania.firebasestorage.app',
    messagingSenderId: '625457865447',
    appId: '1:625457865447:web:ae15c15285600440283842',
  } as FirebaseOptions,
  /** Login do modo local. Com o Firebase configurado, não é usado. */
  localAdmin: null as { email: string; password: string } | null,
};
