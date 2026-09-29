import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ContentStore } from '../../../core/content/content.store';
import { ProductLine } from '../../../core/content/content.model';
import { DeliveryStatusService } from '../../../core/hours/delivery-status.service';
import { OrderDraftService } from '../../../core/order/order-draft.service';
import { IconComponent } from '../../../shared/ui/icon.component';

interface LineOption {
  id: ProductLine;
  label: string;
  code: string;
}

/**
 * The order ticket: pick gas or water, pick the depot, send on WhatsApp.
 * The message is composed live so the customer sees exactly what goes out.
 */
@Component({
  selector: 'gm-order-ticket',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  templateUrl: './order-ticket.component.html',
  styleUrl: './order-ticket.component.css',
})
export class OrderTicketComponent {
  protected readonly store = inject(ContentStore);
  protected readonly order = inject(OrderDraftService);
  protected readonly delivery = inject(DeliveryStatusService);

  protected readonly lines: LineOption[] = [
    { id: 'gas', label: 'Gás', code: 'P13 · P45' },
    { id: 'agua', label: 'Água', code: '20 L' },
  ];

  protected readonly statusText = computed(() => this.delivery.label(this.order.line()));
  protected readonly isOpen = computed(() => this.delivery.status(this.order.line()).open);
  protected readonly placeholder = computed(() =>
    this.order.line() === 'gas'
      ? 'Ex.: 1 botijão P13, Rua das Flores 120, apto 3'
      : 'Ex.: 2 galões de 20 L, Rua das Flores 120',
  );

  protected placeOf(city: string, district: string): string {
    return [district, city].filter(Boolean).join(' · ');
  }

  protected onDetail(event: Event): void {
    this.order.detail.set((event.target as HTMLTextAreaElement).value);
  }
}
