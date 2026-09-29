import { Injectable, inject, signal } from '@angular/core';
import { AdminUser, AuthService } from '../auth/auth.service';
import { SiteContent } from '../content/content.model';
import { ContentPublisher, MediaStorage } from '../content/content.repository';
import { CONTENT_COLLECTION, CONTENT_DOC, MEDIA_ROOT } from '../content/content.paths';
import { FirebaseAppLoader } from './firebase-app.loader';

/** Firebase Authentication (e-mail + senha) behind the AuthService port. */
@Injectable()
export class FirebaseAuthService extends AuthService {
  private readonly loader = inject(FirebaseAppLoader);
  private readonly _user = signal<AdminUser | null>(null);
  private readonly initialized: Promise<void>;
  override readonly user = this._user.asReadonly();

  constructor() {
    super();
    this.initialized = this.loader.get().then(async (app) => {
      const { getAuth, onAuthStateChanged } = await import('firebase/auth');
      await new Promise<void>((resolve) => {
        onAuthStateChanged(getAuth(app), (u) => {
          this._user.set(u?.email ? { email: u.email } : null);
          resolve();
        });
      });
    });
  }

  override ready(): Promise<void> {
    return this.initialized;
  }

  override async signIn(email: string, password: string): Promise<void> {
    const app = await this.loader.get();
    const { getAuth, signInWithEmailAndPassword } = await import('firebase/auth');
    try {
      const cred = await signInWithEmailAndPassword(getAuth(app), email.trim(), password);
      this._user.set(cred.user.email ? { email: cred.user.email } : null);
    } catch {
      throw new Error('E-mail ou senha não conferem.');
    }
  }

  override async signOut(): Promise<void> {
    const app = await this.loader.get();
    const { getAuth, signOut } = await import('firebase/auth');
    await signOut(getAuth(app));
    this._user.set(null);
  }
}

/** Saves the whole content as one JSON string in Firestore `site/content`. */
@Injectable()
export class FirebaseContentPublisher implements ContentPublisher {
  private readonly loader = inject(FirebaseAppLoader);

  async save(content: SiteContent): Promise<void> {
    const app = await this.loader.get();
    const { getFirestore, doc, setDoc } = await import('firebase/firestore');
    await setDoc(doc(getFirestore(app), CONTENT_COLLECTION, CONTENT_DOC), {
      json: JSON.stringify(content),
      updatedAt: content.updatedAt,
    });
  }
}

/** Uploads to Firebase Storage under `site-media/<folder>/`. */
@Injectable()
export class FirebaseMediaStorage implements MediaStorage {
  private readonly loader = inject(FirebaseAppLoader);

  async upload(file: File, folder: string): Promise<string> {
    const app = await this.loader.get();
    const { getStorage, ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-');
    const target = ref(getStorage(app), `${MEDIA_ROOT}/${folder}/${Date.now()}-${safeName}`);
    await uploadBytes(target, file, { contentType: file.type, cacheControl: 'public, max-age=31536000' });
    return getDownloadURL(target);
  }
}
