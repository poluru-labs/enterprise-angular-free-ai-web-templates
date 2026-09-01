import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  EdsAvatarComponent,
  EdsBadgeComponent,
  EdsButtonComponent,
  EdsDrawerComponent,
  EdsDropdownMenuComponent,
  EdsIconComponent,
  EdsInputComponent,
  EdsKbdComponent,
  EdsListComponent,
  EdsMenuItemComponent,
  EdsModalComponent,
  EdsSearchComponent,
  EdsSelectComponent,
  EdsTextareaComponent,
  EdsToastComponent,
  EdsTooltipComponent,
  EdsVisuallyHiddenComponent,
  type EdsListItem,
  type EdsSelectOption
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
    EdsDrawerComponent,
    EdsDropdownMenuComponent,
    EdsIconComponent,
    EdsInputComponent,
    EdsKbdComponent,
    EdsListComponent,
    EdsMenuItemComponent,
    EdsModalComponent,
    EdsSearchComponent,
    EdsSelectComponent,
    EdsTextareaComponent,
    EdsToastComponent,
    EdsTooltipComponent,
    EdsVisuallyHiddenComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="shell"
      [attr.data-app]="appName"
      [class.nav-open]="navOpen()"
      [class.sidebar-collapsed]="sidebarCollapsed()"
    >
      <header class="topbar">
        <div class="topbar-inner">
          <eds-button
            class="menu-button topbar-icon"
            variant="tertiary"
            size="sm"
            icon="menu"
            [iconOnly]="true"
            [accessibleLabel]="sidebarCollapsed() ? 'Expand sidebar' : 'Show icon sidebar'"
            (clicked)="onMenuClick()"
          ></eds-button>

          <a class="brand" routerLink="/" [attr.aria-label]="config.brand.accent">
            <span class="brand-mark">{{ config.brand.mark }}</span>
            <strong class="brand-copy">{{ config.brand.accent }}</strong>
          </a>

          <span class="live-pill">
            <eds-badge label="5 release candidates" variant="brand" [soft]="true" [pill]="true"></eds-badge>
          </span>

          <eds-search
            class="topbar-search"
            size="md"
            placeholder="Search suites or datasets"
            [clearable]="true"
            [value]="query()"
            (valueChange)="onQuery($event)"
          ></eds-search>

          <div class="topbar-actions">
            <eds-kbd keys="⌘K"></eds-kbd>

            <eds-tooltip content="Regressions" placement="bottom">
              <eds-button
                class="topbar-icon"
                variant="tertiary"
                size="sm"
                icon="bell"
                [iconOnly]="true"
                accessibleLabel="Open regression inbox"
                (clicked)="inboxOpen.set(true)"
              ></eds-button>
            </eds-tooltip>

            <eds-button class="topbar-cta" variant="primary" size="sm" icon="plus" (clicked)="openRunModal()">
              {{ config.action }}
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
              <eds-menu-item label="Open regressions" value="regressions" (itemSelect)="goRegressions()"></eds-menu-item>
              <eds-menu-item label="Run evaluation" value="run" (itemSelect)="openRunModal()"></eds-menu-item>
            </eds-dropdown-menu>
          </div>
        </div>
      </header>

      <aside class="sidebar">
        <div class="sidebar-head">
          <button
            type="button"
            class="collapse-button"
            [attr.aria-label]="sidebarCollapsed() ? 'Expand sidebar' : 'Show icon sidebar'"
            [attr.title]="sidebarCollapsed() ? 'Expand sidebar' : 'Show icon sidebar'"
            (click)="toggleSidebar()"
          >
            <span class="material-symbols-outlined" aria-hidden="true">
              {{ sidebarCollapsed() ? 'chevron_right' : 'chevron_left' }}
            </span>
          </button>
        </div>

        <nav class="nav">
          @for (item of config.nav; track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: item.exact === true }"
              [attr.aria-label]="item.label"
              [attr.title]="item.label"
            >
              <span class="material-symbols-outlined" aria-hidden="true">{{ item.icon }}</span>
              <span class="nav-label">{{ item.label }}</span>
            </a>
          }
        </nav>

        <div class="sidebar-extras">
          <p class="quick-label">Quick links</p>
          <eds-button variant="primary" size="sm" icon="plus" [fullWidth]="true" (clicked)="openRunModal()">
            Run evaluation
          </eds-button>
          <eds-button variant="secondary" size="sm" icon="alert-triangle" [fullWidth]="true" (clicked)="goRegressions()">
            Open regressions
          </eds-button>
        </div>

        <div class="profile">
          <eds-avatar [name]="config.user.name" size="sm"></eds-avatar>
          <div class="profile-copy">
            <strong>{{ config.user.name }}</strong>
            <small>{{ config.user.role }}</small>
          </div>
        </div>
      </aside>

      <button class="backdrop" type="button" aria-label="Close navigation" (click)="closeNav()"></button>

      <div class="main">
        <main>
          <eds-visually-hidden>Model evaluation workspace</eds-visually-hidden>
          <router-outlet />
        </main>
      </div>
    </div>

    <eds-modal [open]="isRunModalOpen()" heading="Run evaluation" (openChange)="isRunModalOpen.set($event)">
      <div class="modal-grid">
        <eds-input
          label="Model checkpoint"
          placeholder="horizon-2"
          [value]="draftModel()"
          (valueChange)="draftModel.set($event)"
        ></eds-input>
        <eds-select
          label="Suite"
          placeholder="Choose suite"
          [options]="suiteOptions"
          [value]="draftSuite()"
          (valueChange)="draftSuite.set($event)"
        ></eds-select>
        <eds-textarea
          label="Notes"
          placeholder="Reason for this run"
          [rows]="4"
          [value]="draftNotes()"
          (valueChange)="draftNotes.set($event)"
        ></eds-textarea>
      </div>
      <div footer class="modal-footer">
        <eds-button variant="secondary" (clicked)="closeRunModal()">Cancel</eds-button>
        <eds-button variant="primary" [disabled]="!canRun()" (clicked)="runEvaluation()">Run</eds-button>
      </div>
    </eds-modal>

    <eds-drawer [open]="inboxOpen()" heading="Regression inbox" side="right" size="md" (openChange)="inboxOpen.set($event)">
      <div class="drawer-stack">
        <eds-icon name="alert-triangle" size="md" [decorative]="true"></eds-icon>
        <eds-list [items]="inboxItems" [divided]="true"></eds-list>
      </div>
      <div footer class="drawer-footer">
        <eds-button variant="secondary" (clicked)="inboxOpen.set(false)">Close</eds-button>
        <eds-button variant="primary" (clicked)="goRegressions()">View all regressions</eds-button>
      </div>
    </eds-drawer>

    <div class="toast-slot">
      <eds-toast
        title="Evaluation queued"
        description="Ananya Poluru will get a copy when the suite finishes."
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
  protected readonly sidebarCollapsed = signal(false);
  protected readonly query = signal('');
  protected readonly isRunModalOpen = signal(false);
  protected readonly inboxOpen = signal(false);
  protected readonly toastOpen = signal(false);
  protected readonly draftModel = signal('');
  protected readonly draftSuite = signal('');
  protected readonly draftNotes = signal('');

  protected readonly suiteOptions: EdsSelectOption[] = this.config.suites.map((suite) => ({
    label: suite.name,
    value: suite.name
  }));

  protected readonly inboxItems: EdsListItem[] = this.config.inbox;

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe(() => this.closeNav());

    fromEvent(window, 'eval:run')
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.openRunModal());
  }

  @HostListener('document:keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.goSuitesSearch();
    }
  }

  protected onMenuClick(): void {
    const compact = typeof window !== 'undefined' && window.matchMedia?.('(max-width: 860px)')?.matches === true;
    if (compact) {
      this.toggleNav();
      return;
    }
    this.toggleSidebar();
  }

  protected toggleNav(): void {
    this.navOpen.update((open) => !open);
  }

  protected closeNav(): void {
    this.navOpen.set(false);
  }

  protected toggleSidebar(): void {
    this.sidebarCollapsed.update((collapsed) => !collapsed);
  }

  protected onQuery(value: string): void {
    this.query.set(value);
  }

  protected goSuitesSearch(): void {
    const q = this.query().trim();
    void this.router.navigate(['/suites'], { queryParams: q ? { q } : {} });
  }

  protected openRunModal(): void {
    this.isRunModalOpen.set(true);
  }

  protected closeRunModal(): void {
    this.isRunModalOpen.set(false);
  }

  protected goSettings(): void {
    void this.router.navigateByUrl('/settings');
  }

  protected goRegressions(): void {
    this.inboxOpen.set(false);
    void this.router.navigateByUrl('/regressions');
  }

  protected canRun(): boolean {
    return this.draftModel().trim().length > 1 && this.draftSuite().trim().length > 0;
  }

  protected runEvaluation(): void {
    if (!this.canRun()) {
      return;
    }
    this.draftModel.set('');
    this.draftSuite.set('');
    this.draftNotes.set('');
    this.isRunModalOpen.set(false);
    this.toastOpen.set(true);
  }
}
