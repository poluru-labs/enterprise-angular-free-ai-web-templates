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
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the dashboard heading', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Good morning, Nikhil.');
  });

  it('should filter documents by type tab', () => {
    const fixture = TestBed.createComponent(App);
    fixture.componentInstance.setFilter('Invoices');
    fixture.detectChanges();
    expect(fixture.componentInstance.filteredDocuments().length).toBe(1);
    expect(fixture.componentInstance.filteredDocuments()[0].type).toBe('Invoice');
  });

  it('should render footer links', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const footer = compiled.querySelector('footer');
    expect(footer?.textContent).toContain('Subrahmanyam Poluru');
    expect(footer?.textContent).toContain('@poluru-labs/enterprise-design-system-angular');
  });
});
