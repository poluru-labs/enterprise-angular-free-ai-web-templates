import { TestBed } from '@angular/core/testing';
import { BudgetsPageComponent } from './budgets-page.component';
import { templateConfig } from '../../core/config/template.config';

describe('BudgetsPageComponent', () => {
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetsPageComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(BudgetsPageComponent);
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('creates the budget cycle', () => {
    expect(nativeElement.textContent).toContain('Budgets');
    expect(nativeElement.textContent).toContain('Production');
    expect(nativeElement.textContent).toContain('Lakshmi Poluru');
    expect(nativeElement.textContent).toContain(templateConfig.workspaces[4].name);
  });

  it('lists weekly checks including weekend jobs', () => {
    expect(nativeElement.textContent).toContain('Knowledge reindex window');
    expect(nativeElement.textContent).toContain('GTM weekend catch-up');
  });
});
