import { TestBed } from '@angular/core/testing';
import { AuditPageComponent } from './audit-page.component';
import { internals } from '../../shared/testing/internals';

describe('AuditPageComponent', () => {
  let component: AuditPageComponent;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditPageComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(AuditPageComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('creates the audit log', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.textContent).toContain('Audit log');
    expect(nativeElement.textContent).toContain('Approved HR-1079 appeal');
    expect(nativeElement.textContent).toContain('Labeled GOLD-08');
  });

  it('filters by reviewer and search', () => {
    const api = internals(component);
    api.actor.set('Maya Poluru');
    expect(api.filtered().every((item: { actor: string }) => item.actor === 'Maya Poluru')).toBe(true);

    api.actor.set('All');
    api.query.set('calibration');
    expect(api.filtered().some((item: { kind: string }) => item.kind === 'Calibration')).toBe(true);

    api.query.set('zzzz-not-an-event');
    expect(api.filtered()).toEqual([]);
  });

  it('counts decisions and exports the filtered log', () => {
    const api = internals(component);
    expect(api.countKind('Decision')).toBeGreaterThan(0);
    api.exportLog();
    expect(api.notice()).toContain('Exported');
    expect(api.notice()).toContain('Aisha Poluru');
  });
});
