import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ContentStore } from '../../../core/content/content.store';
import { OrderDraftService } from '../../../core/order/order-draft.service';
import { IconComponent } from '../../../shared/ui/icon.component';

@Component({
  selector: 'gm-water-chapter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  templateUrl: './water-chapter.component.html',
  styleUrl: './water-chapter.component.css',
})
export class WaterChapterComponent {
  protected readonly store = inject(ContentStore);
  protected readonly order = inject(OrderDraftService);
}
