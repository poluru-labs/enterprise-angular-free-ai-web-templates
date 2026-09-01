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

  it('creates the Review Desk shell', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.querySelector('.header-brand')?.textContent).toContain('Review');
    expect(nativeElement.querySelector('.header-brand')?.textContent).toContain('Desk');
    expect(nativeElement.textContent).toContain(templateConfig.workspace);
    expect(nativeElement.textContent).toContain('Aisha Poluru');
    expect(nativeElement.querySelector('.shell')?.getAttribute('data-app')).toBe('Review Desk');
  });

  it('renders sidebar navigation including new features', () => {
    expect(nativeElement.textContent).toContain('Queue');
    expect(nativeElement.textContent).toContain('Assignments');
    expect(nativeElement.textContent).toContain('Policies');
    expect(nativeElement.textContent).toContain('Calibration');
    expect(nativeElement.textContent).toContain('Reports');
    expect(nativeElement.textContent).toContain('Audit');
    expect(nativeElement.textContent).toContain('Settings');
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
    input.value = 'HR-1104';
    internals(component).onSearch({ target: input } as unknown as Event);
    expect(internals(component).query()).toBe('HR-1104');
  });

  it('navigates to search with the current query', () => {
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    internals(component).query.set('GOLD-12');
    internals(component).goSearch();
    expect(navigate).toHaveBeenCalledWith(['/search'], { queryParams: { q: 'GOLD-12' } });
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
    internals(component).showToast('Item assigned.');
    expect(internals(component).toastOpen()).toBe(true);
    expect(internals(component).toastMessage()).toBe('Item assigned.');
  });
});
