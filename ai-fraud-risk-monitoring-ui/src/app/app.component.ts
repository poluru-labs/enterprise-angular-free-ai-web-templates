import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { templateConfig } from './core/config/template.config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="shell" [class.nav-open]="navOpen()">
      <aside class="sidebar">
        <a class="brand" routerLink="/">
          <span class="brand-mark">{{ config.brand.mark }}</span>
          <span>{{ config.brand.name }} <b>{{ config.brand.accent }}</b></span>
        </a>

        @for (group of config.navGroups; track group.label) {
          <p class="nav-label">{{ group.label }}</p>
          <nav class="nav">
            @for (item of group.items; track item.path) {
              <a
                [routerLink]="item.path"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: item.exact === true }"
              >
                <span class="material-symbols-outlined">{{ item.icon }}</span>
                <span class="nav-copy">{{ item.label }}</span>
                @if (item.badge) {
                  <em class="nav-badge">{{ item.badge }}</em>
                }
              </a>
            }
          </nav>
        }

        <div class="sidebar-bottom">
          <a routerLink="/settings" routerLinkActive="active" class="settings-link">
            <span class="material-symbols-outlined">settings</span>
            Settings
          </a>
          <div class="profile">
            <span>{{ config.user.initials }}</span>
            <div>
              <strong>{{ config.user.name }}</strong>
              <small>{{ config.user.role }}</small>
            </div>
          </div>
        </div>
      </aside>

      <button class="backdrop" type="button" aria-label="Close navigation" (click)="closeNav()"></button>

      <div class="main">
        <header>
          <button class="icon-button menu-button" type="button" aria-label="Open navigation" (click)="toggleNav()">
            <span class="material-symbols-outlined">menu</span>
          </button>
          <p class="workspace">{{ config.workspace }}</p>
          <div class="top-actions">
            <label class="search header-search">
              <span class="material-symbols-outlined">search</span>
              <input
                type="search"
                placeholder="Search cases, alerts, rules"
                [value]="query()"
                (input)="onSearch($event)"
                (keydown.enter)="goSearch()"
              />
            </label>
            <button class="icon-button header-search-icon" type="button" aria-label="Open search" (click)="goSearch()">
              <span class="material-symbols-outlined">search</span>
            </button>
            <a class="icon-button" routerLink="/alerts" aria-label="Alerts">
              <span class="material-symbols-outlined">notifications</span>
            </a>
            <a class="primary" routerLink="/alerts">{{ config.action }}</a>
          </div>
        </header>
        <main>
          <router-outlet />
        </main>
      </div>
    </div>

    @if (toastOpen()) {
      <div class="toast-slot" role="status">{{ toastMessage() }}</div>
    }
  `
})
export class AppComponent {
  private readonly router = inject(Router);
  protected readonly config = templateConfig;
  protected readonly navOpen = signal(false);
  protected readonly query = signal('');
  protected readonly toastOpen = signal(false);
  protected readonly toastMessage = signal('');

  constructor() {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      takeUntilDestroyed()
    ).subscribe(() => this.closeNav());
  }

  @HostListener('document:keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.goSearch();
    }
  }

  protected toggleNav(): void {
    this.navOpen.update((open) => !open);
  }

  protected closeNav(): void {
    this.navOpen.set(false);
  }

  protected onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected goSearch(): void {
    const q = this.query().trim();
    void this.router.navigate(['/search'], { queryParams: q ? { q } : {} });
  }

  protected showToast(message: string): void {
    this.toastMessage.set(message);
    this.toastOpen.set(true);
  }
}
