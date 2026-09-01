import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AlertsPageComponent } from './alerts-page.component';
import { internals } from '../../shared/testing/internals';

describe('AlertsPageComponent', () => {
  let component: AlertsPageComponent;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertsPageComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    const fixture = TestBed.createComponent(AlertsPageComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('creates the alert queue', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.textContent).toContain('Alerts');
    expect(nativeElement.textContent).toContain('AL-441');
  });

  it('filters by severity and search', () => {
    const api = internals(component);
    api.filter.set('High');
    expect(api.filtered().every((item: { severity: string }) => item.severity === 'High')).toBe(true);

    api.filter.set('All');
    api.query.set('payroll');
    expect(api.filtered().some((item: { id: string }) => item.id === 'AL-429')).toBe(true);

    api.query.set('zzzz-not-an-alert');
    expect(api.filtered()).toEqual([]);
  });

  it('acknowledges, assigns, and snoozes alerts', () => {
    const api = internals(component);
    const openBefore = api.openCount();
    api.ack('AL-441');
    expect(api.rows().find((item: { id: string }) => item.id === 'AL-441').done).toBe(true);
    expect(api.openCount()).toBe(openBefore - 1);
    expect(api.notice()).toContain('acknowledged');

    api.assign('AL-440');
    expect(api.rows().find((item: { id: string }) => item.id === 'AL-440').assignee).toBe('Aisha Poluru');

    api.snooze('AL-438');
    expect(api.rows().find((item: { id: string }) => item.id === 'AL-438').snoozed).toBe(true);
    expect(api.filtered().some((item: { id: string }) => item.id === 'AL-438')).toBe(false);
  });

  it('counts assigned-to-you alerts for Aisha Poluru', () => {
    expect(internals(component).assignedToYou()).toBeGreaterThan(0);
  });
});
