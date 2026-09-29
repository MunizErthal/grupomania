import { Injectable, computed, inject, signal } from '@angular/core';
import { ContentStore } from '../../core/content/content.store';
import { SiteContent } from '../../core/content/content.model';
import { ContentPublisher } from '../../core/content/content.repository';

export type Path = (string | number)[];
export type PublishState = 'idle' | 'publishing' | 'done' | 'error';

export function readPath(root: unknown, path: Path): unknown {
  return path.reduce<unknown>((node, key) => (node == null ? undefined : (node as Record<string | number, unknown>)[key]), root);
}

function writePath(node: unknown, path: Path, value: unknown): unknown {
  if (!path.length) return value;
  const [head, ...rest] = path;
  if (Array.isArray(node)) {
    const copy = [...node];
    copy[head as number] = writePath(copy[head as number], rest, value);
    return copy;
  }
  const obj = (node ?? {}) as Record<string, unknown>;
  return { ...obj, [head]: writePath(obj[head as string], rest, value) };
}

/**
 * The admin's working copy. Edits are immutable updates on a signal;
 * nothing reaches visitors until `publish()`.
 */
@Injectable()
export class AdminDraftService {
  private readonly store = inject(ContentStore);
  private readonly publisher = inject(ContentPublisher);

  private readonly _draft = signal<SiteContent>(structuredClone(this.store.content()));
  private readonly _baseline = signal(JSON.stringify(this.store.content()));
  private readonly _publishState = signal<PublishState>('idle');
  private readonly _error = signal('');

  readonly draft = this._draft.asReadonly();
  readonly publishState = this._publishState.asReadonly();
  readonly error = this._error.asReadonly();
  readonly dirty = computed(() => JSON.stringify(this._draft()) !== this._baseline());

  /** Re-sync after the store finishes loading (first visit to /painel). */
  resetFromStore(): void {
    this._draft.set(structuredClone(this.store.content()));
    this._baseline.set(JSON.stringify(this.store.content()));
  }

  get(path: Path): unknown {
    return readPath(this._draft(), path);
  }

  set(path: Path, value: unknown): void {
    this._draft.update((d) => writePath(d, path, value) as SiteContent);
    if (this._publishState() === 'done') this._publishState.set('idle');
  }

  restoreSection(key: string): void {
    const defaults = this.store.defaults() as unknown as Record<string, unknown>;
    this.set([key], structuredClone(defaults[key]));
  }

  discard(): void {
    this._draft.set(JSON.parse(this._baseline()) as SiteContent);
  }

  async publish(): Promise<void> {
    this._publishState.set('publishing');
    this._error.set('');
    try {
      const next = { ...this._draft(), updatedAt: new Date().toISOString() };
      await this.publisher.save(next);
      this.store.replace(next);
      this._draft.set(next);
      this._baseline.set(JSON.stringify(next));
      this._publishState.set('done');
    } catch (e) {
      this._error.set(e instanceof Error ? e.message : 'Não foi possível publicar. Tente de novo.');
      this._publishState.set('error');
    }
  }
}
