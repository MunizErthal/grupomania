/**
 * "Acabou o gás? A água? A gente leva." → { head: 'Acabou o gás? A água?', tail: 'A gente leva.' }
 * Lets editable headlines put the accent on their last sentence without markup.
 */
export function splitLastSentence(text: string): { head: string; tail: string } {
  const t = text.trim();
  const end = t.length - 2;
  const cut = Math.max(t.lastIndexOf('? ', end), t.lastIndexOf('. ', end), t.lastIndexOf('! ', end));
  return cut > 0 ? { head: t.slice(0, cut + 1), tail: t.slice(cut + 2) } : { head: '', tail: t };
}
