import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('Annotation Quality Dashboard', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [App] }).compileComponents();
  });

  it('renders the dashboard title and requested footer links', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('h1')?.textContent).toContain('Annotation Quality Dashboard');
    expect(element.querySelector('footer a')?.getAttribute('href')).toBe('https://polurus.com');
    expect(element.querySelectorAll('footer a')).toHaveLength(2);
  });

  it('scopes metrics, datasets, and disputes together', () => {
    const app = TestBed.createComponent(App).componentInstance;
    app.project.set('entities');
    expect(app.totalRecords()).toBe(12600);
    expect(app.agreement()).toBeCloseTo(84.6);
    expect(app.filteredDatasets()).toHaveLength(1);
    expect(app.openReviews().every(r => r.dataset === 'entities')).toBe(true);
    app.search.set('missing');
    expect(app.filteredDatasets()).toHaveLength(0);
  });

  it('requires a label and explanation before resolving a disagreement', () => {
    const app = TestBed.createComponent(App).componentInstance;
    const item = app.reviews()[0];
    app.review(item);
    app.resolve();
    expect(app.error()).toContain('Choose a final label');
    expect(app.openReviews()).toHaveLength(4);
    app.finalLabel.set(item.first);
    app.note.set('The highlighted phrase names the contracting organization.');
    app.resolve();
    expect(app.openReviews()).toHaveLength(3);
    app.reviewTab.set(1);
    expect(app.visibleReviews()[0].finalLabel).toBe('Organization');
    expect(app.visibleReviews()[0].note).toContain('contracting organization');
  });

  it('validates thresholds and recalculates dataset health', () => {
    const app = TestBed.createComponent(App).componentInstance;
    expect(app.healthy()).toBe(3);
    app.thresholdAccuracy.set('101');
    app.saveSettings();
    expect(app.error()).toContain('between 0 and 100');
    expect(app.accuracyTarget()).toBe(95);
    app.thresholdAccuracy.set('90');
    app.thresholdAgreement.set('80');
    app.saveSettings();
    expect(app.healthy()).toBe(5);
  });

  it('captures a report with optional open dispute counts', () => {
    const app = TestBed.createComponent(App).componentInstance;
    app.auditDataset.set('entities');
    app.runAudit();
    expect(app.reports()[0]['disputes']).toBe(1);
    expect(app.reports()[0]['accuracy']).toBe('91.8%');
    app.includeDisagreements.set(false);
    app.runAudit();
    expect(app.reports()[0]['disputes']).toBe('Not included');
    expect(app.page()).toBe('Reports');
  });

  it('sorts annotator volume numerically', () => {
    const app = TestBed.createComponent(App).componentInstance;
    app.sortTeam({ key: 'reviewed', direction: 'desc' });
    expect(app.sortedTeam()[0].name).toBe('Kiran Poluru');
    app.sortTeam({ key: 'reviewed', direction: 'asc' });
    expect(app.sortedTeam()[0].name).toBe('Tara Poluru');
  });
});
