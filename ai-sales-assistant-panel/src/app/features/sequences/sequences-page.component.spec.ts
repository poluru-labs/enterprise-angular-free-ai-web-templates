import { TestBed } from '@angular/core/testing';
import { SequencesPageComponent } from './sequences-page.component';

describe('SequencesPageComponent', () => {
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SequencesPageComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(SequencesPageComponent);
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('creates the sequence board', () => {
    expect(nativeElement.textContent).toContain('Sequences');
    expect(nativeElement.textContent).toContain('Clinic expansion');
    expect(nativeElement.textContent).toContain('Alpha outbound');
    expect(nativeElement.textContent).toContain('Nikhil Poluru');
  });
});
