import { Provider } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { LocalAuthService } from '../auth/local-auth.service';
import { ContentPublisher, MediaStorage } from '../content/content.repository';
import { DataUrlMediaStorage, LocalContentStore } from '../content/local-content.repository';
import {
  FirebaseAuthService,
  FirebaseContentPublisher,
  FirebaseMediaStorage,
} from './firebase-admin.adapters';
import { FirebaseAppLoader } from './firebase-app.loader';
import { isFirebaseConfigured } from './firebase-options';

/** Write side of the backend, provided only on the lazy `/painel` routes. */
export function provideAdminBackend(): Provider[] {
  if (isFirebaseConfigured(environment.firebase)) {
    return [
      FirebaseAppLoader,
      { provide: AuthService, useClass: FirebaseAuthService },
      { provide: ContentPublisher, useClass: FirebaseContentPublisher },
      { provide: MediaStorage, useClass: FirebaseMediaStorage },
    ];
  }
  return [
    { provide: AuthService, useClass: LocalAuthService },
    { provide: ContentPublisher, useExisting: LocalContentStore },
    { provide: MediaStorage, useClass: DataUrlMediaStorage },
  ];
}

export const backendMode = (): 'firebase' | 'local' =>
  isFirebaseConfigured(environment.firebase) ? 'firebase' : 'local';
