import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  EdsAvatarComponent,
  EdsBadgeComponent,
  EdsButtonComponent,
  EdsCardComponent,
  EdsIconComponent,
  EdsProgressBarComponent,
  EdsStatusComponent,
} from '@poluru-labs/enterprise-design-system-angular';

@Component({
  selector: 'app-root',
  imports: [EdsAvatarComponent, EdsBadgeComponent, EdsButtonComponent, EdsCardComponent, EdsIconComponent, EdsProgressBarComponent, EdsStatusComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {}
