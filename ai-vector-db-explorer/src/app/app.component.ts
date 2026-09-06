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
  EdsSelectComponent,
  EdsSliderComponent,
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
import { warmCount } from './shared/utils/vector';

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
    EdsSelectComponent,
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
              placeholder="Search indexes, namespaces, vector ids..."
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
              <span class="inbox-count">{{ warmNamespaces }}</span>
            </span>

            <eds-button class="topbar-cta" variant="primary" size="sm" icon="search" (clicked)="openQueryModal()">
              Run query
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
              <eds-menu-item label="Open search" value="search" (itemSelect)="goSearch()"></eds-menu-item>
              <eds-menu-item label="Run query" value="query" (itemSelect)="openQueryModal()"></eds-menu-item>
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
              {{ config.copilotLabel }}
            </span>
            <span class="context-chip">
              <span class="material-symbols-outlined" aria-hidden="true">person</span>
              {{ config.user.role }}
            </span>
            <button type="button" class="context-chip action" (click)="goNamespaces()">
              <span class="material-symbols-outlined" aria-hidden="true">account_tree</span>
              {{ warmNamespaces }} warm
            </button>
            <button type="button" class="context-chip action" (click)="goSearch()">
              <span class="material-symbols-outlined" aria-hidden="true">query_stats</span>
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
          <eds-visually-hidden>Lattice vector explorer workspace</eds-visually-hidden>
          <router-outlet />
        </main>
      </div>
    </div>

    <eds-modal [open]="queryOpen()" heading="Run similarity query" (openChange)="queryOpen.set($event)">
      <div class="modal-grid">
        <eds-stepper [steps]="querySteps" [current]="queryStep()" (stepClick)="queryStep.set($event)"></eds-stepper>

        @if (queryStep() === 0) {
          <eds-combobox
            label="Index"
            placeholder="Choose an index"
            [options]="indexOptions"
            [value]="draftIndex()"
            (valueChange)="draftIndex.set($event)"
          ></eds-combobox>
          <eds-select
            label="Namespace"
            placeholder="Choose a namespace"
            [options]="namespaceOptions"
            [value]="draftNamespace()"
            (valueChange)="draftNamespace.set($event)"
          ></eds-select>
        } @else if (queryStep() === 1) {
          <eds-textarea
            label="Query text"
            placeholder="What should Lattice retrieve for Maya Poluru?"
            [rows]="4"
            [value]="draftText()"
            (valueChange)="draftText.set($event)"
          ></eds-textarea>
        } @else {
          <eds-slider
            label="Top K"
            [min]="3"
            [max]="25"
            [step]="1"
            [value]="draftK()"
            [showValue]="true"
            (valueChange)="draftK.set($event)"
          ></eds-slider>
        }
      </div>
      <div footer class="modal-footer">
        <eds-button variant="secondary" (clicked)="queryOpen.set(false)">Cancel</eds-button>
        @if (queryStep() > 0) {
          <eds-button variant="tertiary" (clicked)="queryStep.set(queryStep() - 1)">Back</eds-button>
        }
        <eds-button variant="primary" [disabled]="!canAdvanceQuery()" (clicked)="advanceQuery()">
          {{ queryStep() === 2 ? 'Run query' : 'Continue' }}
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
        <eds-button variant="primary" (clicked)="goSearch()">Open search</eds-button>
      </div>
    </eds-drawer>

    <div class="toast-slot">
      <eds-toast
        title="Query queued"
        description="Maya Poluru will see hits on the search playground."
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
  protected readonly queryOpen = signal(false);
  protected readonly inboxOpen = signal(false);
  protected readonly toastOpen = signal(false);
  protected readonly queryStep = signal(0);
  protected readonly draftIndex = signal('');
  protected readonly draftNamespace = signal('');
  protected readonly draftText = signal('');
  protected readonly draftK = signal(10);

  protected readonly querySteps: EdsStepperStep[] = [
    { label: 'Scope', description: 'Index and namespace' },
    { label: 'Query', description: 'Text to embed' },
    { label: 'K', description: 'Neighbor count' }
  ];

  protected readonly indexOptions: EdsComboboxOption[] = this.config.indexes.map((item) => ({
    label: item.name,
    value: item.id
  }));

  protected readonly namespaceOptions: EdsSelectOption[] = this.config.namespaces.map((item) => ({
    label: `${item.name} · ${item.index}`,
    value: item.id
  }));

  protected readonly inboxItems: EdsListItem[] = this.config.activity.slice(0, 4).map((entry) => ({
    label: entry.title,
    description: entry.detail
  }));

  protected readonly warmNamespaces = warmCount(this.config.namespaces);

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe(() => this.closeNav());

    fromEvent(window, 'lattice:query')
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.openQueryModal());
  }

  @HostListener('document:keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.goSearchQuery();
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

  protected goSearchQuery(): void {
    const q = this.query().trim();
    void this.router.navigate(['/search'], { queryParams: q ? { q } : {} });
  }

  protected openQueryModal(): void {
    this.queryStep.set(0);
    this.queryOpen.set(true);
  }

  protected goSettings(): void {
    void this.router.navigateByUrl('/settings');
  }

  protected goSearch(): void {
    this.inboxOpen.set(false);
    void this.router.navigateByUrl('/search');
  }

  protected goNamespaces(): void {
    this.inboxOpen.set(false);
    void this.router.navigateByUrl('/namespaces');
  }

  protected canAdvanceQuery(): boolean {
    if (this.queryStep() === 0) {
      return this.draftIndex().length > 0 && this.draftNamespace().length > 0;
    }
    if (this.queryStep() === 1) {
      return this.draftText().trim().length > 3;
    }
    return true;
  }

  protected advanceQuery(): void {
    if (!this.canAdvanceQuery()) {
      return;
    }
    if (this.queryStep() < 2) {
      this.queryStep.update((step) => step + 1);
      return;
    }
    this.draftIndex.set('');
    this.draftNamespace.set('');
    this.draftText.set('');
    this.draftK.set(10);
    this.queryOpen.set(false);
    this.toastOpen.set(true);
    void this.router.navigateByUrl('/search');
  }
}
