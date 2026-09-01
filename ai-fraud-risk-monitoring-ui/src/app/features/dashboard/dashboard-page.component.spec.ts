import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DashboardPageComponent } from './dashboard-page.component';
import { internals } from '../../shared/testing/internals';
import { templateConfig } from '../../core/config/template.config';

describe('DashboardPageComponent', () => {
  let component: DashboardPageComponent;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPageComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    const fixture = TestBed.createComponent(DashboardPageComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('creates the fraud monitor', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.textContent).toContain('Fraud risk monitor');
    expect(nativeElement.textContent).toContain('Aisha Poluru is on call');
    expect(nativeElement.textContent).toContain('Leila Poluru is testing cards');
  });

  it('renders headline metrics for 7d by default', () => {
    expect(internals(component).period()).toBe('7d');
    expect(nativeElement.textContent).toContain('$4.28M');
    expect(nativeElement.textContent).toContain('97.1%');
    expect(nativeElement.textContent).toContain(templateConfig.activity[0].title);
  });

  it('switches metric values by period', () => {
    internals(component).period.set('Today');
    expect(internals(component).visibleMetrics()[0].value).toBe('$612k');
    internals(component).period.set('30d');
    expect(internals(component).visibleMetrics()[0].value).toBe('$17.4M');
  });

  it('maps activity tones to icons', () => {
    const api = internals(component);
    expect(api.statusIcon('ok')).toBe('check_circle');
    expect(api.statusIcon('warn')).toBe('error');
    expect(api.statusIcon('rose')).toBe('block');
    expect(api.statusIcon('info')).toBe('info');
  });

  it('shows investigators, watchlist, and model drift', () => {
    expect(nativeElement.textContent).toContain('Aisha Poluru');
    expect(nativeElement.textContent).toContain('BIN 414720');
    expect(nativeElement.textContent).toContain('Card velocity v4');
  });
});
