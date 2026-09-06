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

  it('creates the Lattice shell', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.querySelector('.brand')?.textContent).toContain('Lattice');
    expect(nativeElement.querySelector('.brand')?.textContent).not.toContain('Harbor Desk');
    expect(nativeElement.textContent).toContain(templateConfig.user.name);
    expect(nativeElement.querySelector('.shell')?.getAttribute('data-app')).toBe('Lattice');
  });

  it('renders a context strip with workspace pulse', () => {
    const strip = nativeElement.querySelector('.topbar-context');
    expect(strip?.textContent).toContain('Vectors · Production');
    expect(strip?.textContent).toContain('Production');
    expect(strip?.textContent).toContain('HNSW live');
    expect(strip?.textContent).toContain('warm');
    expect(strip?.textContent).toContain('0.91 recall');
    expect(nativeElement.querySelector('.command-bar eds-search')).toBeTruthy();
    expect(nativeElement.querySelector('.inbox-count')?.textContent).toContain('4');
  });

  it('renders a header profile chip', () => {
    const chip = nativeElement.querySelector('.account');
    expect(chip?.textContent).toContain('Maya Poluru');
    expect(chip?.textContent).toContain('Index engineer');
    expect(nativeElement.querySelector('.account-menu-head')?.textContent).toContain(templateConfig.workspace);
  });

  it('renders a simple sidebar', () => {
    expect(nativeElement.textContent).toContain('Overview');
    expect(nativeElement.textContent).toContain('Indexes');
    expect(nativeElement.textContent).toContain('Namespaces');
    expect(nativeElement.textContent).toContain('Vectors');
    expect(nativeElement.textContent).toContain('Search');
    expect(nativeElement.textContent).toContain('Neighbors');
    expect(nativeElement.textContent).toContain('Clusters');
    expect(nativeElement.textContent).toContain('Settings');
    expect(nativeElement.querySelector('.quick-label')).toBeNull();
  });

  it('toggles and closes the mobile nav', () => {
    const api = internals(component);
    expect(api.navOpen()).toBe(false);
    api.toggleNav();
    expect(api.navOpen()).toBe(true);
    api.closeNav();
    expect(api.navOpen()).toBe(false);
  });

  it('stores header search text and opens search on ⌘K', () => {
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    internals(component).onQuery('docs-prod');
    expect(internals(component).query()).toBe('docs-prod');

    const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true });
    const prevent = vi.spyOn(event, 'preventDefault');
    internals(component).onKeydown(event);
    expect(prevent).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith(['/search'], { queryParams: { q: 'docs-prod' } });
  });

  it('opens the query wizard and blocks an empty first step', () => {
    const api = internals(component);
    api.openQueryModal();
    expect(api.queryOpen()).toBe(true);
    expect(api.queryStep()).toBe(0);
    expect(api.canAdvanceQuery()).toBe(false);

    api.draftIndex.set('docs-prod');
    api.draftNamespace.set('eu-live');
    expect(api.canAdvanceQuery()).toBe(true);
    api.advanceQuery();
    expect(api.queryStep()).toBe(1);
  });

  it('queues a query after the last step', () => {
    const navigateByUrl = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    const api = internals(component);
    api.openQueryModal();
    api.draftIndex.set('docs-prod');
    api.draftNamespace.set('eu-live');
    api.advanceQuery();
    api.draftText.set('Rotate API keys every 90 days');
    api.advanceQuery();
    expect(api.queryStep()).toBe(2);
    api.advanceQuery();
    expect(api.queryOpen()).toBe(false);
    expect(api.toastOpen()).toBe(true);
    expect(navigateByUrl).toHaveBeenCalledWith('/search');
  });

  it('navigates to settings, search, and namespaces', () => {
    const navigateByUrl = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    internals(component).goSettings();
    expect(navigateByUrl).toHaveBeenCalledWith('/settings');
    internals(component).goSearch();
    expect(navigateByUrl).toHaveBeenCalledWith('/search');
    internals(component).goNamespaces();
    expect(navigateByUrl).toHaveBeenCalledWith('/namespaces');
    expect(internals(component).inboxOpen()).toBe(false);
  });
});
