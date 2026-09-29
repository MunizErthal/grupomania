import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { MediaStorage } from '../../../core/content/content.repository';
import { IconComponent } from '../../../shared/ui/icon.component';

/** Preview + upload + manual URL for one image or video. */
@Component({
  selector: 'gm-media-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  templateUrl: './media-field.component.html',
  styleUrl: './media-field.component.css',
})
export class MediaFieldComponent {
  private readonly storage = inject(MediaStorage);

  readonly label = input.required<string>();
  readonly value = input<string>('');
  readonly kind = input<'image' | 'video'>('image');
  readonly folder = input('geral');
  readonly hint = input<string | undefined>();
  readonly fieldId = input.required<string>();
  readonly changed = output<string>();

  protected readonly busy = signal(false);
  protected readonly error = signal('');
  protected readonly accept = computed(() => (this.kind() === 'video' ? 'video/mp4,video/webm' : 'image/*'));

  protected async onFile(event: Event): Promise<void> {
    const inputEl = event.target as HTMLInputElement;
    const file = inputEl.files?.[0];
    inputEl.value = '';
    if (!file) return;
    this.busy.set(true);
    this.error.set('');
    try {
      this.changed.emit(await this.storage.upload(file, this.folder()));
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : 'Falha no envio. Tente de novo.');
    } finally {
      this.busy.set(false);
    }
  }

  protected onUrl(event: Event): void {
    this.changed.emit((event.target as HTMLInputElement).value.trim());
  }
}
