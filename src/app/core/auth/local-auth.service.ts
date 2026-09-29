import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AdminUser, AuthService } from './auth.service';

const SESSION_KEY = 'gm.admin-session';

/**
 * Development-only login used while Firebase is not configured.
 * Credentials come from `environment.localAdmin`; never use this in production.
 */
@Injectable()
export class LocalAuthService extends AuthService {
  private readonly _user = signal<AdminUser | null>(this.restore());
  override readonly user = this._user.asReadonly();

  override async ready(): Promise<void> {}

  override async signIn(email: string, password: string): Promise<void> {
    const admin = environment.localAdmin;
    await new Promise((r) => setTimeout(r, 350));
    if (!admin || email.trim().toLowerCase() !== admin.email || password !== admin.password) {
      throw new Error('E-mail ou senha não conferem.');
    }
    const user = { email: admin.email };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
    this._user.set(user);
  }

  override async signOut(): Promise<void> {
    sessionStorage.removeItem(SESSION_KEY);
    this._user.set(null);
  }

  private restore(): AdminUser | null {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      return raw ? (JSON.parse(raw) as AdminUser) : null;
    } catch {
      return null;
    }
  }
}
