import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  EdsAvatarComponent,
  EdsButtonComponent,
  EdsComboboxComponent,
  EdsDrawerComponent,
  EdsDropdownMenuComponent,
  EdsIconComponent,
  EdsKbdComponent,
  EdsListComponent,
  EdsMenuItemComponent,
  EdsModalComponent,
  EdsSearchComponent,
  EdsSliderComponent,
  EdsStepperComponent,
  EdsTextareaComponent,
  EdsToastComponent,
  EdsTooltipComponent,
  EdsVisuallyHiddenComponent,
  type EdsComboboxOption,
  type EdsListItem,
  type EdsStepperStep
} from '@poluru-labs/enterprise-design-system-angular';
import { filter, fromEvent } from 'rxjs';
import { templateConfig } from './core/config/template.config';
import { environment } from '../environments/environment';
import { liveEndpointCount, openViolationCount } from './shared/utils/policy';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    EdsAvatarComponent,
    EdsButtonComponent,
    EdsComboboxComponent,
    EdsDrawerComponent,
    EdsDropdownMenuComponent,
    EdsIconComponent,
    EdsKbdComponent,
    EdsListComponent,
    EdsMenuItemComponent,
    EdsModalComponent,
    EdsSearchComponent,
    EdsSliderComponent,
    EdsStepperComponent,
    EdsTextareaComponent,
    EdsToastComponent,
    EdsTooltipComponent,
    EdsVisuallyHiddenComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="shell" [attr.data-app]="appName" [class.nav-open]="navOpen()">
      <header class="topbar">
        <div class="topbar-primary">
          <eds-button
            class="menu-button topbar-icon"
            variant="tertiary"
            size="sm"
            icon="menu"
            [iconOnly]="true"
            accessibleLabel="Open navigation"
            (clicked)="toggleNav()"
          ></eds-button>

          <a class="brand" routerLink="/" [attr.aria-label]="config.brand.accent">
            <span class="brand-mark">{{ config.brand.mark }}</span>
            <strong class="brand-copy">{{ config.brand.accent }}</strong>
          </a>

          <div class="command-bar">
            <eds-search
              class="topbar-search"
              size="md"
              placeholder="Search policies, filters, PII rules..."
              [clearable]="true"
              [value]="query()"
              (valueChange)="onQuery($event)"
            ></eds-search>
            <eds-kbd keys="⌘K"></eds-kbd>
          </div>

          <div class="topbar-actions">
            <span class="inbox-wrap">
              <eds-tooltip content="Activity" placement="bottom">
                <eds-button
                  class="topbar-icon"
                  variant="tertiary"
                  size="sm"
                  icon="bell"
                  [iconOnly]="true"
                  accessibleLabel="Open activity"
                  (clicked)="inboxOpen.set(true)"
                ></eds-button>
              </eds-tooltip>
              <span class="inbox-count">{{ openHits }}</span>
            </span>

            <eds-button class="topbar-cta" variant="primary" size="sm" icon="filter" (clicked)="openTestModal()">
              Test prompt
            </eds-button>

            <span class="topbar-divider" aria-hidden="true"></span>

            <eds-dropdown-menu class="account-menu" placement="bottom">
              <button
                trigger
                type="button"
                class="account"
                [attr.aria-label]="'Account menu for ' + config.user.name"
              >
                <span class="account-avatar">
                  <eds-avatar [name]="config.user.name" size="sm"></eds-avatar>
                  <span class="account-status" title="Online"></span>
                </span>
                <span class="account-meta">
                  <strong>{{ config.user.name }}</strong>
                  <small>{{ config.user.role }}</small>
                </span>
                <span class="material-symbols-outlined account-caret" aria-hidden="true">expand_more</span>
              </button>
              <div class="account-menu-head">
                <eds-avatar [name]="config.user.name" size="md"></eds-avatar>
                <div>
                  <strong>{{ config.user.name }}</strong>
                  <small>{{ config.user.role }}</small>
                  <span>{{ config.workspace }}</span>
                </div>
              </div>
              <eds-menu-item label="Workspace settings" value="settings" (itemSelect)="goSettings()"></eds-menu-item>
              <eds-menu-item label="Open playground" value="playground" (itemSelect)="goPlayground()"></eds-menu-item>
              <eds-menu-item label="Test prompt" value="test" (itemSelect)="openTestModal()"></eds-menu-item>
            </eds-dropdown-menu>
          </div>
        </div>

        <div class="topbar-context">
          <span class="context-workspace">{{ config.workspace }}</span>
          <div class="context-chips">
            <span class="context-chip">
              <span class="material-symbols-outlined" aria-hidden="true">bolt</span>
              {{ config.environment }}
            </span>
            <span class="context-chip">
              <span class="material-symbols-outlined" aria-hidden="true">shield</span>
              {{ config.copilotLabel }}
            </span>
            <span class="context-chip">
              <span class="material-symbols-outlined" aria-hidden="true">person</span>
              {{ config.user.role }}
            </span>
            <button type="button" class="context-chip action" (click)="goEndpoints()">
              <span class="material-symbols-outlined" aria-hidden="true">hub</span>
              {{ liveEndpoints }} live
            </button>
            <button type="button" class="context-chip action" (click)="goPlayground()">
              <span class="material-symbols-outlined" aria-hidden="true">verified_user</span>
              {{ config.qualityLabel }}
            </button>
          </div>
        </div>
      </header>

      <aside class="sidebar">
        <nav class="nav">
          @for (item of config.nav; track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: item.exact === true }"
            >
              <span class="material-symbols-outlined">{{ item.icon }}</span>
              <span>{{ item.label }}</span>
            </a>
          }
        </nav>

        <div class="profile">
          <eds-avatar [name]="config.user.name" size="sm"></eds-avatar>
          <div>
            <strong>{{ config.user.name }}</strong>
            <small>{{ config.user.role }}</small>
          </div>
        </div>
      </aside>

      <button class="backdrop" type="button" aria-label="Close navigation" (click)="closeNav()"></button>

      <div class="main">
        <main>
          <eds-visually-hidden>Reef guardrails policy center workspace</eds-visually-hidden>
          <router-outlet />
        </main>
      </div>
    </div>

    <eds-modal [open]="testOpen()" heading="Test a prompt" (openChange)="testOpen.set($event)">
      <div class="modal-grid">
        <eds-stepper [steps]="testSteps" [current]="testStep()" (stepClick)="testStep.set($event)"></eds-stepper>

        @if (testStep() === 0) {
          <eds-combobox
            label="Endpoint"
            placeholder="Choose an LLM endpoint"
            [options]="endpointOptions"
            [value]="draftEndpoint()"
            (valueChange)="draftEndpoint.set($event)"
          ></eds-combobox>
        } @else if (testStep() === 1) {
          <eds-textarea
            label="Prompt"
            placeholder="Paste a prompt Maya Poluru should score against safety-core."
            [rows]="4"
            [value]="draftText()"
            (valueChange)="draftText.set($event)"
          ></eds-textarea>
        } @else {
          <eds-slider
            label="Threshold"
            [min]="0.4"
            [max]="0.95"
            [step]="0.01"
            [value]="draftThreshold()"
            [showValue]="true"
            (valueChange)="draftThreshold.set($event)"
          ></eds-slider>
        }
      </div>
      <div footer class="modal-footer">
        <eds-button variant="secondary" (clicked)="testOpen.set(false)">Cancel</eds-button>
        @if (testStep() > 0) {
          <eds-button variant="tertiary" (clicked)="testStep.set(testStep() - 1)">Back</eds-button>
        }
        <eds-button variant="primary" [disabled]="!canAdvanceTest()" (clicked)="advanceTest()">
          {{ testStep() === 2 ? 'Run test' : 'Continue' }}
        </eds-button>
      </div>
    </eds-modal>

    <eds-drawer [open]="inboxOpen()" heading="Activity" side="right" size="md" (openChange)="inboxOpen.set($event)">
      <div class="drawer-stack">
        <eds-icon name="bell" size="md" [decorative]="true"></eds-icon>
        <eds-list [items]="inboxItems" [divided]="true"></eds-list>
      </div>
      <div footer class="drawer-footer">
        <eds-button variant="secondary" (clicked)="inboxOpen.set(false)">Close</eds-button>
        <eds-button variant="primary" (clicked)="goViolations()">Open violations</eds-button>
      </div>
    </eds-drawer>

    <div class="toast-slot">
      <eds-toast
        title="Test queued"
        description="Maya Poluru will see hits on the policy playground."
        variant="success"
        [open]="toastOpen()"
        (openChange)="toastOpen.set($event)"
      ></eds-toast>
    </div>
  `
})
export class AppComponent {
  private readonly router = inject(Router);
  protected readonly config = templateConfig;
  protected readonly appName = environment.appName;
  protected readonly navOpen = signal(false);
  protected readonly query = signal('');
  protected readonly testOpen = signal(false);
  protected readonly inboxOpen = signal(false);
  protected readonly toastOpen = signal(false);
  protected readonly testStep = signal(0);
  protected readonly draftEndpoint = signal('');
  protected readonly draftText = signal('');
  protected readonly draftThreshold = signal(0.7);

  protected readonly testSteps: EdsStepperStep[] = [
    { label: 'Endpoint', description: 'LLM surface' },
    { label: 'Prompt', description: 'Text to score' },
    { label: 'Threshold', description: 'Hit floor' }
  ];

  protected readonly endpointOptions: EdsComboboxOption[] = this.config.endpoints.map((item) => ({
    label: `${item.name} · ${item.model}`,
    value: item.id
  }));

  protected readonly inboxItems: EdsListItem[] = this.config.activity.slice(0, 4).map((entry) => ({
    label: entry.title,
    description: entry.detail
  }));

  protected readonly liveEndpoints = liveEndpointCount(this.config.endpoints);
  protected readonly openHits = openViolationCount(this.config.violations);

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe(() => this.closeNav());

    fromEvent(window, 'reef:test')
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.openTestModal());
  }

  @HostListener('document:keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.goPlaygroundQuery();
    }
  }

  protected toggleNav(): void {
    this.navOpen.update((open) => !open);
  }

  protected closeNav(): void {
    this.navOpen.set(false);
  }

  protected onQuery(value: string): void {
    this.query.set(value);
  }

  protected goPlaygroundQuery(): void {
    const q = this.query().trim();
    void this.router.navigate(['/playground'], { queryParams: q ? { q } : {} });
  }

  protected openTestModal(): void {
    this.testStep.set(0);
    this.testOpen.set(true);
  }

  protected goSettings(): void {
    void this.router.navigateByUrl('/settings');
  }

  protected goPlayground(): void {
    this.inboxOpen.set(false);
    void this.router.navigateByUrl('/playground');
  }

  protected goEndpoints(): void {
    this.inboxOpen.set(false);
    void this.router.navigateByUrl('/endpoints');
  }

  protected goViolations(): void {
    this.inboxOpen.set(false);
    void this.router.navigateByUrl('/violations');
  }

  protected canAdvanceTest(): boolean {
    if (this.testStep() === 0) {
      return this.draftEndpoint().length > 0;
    }
    if (this.testStep() === 1) {
      return this.draftText().trim().length > 3;
    }
    return true;
  }

  protected advanceTest(): void {
    if (!this.canAdvanceTest()) {
      return;
    }
    if (this.testStep() < 2) {
      this.testStep.update((step) => step + 1);
      return;
    }
    const q = this.draftText().trim();
    this.draftEndpoint.set('');
    this.draftText.set('');
    this.draftThreshold.set(0.7);
    this.testOpen.set(false);
    this.toastOpen.set(true);
    void this.router.navigate(['/playground'], { queryParams: q ? { q } : {} });
  }
}
