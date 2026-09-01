import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { EvaluationsPageComponent } from './evaluations-page.component';
import { internals } from '../../shared/testing/internals';

describe('EvaluationsPageComponent', () => {
  let component: EvaluationsPageComponent;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluationsPageComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    const fixture = TestBed.createComponent(EvaluationsPageComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('creates the evaluation desk', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.textContent).toContain('Evaluations');
    expect(nativeElement.textContent).toContain('Harbor Desk macros');
    expect(nativeElement.textContent).toContain('Priya Poluru');
  });

  it('filters by status', () => {
    const api = internals(component);
    api.filter.set('Drift');
    expect(api.filtered().every((item: { status: string }) => item.status === 'Drift')).toBe(true);
    expect(api.filtered().some((item: { id: string }) => item.id === 'EVAL-88')).toBe(true);
  });

  it('queues an eval run', () => {
    const api = internals(component);
    api.runEval('EVAL-91');
    expect(api.rows().find((item: { id: string }) => item.id === 'EVAL-91').status).toBe('Running');
    expect(api.notice()).toContain('EVAL-91');
  });

  it('aggregates nDCG and golden questions', () => {
    const api = internals(component);
    expect(api.ndcgAvg()).toBeGreaterThan(80);
    expect(api.questionCount()).toBeGreaterThan(100);
    expect(api.driftCount()).toBe(1);
  });
});
