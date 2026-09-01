import { TestBed } from '@angular/core/testing';
import { SettingsPageComponent } from './settings-page.component';
import { internals } from '../../shared/testing/internals';

describe('SettingsPageComponent', () => {
  let component: SettingsPageComponent;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsPageComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(SettingsPageComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('creates workspace settings', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.textContent).toContain('Settings');
    expect(nativeElement.textContent).toContain('Hybrid search');
    expect(nativeElement.textContent).toContain('Ananya Poluru');
  });

  it('starts with production-safe defaults', () => {
    const api = internals(component);
    expect(api.hybrid()).toBe(true);
    expect(api.aclFreeze()).toBe(true);
    expect(api.piiRedaction()).toBe(true);
    expect(api.chunkSize()).toBe(512);
    expect(api.overlap()).toBe(64);
    expect(api.saved()).toBe(false);
  });

  it('lets operators change chunking and save', () => {
    const api = internals(component);
    api.onChunkSize(768);
    api.onOverlap(96);
    api.save();
    expect(api.chunkSize()).toBe(768);
    expect(api.overlap()).toBe(96);
    expect(api.saved()).toBe(true);
  });

  it('toggles a control and clears the saved flag', () => {
    const api = internals(component);
    api.save();
    api.toggle('hybrid', false);
    expect(api.hybrid()).toBe(false);
    expect(api.saved()).toBe(false);
  });
});
