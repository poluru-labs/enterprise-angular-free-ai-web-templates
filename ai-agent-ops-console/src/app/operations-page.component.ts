import { LowerCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-operations-page', standalone: true, imports: [LowerCasePipe], changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<section class="page-head"><div><p class="eyebrow">{{ route.snapshot.data['eyebrow'] }}</p><h1>{{ route.snapshot.data['title'] }}</h1><p class="summary">{{ route.snapshot.data['description'] }}</p></div><button class="primary"><span class="material-symbols-outlined">add</span>New {{ route.snapshot.data['title'] | lowercase }}</button></section><section class="panel workspace-panel"><div class="empty-icon"><span class="material-symbols-outlined">{{ route.snapshot.data['icon'] }}</span></div><h2>{{ route.snapshot.data['title'] }} workspace</h2><p>Connect this view to your agent operations API to display live workspace data.</p><button class="secondary"><span class="material-symbols-outlined">add_circle</span>Create first item</button></section>`
})
export class OperationsPageComponent { protected readonly route = inject(ActivatedRoute); }