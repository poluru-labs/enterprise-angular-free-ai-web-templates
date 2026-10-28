import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('Natural Language Query Builder', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [App] }).compileComponents();
  });

  it('renders overview and footer links', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1')?.textContent).toContain('Overview');
    expect(el.querySelectorAll('.site-footer a').length).toBe(2);
  });
});
