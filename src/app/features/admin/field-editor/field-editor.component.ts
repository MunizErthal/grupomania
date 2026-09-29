import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { WeeklyHours } from '../../../core/content/content.model';
import { IconComponent } from '../../../shared/ui/icon.component';
import { AdminDraftService, Path } from '../admin-draft.service';
import { FieldDef } from '../field-defs';
import { HoursFieldComponent } from '../hours-field/hours-field.component';
import { MediaFieldComponent } from '../media-field/media-field.component';

type ObjectListDef = Extract<FieldDef, { kind: 'objectList' }>;

/**
 * Renders one field of the schema and writes changes to the draft.
 * Recursive for lists of objects (depots, FAQ, photos…).
 */
@Component({
  selector: 'gm-field-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, MediaFieldComponent, HoursFieldComponent],
  templateUrl: './field-editor.component.html',
  styleUrl: './field-editor.component.css',
})
export class FieldEditorComponent {
  private readonly draft = inject(AdminDraftService);

  readonly field = input.required<FieldDef>();
  readonly base = input.required<Path>();

  protected readonly path = computed<Path>(() => (this.field().key ? [...this.base(), this.field().key] : this.base()));
  protected readonly id = computed(() => 'f-' + this.path().join('-'));
  protected readonly value = computed(() => this.draft.get(this.path()));
  protected readonly text = computed(() => (this.value() as string | undefined) ?? '');
  protected readonly list = computed(() => (this.value() as unknown[] | undefined) ?? []);
  protected readonly expanded = signal<number | null>(0);

  protected set(value: unknown): void {
    this.draft.set(this.path(), value);
  }

  protected onInput(event: Event): void {
    this.set((event.target as HTMLInputElement | HTMLTextAreaElement).value);
  }

  protected asHours(): WeeklyHours {
    return this.value() as WeeklyHours;
  }

  protected asObjectList(): ObjectListDef {
    return this.field() as ObjectListDef;
  }

  protected itemTitle(item: unknown, index: number): string {
    const key = this.asObjectList().titleKey;
    const title = (item as Record<string, unknown>)?.[key];
    return (typeof title === 'string' && title.trim()) || `${this.asObjectList().itemLabel} ${index + 1}`;
  }

  protected itemPath(index: number): Path {
    return [...this.path(), index];
  }

  protected add(): void {
    const f = this.field();
    const item = f.kind === 'objectList' ? f.create() : '';
    this.set([...this.list(), item]);
    this.expanded.set(this.list().length - 1);
  }

  protected remove(index: number): void {
    const label = this.field().kind === 'objectList' ? this.itemTitle(this.list()[index], index) : 'este item';
    if (!confirm(`Remover "${label}"?`)) return;
    this.set(this.list().filter((_, i) => i !== index));
    this.expanded.set(null);
  }

  protected move(index: number, delta: -1 | 1): void {
    const target = index + delta;
    const items = [...this.list()];
    if (target < 0 || target >= items.length) return;
    [items[index], items[target]] = [items[target], items[index]];
    this.set(items);
    if (this.expanded() === index) this.expanded.set(target);
  }

  protected setItem(index: number, event: Event): void {
    const items = [...this.list()];
    items[index] = (event.target as HTMLInputElement).value;
    this.set(items);
  }

  protected toggleItem(index: number): void {
    this.expanded.update((v) => (v === index ? null : index));
  }
}
