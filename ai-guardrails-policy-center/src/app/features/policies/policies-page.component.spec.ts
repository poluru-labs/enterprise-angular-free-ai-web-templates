import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PoliciesPageComponent } from './policies-page.component';
import { internals } from '../../shared/testing/internals';

describe('PoliciesPageComponent', () => {
  let component: PoliciesPageComponent;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoliciesPageComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    const fixture = TestBed.createComponent(PoliciesPageComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('lists registered policies', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.textContent).toContain('safety-core');
    expect(nativeElement.textContent).toContain('Maya Poluru');
  });

  it('filters by query', () => {
    internals(component).onSearch('support-draft');
    expect(internals(component).filtered().every((row: { id: string }) => row.id === 'support-draft')).toBe(true);
  });
});
