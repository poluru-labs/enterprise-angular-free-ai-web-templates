import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SourcesPageComponent } from './sources-page.component';
import { internals } from '../../shared/testing/internals';

describe('SourcesPageComponent', () => {
  let component: SourcesPageComponent;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourcesPageComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    const fixture = TestBed.createComponent(SourcesPageComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('creates the source catalog', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.textContent).toContain('Sources');
    expect(nativeElement.textContent).toContain('Canonical product how-tos');
  });

  it('filters by search and resets to the first page', () => {
    const api = internals(component);
    api.tags.set([]);
    api.page.set(2);
    api.onSearch('Legal');
    expect(api.page()).toBe(1);
    expect(api.filtered().every((row: { name: string }) => row.name.includes('Legal'))).toBe(true);
  });

  it('applies and dismisses status tags', () => {
    const api = internals(component);
    expect(api.filtered().every((row: { status: string }) => row.status === 'Healthy')).toBe(true);
    api.dismissTag('Healthy');
    expect(api.tags()).toEqual([]);
    expect(api.filtered().length).toBeGreaterThan(8);
  });

  it('clears filters to restore the full catalog', () => {
    const api = internals(component);
    api.onSearch('zzzz-not-a-source');
    expect(api.pageRows()).toEqual([]);
    api.clearFilters();
    expect(api.search()).toBe('');
    expect(api.filtered().length).toBeGreaterThan(8);
  });

  it('stores the selected date window and opens add source', () => {
    const spy = vi.spyOn(window, 'dispatchEvent');
    internals(component).onRange({ start: '2026-08-10', end: '2026-08-20' });
    expect(internals(component).rangeStart()).toBe('2026-08-10');
    expect(internals(component).rangeEnd()).toBe('2026-08-20');
    internals(component).openAdd();
    expect((spy.mock.calls[0][0] as Event).type).toBe('vault:add-source');
  });
});
