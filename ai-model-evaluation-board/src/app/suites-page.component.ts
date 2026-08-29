import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  EdsCardComponent,
  EdsDataTableColumn,
  EdsDataTableComponent
} from '@poluru-labs/enterprise-design-system-angular';
import { templateConfig } from '../template.config';

@Component({
  selector: 'app-suites-page',
  standalone: true,
  imports: [EdsCardComponent, EdsDataTableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host {
      --brand: #2f6b1f;
      --line: #cdeab8;
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
export class SuitesPageComponent {
  protected readonly config = templateConfig;
  protected readonly columns: EdsDataTableColumn[] = [
    { key: 'name', label: 'Suite', sortable: true },
    { key: 'owner', label: 'Owner', sortable: true },
    { key: 'model', label: 'Model', sortable: true },
    { key: 'score', label: 'Score', sortable: true },
    { key: 'status', label: 'Status', sortable: true }
  ];

  protected readonly rows = this.config.suites.map((suite) => ({
    name: suite.name,
    owner: suite.owner,
    model: suite.model,
    score: suite.score,
    status: suite.status
  }));
}
