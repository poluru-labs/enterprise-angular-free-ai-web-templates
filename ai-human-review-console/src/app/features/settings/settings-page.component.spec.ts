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
    expect(nativeElement.textContent).toContain('Auto-assign Safety to Aisha Poluru');
    expect(nativeElement.textContent).toContain('Elena Poluru');
  });

  it('starts with production-safe defaults', () => {
    const api = internals(component);
    expect(api.highMinutes()).toBe('30');
    expect(api.dualMinutes()).toBe('15');
    expect(api.idleHours()).toBe('2');
    expect(api.onCallUntil()).toBe('18:00 CT');
    expect(api.saved()).toBe(false);
  });

  it('lets operators change SLA values and save', () => {
    const api = internals(component);
    api.highMinutes.set('20');
    api.dualMinutes.set('10');
    api.save();
    expect(api.highMinutes()).toBe('20');
    expect(api.dualMinutes()).toBe('10');
    expect(api.saved()).toBe(true);
  });

  it('toggles a control and clears the saved flag', () => {
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
