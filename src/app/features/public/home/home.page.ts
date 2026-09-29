import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { StructuredDataService } from '../../../core/seo/structured-data.service';
import { AboutComponent } from '../about/about.component';
import { DepotsComponent } from '../depots/depots.component';
import { FaqComponent } from '../faq/faq.component';
import { GasChapterComponent } from '../gas-chapter/gas-chapter.component';
import { HeroComponent } from '../hero/hero.component';
import { MobileOrderBarComponent } from '../mobile-order-bar/mobile-order-bar.component';
import { SafetyComponent } from '../safety/safety.component';
import { SiteFooterComponent } from '../site-footer/site-footer.component';
import { SiteHeaderComponent } from '../site-header/site-header.component';
import { StationComponent } from '../station/station.component';
import { WaterChapterComponent } from '../water-chapter/water-chapter.component';
import { YardFilmComponent } from '../yard-film/yard-film.component';

@Component({
  selector: 'gm-home-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SiteHeaderComponent,
    HeroComponent,
    YardFilmComponent,
    GasChapterComponent,
    WaterChapterComponent,
    StationComponent,
    SafetyComponent,
    DepotsComponent,
    AboutComponent,
    FaqComponent,
    SiteFooterComponent,
    MobileOrderBarComponent,
  ],
  template: `
    <a class="skip" href="#pedido">Ir para o pedido</a>
    <gm-site-header />
    <main>
      <gm-hero />
      <gm-yard-film />
      <gm-gas-chapter />
      <gm-water-chapter />
      <gm-station />
      <gm-depots />
      <gm-safety />
      <gm-about />
      <gm-faq />
    </main>
    <gm-site-footer />
    <gm-mobile-order-bar />
  `,
  styles: `
    .skip {
      position: absolute; left: 1rem; top: -4rem; z-index: 50;
      padding: 0.7rem 1rem; background: var(--ink); color: #fff; font-weight: 700;
    }
    .skip:focus { top: 1rem; }
  `,
})
export class HomePage {
  // Public page only: publishes the schema.org data for search engines.
  private readonly structuredData = inject(StructuredDataService);
}
