import { TestBed } from '@angular/core/testing';
import { ExperimentsPageComponent } from './experiments-page.component';
import { internals } from '../../shared/testing/internals';

describe('ExperimentsPageComponent', () => {
  let component: ExperimentsPageComponent;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperimentsPageComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(ExperimentsPageComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('creates the experiment board', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.textContent).toContain('Experiments');
    expect(nativeElement.textContent).toContain('Email writer tone');
    expect(nativeElement.textContent).toContain('EX-41');
  });

  it('filters by status', () => {
    const api = internals(component);
    api.status.set('Paused');
    expect(api.filtered().every((item: { status: string }) => item.status === 'Paused')).toBe(true);
    expect(api.filtered().some((item: { id: string }) => item.id === 'EX-38')).toBe(true);
  });

  it('declares a winner and counts running experiments', () => {
    const api = internals(component);
    expect(api.runningCount()).toBe(2);
    api.declareWinner('EX-41');
    expect(api.rows().find((item: { id: string }) => item.id === 'EX-41').status).toBe('Winner');
    expect(api.runningCount()).toBe(1);
    expect(api.notice()).toContain('EX-41');
  });
});
