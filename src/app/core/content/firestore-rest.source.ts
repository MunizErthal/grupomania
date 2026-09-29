import { Injectable, inject } from '@angular/core';
import { FIREBASE_OPTIONS } from '../backend/firebase-options';
import { SiteContent } from './content.model';
import { ContentSource } from './content.repository';
import { CONTENT_COLLECTION, CONTENT_DOC } from './content.paths';

/**
 * Public read path: one `fetch` to the Firestore REST API instead of shipping
 * the Firebase SDK to every visitor. The document stores the content as a JSON
 * string in the `json` field (see FirebaseContentPublisher).
 */
@Injectable()
export class FirestoreRestContentSource implements ContentSource {
  private readonly options = inject(FIREBASE_OPTIONS);

  async load(): Promise<SiteContent | null> {
    const { projectId, apiKey } = this.options;
    const url =
      `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}` +
      `/databases/(default)/documents/${CONTENT_COLLECTION}/${CONTENT_DOC}?key=${encodeURIComponent(apiKey)}`;
    const response = await fetch(url, { cache: 'no-cache' });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`Firestore respondeu ${response.status}`);
    const body = (await response.json()) as { fields?: { json?: { stringValue?: string } } };
    const json = body.fields?.json?.stringValue;
    return json ? (JSON.parse(json) as SiteContent) : null;
  }
}
