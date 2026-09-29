import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Authored icon set: one stroke width, one corner language. */
const PATHS = {
  whatsapp:
    'M12 3.6a8.4 8.4 0 0 0-7.3 12.6L3.6 20.4l4.3-1.1A8.4 8.4 0 1 0 12 3.6ZM9.3 8.2c.3-.3.7-.2.9.1l.8 1.3c.2.3.1.6-.1.8l-.5.5c.5 1 1.4 1.9 2.4 2.4l.5-.5c.2-.2.5-.3.8-.1l1.3.8c.3.2.4.6.1.9l-.6.6c-.6.6-1.4.7-2.1.4a8.3 8.3 0 0 1-3.8-3.8c-.3-.7-.2-1.5.4-2.1Z',
  phone:
    'M8.3 4.5 6.2 4c-.7-.1-1.4.3-1.6 1-.9 3.6 2.9 10.2 8.2 13.4 1.4.9 3 .3 3.6-.8l.9-1.8c.3-.6 0-1.3-.6-1.6l-2.4-1.2c-.5-.2-1 0-1.3.4l-.9 1.2c-2-.9-3.8-2.8-4.6-4.9l1.2-.8c.4-.3.6-.8.4-1.3L8.3 4.5Z',
  pin: 'M12 20.5s6.2-5.6 6.2-10.6a6.2 6.2 0 1 0-12.4 0c0 5 6.2 10.6 6.2 10.6Zm0-8.2a2.3 2.3 0 1 0 0-4.6 2.3 2.3 0 0 0 0 4.6Z',
  clock: 'M12 20.2a8.2 8.2 0 1 0 0-16.4 8.2 8.2 0 0 0 0 16.4Zm0-12.4V12l3 1.8',
  instagram:
    'M8 3.8h8a4.2 4.2 0 0 1 4.2 4.2v8a4.2 4.2 0 0 1-4.2 4.2H8A4.2 4.2 0 0 1 3.8 16V8A4.2 4.2 0 0 1 8 3.8Zm4 12a3.8 3.8 0 1 0 0-7.6 3.8 3.8 0 0 0 0 7.6Zm4.6-8.6h.01',
  arrow: 'M5 12h13.5m-5-5.5L19 12l-5.5 5.5',
  arrowDown: 'M12 5v13.5m-5.5-5L12 19l5.5-5.5',
  check: 'm5 12.5 4.2 4.2L19 7',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  close: 'm6 6 12 12M18 6 6 18',
  menu: 'M4 7h16M4 12h16M4 17h10',
  upload: 'M12 15.5V4.5m-4.5 4.5L12 4.5 16.5 9M4.5 15v3.2c0 .7.6 1.3 1.3 1.3h12.4c.7 0 1.3-.6 1.3-1.3V15',
  trash: 'M5 7h14M9.5 7V5h5v2m-7.2 0 .8 12h7.8l.8-12',
  external: 'M13 5h6v6m0-6-8.5 8.5M10 6H6a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4',
  eye: 'M2.8 12S6.2 5.8 12 5.8 21.2 12 21.2 12 17.8 18.2 12 18.2 2.8 12 2.8 12Zm9.2 2.8a2.8 2.8 0 1 0 0-5.6 2.8 2.8 0 0 0 0 5.6Z',
  logout: 'M14 4.5h4a1.5 1.5 0 0 1 1.5 1.5v12a1.5 1.5 0 0 1-1.5 1.5h-4M10 16l-4-4 4-4m-4 4h10',
  up: 'm6 14.5 6-6 6 6',
  down: 'm6 9.5 6 6 6-6',
} as const;

export type IconName = keyof typeof PATHS;

@Component({
  selector: 'gm-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true', class: 'gm-icon' },
  template: `
    <svg [attr.width]="size()" [attr.height]="size()" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" [attr.stroke-width]="stroke()" stroke-linecap="round" stroke-linejoin="round">
      <path [attr.d]="d()" />
    </svg>
  `,
  styles: `:host { display: inline-grid; place-items: center; flex: none; line-height: 0; }`,
})
export class IconComponent {
  readonly name = input.required<IconName>();
  readonly size = input(22);
  readonly stroke = input(1.8);
  protected readonly d = computed(() => PATHS[this.name()]);
}
