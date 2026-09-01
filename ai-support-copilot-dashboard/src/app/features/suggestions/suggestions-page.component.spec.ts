import { TestBed } from '@angular/core/testing';
import { SuggestionsPageComponent } from './suggestions-page.component';
import { internals } from '../../shared/testing/internals';

describe('SuggestionsPageComponent', () => {
  let component: SuggestionsPageComponent;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuggestionsPageComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(SuggestionsPageComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('creates the suggestion map', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.textContent).toContain('Suggestions');
    expect(nativeElement.textContent).toContain('Refund window reply');
    expect(nativeElement.textContent).toContain('Cite the 30-day policy');
  });

  it('resolves the selected tree node', () => {
    const api = internals(component);
    expect(api.selectedLabel()).toBe('Billing');
    api.selectedId.set('orders');
    expect(api.selectedLabel()).toBe('Orders');
    expect(api.selectedOwner()).toBe('Rohan Poluru');
  });
});
