import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { UsagePageComponent } from './usage-page.component';
import { internals } from '../../shared/testing/internals';

describe('UsagePageComponent', () => {
  let component: UsagePageComponent;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsagePageComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    const fixture = TestBed.createComponent(UsagePageComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('creates the usage catalog', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.textContent).toContain('Usage');
    expect(nativeElement.textContent).toContain('gpt-4.1');
  });

  it('filters by search and resets to the first page', () => {
    const api = internals(component);
    api.page.set(2);
    api.onSearch('gemini');
    expect(api.page()).toBe(1);
    expect(api.filtered().every((row: { model: string }) => row.model.includes('gemini'))).toBe(true);
  });

  it('applies and dismisses workspace tags', () => {
    const api = internals(component);
    expect(api.filtered().some((row: { workspace: string }) => row.workspace === 'Production')).toBe(true);
    api.dismissTag('Production');
    expect(api.tags()).toEqual(['Healthy']);
  });

  it('clears filters to restore the full catalog', () => {
    const api = internals(component);
    api.onSearch('zzzz-not-a-model');
    expect(api.pageRows()).toEqual([]);
    api.clearFilters();
    expect(api.search()).toBe('');
    expect(api.filtered().length).toBeGreaterThan(8);
  });

  it('stores the selected date window', () => {
    internals(component).onRange({ start: '2026-08-10', end: '2026-08-20' });
    expect(internals(component).rangeStart()).toBe('2026-08-10');
    expect(internals(component).rangeEnd()).toBe('2026-08-20');
  });
});
