import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  EdsBadgeComponent,
  EdsButtonComponent,
  EdsCardComponent,
  EdsStatusComponent,
  EdsTagComponent
} from '@poluru-labs/enterprise-design-system-angular';
import { templateConfig } from '../../core/config/template.config';
import { statusVariant } from '../../shared/utils/status-variant';
import { filterMeetings } from '../../shared/utils/sales';

@Component({
  selector: 'app-meetings-page',
  standalone: true,
  imports: [EdsBadgeComponent, EdsButtonComponent, EdsCardComponent, EdsStatusComponent, EdsTagComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head">
      <div>
        <p class="eyebrow">Prep</p>
        <h1>Meetings</h1>
        <p class="summary">AI-packed agendas, attendee maps, and competitive notes for Ananya Poluru’s live calendar.</p>
      </div>
      <eds-badge [label]="filtered().length + ' packs'" variant="brand" [soft]="true" [pill]="true"></eds-badge>
    </section>

    <div class="chips" style="margin-bottom: 0.9rem">
      @for (item of types; track item) {
        <button type="button" class="chip" [class.active]="type() === item" (click)="type.set(item)">{{ item }}</button>
      }
    </div>

    <section class="grid-3">
      @for (item of filtered(); track item.id) {
        <eds-card class="card-pad collection-card" [elevated]="false">
          <div class="section-head">
            <h3>{{ item.account }}</h3>
            <eds-status [label]="item.status" [variant]="statusVariant(item.status)"></eds-status>
          </div>
          <p class="meta meta-clamp">{{ item.detail }}</p>
          <p class="meta">{{ item.when }} · {{ item.attendees }} attendees · {{ item.owner }}</p>
          <div footer class="card-actions">
            <eds-tag [label]="item.type" variant="brand"></eds-tag>
            <eds-button variant="secondary" size="sm" icon="file" (clicked)="openBrief()">Open pack</eds-button>
          </div>
        </eds-card>
      }
    </section>
  `
})
export class MeetingsPageComponent {
  protected readonly config = templateConfig;
  protected readonly statusVariant = statusVariant;
  protected readonly type = signal('All');
  protected readonly types = ['All', 'QBR', 'Discovery', 'Proposal', 'Legal', 'Champion'];

  protected readonly filtered = computed(() => filterMeetings(this.config.meetings, '', this.type()));

  protected openBrief(): void {
    window.dispatchEvent(new CustomEvent('garnet:brief'));
  }
}
