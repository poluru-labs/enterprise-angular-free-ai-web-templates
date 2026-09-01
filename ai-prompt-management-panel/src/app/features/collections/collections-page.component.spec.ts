import { TestBed } from '@angular/core/testing';
import { CollectionsPageComponent } from './collections-page.component';
import { internals } from '../../shared/testing/internals';

describe('CollectionsPageComponent', () => {
  let component: CollectionsPageComponent;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionsPageComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(CollectionsPageComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('creates the collection directory', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.textContent).toContain('Collections');
    expect(nativeElement.textContent).toContain('Customer experience');
    expect(nativeElement.textContent).toContain('Legal');
  });

  it('filters pinned collections', () => {
    const api = internals(component);
    api.filter.set('Pinned');
    expect(api.filtered().every((item: { pinned: boolean }) => item.pinned)).toBe(true);
    expect(api.filtered().some((item: { name: string }) => item.name === 'Legal')).toBe(true);
  });

  it('pins and unpins a collection', () => {
    const api = internals(component);
    const before = api.pinnedCount();
    api.togglePin('Revenue');
    expect(api.rows().find((item: { name: string }) => item.name === 'Revenue').pinned).toBe(true);
    expect(api.pinnedCount()).toBe(before + 1);
    expect(api.notice()).toContain('Revenue');

    api.togglePin('Revenue');
    expect(api.rows().find((item: { name: string }) => item.name === 'Revenue').pinned).toBe(false);
  });
});
