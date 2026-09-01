import { TestBed } from '@angular/core/testing';
import { ScorecardsPageComponent } from './scorecards-page.component';
import { internals } from '../../shared/testing/internals';

describe('ScorecardsPageComponent', () => {
  let component: ScorecardsPageComponent;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScorecardsPageComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(ScorecardsPageComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('creates the scorecard board', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.textContent).toContain('Scorecards');
    expect(nativeElement.textContent).toContain('EV-441');
    expect(nativeElement.textContent).toContain('Ananya Poluru');
  });

  it('signs off a drafted scorecard', () => {
    const api = internals(component);
    expect(api.signedCount()).toBe(1);
    api.signOff('EV-441');
    expect(api.rows().find((item: { id: string }) => item.id === 'EV-441').status).toBe('Signed off');
    expect(api.signedCount()).toBe(2);
    expect(api.notice()).toContain('EV-441');
  });

  it('blocks a scorecard until regressions clear', () => {
    const api = internals(component);
    api.block('EV-438');
    expect(api.rows().find((item: { id: string }) => item.id === 'EV-438').status).toBe('Blocked');
  });
});
