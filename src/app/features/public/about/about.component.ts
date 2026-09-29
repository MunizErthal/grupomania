import { ChangeDetectionStrategy, Component, ElementRef, computed, inject, viewChild } from '@angular/core';
import { ContentStore } from '../../../core/content/content.store';
import { IconComponent } from '../../../shared/ui/icon.component';

@Component({
  selector: 'gm-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent {
  protected readonly store = inject(ContentStore);
  private readonly strip = viewChild<ElementRef<HTMLElement>>('strip');

  /** '2003-03-03' → '03.03.2003', the way a date is stamped on a cylinder. */
  protected readonly stampedDate = computed(() => {
    const [y, m, d] = this.store.brand().foundedOn.split('-');
    return `${d}.${m}.${y}`;
  });

  protected scrollStrip(direction: -1 | 1): void {
    const el = this.strip()?.nativeElement;
    if (!el) return;
    const item = el.querySelector('li');
    const step = item ? item.getBoundingClientRect().width + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: direction * step, behavior: 'smooth' });
  }
}
