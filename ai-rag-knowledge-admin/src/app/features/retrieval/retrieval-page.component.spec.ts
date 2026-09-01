import { TestBed } from '@angular/core/testing';
import { RetrievalPageComponent } from './retrieval-page.component';
import { internals } from '../../shared/testing/internals';

describe('RetrievalPageComponent', () => {
  let component: RetrievalPageComponent;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RetrievalPageComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(RetrievalPageComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('creates the retrieval playground', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.textContent).toContain('Retrieval');
    expect(nativeElement.textContent).toContain('How do we rotate API keys?');
  });

  it('filters grounded hits by min score', () => {
    const api = internals(component);
    expect(api.hits().every((hit: { score: string }) => Number(hit.score) >= 0.65)).toBe(true);
    api.minScore.set(0.9);
    expect(api.hits().every((hit: { score: string }) => Number(hit.score) >= 0.9)).toBe(true);
  });

  it('runs a hybrid search and records a notice', () => {
    const api = internals(component);
    api.query.set('Harbor SLA credits');
    api.runQuery();
    expect(api.ran()).toBe(true);
    expect(api.notice()).toContain('hybrid');
    expect(api.sampleQuery()).toContain('Harbor SLA credits');
  });
});
