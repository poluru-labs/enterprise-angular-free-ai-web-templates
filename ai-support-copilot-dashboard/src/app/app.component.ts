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
import { reviewCount } from './shared/utils/support';

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
              placeholder="Search tickets, agents, articles..."
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
              <span class="inbox-count">{{ openReviewCount }}</span>
            </span>

            <eds-button class="topbar-cta" variant="primary" size="sm" icon="edit" (clicked)="openReplyModal()">
              Draft reply
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
              <eds-menu-item label="Open reports" value="reports" (itemSelect)="goReports()"></eds-menu-item>
              <eds-menu-item label="Draft reply" value="reply" (itemSelect)="openReplyModal()"></eds-menu-item>
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
              <span class="material-symbols-outlined" aria-hidden="true">smart_toy</span>
              {{ config.copilotLabel }}
            </span>
            <span class="context-chip">
              <span class="material-symbols-outlined" aria-hidden="true">support_agent</span>
              {{ config.user.role }}
            </span>
            <button type="button" class="context-chip action" (click)="goConversations()">
              <span class="material-symbols-outlined" aria-hidden="true">forum</span>
              {{ openReviewCount }} review
            </button>
            <button type="button" class="context-chip action" (click)="goReports()">
              <span class="material-symbols-outlined" aria-hidden="true">analytics</span>
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
        <eds-button variant="primary" size="sm" icon="edit" [fullWidth]="true" (clicked)="openReplyModal()">
          Draft reply
        </eds-button>
        <eds-button variant="secondary" size="sm" icon="star" [fullWidth]="true" (clicked)="goReports()">
          Open reports
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
          <eds-visually-hidden>Harbor Desk support copilot workspace</eds-visually-hidden>
          <router-outlet />
        </main>
      </div>
    </div>

    <eds-modal [open]="replyOpen()" heading="Draft copilot reply" (openChange)="replyOpen.set($event)">
      <div class="modal-grid">
        <eds-stepper [steps]="replySteps" [current]="replyStep()" (stepClick)="replyStep.set($event)"></eds-stepper>

        @if (replyStep() === 0) {
          <eds-input
            label="Ticket"
            placeholder="#48324 Refund window"
            icon="mail"
            [value]="draftTicket()"
            (valueChange)="draftTicket.set($event)"
          ></eds-input>
          <eds-combobox
            label="Reply type"
            placeholder="Choose a draft"
            [options]="replyOptions"
            [value]="draftType()"
            (valueChange)="draftType.set($event)"
          ></eds-combobox>
        } @else if (replyStep() === 1) {
          <eds-select
            label="Owner"
            placeholder="Choose owner"
            [options]="ownerOptions"
            [value]="draftOwner()"
            (valueChange)="draftOwner.set($event)"
          ></eds-select>
          <eds-textarea
            label="Copilot notes"
            placeholder="What should Kavya Poluru emphasize for the customer?"
            [rows]="4"
            [value]="draftNotes()"
            (valueChange)="draftNotes.set($event)"
          ></eds-textarea>
        } @else {
          <eds-file-upload
            label="Attach policy"
            hint="Optional PDF or knowledge snippet from Meera Poluru."
            accept=".pdf,.txt,.md"
          ></eds-file-upload>
        }
      </div>
      <div footer class="modal-footer">
        <eds-button variant="secondary" (clicked)="replyOpen.set(false)">Cancel</eds-button>
        @if (replyStep() > 0) {
          <eds-button variant="tertiary" (clicked)="replyStep.set(replyStep() - 1)">Back</eds-button>
        }
        <eds-button variant="primary" [disabled]="!canAdvanceReply()" (clicked)="advanceReply()">
          {{ replyStep() === 2 ? 'Queue draft' : 'Continue' }}
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
        <eds-button variant="primary" (clicked)="goConversations()">View inbox</eds-button>
      </div>
    </eds-drawer>

    <div class="toast-slot">
      <eds-toast
        title="Draft queued"
        description="Ananya Poluru will get a copy when Kavya Poluru’s policy pack is ready."
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
  protected readonly replyOpen = signal(false);
  protected readonly inboxOpen = signal(false);
  protected readonly toastOpen = signal(false);
  protected readonly replyStep = signal(0);
  protected readonly draftTicket = signal('');
  protected readonly draftType = signal('');
  protected readonly draftOwner = signal('');
  protected readonly draftNotes = signal('');

  protected readonly replySteps: EdsStepperStep[] = [
    { label: 'Type', description: 'Ticket and draft' },
    { label: 'Owner', description: 'Agent notes' },
    { label: 'Attach', description: 'Optional file' }
  ];

  protected readonly replyOptions: EdsComboboxOption[] = this.config.replyTypes.map((label) => ({
    label,
    value: label
  }));

  protected readonly ownerOptions: EdsSelectOption[] = this.config.owners.map((entry) => ({
    label: entry.name,
    value: entry.name
  }));

  protected readonly inboxItems: EdsListItem[] = this.config.activity.slice(0, 4).map((entry) => ({
    label: entry.title,
    description: entry.detail
  }));

  protected readonly openReviewCount = reviewCount(this.config.conversations);

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe(() => this.closeNav());

    fromEvent(window, 'harbor:reply')
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.openReplyModal());
  }

  @HostListener('document:keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.goConversationsSearch();
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

  protected goConversationsSearch(): void {
    const q = this.query().trim();
    void this.router.navigate(['/conversations'], { queryParams: q ? { q } : {} });
  }

  protected openReplyModal(): void {
    this.replyStep.set(0);
    this.replyOpen.set(true);
  }

  protected goSettings(): void {
    void this.router.navigateByUrl('/settings');
  }

  protected goConversations(): void {
    this.inboxOpen.set(false);
    void this.router.navigateByUrl('/conversations');
  }

  protected goReports(): void {
    void this.router.navigateByUrl('/reports');
  }

  protected canAdvanceReply(): boolean {
    if (this.replyStep() === 0) {
      return this.draftTicket().trim().length > 1 && this.draftType().length > 0;
    }
    if (this.replyStep() === 1) {
      return this.draftOwner().length > 0;
    }
    return true;
  }

  protected advanceReply(): void {
    if (!this.canAdvanceReply()) {
      return;
    }
    if (this.replyStep() < 2) {
      this.replyStep.update((step) => step + 1);
      return;
    }
    this.draftTicket.set('');
    this.draftType.set('');
    this.draftOwner.set('');
    this.draftNotes.set('');
    this.replyOpen.set(false);
    this.toastOpen.set(true);
  }
}
