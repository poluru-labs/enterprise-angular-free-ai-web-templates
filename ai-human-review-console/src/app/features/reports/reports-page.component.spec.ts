import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ReportsPageComponent } from './reports-page.component';
import { internals } from '../../shared/testing/internals';

describe('ReportsPageComponent', () => {
  let component: ReportsPageComponent;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportsPageComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    const fixture = TestBed.createComponent(ReportsPageComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('creates the reports desk', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.textContent).toContain('Reports');
    expect(nativeElement.textContent).toContain('Daily review digest');
  });

  it('filters by filing status', () => {
    const api = internals(component);
    api.filter.set('Filed');
    expect(api.filtered().every((item: { status: string }) => item.status === 'Filed')).toBe(true);
  });

  it('files and queues a package', () => {
    const api = internals(component);
    api.file('RPT-041');
    expect(api.rows().find((item: { id: string }) => item.id === 'RPT-041').status).toBe('Filed');

    api.queue('RPT-038');
    expect(api.rows().find((item: { id: string }) => item.id === 'RPT-038').status).toBe('Queued');
  });

  it('generates an on-demand digest', () => {
    const api = internals(component);
    const before = api.rows().length;
    api.generate();
    expect(api.rows().length).toBe(before + 1);
    expect(api.rows()[0].title).toBe('On-demand review digest');
    expect(api.rows()[0].owner).toBe('Aisha Poluru');
  });
});
