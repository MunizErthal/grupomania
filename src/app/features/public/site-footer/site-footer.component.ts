import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ContentStore } from '../../../core/content/content.store';
import { OrderDraftService } from '../../../core/order/order-draft.service';
import { telLink, whatsappLink } from '../../../core/order/whatsapp';
import { splitLastSentence } from '../../../shared/text/split-last-sentence';
import { IconComponent } from '../../../shared/ui/icon.component';

@Component({
  selector: 'gm-site-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  templateUrl: './site-footer.component.html',
  styleUrl: './site-footer.component.css',
})
export class SiteFooterComponent {
  protected readonly store = inject(ContentStore);
  protected readonly order = inject(OrderDraftService);
  protected readonly tel = telLink;
  protected readonly wa = whatsappLink;
  protected readonly year = new Date().getFullYear();
  protected readonly line = computed(() => splitLastSentence(this.store.brand().footerLine));
}
