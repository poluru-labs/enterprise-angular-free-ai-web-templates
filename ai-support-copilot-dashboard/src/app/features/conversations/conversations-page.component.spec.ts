import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ConversationsPageComponent } from './conversations-page.component';
import { internals } from '../../shared/testing/internals';

describe('ConversationsPageComponent', () => {
  let component: ConversationsPageComponent;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConversationsPageComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    const fixture = TestBed.createComponent(ConversationsPageComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('creates the conversation inbox', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.textContent).toContain('Inbox');
    expect(nativeElement.textContent).toContain('Where is my order');
  });

  it('filters by search and resets to the first page', () => {
    const api = internals(component);
    api.tags.set([]);
    api.page.set(2);
    api.onSearch('Refund');
    expect(api.page()).toBe(1);
    expect(api.filtered().every((row: { topic: string }) => row.topic.includes('Refund'))).toBe(true);
  });

  it('applies and dismisses channel tags', () => {
    const api = internals(component);
    expect(api.filtered().every((row: { channel: string }) => row.channel === 'Chat')).toBe(true);
    api.dismissTag('Chat');
    expect(api.tags()).toEqual([]);
    expect(api.filtered().length).toBeGreaterThan(8);
  });

  it('clears filters to restore the full inbox', () => {
    const api = internals(component);
    api.onSearch('zzzz-not-a-ticket');
    expect(api.pageRows()).toEqual([]);
    api.clearFilters();
    expect(api.search()).toBe('');
    expect(api.filtered().length).toBeGreaterThan(8);
  });

  it('stores the selected date window and opens draft reply', () => {
    const spy = vi.spyOn(window, 'dispatchEvent');
    internals(component).onRange({ start: '2026-08-10', end: '2026-08-20' });
    expect(internals(component).rangeStart()).toBe('2026-08-10');
    expect(internals(component).rangeEnd()).toBe('2026-08-20');
    internals(component).openReply();
    expect((spy.mock.calls[0][0] as Event).type).toBe('harbor:reply');
  });
});
