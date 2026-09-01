import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RegressionsPageComponent } from './regressions-page.component';
import { internals } from '../../shared/testing/internals';

describe('RegressionsPageComponent', () => {
  let component: RegressionsPageComponent;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegressionsPageComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    const fixture = TestBed.createComponent(RegressionsPageComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('creates the regression watchtower', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.textContent).toContain('Regressions');
    expect(nativeElement.textContent).toContain('Safety & Toxicity');
    expect(nativeElement.textContent).toContain('REG-204');
  });

  it('filters by severity and status', () => {
    const api = internals(component);
    api.filter.set('Critical');
    expect(api.filtered().every((item: { severity: string }) => item.severity === 'Critical')).toBe(true);

    api.filter.set('Snoozed');
    expect(api.filtered().every((item: { status: string }) => item.status === 'Snoozed')).toBe(true);
    expect(api.filtered().some((item: { id: string }) => item.id === 'REG-174')).toBe(true);
  });

  it('acknowledges and snoozes a regression', () => {
    const api = internals(component);
    api.acknowledge('REG-204');
    expect(api.rows().find((item: { id: string }) => item.id === 'REG-204').status).toBe('Acknowledged');
    expect(api.notice()).toContain('REG-204');

    api.snooze('REG-198');
    expect(api.rows().find((item: { id: string }) => item.id === 'REG-198').status).toBe('Snoozed');
  });

  it('counts open and critical regressions', () => {
    const api = internals(component);
    expect(api.openCount()).toBeGreaterThan(0);
    expect(api.criticalCount()).toBe(1);
  });
});
