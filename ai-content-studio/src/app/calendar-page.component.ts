import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  EdsBadgeComponent,
  EdsCardComponent,
  EdsTimelineComponent,
  EdsTimelineItem
} from '@poluru-labs/enterprise-design-system-angular';
import { templateConfig } from '../template.config';

@Component({
  selector: 'app-calendar-page',
  standalone: true,
  imports: [EdsCardComponent, EdsTimelineComponent, EdsBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host {
      --brand: #0046ff;
      --line: #dbe7ff;
      display: block;
    }

    .card {
      border-radius: 14px;
    }

    .head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
    }
  `],
  template: `
    <eds-card class="card" [elevated]="false">
      <div class="head">
        <h2>This Week</h2>
        <eds-badge label="5 planned" variant="brand" [soft]="true"></eds-badge>
      </div>
      <eds-timeline [items]="timelineItems"></eds-timeline>
    </eds-card>
  `
})
export class CalendarPageComponent {
  protected readonly config = templateConfig;
  protected readonly timelineItems: EdsTimelineItem[] = this.config.calendar.map((entry, index) => ({
    title: entry.item,
    description: entry.day,
    status: index === 0 ? 'current' : 'upcoming'
  }));
}
