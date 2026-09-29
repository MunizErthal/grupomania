import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ContentStore } from '../../../core/content/content.store';
import { OrderDraftService } from '../../../core/order/order-draft.service';
import { IconComponent } from '../../../shared/ui/icon.component';

@Component({
  selector: 'gm-gas-chapter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  templateUrl: './gas-chapter.component.html',
  styleUrl: './gas-chapter.component.css',
})
export class GasChapterComponent {
  protected readonly store = inject(ContentStore);
  protected readonly order = inject(OrderDraftService);
}
