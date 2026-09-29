import { Injectable, inject } from '@angular/core';
import type { FirebaseApp } from 'firebase/app';
import { FIREBASE_OPTIONS } from './firebase-options';

/**
 * Loads the Firebase SDK on demand (admin only) and keeps one app instance.
 * The public site never pays for this download.
 */
@Injectable()
export class FirebaseAppLoader {
  private readonly options = inject(FIREBASE_OPTIONS);
  private app?: Promise<FirebaseApp>;

  get(): Promise<FirebaseApp> {
    this.app ??= import('firebase/app').then(({ initializeApp, getApps }) =>
      getApps()[0] ?? initializeApp(this.options),
    );
    return this.app;
  }
}
