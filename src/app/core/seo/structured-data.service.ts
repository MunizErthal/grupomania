import { DOCUMENT, Injectable, effect, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ContentStore } from '../content/content.store';
import { buildStructuredData } from './structured-data';

const SCRIPT_ID = 'gm-structured-data';

/**
 * Keeps a JSON-LD <script> in <head> in sync with the published content,
 * so search engines read the depots' names, addresses, phones and hours.
 */
@Injectable({ providedIn: 'root' })
export class StructuredDataService {
  private readonly document = inject(DOCUMENT);
  private readonly store = inject(ContentStore);

  constructor() {
    effect(() => this.write(buildStructuredData(this.store.content(), environment.siteUrl)));
  }

  private write(data: object): void {
    let script = this.document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (!script) {
      script = this.document.createElement('script');
      script.id = SCRIPT_ID;
      script.type = 'application/ld+json';
      this.document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  }
}
