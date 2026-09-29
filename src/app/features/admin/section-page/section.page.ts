import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { IconComponent } from '../../../shared/ui/icon.component';
import { AdminDraftService } from '../admin-draft.service';
import { FieldEditorComponent } from '../field-editor/field-editor.component';
import { sectionBySlug } from '../sections';

@Component({
  selector: 'gm-section-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FieldEditorComponent, IconComponent],
  templateUrl: './section.page.html',
  styleUrl: './section.page.css',
})
export class SectionPage {
  private readonly draft = inject(AdminDraftService);
  /** Bound from the route param via withComponentInputBinding. */
  readonly slug = input.required<string>();
  protected readonly section = computed(() => sectionBySlug(this.slug()));

  protected restore(): void {
    const s = this.section();
    if (s && confirm(`Voltar "${s.title}" ao texto original do site? (Só vale depois de publicar.)`)) {
      this.draft.restoreSection(s.key);
    }
  }
}
