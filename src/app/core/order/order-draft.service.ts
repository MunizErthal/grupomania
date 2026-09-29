import { Injectable, computed, inject, signal } from '@angular/core';
import { ContentStore } from '../content/content.store';
import { Depot, ProductLine } from '../content/content.model';
import { whatsappLink } from './whatsapp';

/**
 * State of the order ticket (the site's main interaction).
 * Any CTA on the page can preselect a line or depot and scroll to the ticket.
 */
@Injectable({ providedIn: 'root' })
export class OrderDraftService {
  private readonly store = inject(ContentStore);

  readonly line = signal<ProductLine>('gas');
  readonly depotId = signal<string | null>(null);
  readonly detail = signal('');

  readonly depot = computed<Depot>(() => {
    const id = this.depotId();
    return this.store.depots().find((d) => d.id === id) ?? this.store.headquarters();
  });

  readonly message = computed(() => {
    const product = this.line() === 'gas' ? 'um botijão de gás' : 'água mineral';
    const extra = this.detail().trim();
    return `Olá, ${this.depot().name}! Quero pedir ${product}.${extra ? ` ${extra}` : ''}`;
  });

  readonly link = computed(() => whatsappLink(this.depot().whatsapp, this.message()));

  prepare(line: ProductLine, depotId?: string): void {
    this.line.set(line);
    if (depotId) this.depotId.set(depotId);
    document.getElementById('pedido')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
