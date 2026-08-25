import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  EdsCardComponent,
  EdsDataTableColumn,
  EdsDataTableComponent
} from '@poluru-labs/enterprise-design-system-angular';
import { templateConfig } from '../template.config';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [EdsCardComponent, EdsDataTableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host {
      --brand: #0046ff;
      --line: #dbe7ff;
      --muted: #5d6f92;
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
export class ProjectsPageComponent {
  protected readonly config = templateConfig;
  protected readonly columns: EdsDataTableColumn[] = [
    { key: 'project', label: 'Project', sortable: true },
    { key: 'owner', label: 'Owner', sortable: true },
    { key: 'progress', label: 'Progress', sortable: true },
    { key: 'due', label: 'Due', sortable: true }
  ];

  protected readonly rows = this.config.projects.map((project) => ({
    project: project.name,
    owner: project.owner,
    progress: `${project.progress}%`,
    due: project.due
  }));
}
