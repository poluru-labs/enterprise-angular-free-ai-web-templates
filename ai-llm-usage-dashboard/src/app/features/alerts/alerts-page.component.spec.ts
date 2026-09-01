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

  it('creates the alerts inbox', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.textContent).toContain('Alerts');
    expect(nativeElement.textContent).toContain('Production is at 88% of budget');
    expect(nativeElement.textContent).toContain('ALT-204');
  });

  it('filters by kind and status', () => {
    const api = internals(component);
    api.filter.set('Latency');
    expect(api.filtered().every((item: { kind: string }) => item.kind === 'Latency')).toBe(true);

    api.filter.set('Snoozed');
    expect(api.filtered().every((item: { status: string }) => item.status === 'Snoozed')).toBe(true);
    expect(api.filtered().some((item: { id: string }) => item.id === 'ALT-174')).toBe(true);
  });

  it('acknowledges and snoozes an alert', () => {
    const api = internals(component);
    api.acknowledge('ALT-204');
    expect(api.rows().find((item: { id: string }) => item.id === 'ALT-204').status).toBe('Acknowledged');
    expect(api.notice()).toContain('ALT-204');

    api.snooze('ALT-198');
    expect(api.rows().find((item: { id: string }) => item.id === 'ALT-198').status).toBe('Snoozed');
  });

  it('counts open and critical alerts', () => {
    const api = internals(component);
    expect(api.openCount()).toBeGreaterThan(0);
    expect(api.criticalCount()).toBe(1);
  });
});
