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

  it('creates the Garnet Close shell', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.querySelector('.brand')?.textContent).toContain('Garnet Close');
    expect(nativeElement.querySelector('.brand')?.textContent).not.toContain('Poluru Labs');
    expect(nativeElement.querySelector('.brand')?.textContent).not.toContain('Poluru Revenue');
    expect(nativeElement.textContent).toContain(templateConfig.user.name);
    expect(nativeElement.querySelector('.shell')?.getAttribute('data-app')).toBe('Garnet Close');
  });

  it('renders a modern context strip with workspace pulse', () => {
    const strip = nativeElement.querySelector('.topbar-context');
    expect(strip?.textContent).toContain('FY26 Q3 · Enterprise');
    expect(strip?.textContent).toContain('Production');
    expect(strip?.textContent).toContain('Salesforce live');
    expect(strip?.textContent).toContain('watch');
    expect(strip?.textContent).toContain('$1.84M pipeline');
    expect(strip?.querySelectorAll('.material-symbols-outlined').length).toBe(5);
    expect(nativeElement.querySelector('.command-bar')).toBeTruthy();
    expect(nativeElement.querySelector('.command-bar eds-search')).toBeTruthy();
    expect(nativeElement.querySelector('.inbox-count')?.textContent).toContain('9');
  });

  it('renders a styled header profile chip and menu identity', () => {
    const chip = nativeElement.querySelector('.account');
    expect(chip?.textContent).toContain('Ananya Poluru');
    expect(chip?.textContent).toContain('Revenue lead');
    expect(nativeElement.querySelector('.account-status')).toBeTruthy();
    expect(nativeElement.querySelector('.account-menu-head')?.textContent).toContain(templateConfig.workspace);
  });

  it('renders sidebar navigation including new features', () => {
    expect(nativeElement.textContent).toContain('Overview');
    expect(nativeElement.textContent).toContain('Accounts');
    expect(nativeElement.textContent).toContain('Signals');
    expect(nativeElement.textContent).toContain('Sequences');
    expect(nativeElement.textContent).toContain('Meetings');
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

  it('stores header search text and opens accounts on ⌘K', () => {
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    internals(component).onQuery('Northstar');
    expect(internals(component).query()).toBe('Northstar');

    const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true });
    const prevent = vi.spyOn(event, 'preventDefault');
    internals(component).onKeydown(event);
    expect(prevent).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith(['/accounts'], { queryParams: { q: 'Northstar' } });
  });

  it('opens the brief wizard and blocks an empty first step', () => {
    const api = internals(component);
    api.openBriefModal();
    expect(api.briefOpen()).toBe(true);
    expect(api.briefStep()).toBe(0);
    expect(api.canAdvanceBrief()).toBe(false);

    api.draftName.set('Brightside Health expansion');
    api.draftType.set('Account research');
    expect(api.canAdvanceBrief()).toBe(true);
    api.advanceBrief();
    expect(api.briefStep()).toBe(1);
  });

  it('queues a brief after the last step', () => {
    const api = internals(component);
    api.openBriefModal();
    api.draftName.set('Brightside Health expansion');
    api.draftType.set('Account research');
    api.advanceBrief();
    api.draftAccount.set('Brightside Health');
    api.advanceBrief();
    expect(api.briefStep()).toBe(2);
    api.advanceBrief();
    expect(api.briefOpen()).toBe(false);
    expect(api.toastOpen()).toBe(true);
  });

  it('navigates to settings, signals, and forecasts', () => {
    const navigateByUrl = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    internals(component).goSettings();
    expect(navigateByUrl).toHaveBeenCalledWith('/settings');
    internals(component).goSignals();
    expect(navigateByUrl).toHaveBeenCalledWith('/signals');
    internals(component).goForecasts();
    expect(navigateByUrl).toHaveBeenCalledWith('/forecasts');
    expect(internals(component).inboxOpen()).toBe(false);
  });
});
