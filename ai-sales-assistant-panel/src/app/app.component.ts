import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  EdsAvatarComponent,
  EdsButtonComponent,
  EdsComboboxComponent,
  EdsDrawerComponent,
  EdsDropdownMenuComponent,
  EdsFileUploadComponent,
  EdsIconComponent,
  EdsInputComponent,
  EdsKbdComponent,
  EdsListComponent,
  EdsMenuItemComponent,
  EdsModalComponent,
  EdsSearchComponent,
  EdsSelectComponent,
  EdsStepperComponent,
  EdsTextareaComponent,
  EdsToastComponent,
  EdsTooltipComponent,
  EdsVisuallyHiddenComponent,
  type EdsComboboxOption,
  type EdsListItem,
  type EdsSelectOption,
  type EdsStepperStep
} from '@poluru-labs/enterprise-design-system-angular';
import { filter, fromEvent } from 'rxjs';
import { templateConfig } from './core/config/template.config';
import { environment } from '../environments/environment';
import { watchCount } from './shared/utils/sales';

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
    EdsFileUploadComponent,
    EdsIconComponent,
    EdsInputComponent,
    EdsKbdComponent,
    EdsListComponent,
    EdsMenuItemComponent,
    EdsModalComponent,
    EdsSearchComponent,
    EdsSelectComponent,
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
              placeholder="Search accounts, signals, owners..."
              [clearable]="true"
              [value]="query()"
              (valueChange)="onQuery($event)"
            ></eds-search>
            <eds-kbd keys="⌘K"></eds-kbd>
          </div>

          <div class="topbar-actions">
            <span class="inbox-wrap">
              <eds-tooltip content="Inbox" placement="bottom">
                <eds-button
                  class="topbar-icon"
                  variant="tertiary"
                  size="sm"
                  icon="bell"
                  [iconOnly]="true"
                  accessibleLabel="Open inbox"
                  (clicked)="inboxOpen.set(true)"
                ></eds-button>
              </eds-tooltip>
              <span class="inbox-count">{{ openWatchCount }}</span>
            </span>

            <eds-button class="topbar-cta" variant="primary" size="sm" icon="file" (clicked)="openBriefModal()">
              Create brief
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
              <eds-menu-item label="Open forecasts" value="forecasts" (itemSelect)="goForecasts()"></eds-menu-item>
              <eds-menu-item label="Create brief" value="brief" (itemSelect)="openBriefModal()"></eds-menu-item>
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
              <span class="material-symbols-outlined" aria-hidden="true">hub</span>
              {{ config.crmLabel }}
            </span>
            <span class="context-chip">
              <span class="material-symbols-outlined" aria-hidden="true">groups</span>
              {{ config.user.role }}
            </span>
            <button type="button" class="context-chip action" (click)="goSignals()">
              <span class="material-symbols-outlined" aria-hidden="true">sensors</span>
              {{ openWatchCount }} watch
            </button>
            <button type="button" class="context-chip action" (click)="goForecasts()">
              <span class="material-symbols-outlined" aria-hidden="true">trending_up</span>
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

        <p class="quick-label">Quick links</p>
        <eds-button variant="primary" size="sm" icon="file" [fullWidth]="true" (clicked)="openBriefModal()">
          Create brief
        </eds-button>
        <eds-button variant="secondary" size="sm" icon="star" [fullWidth]="true" (clicked)="goForecasts()">
          Open forecasts
        </eds-button>

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
          <eds-visually-hidden>Garnet Close sales assistant workspace</eds-visually-hidden>
          <router-outlet />
        </main>
      </div>
    </div>

    <eds-modal [open]="briefOpen()" heading="Create account brief" (openChange)="briefOpen.set($event)">
      <div class="modal-grid">
        <eds-stepper [steps]="briefSteps" [current]="briefStep()" (stepClick)="briefStep.set($event)"></eds-stepper>

        @if (briefStep() === 0) {
          <eds-input
            label="Brief name"
            placeholder="Brightside Health expansion"
            icon="file"
            [value]="draftName()"
            (valueChange)="draftName.set($event)"
          ></eds-input>
          <eds-combobox
            label="Brief type"
            placeholder="Choose a brief"
            [options]="briefOptions"
            [value]="draftType()"
            (valueChange)="draftType.set($event)"
          ></eds-combobox>
        } @else if (briefStep() === 1) {
          <eds-select
            label="Account"
            placeholder="Choose account"
            [options]="accountOptions"
            [value]="draftAccount()"
            (valueChange)="draftAccount.set($event)"
          ></eds-select>
          <eds-textarea
            label="Seller notes"
            placeholder="What should Ananya Poluru’s team emphasize?"
            [rows]="4"
            [value]="draftNotes()"
            (valueChange)="draftNotes.set($event)"
          ></eds-textarea>
        } @else {
          <eds-file-upload
            label="Attach research"
            hint="Optional PDF or notes from last discovery."
            accept=".pdf,.txt,.md"
          ></eds-file-upload>
        }
      </div>
      <div footer class="modal-footer">
        <eds-button variant="secondary" (clicked)="briefOpen.set(false)">Cancel</eds-button>
        @if (briefStep() > 0) {
          <eds-button variant="tertiary" (clicked)="briefStep.set(briefStep() - 1)">Back</eds-button>
        }
        <eds-button variant="primary" [disabled]="!canAdvanceBrief()" (clicked)="advanceBrief()">
          {{ briefStep() === 2 ? 'Queue brief' : 'Continue' }}
        </eds-button>
      </div>
    </eds-modal>

    <eds-drawer [open]="inboxOpen()" heading="Inbox" side="right" size="md" (openChange)="inboxOpen.set($event)">
      <div class="drawer-stack">
        <eds-icon name="bell" size="md" [decorative]="true"></eds-icon>
        <eds-list [items]="inboxItems" [divided]="true"></eds-list>
      </div>
      <div footer class="drawer-footer">
        <eds-button variant="secondary" (clicked)="inboxOpen.set(false)">Close</eds-button>
        <eds-button variant="primary" (clicked)="goSignals()">View signals</eds-button>
      </div>
    </eds-drawer>

    <div class="toast-slot">
      <eds-toast
        title="Brief queued"
        description="Ananya Poluru will get a copy when the research pack is ready."
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
  protected readonly briefOpen = signal(false);
  protected readonly inboxOpen = signal(false);
  protected readonly toastOpen = signal(false);
  protected readonly briefStep = signal(0);
  protected readonly draftName = signal('');
  protected readonly draftType = signal('');
  protected readonly draftAccount = signal('');
  protected readonly draftNotes = signal('');

  protected readonly briefSteps: EdsStepperStep[] = [
    { label: 'Type', description: 'Name and brief' },
    { label: 'Account', description: 'Owner notes' },
    { label: 'Attach', description: 'Optional file' }
  ];

  protected readonly briefOptions: EdsComboboxOption[] = this.config.briefs.map((label) => ({
    label,
    value: label
  }));

  protected readonly accountOptions: EdsSelectOption[] = this.config.accounts.map((entry) => ({
    label: entry.name,
    value: entry.name
  }));

  protected readonly inboxItems: EdsListItem[] = this.config.activity.slice(0, 4).map((entry) => ({
    label: entry.title,
    description: entry.detail
  }));

  protected readonly openWatchCount = watchCount(this.config.accounts, this.config.signals);

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe(() => this.closeNav());

    fromEvent(window, 'garnet:brief')
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.openBriefModal());
  }

  @HostListener('document:keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.goAccountsSearch();
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

  protected goAccountsSearch(): void {
    const q = this.query().trim();
    void this.router.navigate(['/accounts'], { queryParams: q ? { q } : {} });
  }

  protected openBriefModal(): void {
    this.briefStep.set(0);
    this.briefOpen.set(true);
  }

  protected goSettings(): void {
    void this.router.navigateByUrl('/settings');
  }

  protected goSignals(): void {
    this.inboxOpen.set(false);
    void this.router.navigateByUrl('/signals');
  }

  protected goForecasts(): void {
    void this.router.navigateByUrl('/forecasts');
  }

  protected canAdvanceBrief(): boolean {
    if (this.briefStep() === 0) {
      return this.draftName().trim().length > 1 && this.draftType().length > 0;
    }
    if (this.briefStep() === 1) {
      return this.draftAccount().length > 0;
    }
    return true;
  }

  protected advanceBrief(): void {
    if (!this.canAdvanceBrief()) {
      return;
    }
    if (this.briefStep() < 2) {
      this.briefStep.update((step) => step + 1);
      return;
    }
    this.draftName.set('');
    this.draftType.set('');
    this.draftAccount.set('');
    this.draftNotes.set('');
    this.briefOpen.set(false);
    this.toastOpen.set(true);
  }
}
