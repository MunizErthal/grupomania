import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ContentStore } from '../../../core/content/content.store';
import { OrderDraftService } from '../../../core/order/order-draft.service';
import { telLink } from '../../../core/order/whatsapp';
import { IconComponent } from '../../../shared/ui/icon.component';

interface NavItem {
  href: string;
  label: string;
}

@Component({
  selector: 'gm-site-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  templateUrl: './site-header.component.html',
  styleUrl: './site-header.component.css',
})
export class SiteHeaderComponent {
  protected readonly store = inject(ContentStore);
  protected readonly order = inject(OrderDraftService);
  protected readonly menuOpen = signal(false);
  protected readonly tel = telLink;

  protected readonly nav: NavItem[] = [
    { href: '#gas', label: 'Gás' },
    { href: '#agua', label: 'Água' },
    { href: '#estacao-24h', label: '24 horas' },
    { href: '#depositos', label: 'Depósitos' },
    { href: '#duvidas', label: 'Dúvidas' },
  ];

  protected toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }
}
