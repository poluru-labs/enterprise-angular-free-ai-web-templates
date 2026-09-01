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
    expect(nativeElement.textContent).toContain('Require review before publish');
    expect(nativeElement.textContent).toContain('Priya Poluru');
  });

  it('starts with production-safe defaults', () => {
    const api = internals(component);
    expect(api.reviewGate()).toBe(true);
    expect(api.ownerNotifications()).toBe(true);
    expect(api.autoPromote()).toBe(false);
    expect(api.successFloor()).toBe(88);
    expect(api.reviewSla()).toBe(24);
    expect(api.saved()).toBe(false);
    expect(api.floorLabel()).toBe('Library meets floor');
  });

  it('lets operators change floors and save', () => {
    const api = internals(component);
    api.onFloor(96);
    api.onSla(12);
    expect(api.floorLabel()).toBe('Below floor');
    api.save();
    expect(api.successFloor()).toBe(96);
    expect(api.reviewSla()).toBe(12);
    expect(api.saved()).toBe(true);
  });

  it('toggles a control and clears the saved flag', () => {
    const api = internals(component);
    api.save();
    api.toggle('autoPromote', true);
    expect(api.autoPromote()).toBe(true);
    expect(api.saved()).toBe(false);
  });
});
