import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CalibrationPageComponent } from './calibration-page.component';
import { internals } from '../../shared/testing/internals';

describe('CalibrationPageComponent', () => {
  let component: CalibrationPageComponent;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalibrationPageComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    const fixture = TestBed.createComponent(CalibrationPageComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('creates the calibration desk', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.textContent).toContain('Calibration');
    expect(nativeElement.textContent).toContain('August 2026');
    expect(nativeElement.textContent).toContain('GOLD-12');
  });

  it('filters cycles by status', () => {
    const api = internals(component);
    api.filter.set('Draft');
    expect(api.filtered().every((item: { status: string }) => item.status === 'Draft')).toBe(true);
  });

  it('publishes and archives a cycle', () => {
    const api = internals(component);
    api.publish('CAL-09');
    expect(api.rows().find((item: { id: string }) => item.id === 'CAL-09').status).toBe('Live');

    api.archive('CAL-08');
    expect(api.rows().find((item: { id: string }) => item.id === 'CAL-08').status).toBe('Archived');
  });

  it('starts an on-demand cycle and marks gold items', () => {
    const api = internals(component);
    const before = api.rows().length;
    api.startCycle();
    expect(api.rows().length).toBe(before + 1);
    expect(api.rows()[0].owner).toBe('Aisha Poluru');
    expect(api.rows()[0].status).toBe('Draft');

    api.markGold('GOLD-12');
    expect(api.goldRows().find((item: { id: string }) => item.id === 'GOLD-12').gold).toBe(true);
  });
});
