/**
 * Declarative description of what the admin can edit. Adding a new editable
 * field means adding a line here, not writing a new form (Open/Closed).
 */
export type FieldDef =
  | { kind: 'text' | 'textarea' | 'phone' | 'url' | 'date'; key: string; label: string; hint?: string }
  | { kind: 'image' | 'video'; key: string; label: string; folder: string; hint?: string }
  | { kind: 'toggle'; key: string; label: string; hint?: string }
  | { kind: 'hours'; key: string; label: string; hint?: string }
  | { kind: 'stringList'; key: string; label: string; itemLabel: string; hint?: string }
  | {
      kind: 'objectList';
      key: string;
      label: string;
      itemLabel: string;
      titleKey: string;
      fields: FieldDef[];
      create: () => Record<string, unknown>;
      hint?: string;
    };

export interface SectionDef {
  /** Top-level key in SiteContent. */
  key: string;
  slug: string;
  title: string;
  description: string;
  /** For sections whose value is a list, the single field that edits it. */
  fields: FieldDef[];
  /** When true, `fields[0]` edits the section value itself (a root list). */
  rootList?: boolean;
  preview?: string; // anchor on the public page
}
