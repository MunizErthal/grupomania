import { Injectable, computed, inject, signal } from '@angular/core';
import { DEFAULT_CONTENT } from './default-content';
import { SiteContent } from './content.model';
import { ContentSource } from './content.repository';
import { mergeContent } from './merge-content';

export type LoadState = 'idle' | 'loading' | 'ready' | 'error';

/**
 * Single source of truth for what the public site renders.
 * Components read through the computed slices; only `replace()` writes,
 * and only the admin calls it after publishing.
 */
@Injectable({ providedIn: 'root' })
export class ContentStore {
  private readonly source = inject(ContentSource);

  private readonly _content = signal<SiteContent>(structuredClone(DEFAULT_CONTENT));
  private readonly _state = signal<LoadState>('idle');

  readonly content = this._content.asReadonly();
  readonly state = this._state.asReadonly();

  readonly brand = computed(() => this._content().brand);
  readonly hero = computed(() => this._content().hero);
  readonly hours = computed(() => this._content().hours);
  readonly depots = computed(() => this._content().depots);
  readonly gas = computed(() => this._content().gas);
  readonly water = computed(() => this._content().water);
  readonly station = computed(() => this._content().station);
  readonly safety = computed(() => this._content().safety);
  readonly about = computed(() => this._content().about);
  readonly faq = computed(() => this._content().faq);
  readonly gallery = computed(() => this._content().gallery);
  readonly payments = computed(() => this._content().payments);
  readonly headquarters = computed(() => this.depots().find((d) => d.isHeadquarters) ?? this.depots()[0]);

  async load(): Promise<void> {
    if (this._state() === 'loading') return;
    this._state.set('loading');
    try {
      this._content.set(mergeContent(DEFAULT_CONTENT, await this.source.load()));
      this._state.set('ready');
    } catch (error) {
      console.error('[ContentStore] falha ao carregar conteúdo; usando o padrão', error);
      this._state.set('error');
    }
  }

  replace(next: SiteContent): void {
    this._content.set(structuredClone(next));
  }

  defaults(): SiteContent {
    return structuredClone(DEFAULT_CONTENT);
  }
}
