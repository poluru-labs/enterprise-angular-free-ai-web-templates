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
            <eds-badge label="16 in review" variant="brand" [soft]="true" [pill]="true"></eds-badge>
          </span>

          <eds-search
            class="topbar-search"
            size="md"
            placeholder="Search prompts or collections"
            [clearable]="true"
            [value]="query()"
            (valueChange)="onQuery($event)"
          ></eds-search>

          <div class="topbar-actions">
            <eds-kbd keys="⌘K"></eds-kbd>

            <eds-tooltip content="Reviews" placement="bottom">
              <eds-button
                class="topbar-icon"
                variant="tertiary"
                size="sm"
                icon="bell"
                [iconOnly]="true"
                accessibleLabel="Open review inbox"
                (clicked)="inboxOpen.set(true)"
              ></eds-button>
            </eds-tooltip>

            <eds-button class="topbar-cta" variant="primary" size="sm" icon="plus" (clicked)="openPromptModal()">
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
              <eds-menu-item label="Open experiments" value="experiments" (itemSelect)="goExperiments()"></eds-menu-item>
              <eds-menu-item label="New prompt" value="prompt" (itemSelect)="openPromptModal()"></eds-menu-item>
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
          <eds-button variant="primary" size="sm" icon="plus" [fullWidth]="true" (clicked)="openPromptModal()">
            New prompt
          </eds-button>
          <eds-button variant="secondary" size="sm" icon="star" [fullWidth]="true" (clicked)="goExperiments()">
            Open experiments
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
          <eds-visually-hidden>Prompt library workspace</eds-visually-hidden>
          <router-outlet />
        </main>
      </div>
    </div>

    <eds-modal [open]="isPromptModalOpen()" heading="New prompt" (openChange)="isPromptModalOpen.set($event)">
      <div class="modal-grid">
        <eds-input
          label="Prompt name"
          placeholder="Support triage v4"
          [value]="draftName()"
          (valueChange)="draftName.set($event)"
        ></eds-input>
        <eds-select
          label="Collection"
          placeholder="Choose collection"
          [options]="collectionOptions"
          [value]="draftCollection()"
          (valueChange)="draftCollection.set($event)"
        ></eds-select>
        <eds-textarea
          label="Body"
          placeholder="System prompt body"
          [rows]="4"
          [value]="draftBody()"
          (valueChange)="draftBody.set($event)"
        ></eds-textarea>
      </div>
      <div footer class="modal-footer">
        <eds-button variant="secondary" (clicked)="closePromptModal()">Cancel</eds-button>
        <eds-button variant="primary" [disabled]="!canCreate()" (clicked)="createPrompt()">Create draft</eds-button>
      </div>
    </eds-modal>

    <eds-drawer [open]="inboxOpen()" heading="Review inbox" side="right" size="md" (openChange)="inboxOpen.set($event)">
      <div class="drawer-stack">
        <eds-icon name="mail" size="md" [decorative]="true"></eds-icon>
        <eds-list [items]="inboxItems" [divided]="true"></eds-list>
      </div>
      <div footer class="drawer-footer">
        <eds-button variant="secondary" (clicked)="inboxOpen.set(false)">Close</eds-button>
        <eds-button variant="primary" (clicked)="goLibraryReview()">View library</eds-button>
      </div>
    </eds-drawer>

    <div class="toast-slot">
      <eds-toast
        title="Draft queued"
        description="Priya Poluru will review this prompt before it can publish."
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
  protected readonly isPromptModalOpen = signal(false);
  protected readonly inboxOpen = signal(false);
  protected readonly toastOpen = signal(false);
  protected readonly draftName = signal('');
  protected readonly draftCollection = signal('');
  protected readonly draftBody = signal('');

  protected readonly collectionOptions: EdsSelectOption[] = this.config.collections.map((collection) => ({
    label: collection.name,
    value: collection.name
  }));

  protected readonly inboxItems: EdsListItem[] = this.config.inbox;

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe(() => this.closeNav());

    fromEvent(window, 'prompt:new')
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.openPromptModal());
  }

  @HostListener('document:keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.goLibrarySearch();
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

  protected goLibrarySearch(): void {
    const q = this.query().trim();
    void this.router.navigate(['/'], { queryParams: q ? { q } : {} });
  }

  protected openPromptModal(): void {
    this.isPromptModalOpen.set(true);
  }

  protected closePromptModal(): void {
    this.isPromptModalOpen.set(false);
  }

  protected goSettings(): void {
    void this.router.navigateByUrl('/settings');
  }

  protected goExperiments(): void {
    this.inboxOpen.set(false);
    void this.router.navigateByUrl('/experiments');
  }

  protected goLibraryReview(): void {
    this.inboxOpen.set(false);
    void this.router.navigate(['/'], { queryParams: { status: 'Review' } });
  }

  protected canCreate(): boolean {
    return this.draftName().trim().length > 1 && this.draftCollection().trim().length > 0;
  }

  protected createPrompt(): void {
    if (!this.canCreate()) {
      return;
    }
    this.draftName.set('');
    this.draftCollection.set('');
    this.draftBody.set('');
    this.isPromptModalOpen.set(false);
    this.toastOpen.set(true);
  }
}
