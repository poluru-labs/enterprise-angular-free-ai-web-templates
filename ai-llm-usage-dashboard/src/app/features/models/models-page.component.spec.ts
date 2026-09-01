import { TestBed } from '@angular/core/testing';
import { ModelsPageComponent } from './models-page.component';
import { internals } from '../../shared/testing/internals';

describe('ModelsPageComponent', () => {
  let component: ModelsPageComponent;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModelsPageComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(ModelsPageComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('creates the model directory', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.textContent).toContain('Models');
    expect(nativeElement.textContent).toContain('gpt-4.1');
    expect(nativeElement.textContent).toContain('claude-haiku');
  });

  it('starts on OpenAI and can select a restricted model', () => {
    const api = internals(component);
    expect(api.selectedLabel()).toBe('OpenAI');
    expect(api.access()).toBe('open');

    api.onSelect('llama-3-70b');
    expect(api.selectedLabel()).toBe('llama-3-70b');
    expect(api.selectedOwner()).toBe('Meera Poluru');
    expect(api.access()).toBe('restricted');
    expect(api.enabled()).toBe(false);
  });

  it('groups providers in the catalog tree', () => {
    const openai = internals(component).tree[0].children.find((node: { id: string }) => node.id === 'openai');
    expect(openai.children.some((node: { id: string }) => node.id === 'gpt-4.1-mini')).toBe(true);
  });
});
