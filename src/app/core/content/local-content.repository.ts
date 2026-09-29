import { Injectable } from '@angular/core';
import { SiteContent } from './content.model';
import { ContentPublisher, ContentSource, MediaStorage } from './content.repository';

const STORAGE_KEY = 'gm.site-content.v1';

/**
 * Browser-only persistence used while Firebase is not configured.
 * Good for trying the admin locally: changes are visible only in this browser.
 */
@Injectable()
export class LocalContentStore implements ContentSource, ContentPublisher {
  async load(): Promise<SiteContent | null> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as SiteContent) : null;
    } catch {
      return null;
    }
  }

  async save(content: SiteContent): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    } catch {
      throw new Error('O navegador ficou sem espaço para salvar. Use imagens menores ou ligue o Firebase.');
    }
  }
}

/** Keeps uploads as data URLs inside the saved content (local mode only). */
@Injectable()
export class DataUrlMediaStorage implements MediaStorage {
  private static readonly MAX_BYTES = 1_500_000;

  upload(file: File): Promise<string> {
    if (file.size > DataUrlMediaStorage.MAX_BYTES) {
      return Promise.reject(
        new Error('No modo local cada arquivo pode ter até 1,5 MB. Com o Firebase ligado esse limite some.'),
      );
    }
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error('Não foi possível ler o arquivo.'));
      reader.readAsDataURL(file);
    });
  }
}
