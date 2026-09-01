import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SearchPageComponent } from './search-page.component';
import { internals } from '../../shared/testing/internals';

describe('SearchPageComponent', () => {
  let component: SearchPageComponent;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchPageComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    const fixture = TestBed.createComponent(SearchPageComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('creates workspace search', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.textContent).toContain('Search');
  });

  it('shows a default catalog slice when the query is empty', () => {
    expect(internals(component).results()).toHaveLength(10);
  });

  it('finds queue items, policies, gold labels, and reports', () => {
    const api = internals(component);
    api.query.set('HR-1104');
    expect(api.results().some((item: { kind: string }) => item.kind === 'Queue')).toBe(true);

    api.query.set('Self-harm dual review');
    expect(api.results().some((item: { kind: string }) => item.kind === 'Policy')).toBe(true);

    api.query.set('GOLD-12');
    expect(api.results()).toEqual([expect.objectContaining({ kind: 'Gold', title: expect.stringContaining('GOLD-12') })]);

    api.query.set('Daily review digest');
    expect(api.results().some((item: { kind: string }) => item.kind === 'Report')).toBe(true);
  });

  it('returns no matches for an unknown term', () => {
    internals(component).query.set('zzzz-not-a-record');
    expect(internals(component).results()).toEqual([]);
  });
});
