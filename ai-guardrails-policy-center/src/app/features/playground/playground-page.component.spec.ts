import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PlaygroundPageComponent } from './playground-page.component';
import { internals } from '../../shared/testing/internals';

describe('PlaygroundPageComponent', () => {
  let component: PlaygroundPageComponent;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaygroundPageComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    const fixture = TestBed.createComponent(PlaygroundPageComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('renders the policy playground', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.textContent).toContain('Test a prompt');
    expect(nativeElement.textContent).toContain('Maya Poluru');
  });

  it('records a run notice', () => {
    internals(component).runTest();
    expect(internals(component).notice()).toContain('Safety test');
  });
});
