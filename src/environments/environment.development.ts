import type { FirebaseOptions } from '../app/core/backend/firebase-options';

/** Desenvolvimento (`npm start`): usa o mesmo projeto Firebase da produção. */
export const environment = {
  production: false,
  siteUrl: 'https://www.grupomaniadagua.com.br',
  firebase: {
    apiKey: 'AIzaSyBvs2dIQhB8SXEaIGERrnJ3GGP-PkmL4mI',
    authDomain: 'grupomania.firebaseapp.com',
    projectId: 'grupomania',
    storageBucket: 'grupomania.firebasestorage.app',
    messagingSenderId: '625457865447',
    appId: '1:625457865447:web:ae15c15285600440283842',
  } as FirebaseOptions,
  localAdmin: null as { email: string; password: string } | null,
};
