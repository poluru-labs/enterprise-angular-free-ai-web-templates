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

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Agent Marketplace Admin');
  });
  it('creates a draft and requires review before publication', () => {
    const app = TestBed.createComponent(App).componentInstance;
    app.formName.set('Research Companion');
    app.formDescription.set('Prepare research summaries.');
    app.createAgent();
    const draft = app.agents().at(-1)!;
    expect(draft.status).toBe('Draft');
    expect(app.filtered().map(a => a.name)).toContain('Research Companion');
    app.changeStatus(draft, 'In review');
    expect(app.pending().map(a => a.id)).toContain(draft.id);
    app.changeStatus(app.pending().find(a => a.id === draft.id)!, 'Published');
    expect(app.published().map(a => a.id)).toContain(draft.id);
    expect(app.activity()[0].action).toBe('Approved Research Companion');
  });

  it('filters by search, category, and publication status together', () => {
    const app = TestBed.createComponent(App).componentInstance;
    app.catalogTab.set(1);
    app.category.set('Operations');
    app.query.set('Mira Poluru');
    expect(app.filtered().map(a => a.name)).toEqual(['Document Analyst']);
    app.query.set('missing');
    expect(app.filtered()).toEqual([]);
  });

  it('rejects older versions and sends newer versions through review', () => {
    const app = TestBed.createComponent(App).componentInstance;
    const agent = app.agents()[0];
    app.releaseVersion.set('1.0.0');
    app.submitVersion(agent);
    expect(app.formError()).toContain('higher version');
    expect(app.agents()[0].version).toBe('2.4.0');
    app.releaseVersion.set('2.5.0');
    app.submitVersion(agent);
    expect(app.agents()[0].version).toBe('2.5.0');
    expect(app.agents()[0].status).toBe('In review');
  });
});
