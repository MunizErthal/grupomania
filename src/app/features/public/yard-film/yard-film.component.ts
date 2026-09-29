import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ContentStore } from '../../../core/content/content.store';

/** The depot's own film, playing like a window into the yard. */
@Component({
  selector: 'gm-yard-film',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './yard-film.component.html',
  styleUrl: './yard-film.component.css',
})
export class YardFilmComponent {
  protected readonly store = inject(ContentStore);
  protected readonly playing = signal(false);
  private readonly video = viewChild<ElementRef<HTMLVideoElement>>('film');

  constructor() {
    afterNextRender(() => {
      const el = this.video()?.nativeElement;
      if (!el) return;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) return;
      const io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) el.play().then(() => this.playing.set(true)).catch(() => {});
        else el.pause();
      }, { threshold: 0.25 });
      io.observe(el);
    });
  }

  protected toggle(): void {
    const el = this.video()?.nativeElement;
    if (!el) return;
    if (el.paused) {
      el.play().then(() => this.playing.set(true)).catch(() => {});
    } else {
      el.pause();
      this.playing.set(false);
    }
  }
}
