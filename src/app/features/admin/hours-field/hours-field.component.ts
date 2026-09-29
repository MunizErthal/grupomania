import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TimeRange, WeeklyHours } from '../../../core/content/content.model';

type DayKey = keyof WeeklyHours;

@Component({
  selector: 'gm-hours-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hours-field.component.html',
  styleUrl: './hours-field.component.css',
})
export class HoursFieldComponent {
  readonly label = input.required<string>();
  readonly value = input.required<WeeklyHours>();
  readonly fieldId = input.required<string>();
  readonly changed = output<WeeklyHours>();

  protected readonly days: { key: DayKey; label: string }[] = [
    { key: 'weekdays', label: 'Segunda a sexta' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo e feriado' },
  ];

  protected range(day: DayKey): TimeRange | null {
    return this.value()[day];
  }

  protected toggle(day: DayKey, open: boolean): void {
    this.changed.emit({ ...this.value(), [day]: open ? { open: '08:00', close: '18:00' } : null });
  }

  protected setTime(day: DayKey, which: keyof TimeRange, event: Event): void {
    const current = this.value()[day];
    if (!current) return;
    const time = (event.target as HTMLInputElement).value;
    this.changed.emit({ ...this.value(), [day]: { ...current, [which]: time } });
  }
}
