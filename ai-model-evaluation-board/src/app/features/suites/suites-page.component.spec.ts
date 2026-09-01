import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SuitesPageComponent } from './suites-page.component';
import { internals } from '../../shared/testing/internals';

describe('SuitesPageComponent', () => {
  let component: SuitesPageComponent;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuitesPageComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    const fixture = TestBed.createComponent(SuitesPageComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('creates the suite catalog', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.textContent).toContain('Suites');
    expect(nativeElement.textContent).toContain('Summarization Quality');
  });

  it('filters by search and resets to the first page', () => {
    const api = internals(component);
    api.page.set(2);
    api.onSearch('Safety');
    expect(api.page()).toBe(1);
    expect(api.filtered().every((row: { name: string }) => row.name.includes('Safety'))).toBe(true);
  });

  it('filters by status', () => {
    const api = internals(component);
    api.onStatus('Blocked');
    expect(api.filtered().every((row: { status: string }) => row.status === 'Blocked')).toBe(true);
  });

  it('clears filters to restore the full catalog', () => {
    const api = internals(component);
    api.onSearch('zzzz-not-a-suite');
    expect(api.pageRows()).toEqual([]);
    api.clearFilters();
    expect(api.search()).toBe('');
    expect(api.filtered().length).toBeGreaterThan(5);
  });

  it('labels a suite against its baseline', () => {
    expect(internals(component).deltaLabel('96.2%', '94.0%')).toBe('+2.2 vs baseline');
    expect(internals(component).deltaLabel('88.4%', '91.0%')).toBe('-2.6 vs baseline');
  });
});
