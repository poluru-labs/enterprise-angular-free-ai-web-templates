import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  EdsBadgeComponent,
  EdsButtonComponent,
  EdsCardComponent,
  EdsEmptyStateComponent,
  EdsStatusComponent,
  EdsSwitchComponent
} from '@poluru-labs/enterprise-design-system-angular';
import { templateConfig, type AclReview } from '../../core/config/template.config';
import { patchAcl } from '../../shared/utils/knowledge';
import { statusVariant } from '../../shared/utils/status-variant';

type AclFilter = 'All' | AclReview['status'] | AclReview['severity'];

@Component({
  selector: 'app-governance-page',
  standalone: true,
  imports: [
    RouterLink,
    EdsBadgeComponent,
    EdsButtonComponent,
    EdsCardComponent,
    EdsEmptyStateComponent,
    EdsStatusComponent,
    EdsSwitchComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head">
      <div>
        <p class="eyebrow">Access</p>
        <h1>Governance</h1>
        <p class="summary">Approve collection ACLs, freeze retrieval on review, and keep citations required for Ananya Poluru’s workspace.</p>
      </div>
      <eds-badge [label]="openCount() + ' open'" variant="warning" [soft]="true" [pill]="true"></eds-badge>
    </section>

    @if (notice()) {
      <p class="notice">{{ notice() }}</p>
    }

    <section class="grid-4">
      <eds-card class="card-pad" [elevated]="false">
        <p class="eyebrow">Open</p>
        <h2>{{ openCount() }}</h2>
      </eds-card>
      <eds-card class="card-pad" [elevated]="false">
        <p class="eyebrow">Held</p>
        <h2>{{ count('Held') }}</h2>
      </eds-card>
      <eds-card class="card-pad" [elevated]="false">
        <p class="eyebrow">Approved</p>
        <h2>{{ count('Approved') }}</h2>
      </eds-card>
      <eds-card class="card-pad" [elevated]="false">
        <p class="eyebrow">Critical</p>
        <h2>{{ criticalCount() }}</h2>
      </eds-card>
    </section>

    <section class="split" style="margin-top: 0.9rem">
      <eds-card class="card-pad setting" [elevated]="false">
        <div>
          <h3>ACL freeze on review</h3>
          <p>Pause retrieval when Venkata Poluru flags a source for access review.</p>
        </div>
        <eds-switch label="Enabled" [checked]="aclFreeze()" (checkedChange)="aclFreeze.set($event)"></eds-switch>
      </eds-card>
      <eds-card class="card-pad setting" [elevated]="false">
        <div>
          <h3>Require citations</h3>
          <p>Ground every answer with at least one published chunk.</p>
        </div>
        <eds-switch label="Enabled" [checked]="citations()" (checkedChange)="citations.set($event)"></eds-switch>
      </eds-card>
    </section>

    <div class="chips" style="margin: 0.9rem 0">
      @for (item of filters; track item) {
        <button type="button" class="chip" [class.active]="filter() === item" (click)="filter.set(item)">{{ item }}</button>
      }
    </div>

    <section class="split">
      <eds-card class="card-pad" [elevated]="false">
        @if (filtered().length === 0) {
          <eds-empty-state heading="No reviews in this view" description="Clear the filter or wait for the next ACL digest." [icon]="true">
            <div actions>
              <eds-button variant="primary" size="sm" (clicked)="filter.set('All')">Show all</eds-button>
            </div>
          </eds-empty-state>
        } @else {
          @for (item of filtered(); track item.id) {
            <button
              type="button"
              class="alert-row selectable"
              [class.selected]="selectedId() === item.id"
              (click)="selectedId.set(item.id)"
            >
              <div class="copy">
                <strong>{{ item.source }}</strong>
                <p class="meta">{{ item.id }} · {{ item.owner }} · {{ item.severity }}</p>
              </div>
              <eds-status [label]="item.status" [variant]="statusVariant(item.status)"></eds-status>
            </button>
          }
        }
      </eds-card>

      @if (selected(); as item) {
        <eds-card class="card-pad" [elevated]="false">
          <p class="eyebrow">{{ item.id }} · {{ item.time }}</p>
          <h2>{{ item.source }}</h2>
          <p class="meta">{{ item.reason }}</p>
          <dl class="facts">
            <div>
              <dt>Owner</dt>
              <dd>{{ item.owner }}</dd>
            </div>
            <div>
              <dt>Severity</dt>
              <dd>{{ item.severity }}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{{ item.status }}</dd>
            </div>
            <div>
              <dt>Freeze</dt>
              <dd>{{ aclFreeze() ? 'On' : 'Off' }}</dd>
            </div>
          </dl>
          <div class="inline-actions">
            <eds-button variant="primary" size="sm" (clicked)="approve(item.id)">Approve</eds-button>
            <eds-button variant="secondary" size="sm" (clicked)="hold(item.id)">Hold</eds-button>
            <a class="chip" routerLink="/evaluations">Open evaluations</a>
          </div>
        </eds-card>
      }
    </section>
  `
})
export class GovernancePageComponent {
  protected readonly config = templateConfig;
  protected readonly rows = signal<AclReview[]>(this.config.aclReviews.map((item) => ({ ...item })));
  protected readonly filter = signal<AclFilter>('All');
  protected readonly selectedId = signal(this.config.aclReviews[0]?.id ?? '');
  protected readonly notice = signal('');
  protected readonly aclFreeze = signal(true);
  protected readonly citations = signal(true);
  protected readonly statusVariant = statusVariant;
  protected readonly filters: AclFilter[] = ['All', 'Open', 'Held', 'Approved', 'Critical', 'High', 'Watch'];

  protected readonly filtered = computed(() => {
    const current = this.filter();
    return this.rows().filter((item) => current === 'All' || item.status === current || item.severity === current);
  });

  protected readonly selected = computed(() => this.rows().find((item) => item.id === this.selectedId()) ?? this.filtered()[0]);

  protected readonly openCount = computed(() => this.count('Open'));

  protected readonly criticalCount = computed(
    () => this.rows().filter((item) => item.severity === 'Critical' && item.status === 'Open').length
  );

  protected count(status: AclReview['status']): number {
    return this.rows().filter((item) => item.status === status).length;
  }

  protected approve(id: string): void {
    this.rows.set(patchAcl(this.rows(), id, 'Approved'));
    this.notice.set(`Approved ${id} for Ananya Poluru.`);
  }

  protected hold(id: string): void {
    this.rows.set(patchAcl(this.rows(), id, 'Held'));
    this.notice.set(`Held ${id} until ACL freeze lifts.`);
  }
}
