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

  it('creates the Harbor Desk shell', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.querySelector('.brand')?.textContent).toContain('Harbor Desk');
    expect(nativeElement.querySelector('.brand')?.textContent).not.toContain('Poluru Labs');
    expect(nativeElement.querySelector('.brand')?.textContent).not.toContain('Poluru Support');
    expect(nativeElement.textContent).toContain(templateConfig.user.name);
    expect(nativeElement.querySelector('.shell')?.getAttribute('data-app')).toBe('Harbor Desk');
  });

  it('renders a modern context strip with workspace pulse', () => {
    const strip = nativeElement.querySelector('.topbar-context');
    expect(strip?.textContent).toContain('CX · Live queue');
    expect(strip?.textContent).toContain('Production');
    expect(strip?.textContent).toContain('Auto-draft on');
    expect(strip?.textContent).toContain('review');
    expect(strip?.textContent).toContain('4.8/5 CSAT');
    expect(strip?.querySelectorAll('.material-symbols-outlined').length).toBe(5);
    expect(nativeElement.querySelector('.command-bar')).toBeTruthy();
    expect(nativeElement.querySelector('.command-bar eds-search')).toBeTruthy();
    expect(nativeElement.querySelector('.inbox-count')?.textContent).toContain('6');
  });

  it('renders a styled header profile chip and menu identity', () => {
    const chip = nativeElement.querySelector('.account');
    expect(chip?.textContent).toContain('Ananya Poluru');
    expect(chip?.textContent).toContain('Support lead');
    expect(nativeElement.querySelector('.account-status')).toBeTruthy();
    expect(nativeElement.querySelector('.account-menu-head')?.textContent).toContain(templateConfig.workspace);
  });

  it('renders sidebar navigation including new features', () => {
    expect(nativeElement.textContent).toContain('Queue');
    expect(nativeElement.textContent).toContain('Inbox');
    expect(nativeElement.textContent).toContain('Suggestions');
    expect(nativeElement.textContent).toContain('Knowledge');
    expect(nativeElement.textContent).toContain('Agents');
    expect(nativeElement.textContent).toContain('Reports');
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

  it('stores header search text and opens conversations on ⌘K', () => {
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    internals(component).onQuery('Refund');
    expect(internals(component).query()).toBe('Refund');

    const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true });
    const prevent = vi.spyOn(event, 'preventDefault');
    internals(component).onKeydown(event);
    expect(prevent).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith(['/conversations'], { queryParams: { q: 'Refund' } });
  });

  it('opens the reply wizard and blocks an empty first step', () => {
    const api = internals(component);
    api.openReplyModal();
    expect(api.replyOpen()).toBe(true);
    expect(api.replyStep()).toBe(0);
    expect(api.canAdvanceReply()).toBe(false);

    api.draftTicket.set('#48324 Refund window');
    api.draftType.set('Refund');
    expect(api.canAdvanceReply()).toBe(true);
    api.advanceReply();
    expect(api.replyStep()).toBe(1);
  });

  it('queues a draft after the last step', () => {
    const api = internals(component);
    api.openReplyModal();
    api.draftTicket.set('#48324 Refund window');
    api.draftType.set('Refund');
    api.advanceReply();
    api.draftOwner.set('Hana Poluru');
    api.advanceReply();
    expect(api.replyStep()).toBe(2);
    api.advanceReply();
    expect(api.replyOpen()).toBe(false);
    expect(api.toastOpen()).toBe(true);
  });

  it('navigates to settings, conversations, and reports', () => {
    const navigateByUrl = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    internals(component).goSettings();
    expect(navigateByUrl).toHaveBeenCalledWith('/settings');
    internals(component).goConversations();
    expect(navigateByUrl).toHaveBeenCalledWith('/conversations');
    internals(component).goReports();
    expect(navigateByUrl).toHaveBeenCalledWith('/reports');
    expect(internals(component).inboxOpen()).toBe(false);
  });
});
