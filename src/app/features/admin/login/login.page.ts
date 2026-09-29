import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { backendMode } from '../../../core/backend/provide-admin-backend';

@Component({
  selector: 'gm-login-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'gm-admin' },
  templateUrl: './login.page.html',
  styleUrl: './login.page.css',
})
export class LoginPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly mode = backendMode();
  protected readonly busy = signal(false);
  protected readonly error = signal('');

  protected async submit(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    const form = new FormData(event.target as HTMLFormElement);
    const email = String(form.get('email') ?? '');
    const password = String(form.get('password') ?? '');
    if (!email || !password) {
      this.error.set('Preencha e-mail e senha.');
      return;
    }
    this.busy.set(true);
    this.error.set('');
    try {
      await this.auth.signIn(email, password);
      await this.router.navigateByUrl('/painel');
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : 'Não foi possível entrar.');
    } finally {
      this.busy.set(false);
    }
  }
}
