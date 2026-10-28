import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-about',
  template: `
    <section class="page">
      <h1>About</h1>
      <p>
        This boilerplate uses Angular routing and the enterprise design system for UI
        components.
      </p>
    </section>
  `,
  styles: `
    .page {
      max-width: 40rem;
    }

    h1 {
      margin: 0 0 0.5rem;
      font-size: 1.75rem;
    }

    p {
      margin: 0;
      color: var(--eds-color-text-secondary, #555);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {}
