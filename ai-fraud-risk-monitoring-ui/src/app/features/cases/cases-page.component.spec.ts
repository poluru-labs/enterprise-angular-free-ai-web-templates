import { TestBed } from '@angular/core/testing';
import { CasesPageComponent } from './cases-page.component';
import { internals } from '../../shared/testing/internals';

describe('CasesPageComponent', () => {
  let component: CasesPageComponent;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CasesPageComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(CasesPageComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('creates the case ledger', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.textContent).toContain('Cases');
    expect(nativeElement.textContent).toContain('FR-8821');
  });

  it('filters by status and search', () => {
    const api = internals(component);
    api.filter.set('Open');
    expect(api.filtered().every((item: { status: string }) => item.status === 'Open')).toBe(true);

    api.filter.set('All');
    api.query.set('Elena');
    expect(api.filtered()).toEqual([expect.objectContaining({ id: 'FR-8794' })]);
  });

  it('blocks, clears, assigns, and escalates cases', () => {
    const api = internals(component);
    api.decide('FR-8814', 'Blocked', 'ok');
    expect(api.rows().find((item: { id: string }) => item.id === 'FR-8814').status).toBe('Blocked');

    api.decide('FR-8809', 'Cleared', 'ok');
    expect(api.rows().find((item: { id: string }) => item.id === 'FR-8809').status).toBe('Cleared');

    api.assign('FR-8818');
    expect(api.rows().find((item: { id: string }) => item.id === 'FR-8818').owner).toBe('Aisha Poluru');

    api.escalate('FR-8776');
    const escalated = api.rows().find((item: { id: string }) => item.id === 'FR-8776');
    expect(escalated.status).toBe('Review');
    expect(escalated.owner).toBe('Aisha Poluru');
  });

  it('persists a note on the decision', () => {
    const api = internals(component);
    api.draftNote.set('Customer confirmed no travel.');
    api.decide('FR-8821', 'Blocked', 'ok');
    expect(api.rows().find((item: { id: string }) => item.id === 'FR-8821').note).toBe(
      'Customer confirmed no travel.'
    );
    expect(api.draftNote()).toBe('');
  });
});
