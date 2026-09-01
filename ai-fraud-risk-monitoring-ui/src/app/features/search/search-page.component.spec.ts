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

  it('finds alerts, cases, rules, and watchlist entities', () => {
    const api = internals(component);
    api.query.set('velocity spike');
    expect(api.results().some((item: { kind: string }) => item.kind === 'Alert')).toBe(true);

    api.query.set('FR-8821');
    expect(api.results()).toEqual([expect.objectContaining({ kind: 'Case', title: expect.stringContaining('FR-8821') })]);

    api.query.set('impossible travel');
    expect(api.results().some((item: { kind: string }) => item.kind === 'Rule')).toBe(true);

    api.query.set('WL-12');
    expect(api.results()).toEqual([expect.objectContaining({ kind: 'Watchlist', title: 'BIN 414720' })]);
  });

  it('returns no matches for an unknown term', () => {
    internals(component).query.set('zzzz-not-a-record');
    expect(internals(component).results()).toEqual([]);
  });
});
