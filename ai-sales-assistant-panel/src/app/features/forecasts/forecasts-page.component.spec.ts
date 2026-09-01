import { TestBed } from '@angular/core/testing';
import { ForecastsPageComponent } from './forecasts-page.component';
import { internals } from '../../shared/testing/internals';

describe('ForecastsPageComponent', () => {
  let component: ForecastsPageComponent;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForecastsPageComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(ForecastsPageComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('creates the forecast board', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.textContent).toContain('Forecasts');
    expect(nativeElement.textContent).toContain('Enterprise commit');
    expect(nativeElement.textContent).toContain('Harborline stall');
  });

  it('filters books by status', () => {
    const api = internals(component);
    api.filter.set('At risk');
    expect(api.visible().every((item: { status: string }) => item.status === 'At risk')).toBe(true);
    expect(api.visible().some((item: { name: string }) => item.name === 'Retail outbound')).toBe(true);
  });
});
