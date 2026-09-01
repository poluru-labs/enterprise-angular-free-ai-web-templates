import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { QueuePageComponent } from './queue-page.component';
import { internals } from '../../shared/testing/internals';
import { templateConfig } from '../../core/config/template.config';

describe('QueuePageComponent', () => {
  let component: QueuePageComponent;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QueuePageComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    const fixture = TestBed.createComponent(QueuePageComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('creates the support queue', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.textContent).toContain('Support copilot');
    expect(nativeElement.textContent).toContain(templateConfig.activity[0].title);
    expect(nativeElement.textContent).toContain('Ananya Poluru');
    expect(nativeElement.textContent).toContain('Billing, tracking, and night-coverage drafts');
  });

  it('renders week metrics by default and switches by period', () => {
    const api = internals(component);
    expect(api.period()).toBe('week');
    expect(api.visibleMetrics()[0].value).toBe('1,842');

    api.period.set('day');
    expect(api.visibleMetrics()[0].value).toBe('412');
    api.period.set('month');
    expect(api.visibleMetrics()[0].value).toBe('7,410');
  });

  it('dispatches the draft-reply event', () => {
    const spy = vi.spyOn(window, 'dispatchEvent');
    internals(component).openReply();
    expect(spy).toHaveBeenCalled();
    const event = spy.mock.calls[0][0] as Event;
    expect(event.type).toBe('harbor:reply');
  });
});
