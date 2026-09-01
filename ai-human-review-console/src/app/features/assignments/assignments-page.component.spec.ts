import { TestBed } from '@angular/core/testing';
import { AssignmentsPageComponent } from './assignments-page.component';
import { internals } from '../../shared/testing/internals';

describe('AssignmentsPageComponent', () => {
  let component: AssignmentsPageComponent;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignmentsPageComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(AssignmentsPageComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('creates the assignment board', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.textContent).toContain('Assignments');
    expect(nativeElement.textContent).toContain('HR-1104');
    expect(nativeElement.textContent).toContain('Meera Poluru');
  });

  it('filters by status and search', () => {
    const api = internals(component);
    api.filter.set('Waiting');
    expect(api.filtered().every((item: { status: string }) => item.status === 'Waiting')).toBe(true);

    api.filter.set('All');
    api.query.set('Elena');
    expect(api.filtered()).toEqual([expect.objectContaining({ id: 'HR-1079' })]);

    api.query.set('zzzz-not-an-item');
    expect(api.filtered()).toEqual([]);
  });

  it('takes, reassigns, and releases work', () => {
    const api = internals(component);
    api.take('HR-1104');
    expect(api.rows().find((item: { id: string }) => item.id === 'HR-1104').owner).toBe('Aisha Poluru');
    expect(api.yours()).toBeGreaterThan(0);

    api.reassign('HR-1104');
    expect(api.rows().find((item: { id: string }) => item.id === 'HR-1104').owner).toBe('Maya Poluru');

    api.release('HR-1104');
    expect(api.rows().find((item: { id: string }) => item.id === 'HR-1104').status).toBe('Waiting');
  });

  it('resolves an item with an optional note', () => {
    const api = internals(component);
    api.draftNote.set('Held for policy rewrite.');
    api.resolve('HR-1098');
    const row = api.rows().find((item: { id: string }) => item.id === 'HR-1098');
    expect(row.status).toBe('Resolved');
    expect(row.note).toBe('Held for policy rewrite.');
    expect(api.draftNote()).toBe('');
    expect(api.notice()).toContain('note');
  });
});
