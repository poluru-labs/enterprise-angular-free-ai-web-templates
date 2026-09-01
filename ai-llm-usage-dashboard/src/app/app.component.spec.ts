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

  it('creates the Lilac Meter shell', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.querySelector('.brand')?.textContent).toContain('Lilac Meter');
    expect(nativeElement.querySelector('.brand')?.textContent).not.toContain('Poluru Cloud');
    expect(nativeElement.querySelector('.brand')?.textContent).not.toContain('Poluru Labs');
    expect(nativeElement.textContent).toContain(templateConfig.user.name);
    expect(nativeElement.querySelector('.shell')?.getAttribute('data-app')).toBe('Lilac Meter');
  });

  it('renders a styled header profile chip and menu identity', () => {
    const chip = nativeElement.querySelector('.account');
    expect(chip?.textContent).toContain('Lakshmi Poluru');
    expect(chip?.textContent).toContain('Platform lead');
    expect(nativeElement.querySelector('.account-status')).toBeTruthy();
    expect(nativeElement.querySelector('.account-menu-head')?.textContent).toContain(templateConfig.workspace);
  });

  it('renders sidebar navigation including new features', () => {
    expect(nativeElement.textContent).toContain('Overview');
    expect(nativeElement.textContent).toContain('Usage');
    expect(nativeElement.textContent).toContain('Models');
    expect(nativeElement.textContent).toContain('Budgets');
    expect(nativeElement.textContent).toContain('Alerts');
    expect(nativeElement.textContent).toContain('Forecasts');
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

  it('stores header search text and opens usage on ⌘K', () => {
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    internals(component).onQuery('gpt-4.1');
    expect(internals(component).query()).toBe('gpt-4.1');

    const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true });
    const prevent = vi.spyOn(event, 'preventDefault');
    internals(component).onKeydown(event);
    expect(prevent).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith(['/usage'], { queryParams: { q: 'gpt-4.1' } });
  });

  it('opens the export wizard and blocks an empty first step', () => {
    const api = internals(component);
    api.openExportModal();
    expect(api.exportOpen()).toBe(true);
    expect(api.exportStep()).toBe(0);
    expect(api.canAdvanceExport()).toBe(false);

    api.draftName.set('August usage summary');
    api.draftFormat.set('CSV');
    expect(api.canAdvanceExport()).toBe(true);
    api.advanceExport();
    expect(api.exportStep()).toBe(1);
  });

  it('queues an export after the last step', () => {
    const api = internals(component);
    api.openExportModal();
    api.draftName.set('August usage summary');
    api.draftFormat.set('CSV');
    api.advanceExport();
    api.draftWorkspace.set('Production');
    api.advanceExport();
    expect(api.exportStep()).toBe(2);
    api.advanceExport();
    expect(api.exportOpen()).toBe(false);
    expect(api.toastOpen()).toBe(true);
  });

  it('navigates to settings and alerts', () => {
    const navigateByUrl = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    internals(component).goSettings();
    expect(navigateByUrl).toHaveBeenCalledWith('/settings');
    internals(component).goAlerts();
    expect(navigateByUrl).toHaveBeenCalledWith('/alerts');
    expect(internals(component).inboxOpen()).toBe(false);
  });
});
