import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
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

interface DocumentRow {
  name: string;
  type: 'Invoice' | 'Contract' | 'Form';
  owner: string;
  status: string;
  statusVariant: 'success' | 'warning' | 'danger';
  confidence: number;
  updated: string;
}

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly uploadOpen = signal(false);
  readonly selectedFilter = signal('All documents');
  readonly selectedFiles = signal<string[]>([]);
  readonly docSearch = signal('');

  readonly chartData = [
    { day: 'Mon', value: 58, count: 146 },
    { day: 'Tue', value: 76, count: 193 },
    { day: 'Wed', value: 66, count: 168 },
    { day: 'Thu', value: 88, count: 224 },
    { day: 'Fri', value: 78, count: 198 },
    { day: 'Sat', value: 54, count: 137 },
    { day: 'Sun', value: 86, count: 218 },
  ];

  readonly filterTabs = ['All documents', 'Invoices', 'Contracts', 'Forms'] as const;

  readonly documents: DocumentRow[] = [
    {
      name: 'Northwind_Invoice_0926.pdf',
      type: 'Invoice',
      owner: 'Aarav Poluru',
      status: 'Validated',
      statusVariant: 'success',
      confidence: 98,
      updated: '2 min ago',
    },
    {
      name: 'Vendor_Agreement_Q3.pdf',
      type: 'Contract',
      owner: 'Meera Poluru',
      status: 'In review',
      statusVariant: 'warning',
      confidence: 91,
      updated: '18 min ago',
    },
    {
      name: 'Onboarding_Form_1042.pdf',
      type: 'Form',
      owner: 'Rohan Poluru',
      status: 'Validated',
      statusVariant: 'success',
      confidence: 96,
      updated: '34 min ago',
    },
    {
      name: 'Services_Contract_Renewal.pdf',
      type: 'Contract',
      owner: 'Ishita Poluru',
      status: 'Needs attention',
      statusVariant: 'danger',
      confidence: 74,
      updated: '1 hr ago',
    },
  ];

  readonly filteredDocuments = computed(() => {
    const filter = this.selectedFilter();
    const q = this.docSearch().trim().toLowerCase();
    return this.documents.filter((doc) => {
      const typeMatch =
        filter === 'All documents'
          ? true
          : filter === 'Invoices'
            ? doc.type === 'Invoice'
            : filter === 'Contracts'
              ? doc.type === 'Contract'
              : doc.type === 'Form';
      const searchMatch =
        !q || `${doc.name} ${doc.owner} ${doc.type} ${doc.status}`.toLowerCase().includes(q);
      return typeMatch && searchMatch;
    });
  });

  barHeight(value: number): string {
    return `${value}%`;
  }

  setFilter(filter: string): void {
    this.selectedFilter.set(filter);
  }

  handleFiles(detail: EdsFileUploadChangeDetail): void {
    this.selectedFiles.set(detail.files.map((file) => file.name));
  }
}
