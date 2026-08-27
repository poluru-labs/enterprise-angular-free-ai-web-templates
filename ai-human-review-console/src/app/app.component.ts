import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { templateConfig } from '../template.config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="shell" [class.nav-open]="navOpen()">
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
            <input type="search" placeholder="Search HR-id, person, or queue" (keydown.enter)="goSearch()" />
          </label>
          <div class="top-actions">
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
  `
})
export class AppComponent {
  private readonly router = inject(Router);
  protected readonly config = templateConfig;
  protected readonly navOpen = signal(false);

  constructor() {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      takeUntilDestroyed()
    ).subscribe(() => this.closeNav());
  }

  protected toggleNav(): void {
    this.navOpen.update((open) => !open);
  }

  protected closeNav(): void {
    this.navOpen.set(false);
  }

  protected goSearch(): void {
    void this.router.navigateByUrl('/assignments');
  }
}
