import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { AppComponent } from './app.component';
import { internals } from './shared/testing/internals';
import { templateConfig } from './core/config/template.config';

describe('AppComponent', () => {
  let component: AppComponent;
  let nativeElement: HTMLElement;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('creates the Risk Watch shell', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.querySelector('.brand')?.textContent).toContain('Risk');
    expect(nativeElement.querySelector('.brand')?.textContent).toContain('Watch');
    expect(nativeElement.textContent).toContain(templateConfig.workspace);
    expect(nativeElement.textContent).toContain('Aisha Poluru');
  });

  it('renders grouped sidebar navigation', () => {
    const labels = Array.from(nativeElement.querySelectorAll('.nav-label')).map((node) => node.textContent?.trim());
    expect(labels).toEqual(['Monitor', 'Investigate']);
    expect(nativeElement.textContent).toContain('Alerts');
    expect(nativeElement.textContent).toContain('Watchlist');
    expect(nativeElement.textContent).toContain('Reports');
    expect(nativeElement.querySelector('.settings-link')?.textContent).toContain('Settings');
  });

  it('toggles and closes the mobile nav', () => {
    const api = internals(component);
    expect(api.navOpen()).toBe(false);
    api.toggleNav();
    expect(api.navOpen()).toBe(true);
    api.closeNav();
    expect(api.navOpen()).toBe(false);
  });

  it('stores header search text', () => {
    const input = document.createElement('input');
    input.value = 'FR-8821';
    internals(component).onSearch({ target: input } as unknown as Event);
    expect(internals(component).query()).toBe('FR-8821');
  });

  it('navigates to search with the current query', () => {
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    internals(component).query.set('BIN 414720');
    internals(component).goSearch();
    expect(navigate).toHaveBeenCalledWith(['/search'], { queryParams: { q: 'BIN 414720' } });
  });

  it('opens search on ⌘K', () => {
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true });
    const prevent = vi.spyOn(event, 'preventDefault');
    internals(component).onKeydown(event);
    expect(prevent).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith(['/search'], { queryParams: {} });
  });

  it('shows a toast message', () => {
    internals(component).showToast('Alert acknowledged.');
    expect(internals(component).toastOpen()).toBe(true);
    expect(internals(component).toastMessage()).toBe('Alert acknowledged.');
  });
});
