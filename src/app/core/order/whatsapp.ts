/** Brazilian phone text → wa.me number (adds country code 55). */
export function toWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '';
  return digits.startsWith('55') && digits.length >= 12 ? digits : `55${digits}`;
}

export function whatsappLink(phone: string, message = ''): string {
  const number = toWhatsAppNumber(phone);
  const text = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${number}${text}`;
}

export function telLink(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return `tel:+55${digits}`;
}
