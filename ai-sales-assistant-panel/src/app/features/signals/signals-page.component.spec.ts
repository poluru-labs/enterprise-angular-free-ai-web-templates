import { TestBed } from '@angular/core/testing';
import { SignalsPageComponent } from './signals-page.component';
import { internals } from '../../shared/testing/internals';

describe('SignalsPageComponent', () => {
  let component: SignalsPageComponent;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignalsPageComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(SignalsPageComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('creates the signal map', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.textContent).toContain('Signals');
    expect(nativeElement.textContent).toContain('Brightside Health');
    expect(nativeElement.textContent).toContain('Three new stakeholders');
  });

  it('resolves the selected tree node', () => {
    const api = internals(component);
    expect(api.selectedLabel()).toBe('Expansion');
    api.selectedId.set('renewal');
    expect(api.selectedLabel()).toBe('Renewal');
    expect(api.selectedOwner()).toBe('Kavya Poluru');
  });
});
