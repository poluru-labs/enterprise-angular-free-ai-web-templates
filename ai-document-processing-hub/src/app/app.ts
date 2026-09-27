import { Component, signal } from '@angular/core';
import {
  EdsAvatarComponent,
  EdsBadgeComponent,
  EdsButtonComponent,
  EdsCardComponent,
  EdsFileUploadChangeDetail,
  EdsFileUploadComponent,
  EdsIconComponent,
  EdsInputComponent,
  EdsProgressBarComponent,
  EdsStatComponent,
} from '@poluru-labs/enterprise-design-system-angular';

@Component({
  selector: 'app-root',
  imports: [
    EdsAvatarComponent,
    EdsBadgeComponent,
    EdsButtonComponent,
    EdsCardComponent,
    EdsFileUploadComponent,
    EdsIconComponent,
    EdsInputComponent,
    EdsProgressBarComponent,
    EdsStatComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly uploadOpen = signal(false);
  protected readonly selectedFilter = signal('All documents');
  protected readonly selectedFiles = signal<string[]>([]);

  protected readonly documents = [
    {
      name: 'Northwind_Invoice_0926.pdf',
      type: 'Invoice',
      owner: 'Aarav Poluru',
      status: 'Validated',
      statusVariant: 'success' as const,
      confidence: 98,
      updated: '2 min ago',
    },
    {
      name: 'Vendor_Agreement_Q3.pdf',
      type: 'Contract',
      owner: 'Meera Poluru',
      status: 'In review',
      statusVariant: 'warning' as const,
      confidence: 91,
      updated: '18 min ago',
    },
    {
      name: 'Onboarding_Form_1042.pdf',
      type: 'Form',
      owner: 'Rohan Poluru',
      status: 'Validated',
      statusVariant: 'success' as const,
      confidence: 96,
      updated: '34 min ago',
    },
    {
      name: 'Services_Contract_Renewal.pdf',
      type: 'Contract',
      owner: 'Ishita Poluru',
      status: 'Needs attention',
      statusVariant: 'danger' as const,
      confidence: 74,
      updated: '1 hr ago',
    },
  ];

  protected setFilter(filter: string): void {
    this.selectedFilter.set(filter);
  }

  protected handleFiles(detail: EdsFileUploadChangeDetail): void {
    this.selectedFiles.set(detail.files.map((file) => file.name));
  }
}
