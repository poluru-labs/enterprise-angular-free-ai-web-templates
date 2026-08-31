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
import { templateConfig } from '../template.config';

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
    <div class="shell" [class.nav-open]="navOpen()">
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
            placeholder="Search sources, collections, owners..."
            [clearable]="true"
            [value]="query()"
            (valueChange)="query.set($event)"
          ></eds-search>

          <div class="topbar-actions">
            <eds-kbd keys="⌘K"></eds-kbd>

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

            <eds-button class="topbar-cta" variant="primary" size="sm" icon="plus" (clicked)="openSourceModal()">
              Add source
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
              <eds-menu-item label="Add source" value="source" (itemSelect)="openSourceModal()"></eds-menu-item>
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
        <eds-button variant="primary" size="sm" icon="plus" [fullWidth]="true" (clicked)="openSourceModal()">
          Add source
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
          <eds-visually-hidden>Indigo Vault knowledge administration workspace</eds-visually-hidden>
          <router-outlet />
        </main>
      </div>
    </div>

    <eds-modal [open]="sourceModalOpen()" heading="Add a knowledge source" (openChange)="sourceModalOpen.set($event)">
      <div class="modal-grid">
        <eds-stepper [steps]="sourceSteps" [current]="sourceStep()" (stepClick)="sourceStep.set($event)"></eds-stepper>

        @if (sourceStep() === 0) {
          <eds-input
            label="Source name"
            placeholder="Product documentation"
            icon="folder"
            [value]="draftName()"
            (valueChange)="draftName.set($event)"
          ></eds-input>
          <eds-combobox
            label="Connector"
            placeholder="Choose a connector"
            [options]="connectorOptions"
            [value]="draftConnector()"
            (valueChange)="draftConnector.set($event)"
          ></eds-combobox>
        } @else if (sourceStep() === 1) {
          <eds-select
            label="Collection"
            placeholder="Assign a collection"
            [options]="collectionOptions"
            [value]="draftCollection()"
            (valueChange)="draftCollection.set($event)"
          ></eds-select>
          <eds-textarea
            label="Notes"
            placeholder="Why this source is being added"
            [rows]="4"
            [value]="draftNotes()"
            (valueChange)="draftNotes.set($event)"
          ></eds-textarea>
        } @else {
          <eds-file-upload
            label="Upload seed files"
            hint="PDF, Markdown, or HTML. Optional if you connected a crawl."
            accept=".pdf,.md,.html,.txt"
            [multiple]="true"
          ></eds-file-upload>
        }
      </div>
      <div footer class="modal-footer">
        <eds-button variant="secondary" (clicked)="sourceModalOpen.set(false)">Cancel</eds-button>
        @if (sourceStep() > 0) {
          <eds-button variant="tertiary" (clicked)="sourceStep.set(sourceStep() - 1)">Back</eds-button>
        }
        <eds-button variant="primary" [disabled]="!canAdvanceSource()" (clicked)="advanceSource()">
          {{ sourceStep() === 2 ? 'Queue source' : 'Continue' }}
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
      </div>
    </eds-drawer>

    <div class="toast-slot">
      <eds-toast
        title="Source queued"
        description="Ananya Poluru will be notified when the first crawl finishes."
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
  protected readonly navOpen = signal(false);
  protected readonly query = signal('');
  protected readonly sourceModalOpen = signal(false);
  protected readonly inboxOpen = signal(false);
  protected readonly toastOpen = signal(false);
  protected readonly sourceStep = signal(0);
  protected readonly draftName = signal('');
  protected readonly draftConnector = signal('');
  protected readonly draftCollection = signal('');
  protected readonly draftNotes = signal('');

  protected readonly sourceSteps: EdsStepperStep[] = [
    { label: 'Connect', description: 'Name and connector' },
    { label: 'Govern', description: 'Collection and notes' },
    { label: 'Seed', description: 'Optional files' }
  ];

  protected readonly connectorOptions: EdsComboboxOption[] = this.config.connectors.map((label) => ({
    label,
    value: label
  }));

  protected readonly collectionOptions: EdsSelectOption[] = this.config.collections.map((item) => ({
    label: item.name,
    value: item.name
  }));

  protected readonly inboxItems: EdsListItem[] = this.config.activity.slice(0, 4).map((entry) => ({
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

    fromEvent(window, 'vault:add-source')
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.openSourceModal());
  }

  @HostListener('document:keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.sourceModalOpen.set(true);
    }
  }

  protected toggleNav(): void {
    this.navOpen.update((open) => !open);
  }

  protected closeNav(): void {
    this.navOpen.set(false);
  }

  protected openSourceModal(): void {
    this.sourceStep.set(0);
    this.sourceModalOpen.set(true);
  }

  protected goSettings(): void {
    void this.router.navigateByUrl('/settings');
  }

  protected canAdvanceSource(): boolean {
    if (this.sourceStep() === 0) {
      return this.draftName().trim().length > 1 && this.draftConnector().length > 0;
    }
    if (this.sourceStep() === 1) {
      return this.draftCollection().length > 0;
    }
    return true;
  }

  protected advanceSource(): void {
    if (!this.canAdvanceSource()) {
      return;
    }
    if (this.sourceStep() < 2) {
      this.sourceStep.update((step) => step + 1);
      return;
    }
    this.draftName.set('');
    this.draftConnector.set('');
    this.draftCollection.set('');
    this.draftNotes.set('');
    this.sourceModalOpen.set(false);
    this.toastOpen.set(true);
  }
}
