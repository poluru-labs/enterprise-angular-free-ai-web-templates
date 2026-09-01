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
    expect(nativeElement.textContent).toContain('Strict release gate');
    expect(nativeElement.textContent).toContain('Ananya Poluru');
  });

  it('starts with production-safe defaults', () => {
    const api = internals(component);
    expect(api.autoRegression()).toBe(true);
    expect(api.reviewerNotifications()).toBe(true);
    expect(api.strictGate()).toBe(false);
    expect(api.qualityFloor()).toBe(90);
    expect(api.safetyFloor()).toBe(91);
    expect(api.saved()).toBe(false);
  });

  it('lets operators change floors and save', () => {
    const api = internals(component);
    api.onFloor(92);
    api.onSafety(93);
    api.save();
    expect(api.qualityFloor()).toBe(92);
    expect(api.safetyFloor()).toBe(93);
    expect(api.saved()).toBe(true);
  });

  it('toggles a control and clears the saved flag', () => {
    const api = internals(component);
    api.save();
    api.toggle('strictGate', true);
    expect(api.strictGate()).toBe(true);
    expect(api.saved()).toBe(false);
  });
});
