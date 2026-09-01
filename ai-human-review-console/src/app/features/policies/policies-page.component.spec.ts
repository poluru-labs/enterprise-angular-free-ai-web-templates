import { TestBed } from '@angular/core/testing';
import { PoliciesPageComponent } from './policies-page.component';
import { internals } from '../../shared/testing/internals';

describe('PoliciesPageComponent', () => {
  let component: PoliciesPageComponent;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoliciesPageComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(PoliciesPageComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('creates the policy board', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.textContent).toContain('Policies');
    expect(nativeElement.textContent).toContain('Self-harm dual review');
    expect(nativeElement.textContent).toContain('Prompt injection screen');
  });

  it('filters by live / tuning / shadow', () => {
    const api = internals(component);
    api.filter.set('Shadow');
    expect(api.filtered().every((item: { status: string }) => item.status === 'Shadow')).toBe(true);
    expect(api.filtered().some((item: { name: string }) => item.name === 'Financial advice block')).toBe(true);
  });

  it('promotes a pack from shadow to live', () => {
    const api = internals(component);
    api.setStatus('Financial advice block', 'Live', 'ok');
    expect(api.rows().find((item: { name: string }) => item.name === 'Financial advice block').status).toBe('Live');
    expect(api.notice()).toContain('Live');
  });

  it('drafts a shadow policy from the form', () => {
    const api = internals(component);
    const before = api.rows().length;
    api.draftName.set('Age-gate dual review');
    api.draft();
    expect(api.rows().length).toBe(before + 1);
    expect(api.rows()[0].name).toBe('Age-gate dual review');
    expect(api.rows()[0].status).toBe('Shadow');
    expect(api.showForm()).toBe(false);
  });

  it('sums policy hits for the headline metric', () => {
    expect(internals(component).hitsToday()).toBeGreaterThan(200);
  });
});
