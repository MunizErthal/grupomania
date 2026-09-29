import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ContentStore } from '../../../core/content/content.store';
import { IconComponent } from '../../../shared/ui/icon.component';

@Component({
  selector: 'gm-station',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  templateUrl: './station.component.html',
  styleUrl: './station.component.css',
})
export class StationComponent {
  protected readonly store = inject(ContentStore);
  protected readonly depot = computed(() => this.store.depots().find((d) => d.selfService24h));
}
