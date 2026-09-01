import { TestBed } from '@angular/core/testing';
import { VersionsPageComponent } from './versions-page.component';
import { internals } from '../../shared/testing/internals';

describe('VersionsPageComponent', () => {
  let component: VersionsPageComponent;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VersionsPageComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(VersionsPageComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('creates the version history', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.textContent).toContain('Versions');
    expect(nativeElement.textContent).toContain('Support triage');
    expect(nativeElement.textContent).toContain('VR-301');
  });

  it('filters by status', () => {
    const api = internals(component);
    api.status.set('Retired');
    expect(api.filtered().every((item: { status: string }) => item.status === 'Retired')).toBe(true);
    expect(api.filtered().some((item: { id: string }) => item.id === 'VR-284')).toBe(true);
  });

  it('promotes a candidate and rolls back a live version', () => {
    const api = internals(component);
    const liveBefore = api.liveCount();
    api.promote('VR-271');
    expect(api.rows().find((item: { id: string }) => item.id === 'VR-271').status).toBe('Live');
    expect(api.liveCount()).toBe(liveBefore + 1);
    expect(api.notice()).toContain('VR-271');

    api.rollback('VR-301');
    expect(api.rows().find((item: { id: string }) => item.id === 'VR-301').status).toBe('Retired');
  });
});
