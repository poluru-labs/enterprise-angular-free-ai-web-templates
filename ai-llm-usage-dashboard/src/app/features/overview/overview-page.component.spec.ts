import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { OverviewPageComponent } from './overview-page.component';
import { internals } from '../../shared/testing/internals';
import { templateConfig } from '../../core/config/template.config';

describe('OverviewPageComponent', () => {
  let component: OverviewPageComponent;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverviewPageComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    const fixture = TestBed.createComponent(OverviewPageComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('creates the usage overview', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.textContent).toContain('LLM usage');
    expect(nativeElement.textContent).toContain(templateConfig.activity[0].title);
    expect(nativeElement.textContent).toContain('Lakshmi Poluru');
  });

  it('renders week metrics by default and switches by period', () => {
    const api = internals(component);
    expect(api.period()).toBe('week');
    expect(api.visibleMetrics()[0].value).toBe('84.2M');

    api.period.set('day');
    expect(api.visibleMetrics()[0].value).toBe('12.6M');
    api.period.set('month');
    expect(api.visibleMetrics()[0].value).toBe('312.8M');
  });

  it('dispatches the export event', () => {
    const spy = vi.spyOn(window, 'dispatchEvent');
    internals(component).openExport();
    expect(spy).toHaveBeenCalled();
    const event = spy.mock.calls[0][0] as Event;
    expect(event.type).toBe('meter:export');
  });
});
