import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  EdsCardComponent,
  EdsDataTableColumn,
  EdsDataTableComponent
} from '@poluru-labs/enterprise-design-system-angular';
import { templateConfig } from '../template.config';

@Component({
  selector: 'app-usage-page',
  standalone: true,
  imports: [EdsCardComponent, EdsDataTableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host {
      --brand: #08766c;
      --line: #dfe7e6;
      display: block;
    }

    .table {
      border-radius: 14px;
    }
  `],
  template: `
    <eds-card class="table" [elevated]="false">
      <eds-data-table [columns]="columns" [rows]="rows" [striped]="true"></eds-data-table>
    </eds-card>
  `
})
export class UsagePageComponent {
  protected readonly config = templateConfig;
  protected readonly columns: EdsDataTableColumn[] = [
    { key: 'model', label: 'Model', sortable: true },
    { key: 'workspace', label: 'Workspace', sortable: true },
    { key: 'tokens', label: 'Tokens', sortable: true },
    { key: 'cost', label: 'Cost', sortable: true },
    { key: 'latency', label: 'Avg. latency', sortable: true }
  ];

  protected readonly rows = this.config.usage.map((entry) => ({
    model: entry.model,
    workspace: entry.workspace,
    tokens: entry.tokens,
    cost: entry.cost,
    latency: entry.latency
  }));
}
