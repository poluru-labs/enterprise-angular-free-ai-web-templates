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

  it('creates the sales overview', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.textContent).toContain('Sales assistant');
    expect(nativeElement.textContent).toContain(templateConfig.activity[0].title);
    expect(nativeElement.textContent).toContain('Ananya Poluru');
    expect(nativeElement.textContent).toContain('Commit plus watched expansion');
  });

  it('renders week metrics by default and switches by period', () => {
    const api = internals(component);
    expect(api.period()).toBe('week');
    expect(api.visibleMetrics()[0].value).toBe('$1.84M');

    api.period.set('day');
    expect(api.visibleMetrics()[0].value).toBe('$284K');
    api.period.set('month');
    expect(api.visibleMetrics()[0].value).toBe('$6.12M');
  });

  it('dispatches the create-brief event', () => {
    const spy = vi.spyOn(window, 'dispatchEvent');
    internals(component).openBrief();
    expect(spy).toHaveBeenCalled();
    const event = spy.mock.calls[0][0] as Event;
    expect(event.type).toBe('garnet:brief');
  });
});
