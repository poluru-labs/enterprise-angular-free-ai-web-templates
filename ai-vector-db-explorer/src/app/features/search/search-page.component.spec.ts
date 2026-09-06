import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SearchPageComponent } from './search-page.component';
import { internals } from '../../shared/testing/internals';

describe('SearchPageComponent', () => {
  let component: SearchPageComponent;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchPageComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    const fixture = TestBed.createComponent(SearchPageComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('renders the similarity playground', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.textContent).toContain('Similarity search');
    expect(nativeElement.textContent).toContain('Maya Poluru');
  });

  it('records a run notice', () => {
    internals(component).runQuery();
    expect(internals(component).notice()).toContain('Cosine search');
  });
});
