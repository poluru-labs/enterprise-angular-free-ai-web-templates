import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { templateConfig } from './core/config/template.config';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="shell" [attr.data-app]="appName" [class.nav-open]="navOpen()">
      <header>
        <div class="header-start">
          <button class="icon-button menu-button" type="button" aria-label="Open navigation" (click)="toggleNav()">
            <span class="material-symbols-outlined">menu</span>
          </button>
          <a class="header-brand" routerLink="/">
            <span class="brand-mark">{{ config.brand.mark }}</span>
            <span>{{ config.brand.name }} <b>{{ config.brand.accent }}</b></span>
          </a>
        </div>
        <div class="header-end">
          <p class="workspace">{{ config.workspace }}</p>
          <label class="header-search">
            <span class="material-symbols-outlined">search</span>
            <input
              type="search"
              placeholder="Search HR-id, person, or queue"
              [value]="query()"
              (input)="onSearch($event)"
              (keydown.enter)="goSearch()"
            />
          </label>
          <div class="top-actions">
            <button class="icon-button header-search-icon" type="button" aria-label="Open search" (click)="goSearch()">
              <span class="material-symbols-outlined">search</span>
            </button>
            <a class="icon-button" routerLink="/audit" aria-label="Audit log">
              <span class="material-symbols-outlined">history</span>
            </a>
            <a class="icon-button" routerLink="/assignments" aria-label="Assignments">
              <span class="material-symbols-outlined">notifications</span>
            </a>
            <a class="primary" routerLink="/assignments">{{ config.action }}</a>
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
              {{ item.label }}
            </a>
          }
        </nav>
        <div class="profile">
          <span>{{ config.user.initials }}</span>
          <div>
            <strong>{{ config.user.name }}</strong>
            <small>{{ config.user.role }}</small>
          </div>
        </div>
      </aside>

      <button class="backdrop" type="button" aria-label="Close navigation" (click)="closeNav()"></button>

      <div class="main">
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
  protected readonly appName = environment.appName;
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
