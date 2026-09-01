import { TestBed } from '@angular/core/testing';
import { DatasetsPageComponent } from './datasets-page.component';
import { internals } from '../../shared/testing/internals';

describe('DatasetsPageComponent', () => {
  let component: DatasetsPageComponent;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatasetsPageComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(DatasetsPageComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('creates the dataset catalog', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.textContent).toContain('Datasets');
    expect(nativeElement.textContent).toContain('Support Transcripts v4');
    expect(nativeElement.textContent).toContain('ds-red-3.8');
  });

  it('filters by access status', () => {
    const api = internals(component);
    api.status.set('Restricted');
    expect(api.filtered()).toHaveLength(1);
    expect(api.filtered()[0].title).toBe('Red Team Set');

    api.status.set('Draft');
    expect(api.filtered()[0].title).toBe('Reasoning Draft Pack');
  });
});
