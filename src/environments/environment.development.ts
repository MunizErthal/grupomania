import type { FirebaseOptions } from '../app/core/backend/firebase-options';

export const environment = {
  production: false,
  firebase: {
    apiKey: 'COLE_SUA_API_KEY',
    authDomain: 'seu-projeto.firebaseapp.com',
    projectId: 'seu-projeto',
    storageBucket: 'seu-projeto.firebasestorage.app',
    appId: 'COLE_SEU_APP_ID',
  } as FirebaseOptions,
  localAdmin: { email: 'admin@grupomania.local', password: 'mania2003' } as { email: string; password: string } | null,
};
