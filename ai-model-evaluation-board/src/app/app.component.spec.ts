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

  it('creates the Eval Board shell', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.querySelector('.brand')?.textContent).toContain('Eval Board');
    expect(nativeElement.querySelector('.brand')?.textContent).not.toContain('Poluru Labs');
    expect(nativeElement.textContent).toContain(templateConfig.user.name);
    expect(nativeElement.querySelector('.shell')?.getAttribute('data-app')).toBe('Eval Board');
  });

  it('renders a header profile chip and menu identity', () => {
    const chip = nativeElement.querySelector('.account');
    expect(chip?.textContent).toContain('Ananya Poluru');
    expect(chip?.textContent).toContain('QA lead');
    expect(nativeElement.querySelector('.account-status')).toBeTruthy();
    expect(nativeElement.querySelector('.account-menu-head')?.textContent).toContain(templateConfig.workspace);
  });

  it('renders sidebar navigation including new features', () => {
    expect(nativeElement.textContent).toContain('Board');
    expect(nativeElement.textContent).toContain('Suites');
    expect(nativeElement.textContent).toContain('Datasets');
    expect(nativeElement.textContent).toContain('Models');
    expect(nativeElement.textContent).toContain('Regressions');
    expect(nativeElement.textContent).toContain('Scorecards');
    expect(nativeElement.textContent).toContain('Settings');
  });

  it('toggles the icon sidebar from the header menu on desktop', () => {
    const api = internals(component);
    api.onMenuClick();
    expect(api.sidebarCollapsed()).toBe(true);
    expect(api.navOpen()).toBe(false);
  });

  it('toggles and closes the mobile nav', () => {
    const api = internals(component);
    expect(api.navOpen()).toBe(false);
    api.toggleNav();
    expect(api.navOpen()).toBe(true);
    api.closeNav();
    expect(api.navOpen()).toBe(false);
  });

  it('starts expanded and toggles to the icon sidebar', () => {
    const api = internals(component);
    expect(api.sidebarCollapsed()).toBe(false);
    expect(nativeElement.querySelector('.shell')?.classList.contains('sidebar-collapsed')).toBe(false);
    expect(nativeElement.querySelectorAll('.nav a').length).toBe(templateConfig.nav.length);
    api.toggleSidebar();
    expect(api.sidebarCollapsed()).toBe(true);
  });

  it('stores header search text and opens suites on ⌘K', () => {
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    internals(component).onQuery('Safety');
    expect(internals(component).query()).toBe('Safety');

    const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true });
    const prevent = vi.spyOn(event, 'preventDefault');
    internals(component).onKeydown(event);
    expect(prevent).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith(['/suites'], { queryParams: { q: 'Safety' } });
  });

  it('opens the run modal and blocks an empty form', () => {
    const api = internals(component);
    api.openRunModal();
    expect(api.isRunModalOpen()).toBe(true);
    expect(api.canRun()).toBe(false);

    api.draftModel.set('horizon-2');
    api.draftSuite.set('Summarization Quality');
    expect(api.canRun()).toBe(true);
  });

  it('queues an evaluation and shows a toast', () => {
    const api = internals(component);
    api.openRunModal();
    api.draftModel.set('horizon-2');
    api.draftSuite.set('Summarization Quality');
    api.runEvaluation();
    expect(api.isRunModalOpen()).toBe(false);
    expect(api.toastOpen()).toBe(true);
    expect(api.draftModel()).toBe('');
  });

  it('navigates to settings and regressions', () => {
    const navigateByUrl = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    internals(component).goSettings();
    expect(navigateByUrl).toHaveBeenCalledWith('/settings');
    internals(component).goRegressions();
    expect(navigateByUrl).toHaveBeenCalledWith('/regressions');
    expect(internals(component).inboxOpen()).toBe(false);
  });
});
