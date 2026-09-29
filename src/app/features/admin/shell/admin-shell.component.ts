import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { backendMode } from '../../../core/backend/provide-admin-backend';
import { IconComponent } from '../../../shared/ui/icon.component';
import { AdminDraftService } from '../admin-draft.service';
import { SECTIONS } from '../sections';

@Component({
  selector: 'gm-admin-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, IconComponent],
  host: { class: 'gm-admin', '(window:beforeunload)': 'onBeforeUnload($event)' },
  templateUrl: './admin-shell.component.html',
  styleUrl: './admin-shell.component.css',
})
export class AdminShellComponent {
  protected readonly auth = inject(AuthService);
  protected readonly draft = inject(AdminDraftService);
  private readonly router = inject(Router);

  protected readonly sections = SECTIONS;
  protected readonly mode = backendMode();

  protected async signOut(): Promise<void> {
    if (this.draft.dirty() && !confirm('Há alterações não publicadas. Sair mesmo assim?')) return;
    await this.auth.signOut();
    await this.router.navigateByUrl('/painel/entrar');
  }

  protected discard(): void {
    if (confirm('Descartar todas as alterações não publicadas?')) this.draft.discard();
  }

  protected onBeforeUnload(event: BeforeUnloadEvent): void {
    if (this.draft.dirty()) event.preventDefault();
  }
}
