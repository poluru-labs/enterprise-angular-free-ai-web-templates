import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BoardPageComponent } from './board-page.component';
import { internals } from '../../shared/testing/internals';
import { templateConfig } from '../../core/config/template.config';

describe('BoardPageComponent', () => {
  let component: BoardPageComponent;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardPageComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    const fixture = TestBed.createComponent(BoardPageComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('creates the evaluation board', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.textContent).toContain('Model evaluations');
    expect(nativeElement.textContent).toContain(templateConfig.activity[0].title);
    expect(nativeElement.textContent).toContain('Ananya Poluru');
    expect(nativeElement.textContent).toContain('horizon-2');
  });

  it('renders week metrics by default and switches by period', () => {
    const api = internals(component);
    expect(api.period()).toBe('week');
    expect(api.visibleMetrics()[0].value).toBe('328');

    api.period.set('day');
    expect(api.visibleMetrics()[0].value).toBe('41');
    api.period.set('month');
    expect(api.visibleMetrics()[0].value).toBe('1,246');
  });

  it('dispatches the run evaluation event', () => {
    const spy = vi.spyOn(window, 'dispatchEvent');
    internals(component).openRun();
    expect(spy).toHaveBeenCalled();
    const event = spy.mock.calls[0][0] as Event;
    expect(event.type).toBe('eval:run');
  });
});
