import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  EdsBadgeComponent,
  EdsButtonComponent,
  EdsCardComponent,
  EdsEmptyStateComponent,
  EdsStatusComponent,
  EdsTagComponent
} from '@poluru-labs/enterprise-design-system-angular';
import { templateConfig, type CollectionRow } from '../../core/config/template.config';
import { statusVariant } from '../../shared/utils/status-variant';

@Component({
  selector: 'app-collections-page',
  standalone: true,
  imports: [
    EdsBadgeComponent,
    EdsButtonComponent,
    EdsCardComponent,
    EdsEmptyStateComponent,
    EdsStatusComponent,
    EdsTagComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head">
      <div>
        <p class="eyebrow">Owned libraries</p>
        <h1>Collections</h1>
        <p class="summary">Group prompts by team. Legal stays restricted. Customer experience stays pinned for Harbor Desk.</p>
      </div>
      <eds-badge [label]="pinnedCount() + ' pinned'" variant="brand" [soft]="true" [pill]="true"></eds-badge>
    </section>

    @if (notice()) {
      <p class="notice">{{ notice() }}</p>
    }

    <div class="chips" style="margin-bottom: 0.9rem">
      @for (item of filters; track item) {
        <button type="button" class="chip" [class.active]="filter() === item" (click)="filter.set(item)">{{ item }}</button>
      }
    </div>

    @if (filtered().length === 0) {
      <eds-empty-state heading="No collections in this view" description="Show every collection or pin a new one." [icon]="true">
        <div actions>
          <eds-button variant="primary" size="sm" (clicked)="filter.set('All')">Show all</eds-button>
        </div>
      </eds-empty-state>
    } @else {
      <section class="grid-3">
        @for (collection of filtered(); track collection.name) {
          <eds-card
            class="card-pad collection-card"
            [class.selected-card]="selectedName() === collection.name"
            [elevated]="false"
            (click)="selectedName.set(collection.name)"
          >
            <div class="section-head">
              <h3>{{ collection.name }}</h3>
              <eds-status [label]="collection.pinned ? 'Pinned' : 'Open'" [variant]="statusVariant(collection.pinned ? 'Live' : 'Draft')"></eds-status>
            </div>
            <p class="meta meta-clamp">{{ collection.detail }}</p>
            <p class="meta">{{ collection.prompts }} prompts · {{ collection.live }} live · {{ collection.review }} in review</p>
            <div footer class="card-actions">
              <eds-tag [label]="collection.success" variant="brand"></eds-tag>
              <eds-tag [label]="collection.owner" variant="info"></eds-tag>
              <eds-button variant="secondary" size="sm" (clicked)="togglePin(collection.name); $event.stopPropagation()">
                {{ collection.pinned ? 'Unpin' : 'Pin' }}
              </eds-button>
            </div>
          </eds-card>
        }
      </section>
    }
  `
})
export class CollectionsPageComponent {
  protected readonly config = templateConfig;
  protected readonly rows = signal<CollectionRow[]>(this.config.collections.map((item) => ({ ...item })));
  protected readonly filter = signal('All');
  protected readonly selectedName = signal(this.config.collections[0]?.name ?? '');
  protected readonly notice = signal('');
  protected readonly statusVariant = statusVariant;
  protected readonly filters = ['All', 'Pinned', 'Open'];

  protected readonly filtered = computed(() => {
    const current = this.filter();
    return this.rows().filter((item) => {
      if (current === 'Pinned') {
        return item.pinned;
      }
      if (current === 'Open') {
        return !item.pinned;
      }
      return true;
    });
  });

  protected readonly pinnedCount = computed(() => this.rows().filter((item) => item.pinned).length);

  protected togglePin(name: string): void {
    this.rows.update((items) =>
      items.map((item) => (item.name === name ? { ...item, pinned: !item.pinned } : item))
    );
    const next = this.rows().find((item) => item.name === name);
    this.notice.set(`${name} ${next?.pinned ? 'pinned' : 'unpinned'} for Priya Poluru.`);
  }
}
