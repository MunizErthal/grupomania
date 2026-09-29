import { InjectionToken } from '@angular/core';

export interface FirebaseOptions {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  appId: string;
  messagingSenderId?: string;
}

export const FIREBASE_OPTIONS = new InjectionToken<FirebaseOptions>('FIREBASE_OPTIONS');

export const isFirebaseConfigured = (o: Partial<FirebaseOptions> | null | undefined): o is FirebaseOptions =>
  !!o && !!o.apiKey && !!o.projectId && !o.apiKey.startsWith('COLE_');
