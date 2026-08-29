import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  EdsBadgeComponent,
  EdsButtonComponent,
  EdsInputComponent,
  EdsModalComponent,
  EdsSearchComponent,
  EdsSelectComponent,
  EdsTextareaComponent
} from '@poluru-labs/enterprise-design-system-angular';
import { templateConfig } from '../template.config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    EdsBadgeComponent,
    EdsButtonComponent,
    EdsSearchComponent,
    EdsModalComponent,
    EdsInputComponent,
    EdsSelectComponent,
    EdsTextareaComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host {
      --brand: #08766c;
      --ink: #15262c;
      --muted: #66777d;
      --line: #dfe7e6;
      font-family: 'DM Sans', sans-serif;
      color: var(--ink);
      display: block;
      min-height: 100vh;
      background: #f6f8f7;
    }

    .topbar {
      position: sticky;
      top: 0;
      z-index: 20;
      width: 100%;
      background: #fff;
      border-bottom: 1px solid var(--line);
      padding: 14px 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      box-sizing: border-box;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      color: var(--ink);
    }

    .brand-mark {
      width: 34px;
      height: 34px;
      border-radius: 10px;
      background: var(--brand);
      color: #fff;
      display: grid;
      place-items: center;
      font-weight: 700;
      font-size: 13px;
    }

    .brand strong {
      display: block;
      font-size: 14px;
      line-height: 1.1;
    }

    .brand small {
      color: var(--muted);
      font-size: 12px;
    }

    .top-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .search {
      min-width: 220px;
    }

    .layout {
      max-width: 1320px;
      margin: 0 auto;
      padding: 24px 32px;
      display: grid;
      grid-template-columns: 220px minmax(0, 1fr);
      gap: 22px;
    }

    .sidebar {
      align-self: start;
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 12px;
      border-radius: 14px;
      background: #fff;
      border: 1px solid var(--line);
    }

    .sidebar a {
      color: #24403c;
      text-decoration: none;
      padding: 10px 12px;
      border-radius: 10px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .sidebar a:hover {
      background: #eef7f5;
    }

    .sidebar a.active {
      background: #e3f4f1;
      color: var(--brand);
      font-weight: 700;
    }

    .content {
      min-width: 0;
    }

    .modal-grid {
      display: grid;
      gap: 12px;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }

    @media (max-width: 900px) {
      .topbar {
        padding: 12px 16px;
      }

      .search {
        display: none;
      }

      .layout {
        grid-template-columns: 1fr;
        padding: 16px;
      }
    }
  `],
  template: `
    <header class="topbar">
      <a class="brand" routerLink="/">
        <span class="brand-mark">AI</span>
        <span>
          <strong>LLM Usage Dashboard</strong>
          <small>Poluru Labs</small>
        </span>
      </a>
      <div class="top-actions">
        <eds-badge label="12 active models" variant="brand" [soft]="true" [pill]="true"></eds-badge>
        <eds-search class="search" size="md" placeholder="Search models or workspaces" [clearable]="true"></eds-search>
        <eds-button variant="primary" (clicked)="openExportModal()">{{ config.action }}</eds-button>
      </div>
    </header>

    <div class="layout">
      <aside class="sidebar">
        @for (item of navItems; track item.path) {
          <a [routerLink]="item.path" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: item.exact }">
            <span class="material-symbols-outlined">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </a>
        }
      </aside>

      <main class="content">
        <router-outlet></router-outlet>
      </main>
    </div>

    <eds-modal [open]="isExportModalOpen()" heading="Export report" (openChange)="isExportModalOpen.set($event)">
      <div class="modal-grid">
        <eds-input
          label="Report name"
          placeholder="August usage summary"
          [value]="draftName()"
          (valueChange)="draftName.set($event)"
        ></eds-input>

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
      </div>

      <div footer class="modal-footer">
        <eds-button variant="secondary" (clicked)="closeExportModal()">Cancel</eds-button>
        <eds-button variant="primary" [disabled]="!canExport()" (clicked)="exportReport()">Export</eds-button>
      </div>
    </eds-modal>
  `
})
export class AppComponent {
  protected readonly config = templateConfig;
  protected readonly isExportModalOpen = signal(false);
  protected readonly draftName = signal('');
  protected readonly draftWorkspace = signal('');
  protected readonly draftNotes = signal('');

  protected readonly navItems = [
    { label: 'Overview', path: '/', icon: 'dashboard', exact: true },
    { label: 'Usage', path: '/usage', icon: 'data_usage', exact: false },
    { label: 'Models', path: '/models', icon: 'neurology', exact: false },
    { label: 'Budgets', path: '/budgets', icon: 'payments', exact: false },
    { label: 'Settings', path: '/settings', icon: 'tune', exact: false }
  ];

  protected readonly workspaceOptions = this.config.usage.map((entry) => ({ label: entry.workspace, value: entry.workspace }));

  protected openExportModal(): void {
    this.isExportModalOpen.set(true);
  }

  protected closeExportModal(): void {
    this.isExportModalOpen.set(false);
  }

  protected canExport(): boolean {
    return this.draftName().trim().length > 1 && this.draftWorkspace().trim().length > 0;
  }

  protected exportReport(): void {
    if (!this.canExport()) {
      return;
    }

    this.draftName.set('');
    this.draftWorkspace.set('');
    this.draftNotes.set('');
    this.isExportModalOpen.set(false);
  }
}