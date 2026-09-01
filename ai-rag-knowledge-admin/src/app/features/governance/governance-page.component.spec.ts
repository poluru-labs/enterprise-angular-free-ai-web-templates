import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { GovernancePageComponent } from './governance-page.component';
import { internals } from '../../shared/testing/internals';

describe('GovernancePageComponent', () => {
  let component: GovernancePageComponent;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovernancePageComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    const fixture = TestBed.createComponent(GovernancePageComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('creates the governance inbox', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.textContent).toContain('Governance');
    expect(nativeElement.textContent).toContain('Legal contracts');
    expect(nativeElement.textContent).toContain('ACL-412');
  });

  it('filters by status and severity', () => {
    const api = internals(component);
    api.filter.set('Held');
    expect(api.filtered().every((item: { status: string }) => item.status === 'Held')).toBe(true);

    api.filter.set('Critical');
    expect(api.filtered().every((item: { severity: string }) => item.severity === 'Critical')).toBe(true);
    expect(api.filtered().some((item: { id: string }) => item.id === 'ACL-412')).toBe(true);
  });

  it('approves and holds a review', () => {
    const api = internals(component);
    api.approve('ACL-412');
    expect(api.rows().find((item: { id: string }) => item.id === 'ACL-412').status).toBe('Approved');
    expect(api.notice()).toContain('ACL-412');

    api.hold('ACL-388');
    expect(api.rows().find((item: { id: string }) => item.id === 'ACL-388').status).toBe('Held');
  });

  it('counts open and critical reviews', () => {
    const api = internals(component);
    expect(api.openCount()).toBeGreaterThan(0);
    expect(api.criticalCount()).toBe(1);
  });
});
