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
    expect(nativeElement.textContent).toContain('Auto-generate briefs');
    expect(nativeElement.textContent).toContain('Ananya Poluru');
  });

  it('starts with production-safe defaults', () => {
    const api = internals(component);
    expect(api.autoBriefs()).toBe(true);
    expect(api.stallAlerts()).toBe(true);
    expect(api.meetingPrep()).toBe(true);
    expect(api.volume()).toBe(40);
    expect(api.stallAfter()).toBe(2);
    expect(api.saved()).toBe(false);
  });

  it('lets operators change coaching and save', () => {
    const api = internals(component);
    api.onVolume(55);
    api.onStallAfter(3);
    api.save();
    expect(api.volume()).toBe(55);
    expect(api.stallAfter()).toBe(3);
    expect(api.saved()).toBe(true);
  });

  it('toggles a control and clears the saved flag', () => {
    const api = internals(component);
    api.save();
    api.toggle('autoBriefs', false);
    expect(api.autoBriefs()).toBe(false);
    expect(api.saved()).toBe(false);
  });
});
