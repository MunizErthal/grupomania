import { SiteContent } from './content.model';

/*
 * Persistence ports (Interface Segregation + Dependency Inversion).
 * The public site only needs to read; only the lazy-loaded admin writes.
 * Each abstract class doubles as its own DI token.
 */

/** Reads the published content. `null` means nothing was published yet. */
export abstract class ContentSource {
  abstract load(): Promise<SiteContent | null>;
}

/** Publishes a new version of the content (admin only). */
export abstract class ContentPublisher {
  abstract save(content: SiteContent): Promise<void>;
}

/** Stores images/videos uploaded from the admin and returns a public URL. */
export abstract class MediaStorage {
  abstract upload(file: File, folder: string): Promise<string>;
}
