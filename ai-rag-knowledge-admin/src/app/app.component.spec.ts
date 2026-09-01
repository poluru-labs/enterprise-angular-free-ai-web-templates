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

  it('creates the Indigo Vault shell', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.querySelector('.brand')?.textContent).toContain('Indigo Vault');
    expect(nativeElement.querySelector('.brand')?.textContent).not.toContain('Poluru Labs');
    expect(nativeElement.querySelector('.brand')?.textContent).not.toContain('Poluru Cloud');
    expect(nativeElement.textContent).toContain(templateConfig.user.name);
    expect(nativeElement.querySelector('.shell')?.getAttribute('data-app')).toBe('Indigo Vault');
  });

  it('renders a modern context strip with workspace pulse', () => {
    const strip = nativeElement.querySelector('.topbar-context');
    expect(strip?.textContent).toContain('FY26 Q3 · Knowledge');
    expect(strip?.textContent).toContain('Production');
    expect(strip?.textContent).toContain('Hybrid on');
    expect(strip?.textContent).toContain('text-embed-3-large');
    expect(strip?.textContent).toContain('2 ACL open');
    expect(strip?.textContent).toContain('94.6% nDCG');
    expect(strip?.querySelectorAll('.material-symbols-outlined').length).toBe(5);
    expect(nativeElement.querySelector('.command-bar')).toBeTruthy();
    expect(nativeElement.querySelector('.command-bar eds-search')).toBeTruthy();
    expect(nativeElement.querySelector('.inbox-count')?.textContent).toContain('2');
  });

  it('renders a styled header profile chip and menu identity', () => {
    const chip = nativeElement.querySelector('.account');
    expect(chip?.textContent).toContain('Ananya Poluru');
    expect(chip?.textContent).toContain('Knowledge lead');
    expect(nativeElement.querySelector('.account-status')).toBeTruthy();
    expect(nativeElement.querySelector('.account-menu-head')?.textContent).toContain(templateConfig.workspace);
  });

  it('renders sidebar navigation including new features', () => {
    expect(nativeElement.textContent).toContain('Overview');
    expect(nativeElement.textContent).toContain('Sources');
    expect(nativeElement.textContent).toContain('Collections');
    expect(nativeElement.textContent).toContain('Indexing');
    expect(nativeElement.textContent).toContain('Retrieval');
    expect(nativeElement.textContent).toContain('Governance');
    expect(nativeElement.textContent).toContain('Evaluations');
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

  it('stores header search text and opens sources on ⌘K', () => {
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    internals(component).onQuery('Legal');
    expect(internals(component).query()).toBe('Legal');

    const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true });
    const prevent = vi.spyOn(event, 'preventDefault');
    internals(component).onKeydown(event);
    expect(prevent).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith(['/sources'], { queryParams: { q: 'Legal' } });
  });

  it('opens the source wizard and blocks an empty first step', () => {
    const api = internals(component);
    api.openSourceModal();
    expect(api.sourceModalOpen()).toBe(true);
    expect(api.sourceStep()).toBe(0);
    expect(api.canAdvanceSource()).toBe(false);

    api.draftName.set('Product documentation');
    api.draftConnector.set('Confluence');
    expect(api.canAdvanceSource()).toBe(true);
    api.advanceSource();
    expect(api.sourceStep()).toBe(1);
  });

  it('queues a source after the last step', () => {
    const api = internals(component);
    api.openSourceModal();
    api.draftName.set('Product documentation');
    api.draftConnector.set('Confluence');
    api.advanceSource();
    api.draftCollection.set('Public');
    api.advanceSource();
    expect(api.sourceStep()).toBe(2);
    api.advanceSource();
    expect(api.sourceModalOpen()).toBe(false);
    expect(api.toastOpen()).toBe(true);
  });

  it('navigates to settings, governance, and evaluations', () => {
    const navigateByUrl = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    internals(component).goSettings();
    expect(navigateByUrl).toHaveBeenCalledWith('/settings');
    internals(component).goGovernance();
    expect(navigateByUrl).toHaveBeenCalledWith('/governance');
    internals(component).goEvaluations();
    expect(navigateByUrl).toHaveBeenCalledWith('/evaluations');
    expect(internals(component).inboxOpen()).toBe(false);
  });
});
