import { Injectable, computed, inject } from '@angular/core';
import { ContentStore } from '../content/content.store';
import { ProductLine } from '../content/content.model';
import { ClockService } from './clock.service';
import { OpenStatus, formatClock, momentInBrazil, statusAt } from './opening-hours';

/** Live "aberto agora?" for each delivery line, derived from content + clock. */
@Injectable({ providedIn: 'root' })
export class DeliveryStatusService {
  private readonly store = inject(ContentStore);
  private readonly clock = inject(ClockService);

  private readonly moment = computed(() => momentInBrazil(this.clock.now()));

  readonly gas = computed(() => statusAt(this.store.hours().gas, this.moment()));
  readonly agua = computed(() => statusAt(this.store.hours().agua, this.moment()));

  status(line: ProductLine): OpenStatus {
    return line === 'gas' ? this.gas() : this.agua();
  }

  label(line: ProductLine): string {
    const s = this.status(line);
    const what = line === 'gas' ? 'gás' : 'água';
    return s.open
      ? `Entrega de ${what} aberta até ${formatClock(s.closesAt)}`
      : `Entrega de ${what} volta ${s.opensLabel}`;
  }
}
