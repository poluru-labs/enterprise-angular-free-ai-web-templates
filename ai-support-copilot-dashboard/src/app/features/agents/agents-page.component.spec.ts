import { TestBed } from '@angular/core/testing';
import { AgentsPageComponent } from './agents-page.component';
import { internals } from '../../shared/testing/internals';

describe('AgentsPageComponent', () => {
  let component: AgentsPageComponent;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentsPageComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(AgentsPageComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('creates the agent roster', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.textContent).toContain('Agents');
    expect(nativeElement.textContent).toContain('Kavya Poluru');
    expect(nativeElement.textContent).toContain('Night coverage');
  });

  it('filters agents by shift', () => {
    const api = internals(component);
    api.shift.set('Night');
    expect(api.visible().every((item: { shift: string }) => item.shift === 'Night')).toBe(true);
    expect(api.visible().some((item: { name: string }) => item.name === 'Priya Poluru')).toBe(true);
  });
});
