import { TestBed } from '@angular/core/testing';
import { ReportsPageComponent } from './reports-page.component';
import { internals } from '../../shared/testing/internals';

describe('ReportsPageComponent', () => {
  let component: ReportsPageComponent;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportsPageComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(ReportsPageComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('creates the quality reports board', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.textContent).toContain('Reports');
    expect(nativeElement.textContent).toContain('Weekly CSAT');
    expect(nativeElement.textContent).toContain('Stale magic-link article');
  });

  it('filters packs by status', () => {
    const api = internals(component);
    api.filter.set('Watch');
    expect(api.visible().every((item: { status: string }) => item.status === 'Watch')).toBe(true);
    expect(api.visible().some((item: { name: string }) => item.name === 'Account resets')).toBe(true);
  });
});
