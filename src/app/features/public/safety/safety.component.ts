import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ContentStore } from '../../../core/content/content.store';

@Component({
  selector: 'gm-safety',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './safety.component.html',
  styleUrl: './safety.component.css',
})
export class SafetyComponent {
  protected readonly store = inject(ContentStore);
}
