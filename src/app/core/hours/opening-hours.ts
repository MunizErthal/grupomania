import { ClockTime, TimeRange, WeeklyHours } from '../content/content.model';

/** Wall-clock moment in Brazil, independent of the visitor's time zone. */
export interface LocalMoment {
  weekday: number; // 0 = domingo
  minutes: number; // minutes since midnight
}

export type OpenStatus =
  | { open: true; closesAt: ClockTime }
  | { open: false; opensAt: ClockTime | null; opensLabel: string };

const DAY_NAMES = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
const TIME_ZONE = 'America/Sao_Paulo';

export function momentInBrazil(date: Date): LocalMoment {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TIME_ZONE,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '0';
  const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  return { weekday, minutes: Number(get('hour')) * 60 + Number(get('minute')) };
}

export const toMinutes = (t: ClockTime): number => {
  const [h, m] = t.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
};

/** '21:30' → '21h30', '08:00' → '8h' */
export const formatClock = (t: ClockTime): string => {
  const [h, m] = t.split(':').map(Number);
  return m ? `${h}h${String(m).padStart(2, '0')}` : `${h}h`;
};

export function rangeFor(hours: WeeklyHours, weekday: number): TimeRange | null {
  if (weekday === 0) return hours.sunday;
  if (weekday === 6) return hours.saturday;
  return hours.weekdays;
}

export function statusAt(hours: WeeklyHours, at: LocalMoment): OpenStatus {
  const today = rangeFor(hours, at.weekday);
  if (today && at.minutes >= toMinutes(today.open) && at.minutes < toMinutes(today.close)) {
    return { open: true, closesAt: today.close };
  }
  if (today && at.minutes < toMinutes(today.open)) {
    return { open: false, opensAt: today.open, opensLabel: `hoje às ${formatClock(today.open)}` };
  }
  for (let i = 1; i <= 7; i++) {
    const day = (at.weekday + i) % 7;
    const range = rangeFor(hours, day);
    if (range) {
      const when = i === 1 ? 'amanhã' : DAY_NAMES[day];
      return { open: false, opensAt: range.open, opensLabel: `${when} às ${formatClock(range.open)}` };
    }
  }
  return { open: false, opensAt: null, opensLabel: '' };
}

export function describeRange(range: TimeRange | null): string {
  return range ? `${formatClock(range.open)} às ${formatClock(range.close)}` : 'fechado';
}
