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
    expect(nativeElement.textContent).toContain('Auto-block high-risk wires');
    expect(nativeElement.textContent).toContain('Aisha Poluru');
  });

  it('starts with production-safe defaults', () => {
    const api = internals(component);
    expect(api.wireLimit()).toBe('$10,000');
    expect(api.velocity()).toBe('10');
    expect(api.travelMinutes()).toBe('40');
    expect(api.onCallUntil()).toBe('18:00 CT');
    expect(api.saved()).toBe(false);
  });

  it('lets operators change thresholds and save', () => {
    const api = internals(component);
    api.wireLimit.set('$25,000');
    api.velocity.set('8');
    api.save();
    expect(api.wireLimit()).toBe('$25,000');
    expect(api.velocity()).toBe('8');
    expect(api.saved()).toBe(true);
  });

  it('toggles a detection control and clears the saved flag', () => {
    const api = internals(component);
    api.save();
    api.toggle('Daily digest');
    const digest = api
      .groups()
      .flatMap((group: { items: { title: string; enabled: boolean }[] }) => group.items)
      .find((item: { title: string }) => item.title === 'Daily digest');
    expect(digest.enabled).toBe(true);
    expect(api.saved()).toBe(false);
  });
});
