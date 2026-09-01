import { TestBed } from '@angular/core/testing';
import { WatchlistPageComponent } from './watchlist-page.component';
import { internals } from '../../shared/testing/internals';

describe('WatchlistPageComponent', () => {
  let component: WatchlistPageComponent;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WatchlistPageComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(WatchlistPageComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('creates the entity watchlist', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.textContent).toContain('Watchlist');
    expect(nativeElement.textContent).toContain('BIN 414720');
  });

  it('filters by risk and search', () => {
    const api = internals(component);
    api.filter.set('High');
    expect(api.filtered().every((item: { risk: string }) => item.risk === 'High')).toBe(true);

    api.filter.set('All');
    api.query.set('nimbus');
    expect(api.filtered()).toEqual([expect.objectContaining({ label: 'Merchant Nimbus' })]);
  });

  it('freezes, watches, and removes entities', () => {
    const api = internals(component);
    api.setStatus('WL-09', 'Frozen');
    expect(api.rows().find((item: { id: string }) => item.id === 'WL-09').status).toBe('Frozen');

    api.setStatus('WL-12', 'Watch');
    expect(api.rows().find((item: { id: string }) => item.id === 'WL-12').status).toBe('Watch');

    const before = api.rows().length;
    api.remove('WL-04');
    expect(api.rows().length).toBe(before - 1);
    expect(api.rows().some((item: { id: string }) => item.id === 'WL-04')).toBe(false);
  });

  it('adds a frozen entity from the draft form', () => {
    const api = internals(component);
    api.draftLabel.set('BIN 521890');
    api.draftDetail.set('New testing BIN from Leila Poluru');
    api.addEntity();
    expect(api.rows()[0]).toEqual(
      expect.objectContaining({ label: 'BIN 521890', status: 'Frozen', risk: 'High' })
    );
    expect(api.showForm()).toBe(false);
  });
});
