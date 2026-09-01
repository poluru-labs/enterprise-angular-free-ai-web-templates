import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  EdsAvatarComponent,
  EdsBadgeComponent,
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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    EdsAvatarComponent,
    EdsBadgeComponent,
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
        <div class="topbar-inner">
          <eds-button
            class="menu-button topbar-icon"
            variant="tertiary"
            size="sm"
            icon="menu"
            [iconOnly]="true"
            accessibleLabel="Open navigation"
            (clicked)="toggleNav()"
          ></eds-button>

          <a class="brand" routerLink="/">
            <span class="brand-mark">{{ config.brand.mark }}</span>
            <span class="brand-copy">
              <small>{{ config.brand.name }}</small>
              <strong>{{ config.brand.accent }}</strong>
            </span>
          </a>

          <span class="live-pill">
            <eds-badge label="Live" variant="success" [pill]="true"></eds-badge>
          </span>

          <eds-search
            class="topbar-search"
            size="md"
            placeholder="Search models, workspaces, owners..."
            [clearable]="true"
            [value]="query()"
            (valueChange)="onQuery($event)"
          ></eds-search>

          <div class="topbar-actions">
            <eds-kbd keys="⌘K"></eds-kbd>

            <eds-tooltip content="Alerts" placement="bottom">
              <eds-button
                class="topbar-icon"
                variant="tertiary"
                size="sm"
                icon="bell"
                [iconOnly]="true"
                accessibleLabel="Open alerts"
                (clicked)="inboxOpen.set(true)"
              ></eds-button>
            </eds-tooltip>

            <eds-button class="topbar-cta" variant="primary" size="sm" icon="download" (clicked)="openExportModal()">
              Export report
            </eds-button>

            <eds-dropdown-menu>
              <button trigger type="button" class="account">
                <eds-avatar [name]="config.user.name" size="sm"></eds-avatar>
                <span>
                  <strong>{{ config.user.name }}</strong>
                  <small>{{ config.user.role }}</small>
                </span>
              </button>
              <eds-menu-item label="Workspace settings" value="settings" (itemSelect)="goSettings()"></eds-menu-item>
              <eds-menu-item label="Open alerts" value="alerts" (itemSelect)="goAlerts()"></eds-menu-item>
              <eds-menu-item label="Export report" value="export" (itemSelect)="openExportModal()"></eds-menu-item>
            </eds-dropdown-menu>
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
        <eds-button variant="primary" size="sm" icon="download" [fullWidth]="true" (clicked)="openExportModal()">
          Export report
        </eds-button>
        <eds-button variant="secondary" size="sm" icon="bell" [fullWidth]="true" (clicked)="goAlerts()">
          Open alerts
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
          <eds-visually-hidden>Lilac Meter LLM usage workspace</eds-visually-hidden>
          <router-outlet />
        </main>
      </div>
    </div>

    <eds-modal [open]="exportOpen()" heading="Export usage report" (openChange)="exportOpen.set($event)">
      <div class="modal-grid">
        <eds-stepper [steps]="exportSteps" [current]="exportStep()" (stepClick)="exportStep.set($event)"></eds-stepper>

        @if (exportStep() === 0) {
          <eds-input
            label="Report name"
            placeholder="August usage summary"
            icon="file"
            [value]="draftName()"
            (valueChange)="draftName.set($event)"
          ></eds-input>
          <eds-combobox
            label="Format"
            placeholder="Choose a format"
            [options]="formatOptions"
            [value]="draftFormat()"
            (valueChange)="draftFormat.set($event)"
          ></eds-combobox>
        } @else if (exportStep() === 1) {
          <eds-select
            label="Workspace"
            placeholder="Choose workspace"
            [options]="workspaceOptions"
            [value]="draftWorkspace()"
            (valueChange)="draftWorkspace.set($event)"
          ></eds-select>
          <eds-textarea
            label="Notes"
            placeholder="Reason for this export"
            [rows]="4"
            [value]="draftNotes()"
            (valueChange)="draftNotes.set($event)"
          ></eds-textarea>
        } @else {
          <eds-file-upload
            label="Attach a comparison sheet"
            hint="Optional CSV of last month’s spend."
            accept=".csv,.xlsx"
          ></eds-file-upload>
        }
      </div>
      <div footer class="modal-footer">
        <eds-button variant="secondary" (clicked)="exportOpen.set(false)">Cancel</eds-button>
        @if (exportStep() > 0) {
          <eds-button variant="tertiary" (clicked)="exportStep.set(exportStep() - 1)">Back</eds-button>
        }
        <eds-button variant="primary" [disabled]="!canAdvanceExport()" (clicked)="advanceExport()">
          {{ exportStep() === 2 ? 'Queue export' : 'Continue' }}
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
        <eds-button variant="primary" (clicked)="goAlerts()">View all alerts</eds-button>
      </div>
    </eds-drawer>

    <div class="toast-slot">
      <eds-toast
        title="Export queued"
        description="Lakshmi Poluru will get a copy when the report is ready."
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
  protected readonly exportOpen = signal(false);
  protected readonly inboxOpen = signal(false);
  protected readonly toastOpen = signal(false);
  protected readonly exportStep = signal(0);
  protected readonly draftName = signal('');
  protected readonly draftFormat = signal('');
  protected readonly draftWorkspace = signal('');
  protected readonly draftNotes = signal('');

  protected readonly exportSteps: EdsStepperStep[] = [
    { label: 'File', description: 'Name and format' },
    { label: 'Scope', description: 'Workspace and notes' },
    { label: 'Attach', description: 'Optional sheet' }
  ];

  protected readonly formatOptions: EdsComboboxOption[] = this.config.formats.map((label) => ({
    label,
    value: label
  }));

  protected readonly workspaceOptions: EdsSelectOption[] = [
    ...new Map(
      this.config.usage.map((entry) => [entry.workspace, { label: entry.workspace, value: entry.workspace }])
    ).values()
  ];

  protected readonly inboxItems: EdsListItem[] = this.config.opsAlerts.slice(0, 4).map((entry) => ({
    label: entry.title,
    description: entry.detail
  }));

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe(() => this.closeNav());

    fromEvent(window, 'meter:export')
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.openExportModal());
  }

  @HostListener('document:keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.goUsageSearch();
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

  protected goUsageSearch(): void {
    const q = this.query().trim();
    void this.router.navigate(['/usage'], { queryParams: q ? { q } : {} });
  }

  protected openExportModal(): void {
    this.exportStep.set(0);
    this.exportOpen.set(true);
  }

  protected goSettings(): void {
    void this.router.navigateByUrl('/settings');
  }

  protected goAlerts(): void {
    this.inboxOpen.set(false);
    void this.router.navigateByUrl('/alerts');
  }

  protected canAdvanceExport(): boolean {
    if (this.exportStep() === 0) {
      return this.draftName().trim().length > 1 && this.draftFormat().length > 0;
    }
    if (this.exportStep() === 1) {
      return this.draftWorkspace().length > 0;
    }
    return true;
  }

  protected advanceExport(): void {
    if (!this.canAdvanceExport()) {
      return;
    }
    if (this.exportStep() < 2) {
      this.exportStep.update((step) => step + 1);
      return;
    }
    this.draftName.set('');
    this.draftFormat.set('');
    this.draftWorkspace.set('');
    this.draftNotes.set('');
    this.exportOpen.set(false);
    this.toastOpen.set(true);
  }
}
