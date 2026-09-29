import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ContentStore } from '../../../core/content/content.store';
import { DeliveryStatusService } from '../../../core/hours/delivery-status.service';
import { telLink } from '../../../core/order/whatsapp';
import { splitLastSentence } from '../../../shared/text/split-last-sentence';
import { IconComponent } from '../../../shared/ui/icon.component';
import { OrderTicketComponent } from '../order-ticket/order-ticket.component';

@Component({
  selector: 'gm-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, OrderTicketComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
})
export class HeroComponent {
  protected readonly store = inject(ContentStore);
  protected readonly delivery = inject(DeliveryStatusService);
  protected readonly tel = telLink;
  /** Splits the editable title so its last sentence carries the accent. */
  protected readonly titleParts = computed(() => splitLastSentence(this.store.hero().title));

  protected readonly years = computed(
    () => new Date().getFullYear() - new Date(this.store.brand().foundedOn).getFullYear(),
  );
}
