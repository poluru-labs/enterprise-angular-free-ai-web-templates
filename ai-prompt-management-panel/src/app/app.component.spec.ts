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

  it('creates the Prompt library shell', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.querySelector('.brand')?.textContent).toContain('Prompt library');
    expect(nativeElement.querySelector('.brand')?.textContent).not.toContain('Poluru Labs');
    expect(nativeElement.textContent).toContain(templateConfig.user.name);
    expect(nativeElement.querySelector('.shell')?.getAttribute('data-app')).toBe('Prompt library');
  });

  it('renders a header profile chip and menu identity', () => {
    const chip = nativeElement.querySelector('.account');
    expect(chip?.textContent).toContain('Priya Poluru');
    expect(chip?.textContent).toContain('Prompt ops lead');
    expect(nativeElement.querySelector('.account-status')).toBeTruthy();
    expect(nativeElement.querySelector('.account-menu-head')?.textContent).toContain(templateConfig.workspace);
  });

  it('renders sidebar navigation including new features', () => {
    expect(nativeElement.textContent).toContain('Library');
    expect(nativeElement.textContent).toContain('Experiments');
    expect(nativeElement.textContent).toContain('Versions');
    expect(nativeElement.textContent).toContain('Collections');
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

  it('stores header search text and opens library on ⌘K', () => {
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    internals(component).onQuery('Support');
    expect(internals(component).query()).toBe('Support');

    const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true });
    const prevent = vi.spyOn(event, 'preventDefault');
    internals(component).onKeydown(event);
    expect(prevent).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith(['/'], { queryParams: { q: 'Support' } });
  });

  it('opens the new-prompt modal and blocks an empty form', () => {
    const api = internals(component);
    api.openPromptModal();
    expect(api.isPromptModalOpen()).toBe(true);
    expect(api.canCreate()).toBe(false);

    api.draftName.set('Support triage v4');
    api.draftCollection.set('Customer experience');
    expect(api.canCreate()).toBe(true);
  });

  it('queues a draft and shows a toast', () => {
    const api = internals(component);
    api.openPromptModal();
    api.draftName.set('Support triage v4');
    api.draftCollection.set('Customer experience');
    api.createPrompt();
    expect(api.isPromptModalOpen()).toBe(false);
    expect(api.toastOpen()).toBe(true);
    expect(api.draftName()).toBe('');
  });

  it('navigates to settings, experiments, and the review inbox', () => {
    const navigateByUrl = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    internals(component).goSettings();
    expect(navigateByUrl).toHaveBeenCalledWith('/settings');
    internals(component).goExperiments();
    expect(navigateByUrl).toHaveBeenCalledWith('/experiments');
    expect(internals(component).inboxOpen()).toBe(false);
    internals(component).goLibraryReview();
    expect(navigate).toHaveBeenCalledWith(['/'], { queryParams: { status: 'Review' } });
  });
});
