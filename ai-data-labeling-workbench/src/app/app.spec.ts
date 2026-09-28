import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the workbench title and author links', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('h1')?.textContent).toContain('Data Labeling Workbench');
    const links = [...element.querySelectorAll('footer a')].map((link) => link.getAttribute('href'));
    expect(links).toContain('https://polurus.com');
    expect(links).toContain('https://www.npmjs.com/package/@poluru-labs/enterprise-design-system-angular');
  });
});
