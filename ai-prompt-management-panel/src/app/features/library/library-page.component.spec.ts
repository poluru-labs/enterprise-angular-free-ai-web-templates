import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LibraryPageComponent } from './library-page.component';
import { internals } from '../../shared/testing/internals';
import { templateConfig } from '../../core/config/template.config';

describe('LibraryPageComponent', () => {
  let component: LibraryPageComponent;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibraryPageComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    const fixture = TestBed.createComponent(LibraryPageComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('creates the prompt library', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.textContent).toContain('Prompt library');
    expect(nativeElement.textContent).toContain(templateConfig.activity[0].title);
    expect(nativeElement.textContent).toContain('Priya Poluru');
    expect(nativeElement.textContent).toContain('Support triage v3');
  });

  it('renders week metrics by default and switches by period', () => {
    const api = internals(component);
    expect(api.period()).toBe('week');
    expect(api.visibleMetrics()[0].value).toBe('184');

    api.period.set('day');
    expect(api.visibleMetrics()[0].value).toBe('3');
    api.period.set('month');
    expect(api.visibleMetrics()[0].value).toBe('612');
  });

  it('filters the catalog by status and search', () => {
    const api = internals(component);
    api.onStatus('Review');
    expect(api.filtered().every((row: { status: string }) => row.status === 'Review')).toBe(true);

    api.onSearch('Policy');
    expect(api.page()).toBe(1);
    expect(api.filtered().every((row: { name: string }) => row.name.includes('Policy'))).toBe(true);
  });

  it('clears filters and queues a playground run', () => {
    const api = internals(component);
    api.onSearch('zzzz-not-a-prompt');
    expect(api.pageRows()).toEqual([]);
    api.clearFilters();
    expect(api.search()).toBe('');
    expect(api.filtered().length).toBeGreaterThan(5);
    api.testPrompt('Email writer');
    expect(api.notice()).toContain('Email writer');
  });

  it('dispatches the new prompt event', () => {
    const spy = vi.spyOn(window, 'dispatchEvent');
    internals(component).openPrompt();
    expect(spy).toHaveBeenCalled();
    const event = spy.mock.calls[0][0] as Event;
    expect(event.type).toBe('prompt:new');
  });
});
