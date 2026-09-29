import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ContentStore } from '../../../core/content/content.store';
import { IconComponent } from '../../../shared/ui/icon.component';

@Component({
  selector: 'gm-faq',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css',
})
export class FaqComponent {
  protected readonly store = inject(ContentStore);
}
