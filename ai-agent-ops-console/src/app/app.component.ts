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
      <aside class="sidebar">
        <a class="brand" routerLink="/">
          <span class="brand-mark">{{ config.brand.mark }}</span>
          <span>{{ config.brand.name }} <b>{{ config.brand.accent }}</b></span>
        </a>

        @for (group of config.navGroups; track group.label) {
          <p class="nav-label">{{ group.label }}</p>
          <nav class="nav">
            @for (item of group.items; track item.path) {
              <a [routerLink]="item.path" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: item.exact === true }">
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
          <a routerLink="/settings" routerLinkActive="active">
            <span class="material-symbols-outlined">tune</span>
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

      <main>
        <header>
          <button class="icon-button menu-button" type="button" aria-label="Open navigation" (click)="toggleNav()">
            <span class="material-symbols-outlined">menu</span>
          </button>
          <div class="workspace">{{ config.workspace }} <span class="material-symbols-outlined">expand_more</span></div>
          <div class="top-actions">
            <a class="icon-button" routerLink="/search" aria-label="Search">
              <span class="material-symbols-outlined">search</span>
            </a>
            <a class="icon-button notification" routerLink="/alerts" aria-label="Alerts">
              <span class="material-symbols-outlined">notifications</span>
            </a>
            <a class="primary header-deploy" routerLink="/deploy">
              <span class="material-symbols-outlined">rocket_launch</span>
              Deploy
            </a>
          </div>
        </header>
        <router-outlet />
      </main>
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
}
