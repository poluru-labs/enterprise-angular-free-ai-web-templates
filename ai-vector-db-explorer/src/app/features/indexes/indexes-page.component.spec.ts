import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { IndexesPageComponent } from './indexes-page.component';
import { internals } from '../../shared/testing/internals';

describe('IndexesPageComponent', () => {
  let component: IndexesPageComponent;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndexesPageComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    const fixture = TestBed.createComponent(IndexesPageComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('lists registered indexes', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.textContent).toContain('docs-prod');
    expect(nativeElement.textContent).toContain('Maya Poluru');
  });

  it('filters by query', () => {
    internals(component).onSearch('support-faq');
    expect(internals(component).filtered().every((row: { id: string }) => row.id === 'support-faq')).toBe(true);
  });
});
