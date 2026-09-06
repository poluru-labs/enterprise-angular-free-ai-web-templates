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

  it('creates the vector overview', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.textContent).toContain('Vector explorer');
    expect(nativeElement.textContent).toContain(templateConfig.activity[0].title);
    expect(nativeElement.textContent).toContain('Maya Poluru');
    expect(nativeElement.textContent).toContain('docs-prod, support-faq, and code-search');
  });

  it('renders week metrics by default and switches by period', () => {
    const api = internals(component);
    expect(api.period()).toBe('week');
    expect(api.visibleMetrics()[0].value).toBe('4.06M');

    api.period.set('day');
    expect(api.visibleMetrics()[0].value).toBe('4.01M');
    api.period.set('month');
    expect(api.visibleMetrics()[0].value).toBe('3.82M');
  });

  it('dispatches the run-query event', () => {
    const spy = vi.spyOn(window, 'dispatchEvent');
    internals(component).openQuery();
    expect(spy).toHaveBeenCalled();
    const event = spy.mock.calls[0][0] as Event;
    expect(event.type).toBe('lattice:query');
  });
});
