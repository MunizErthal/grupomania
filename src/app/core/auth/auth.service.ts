import { Signal } from '@angular/core';

export interface AdminUser {
  email: string;
}

/** Authentication port for the hidden admin panel. */
export abstract class AuthService {
  abstract readonly user: Signal<AdminUser | null>;
  /** Resolves once the initial session check is done. */
  abstract ready(): Promise<void>;
  abstract signIn(email: string, password: string): Promise<void>;
  abstract signOut(): Promise<void>;
}
