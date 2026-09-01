import { TestBed } from '@angular/core/testing';
import { RulesPageComponent } from './rules-page.component';
import { internals } from '../../shared/testing/internals';

describe('RulesPageComponent', () => {
  let component: RulesPageComponent;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RulesPageComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(RulesPageComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('creates the detection packs page', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.textContent).toContain('Rules');
    expect(nativeElement.textContent).toContain('International wire > $10k');
  });

  it('filters by status and owner search', () => {
    const api = internals(component);
    api.filter.set('Shadow');
    expect(api.filtered().every((item: { status: string }) => item.status === 'Shadow')).toBe(true);

    api.filter.set('All');
    api.query.set('jordan');
    expect(api.filtered().every((item: { owner: string }) => item.owner.includes('Jordan'))).toBe(true);
  });

  it('promotes, pauses, and shadows a pack', () => {
    const api = internals(component);
    api.setStatus('Chargeback cluster', 'Live', 'ok');
    expect(api.rows().find((item: { name: string }) => item.name === 'Chargeback cluster').status).toBe('Live');

    api.setStatus('Impossible travel', 'Paused', 'rose');
    expect(api.rows().find((item: { name: string }) => item.name === 'Impossible travel').status).toBe('Paused');

    api.setStatus('New device + payroll', 'Shadow', 'info');
    expect(api.rows().find((item: { name: string }) => item.name === 'New device + payroll').status).toBe('Shadow');
  });

  it('saves a drafted shadow rule', () => {
    const api = internals(component);
    const before = api.rows().length;
    api.draftName.set('Night ACH burst');
    api.draftCondition.set('3 ACH credits > $8k in 20 minutes');
    api.draft();
    expect(api.rows().length).toBe(before + 1);
    expect(api.rows()[0]).toEqual(
      expect.objectContaining({ name: 'Night ACH burst', status: 'Shadow', owner: 'Aisha Poluru' })
    );
    expect(api.showForm()).toBe(false);
  });

  it('counts live packs and hits', () => {
    expect(internals(component).count('Live')).toBeGreaterThan(0);
    expect(internals(component).hitsToday()).toBeGreaterThan(100);
  });
});
