import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AccountsPageComponent } from './accounts-page.component';
import { internals } from '../../shared/testing/internals';

describe('AccountsPageComponent', () => {
  let component: AccountsPageComponent;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountsPageComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    const fixture = TestBed.createComponent(AccountsPageComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('creates the account catalog', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.textContent).toContain('Accounts');
    expect(nativeElement.textContent).toContain('Usage is up 18%');
  });

  it('filters by search and resets to the first page', () => {
    const api = internals(component);
    api.tags.set([]);
    api.page.set(2);
    api.onSearch('Northstar');
    expect(api.page()).toBe(1);
    expect(api.filtered().every((row: { name: string }) => row.name.includes('Northstar'))).toBe(true);
  });

  it('applies and dismisses brief tags', () => {
    const api = internals(component);
    expect(api.filtered().every((row: { brief: string }) => row.brief === 'Ready')).toBe(true);
    api.dismissTag('Ready');
    expect(api.tags()).toEqual([]);
    expect(api.filtered().length).toBeGreaterThan(8);
  });

  it('clears filters to restore the full catalog', () => {
    const api = internals(component);
    api.onSearch('zzzz-not-an-account');
    expect(api.pageRows()).toEqual([]);
    api.clearFilters();
    expect(api.search()).toBe('');
    expect(api.filtered().length).toBeGreaterThan(8);
  });

  it('stores the selected date window and opens create brief', () => {
    const spy = vi.spyOn(window, 'dispatchEvent');
    internals(component).onRange({ start: '2026-08-10', end: '2026-08-20' });
    expect(internals(component).rangeStart()).toBe('2026-08-10');
    expect(internals(component).rangeEnd()).toBe('2026-08-20');
    internals(component).openBrief();
    expect((spy.mock.calls[0][0] as Event).type).toBe('garnet:brief');
  });
});
