import { TestBed } from '@angular/core/testing';
import { IndexingPageComponent } from './indexing-page.component';
import { internals } from '../../shared/testing/internals';

describe('IndexingPageComponent', () => {
  let component: IndexingPageComponent;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndexingPageComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(IndexingPageComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('creates the indexing pipeline', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.textContent).toContain('Indexing');
    expect(nativeElement.textContent).toContain('IDX-4412');
    expect(nativeElement.textContent).toContain('Priya Poluru');
  });

  it('counts running and failed jobs', () => {
    const api = internals(component);
    expect(api.runningCount()).toBeGreaterThan(0);
    expect(api.failedCount()).toBe(1);
  });

  it('retries a failed crawl', () => {
    const api = internals(component);
    api.retry('IDX-4394');
    expect(api.jobs().find((job: { id: string }) => job.id === 'IDX-4394').status).toBe('Running');
    expect(api.failedCount()).toBe(0);
    expect(api.notice()).toContain('IDX-4394');
  });
});
