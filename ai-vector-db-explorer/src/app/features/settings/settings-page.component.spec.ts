import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SettingsPageComponent } from './settings-page.component';
import { internals } from '../../shared/testing/internals';

describe('SettingsPageComponent', () => {
  let component: SettingsPageComponent;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsPageComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    const fixture = TestBed.createComponent(SettingsPageComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('renders workspace settings', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.textContent).toContain('Maya Poluru');
    expect(nativeElement.textContent).toContain('Auto-rebuild HNSW');
  });

  it('saves after a toggle', () => {
    internals(component).toggle('autoRebuild', false);
    expect(internals(component).autoRebuild()).toBe(false);
    internals(component).save();
    expect(internals(component).saved()).toBe(true);
  });
});
