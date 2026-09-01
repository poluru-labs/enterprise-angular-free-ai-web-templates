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
    expect(nativeElement.textContent).toContain('horizon-2');
    expect(nativeElement.textContent).toContain('assist-lite');
  });

  it('starts on the top-ranked checkpoint and can select a watch model', () => {
    const api = internals(component);
    expect(api.selected().name).toBe('horizon-2');
    expect(api.track()).toBe('candidate');

    api.onSelect('assist-pro');
    expect(api.selected().name).toBe('assist-pro');
    expect(api.selected().owner).toBe('Devika Poluru');
    expect(api.track()).toBe('watch');
    expect(api.inBattery()).toBe(true);
  });

  it('retires a checkpoint out of the weekly battery', () => {
    const api = internals(component);
    api.onSelect('horizon-1.4');
    expect(api.inBattery()).toBe(false);
    expect(api.track()).toBe('candidate');
  });
});
