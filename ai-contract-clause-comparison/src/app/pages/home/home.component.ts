import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EdsButtonComponent } from '@poluru-labs/enterprise-design-system-angular';

@Component({
  selector: 'app-home',
  imports: [EdsButtonComponent],
  template: `
    <section class="page">
      <h1>Home</h1>
      <p>Starter app with @poluru-labs/enterprise-design-system-angular.</p>
      <eds-button variant="primary" (clicked)="onPrimaryClick()">Get started</eds-button>
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
      margin: 0 0 1.25rem;
      color: var(--eds-color-text-secondary, #555);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  onPrimaryClick(): void {
    // Demo hook for the EDS button
    console.log('Get started clicked');
  }
}
