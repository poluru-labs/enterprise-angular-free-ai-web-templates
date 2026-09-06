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

  it('creates the guardrails overview', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.textContent).toContain('Guardrails');
    expect(nativeElement.textContent).toContain(templateConfig.activity[0].title);
    expect(nativeElement.textContent).toContain('Maya Poluru');
    expect(nativeElement.textContent).toContain('Jailbreak, hate, and violence hits');
  });

  it('renders week metrics by default and switches by period', () => {
    const api = internals(component);
    expect(api.period()).toBe('week');
    expect(api.visibleMetrics()[0].value).toBe('1,284');

    api.period.set('day');
    expect(api.visibleMetrics()[0].value).toBe('164');
    api.period.set('month');
    expect(api.visibleMetrics()[0].value).toBe('5,102');
  });

  it('dispatches the test-prompt event', () => {
    const spy = vi.spyOn(window, 'dispatchEvent');
    internals(component).openTest();
    expect(spy).toHaveBeenCalled();
    const event = spy.mock.calls[0][0] as Event;
    expect(event.type).toBe('reef:test');
  });
});
