import { TestBed } from '@angular/core/testing';
import { KnowledgePageComponent } from './knowledge-page.component';
import { internals } from '../../shared/testing/internals';
import { templateConfig } from '../../core/config/template.config';

describe('KnowledgePageComponent', () => {
  let component: KnowledgePageComponent;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KnowledgePageComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(KnowledgePageComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('creates the knowledge library', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.textContent).toContain('Knowledge');
    expect(nativeElement.textContent).toContain('Refund window');
    expect(nativeElement.textContent).toContain('Meera Poluru');
  });

  it('filters articles by topic', () => {
    const api = internals(component);
    expect(api.visible().length).toBe(templateConfig.articles.length);
    api.onTopic({ label: 'Billing' });
    expect(api.selectedTopic()).toBe('Billing');
    expect(api.visible().every((item: { topic: string }) => item.topic === 'Billing')).toBe(true);
  });
});
