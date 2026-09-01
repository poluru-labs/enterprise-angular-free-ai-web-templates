import { TestBed } from '@angular/core/testing';
import { MeetingsPageComponent } from './meetings-page.component';
import { internals } from '../../shared/testing/internals';

describe('MeetingsPageComponent', () => {
  let component: MeetingsPageComponent;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetingsPageComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(MeetingsPageComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('creates the meeting prep board', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.textContent).toContain('Meetings');
    expect(nativeElement.textContent).toContain('Northstar Analytics');
    expect(nativeElement.textContent).toContain('QBR deck');
  });

  it('filters packs by meeting type', () => {
    const api = internals(component);
    expect(api.filtered().length).toBeGreaterThan(4);
    api.type.set('QBR');
    expect(api.filtered().every((item: { type: string }) => item.type === 'QBR')).toBe(true);
  });

  it('opens a brief pack', () => {
    const spy = vi.spyOn(window, 'dispatchEvent');
    internals(component).openBrief();
    expect((spy.mock.calls[0][0] as Event).type).toBe('garnet:brief');
  });
});
