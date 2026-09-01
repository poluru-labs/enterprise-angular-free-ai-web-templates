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

  it('creates the review queue', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.textContent).toContain('Review queue');
    expect(nativeElement.textContent).toContain('Aisha Poluru is on call');
    expect(nativeElement.textContent).toContain('HR-1104');
    expect(nativeElement.textContent).toContain('HR-1082');
  });

  it('renders Today metrics by default and switches by period', () => {
    const api = internals(component);
    expect(api.period()).toBe('Today');
    expect(api.visibleMetrics()[0].value).toBe('128');
    expect(nativeElement.textContent).toContain(templateConfig.activity[0].title);

    api.period.set('7d');
    expect(api.visibleMetrics()[0].value).toBe('841');
    api.period.set('30d');
    expect(api.visibleMetrics()[0].value).toBe('3,204');
  });

  it('filters queue items by lane', () => {
    const api = internals(component);
    api.queueFilter.set('PII');
    expect(api.filteredQueue().every((item: { queue: string }) => item.queue === 'PII')).toBe(true);
    expect(api.filteredQueue().some((item: { id: string }) => item.id === 'HR-1101')).toBe(true);
  });

  it('takes the next unassigned item for Aisha Poluru', () => {
    const api = internals(component);
    api.takeNext();
    expect(api.items().find((item: { id: string }) => item.id === 'HR-1104').assignee).toBe('Aisha Poluru');
    expect(api.notice()).toContain('HR-1104');
  });

  it('approves, rejects, and escalates the selected item', () => {
    const api = internals(component);
    api.selectedId.set('HR-1094');
    api.act('approved');
    expect(api.items().find((item: { id: string }) => item.id === 'HR-1094').done).toBe(true);

    api.selectedId.set('HR-1074');
    api.act('rejected');
    expect(api.notice()).toContain('rejected');

    api.selectedId.set('HR-1068');
    api.act('escalated');
    expect(api.notice()).toContain('Sahana Poluru');
    expect(api.filteredQueue().some((item: { id: string }) => item.id === 'HR-1068')).toBe(false);
  });

  it('scales hourly bars against the busiest hour', () => {
    expect(internals(component).barHeight(71)).toBe(100);
    expect(internals(component).barHeight(0)).toBe(0);
  });
});
