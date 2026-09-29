import { Depot, SiteContent, TimeRange, WeeklyHours } from '../content/content.model';

type Json = Record<string, unknown>;

const DAYS: Record<keyof WeeklyHours, string[]> = {
  weekdays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  saturday: ['Saturday'],
  sunday: ['Sunday'],
};

const absolute = (siteUrl: string, url: string): string =>
  !url || /^https?:\/\//.test(url) ? url : `${siteUrl.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;

const digitsPhone = (phone: string): string => {
  const d = phone.replace(/\D/g, '');
  return d ? `+55${d}` : '';
};

function openingHours(hours: WeeklyHours): Json[] {
  return (Object.keys(DAYS) as (keyof WeeklyHours)[])
    .map((key) => [key, hours[key]] as const)
    .filter((entry): entry is readonly [keyof WeeklyHours, TimeRange] => !!entry[1])
    .map(([key, range]) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: DAYS[key],
      opens: range.open,
      closes: range.close,
    }));
}

function depotNode(depot: Depot, content: SiteContent, siteUrl: string, orgId: string): Json {
  const node: Json = {
    '@type': 'Store',
    '@id': `${siteUrl}/#${depot.id}`,
    name: depot.name,
    description: `${depot.tagline}. Tele-entrega de gás de cozinha e água mineral.`,
    url: `${siteUrl}/#depositos`,
    telephone: digitsPhone(depot.landline || depot.whatsapp),
    parentOrganization: { '@id': orgId },
    paymentAccepted: content.payments.join(', '),
    currenciesAccepted: 'BRL',
    openingHoursSpecification: depot.selfService24h
      ? [{ '@type': 'OpeningHoursSpecification', dayOfWeek: Object.values(DAYS).flat(), opens: '00:00', closes: '23:59' }]
      : openingHours(content.hours.gas),
  };
  if (depot.logoUrl && !depot.logoUrl.startsWith('data:')) node['image'] = absolute(siteUrl, depot.logoUrl);
  if (depot.street) {
    node['address'] = {
      '@type': 'PostalAddress',
      streetAddress: depot.street,
      addressLocality: depot.city,
      addressRegion: 'RS',
      postalCode: depot.zip,
      addressCountry: 'BR',
    };
  }
  if (depot.mapsUrl) node['hasMap'] = depot.mapsUrl;
  if (depot.instagram) node['sameAs'] = [`https://www.instagram.com/${depot.instagram}`];
  const areas = [depot.city, ...depot.neighborhoods.split(/,| e /).map((s) => s.trim())].filter(
    (s) => s && !/arredores/i.test(s),
  );
  if (areas.length) node['areaServed'] = [...new Set(areas)].map((name) => ({ '@type': 'Place', name }));
  return node;
}

/**
 * schema.org description of the group and its depots, derived from the
 * editable content so it never drifts from what the page shows.
 */
export function buildStructuredData(content: SiteContent, siteUrl: string): Json {
  const orgId = `${siteUrl}/#organizacao`;
  const b = content.brand;
  const organization: Json = {
    '@type': 'Organization',
    '@id': orgId,
    name: b.groupName,
    url: `${siteUrl}/`,
    logo: absolute(siteUrl, 'logos/grupo.png'),
    foundingDate: b.foundedOn,
    telephone: digitsPhone(b.landline),
    sameAs: [b.instagram ? `https://www.instagram.com/${b.instagram}` : '', b.linktree].filter(Boolean),
    areaServed: ['Estância Velha', 'Novo Hamburgo'].map((name) => ({ '@type': 'City', name })),
    knowsAbout: ['Gás de cozinha GLP', 'Botijão P13', 'Botijão P45', 'Água mineral 20 litros', 'Bebedouros'],
  };
  return {
    '@context': 'https://schema.org',
    '@graph': [
      organization,
      { '@type': 'WebSite', '@id': `${siteUrl}/#site`, url: `${siteUrl}/`, name: b.groupName, inLanguage: 'pt-BR', publisher: { '@id': orgId } },
      ...content.depots.map((d) => depotNode(d, content, siteUrl, orgId)),
    ],
  };
}
