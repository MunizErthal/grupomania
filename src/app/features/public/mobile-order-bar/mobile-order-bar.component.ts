import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { OrderDraftService } from '../../../core/order/order-draft.service';
import { IconComponent } from '../../../shared/ui/icon.component';

/** Thumb-reach order bar on phones, shown once the ticket leaves the screen. */
@Component({
  selector: 'gm-mobile-order-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  host: { '(window:scroll)': 'onScroll()' },
  template: `
    <nav class="mbar" [class.mbar--on]="visible()" aria-label="Pedido rápido">
      <button type="button" (click)="order.prepare('gas')">
        <gm-icon name="whatsapp" [size]="20" /> Pedir gás
      </button>
      <button type="button" class="mbar__water" (click)="order.prepare('agua')">
        <gm-icon name="whatsapp" [size]="20" /> Pedir água
      </button>
    </nav>
  `,
  styles: `
    .mbar {
      position: fixed; inset: auto 0 0 0; z-index: 30;
      display: none; grid-template-columns: 1fr 1fr; gap: 0.5rem;
      padding: 0.6rem 0.75rem calc(0.6rem + env(safe-area-inset-bottom));
      background: var(--ink);
      transform: translateY(110%);
      transition: transform 260ms var(--ease-out);
    }
    .mbar--on { transform: none; }
    button {
      display: inline-flex; align-items: center; justify-content: center; gap: 0.45rem;
      min-height: 3.1rem; border: 0; border-radius: 999px;
      background: var(--accent); color: var(--ink); font-weight: 800; font-stretch: 82%; cursor: pointer;
    }
    .mbar__water { background: #fff; color: var(--ink); }
    button:focus-visible { outline: 3px solid #fff; outline-offset: 2px; }
    @media (max-width: 760px) { .mbar { display: grid; } }
  `,
})
export class MobileOrderBarComponent {
  protected readonly order = inject(OrderDraftService);
  protected readonly visible = signal(false);

  protected onScroll(): void {
    const ticket = document.getElementById('pedido');
    const bottom = ticket?.getBoundingClientRect().bottom ?? 0;
    this.visible.set(bottom < 0);
  }
}
