import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { ForecastsPageComponent } from './forecasts-page.component';
import { internals } from '../../shared/testing/internals';

describe('ForecastsPageComponent', () => {
  let component: ForecastsPageComponent;
  let nativeElement: HTMLElement;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForecastsPageComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    const fixture = TestBed.createComponent(ForecastsPageComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('creates the forecast desk', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.textContent).toContain('Forecasts');
    expect(nativeElement.textContent).toContain('Production');
    expect(nativeElement.textContent).toContain('Lakshmi Poluru');
  });

  it('starts at 12% weekly growth and restresses projections', () => {
    const api = internals(component);
    expect(api.growth()).toBe(12);
    expect(api.soonest().workspace).toBe('Production');
    const atTwelve = api.projected()[0].projected;

    api.growth.set(0);
    expect(api.projected()[0].projected).toBe(api.projected()[0].current);
    api.growth.set(30);
    expect(api.projected()[0].projected).toBeGreaterThan(atTwelve);
  });

  it('counts watch workspaces and month-end breaches', () => {
    const api = internals(component);
    expect(api.watchCount()).toBeGreaterThan(0);
    api.growth.set(30);
    expect(api.breachCount()).toBeGreaterThan(0);
  });

  it('caps progress bars and opens alerts', () => {
    const navigateByUrl = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    expect(internals(component).capBar(140)).toBe(120);
    expect(internals(component).capMeter(140)).toBe(100);
    internals(component).goAlerts();
    expect(navigateByUrl).toHaveBeenCalledWith('/alerts');
  });
});
