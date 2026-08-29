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
      --brand: #2f6b1f;
      --theme: #D8FFC5;
      --ink: #15262c;
      --muted: #5d6f5d;
      --line: #cdeab8;
      font-family: 'DM Sans', sans-serif;
      color: var(--ink);
      display: block;
      min-height: 100vh;
      background: #f5faf1;
    }

    .topbar {
      position: sticky;
      top: 0;
      z-index: 20;
      width: 100%;
      background: var(--theme);
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
      color: #24402a;
      text-decoration: none;
      padding: 10px 12px;
      border-radius: 10px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .sidebar a:hover {
      background: #eefbe4;
    }

    .sidebar a.active {
      background: var(--theme);
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
          <strong>Model Evaluation Board</strong>
          <small>Poluru Labs</small>
        </span>
      </a>
      <div class="top-actions">
        <eds-badge label="5 release candidates" variant="brand" [soft]="true" [pill]="true"></eds-badge>
        <eds-search class="search" size="md" placeholder="Search suites or datasets" [clearable]="true"></eds-search>
        <eds-button variant="primary" (clicked)="openRunModal()">{{ config.action }}</eds-button>
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
  `
})
export class AppComponent {
  protected readonly config = templateConfig;
  protected readonly isRunModalOpen = signal(false);
  protected readonly draftModel = signal('');
  protected readonly draftSuite = signal('');
  protected readonly draftNotes = signal('');

  protected readonly navItems = [
    { label: 'Board', path: '/', icon: 'dashboard', exact: true },
    { label: 'Suites', path: '/suites', icon: 'science', exact: false },
    { label: 'Datasets', path: '/datasets', icon: 'dataset', exact: false },
    { label: 'Scorecards', path: '/scorecards', icon: 'fact_check', exact: false },
    { label: 'Settings', path: '/settings', icon: 'tune', exact: false }
  ];

  protected readonly suiteOptions = this.config.suites.map((suite) => ({ label: suite.name, value: suite.name }));

  protected openRunModal(): void {
    this.isRunModalOpen.set(true);
  }

  protected closeRunModal(): void {
    this.isRunModalOpen.set(false);
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
  }
}