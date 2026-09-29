import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ContentStore } from '../../../core/content/content.store';
import { Depot } from '../../../core/content/content.model';
import { describeRange } from '../../../core/hours/opening-hours';
import { OrderDraftService } from '../../../core/order/order-draft.service';
import { telLink, whatsappLink } from '../../../core/order/whatsapp';
import { IconComponent } from '../../../shared/ui/icon.component';

interface HoursRow {
  day: string;
  gas: string;
  agua: string;
}

@Component({
  selector: 'gm-depots',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  templateUrl: './depots.component.html',
  styleUrl: './depots.component.css',
})
export class DepotsComponent {
  protected readonly store = inject(ContentStore);
  protected readonly order = inject(OrderDraftService);
  protected readonly tel = telLink;

  protected readonly rows = computed<HoursRow[]>(() => {
    const { gas, agua } = this.store.hours();
    return [
      { day: 'Segunda a sexta', gas: describeRange(gas.weekdays), agua: describeRange(agua.weekdays) },
      { day: 'Sábado', gas: describeRange(gas.saturday), agua: describeRange(agua.saturday) },
      { day: 'Domingo e feriado', gas: describeRange(gas.sunday), agua: describeRange(agua.sunday) },
    ];
  });

  protected address(d: Depot): string {
    const line1 = [d.street, d.district].filter(Boolean).join(' – ');
    const line2 = [d.city, d.zip].filter(Boolean).join(' · ');
    return [line1, line2].filter(Boolean).join('\n');
  }

  protected wa(d: Depot): string {
    return whatsappLink(d.whatsapp, `Olá, ${d.name}!`);
  }
}
