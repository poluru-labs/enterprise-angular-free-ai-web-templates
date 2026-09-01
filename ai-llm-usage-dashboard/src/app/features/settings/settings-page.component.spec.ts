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
    expect(nativeElement.textContent).toContain('Strict cost gate');
    expect(nativeElement.textContent).toContain('prod-openai');
    expect(nativeElement.textContent).toContain('Lakshmi Poluru');
  });

  it('starts with production-safe defaults', () => {
    const api = internals(component);
    expect(api.budgetAlerts()).toBe(true);
    expect(api.latencyNotifications()).toBe(true);
    expect(api.strictCostGate()).toBe(false);
    expect(api.cap()).toBe(1200);
    expect(api.alertPct()).toBe(80);
    expect(api.saved()).toBe(false);
  });

  it('lets operators change caps and save', () => {
    const api = internals(component);
    api.onCap(1500);
    api.onAlertPct(75);
    api.save();
    expect(api.cap()).toBe(1500);
    expect(api.alertPct()).toBe(75);
    expect(api.saved()).toBe(true);
  });

  it('toggles a control and clears the saved flag', () => {
    const api = internals(component);
    api.save();
    api.toggle('strictCostGate', true);
    expect(api.strictCostGate()).toBe(true);
    expect(api.saved()).toBe(false);
  });
});
