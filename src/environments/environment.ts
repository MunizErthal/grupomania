import type { FirebaseOptions } from '../app/core/backend/firebase-options';

/**
 * Produção.
 * 1. Crie um projeto no Firebase (Authentication e-mail/senha, Firestore, Storage).
 * 2. Cole aqui a configuração do app web (Configurações do projeto > Seus apps).
 * Enquanto `apiKey` começar com "COLE_", o site roda em modo local.
 */
export const environment = {
  production: true,
  firebase: {
    apiKey: 'COLE_SUA_API_KEY',
    authDomain: 'seu-projeto.firebaseapp.com',
    projectId: 'seu-projeto',
    storageBucket: 'seu-projeto.firebasestorage.app',
    appId: 'COLE_SEU_APP_ID',
  } as FirebaseOptions,
  /** Login do modo local (só vale enquanto o Firebase não estiver configurado). */
  localAdmin: { email: 'admin@grupomania.local', password: 'mania2003' } as { email: string; password: string } | null,
};
