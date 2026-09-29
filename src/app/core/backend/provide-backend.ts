import { EnvironmentProviders, Provider, makeEnvironmentProviders } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ContentSource } from '../content/content.repository';
import { FirestoreRestContentSource } from '../content/firestore-rest.source';
import { LocalContentStore } from '../content/local-content.repository';
import { FIREBASE_OPTIONS, isFirebaseConfigured } from './firebase-options';

/**
 * Wires the public (read-only) side of the backend.
 * Firebase when configured in `environment.ts`, browser storage otherwise.
 */
export function providePublicBackend(): EnvironmentProviders {
  const providers: Provider[] = isFirebaseConfigured(environment.firebase)
    ? [
        { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
        { provide: ContentSource, useClass: FirestoreRestContentSource },
      ]
    : [LocalContentStore, { provide: ContentSource, useExisting: LocalContentStore }];
  return makeEnvironmentProviders(providers);
}
