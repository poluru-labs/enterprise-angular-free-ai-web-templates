import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
	EdsBadgeComponent,
	EdsButtonComponent,
	EdsCardComponent,
	EdsInputComponent,
	EdsModalComponent,
	EdsSearchComponent,
	EdsSelectComponent,
	EdsTextareaComponent
} from '@poluru-labs/enterprise-design-system-angular';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [
		RouterOutlet,
		RouterLink,
		RouterLinkActive,
		EdsCardComponent,
		EdsSearchComponent,
		EdsButtonComponent,
		EdsBadgeComponent,
		EdsModalComponent,
		EdsInputComponent,
		EdsSelectComponent,
		EdsTextareaComponent
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	styles: [`
		:host {
			--brand: #0046ff;
			--ink: #0f172a;
			--muted: #64748b;
			--line: #dbe7ff;
			--surface: #f4f7ff;
			--card: #ffffff;
			font-family: 'DM Sans', sans-serif;
			color: var(--ink);
			display: block;
			min-height: 100vh;
			background:
				radial-gradient(circle at 0% 0%, #dbe7ff 0%, transparent 44%),
				radial-gradient(circle at 100% 100%, #ebf1ff 0%, transparent 38%),
				#f9fbff;
		}

		.layout {
			min-height: 100vh;
			max-width: 1320px;
			margin: 0 auto;
			padding: 28px;
			display: grid;
			grid-template-columns: 260px minmax(0, 1fr);
			gap: 22px;
		}

		.sidebar,
		.content {
			border-radius: 18px;
			overflow: hidden;
		}

		:host ::ng-deep eds-card .card {
			border: 0;
			box-shadow: 0 16px 30px rgba(11, 28, 70, 0.08);
		}

		:host ::ng-deep eds-card .card .header,
		:host ::ng-deep eds-card .card .footer {
			border: 0;
		}

		:host ::ng-deep eds-stat .eds-stat,
		:host ::ng-deep eds-data-table .eds-data-table__wrapper,
		:host ::ng-deep eds-modal .dialog {
			border: 0;
		}

		.sidebar {
			padding: 18px;
			display: flex;
			flex-direction: column;
			gap: 16px;
		}

		.logo {
			display: flex;
			gap: 10px;
			align-items: center;
			padding: 8px 10px;
			border-radius: 12px;
			background: var(--surface);
		}

		.logo-mark {
			width: 34px;
			height: 34px;
			border-radius: 10px;
			background: var(--brand);
			color: #fff;
			display: grid;
			place-items: center;
			font-weight: 700;
		}

		.logo-copy strong {
			display: block;
			font-size: 14px;
			line-height: 1.1;
		}

		.logo-copy small {
			color: var(--muted);
			font-size: 12px;
		}

		.nav {
			display: grid;
			gap: 6px;
		}

		.nav a {
			color: #19325e;
			text-decoration: none;
			padding: 10px 12px;
			border-radius: 10px;
			font-weight: 500;
			transition: 180ms ease;
			display: flex;
			align-items: center;
			gap: 10px;
		}

		.nav a:hover {
			background: #f3f7ff;
		}

		.nav a.active {
			background: #ebf1ff;
			color: var(--brand);
			font-weight: 700;
		}

		.helper {
			margin-top: auto;
			border-radius: 12px;
			padding: 12px;
			background: #f8faff;
			font-size: 12px;
			color: #37507c;
		}

		.content {
			height: 100%;
		}

		.content-inner {
			padding: 18px;
		}

		.topbar {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 4px 6px 16px;
			margin-bottom: 14px;
		}

		.crumb {
			font-size: 12px;
			color: var(--muted);
			text-transform: uppercase;
			letter-spacing: 0.08em;
			margin: 0;
		}

		.title {
			margin: 4px 0 0;
			font-size: 22px;
		}

		.actions {
			display: flex;
			align-items: center;
			gap: 10px;
		}

		.search {
			min-width: 220px;
		}

		.flash {
			margin: 0 6px 16px;
			padding: 10px 12px;
			border-radius: 10px;
			background: #ecf3ff;
			color: #1140a7;
			font-weight: 600;
			font-size: 13px;
		}

		.modal-grid {
			display: grid;
			gap: 12px;
		}

		.modal-footer {
			display: flex;
			justify-content: flex-end;
			gap: 10px;
		}

		@media (max-width: 980px) {
			.layout {
				grid-template-columns: 1fr;
				padding: 16px;
			}

			.topbar {
				flex-direction: column;
				align-items: flex-start;
				gap: 10px;
			}

			.actions {
				width: 100%;
			}

			.search {
				flex: 1;
				min-width: 0;
			}
		}
	`],
	template: `
		<main class="layout">
			<eds-card class="sidebar" [elevated]="false">
				<div class="logo">
					<span class="logo-mark">AI</span>
					<div class="logo-copy">
						<strong>Content Studio</strong>
						<small>Poluru Labs</small>
					</div>
				</div>

				<nav class="nav">
					@for (item of navItems; track item.path) {
						<a [routerLink]="item.path" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: item.exact }">
							<span class="material-symbols-outlined">{{ item.icon }}</span>
							<span>{{ item.label }}</span>
						</a>
					}
				</nav>

				<div class="helper">
					<eds-badge label="Must-have enabled" variant="brand" [soft]="true" [pill]="true"></eds-badge>
					<br />
					<br />
					Keep brand voice and approvals in one place with clear handoffs across your content team.
				</div>
			</eds-card>

			<eds-card class="content" [elevated]="false">
				<div class="content-inner">
				<header class="topbar">
					<div>
						<p class="crumb">AI Operations</p>
						<h1 class="title">Content Studio Dashboard</h1>
					</div>
					<div class="actions">
						<eds-search class="search" size="md" placeholder="Search projects or campaigns" [clearable]="true"></eds-search>
						<eds-button variant="primary" (clicked)="openCreateModal()">Create Content</eds-button>
					</div>
				</header>

				@if (createdMessage()) {
					<div class="flash">{{ createdMessage() }}</div>
				}

				<router-outlet></router-outlet>
				</div>
			</eds-card>

			<eds-modal [open]="isCreateModalOpen()" heading="Create content" (openChange)="isCreateModalOpen.set($event)">
				<div class="modal-grid">
					<eds-input
						label="Content title"
						placeholder="Q4 launch blog brief"
						[value]="draftTitle()"
						(valueChange)="draftTitle.set($event)"
					></eds-input>

					<eds-select
						label="Content type"
						placeholder="Choose type"
						[options]="contentTypeOptions"
						[value]="draftType()"
						(valueChange)="draftType.set($event)"
					></eds-select>

					<eds-textarea
						label="Creative brief"
						placeholder="Describe audience, goal, and call to action"
						[rows]="5"
						[value]="draftBrief()"
						(valueChange)="draftBrief.set($event)"
					></eds-textarea>
				</div>

				<div footer class="modal-footer">
					<eds-button variant="secondary" (clicked)="closeCreateModal()">Cancel</eds-button>
					<eds-button variant="primary" [disabled]="!canCreate()" (clicked)="createContent()">Create</eds-button>
				</div>
			</eds-modal>
		</main>
	`
})
export class AppComponent {
	protected readonly isCreateModalOpen = signal(false);
	protected readonly createdMessage = signal('');
	protected readonly draftTitle = signal('');
	protected readonly draftType = signal('');
	protected readonly draftBrief = signal('');

	protected readonly navItems = [
		{ label: 'Dashboard', path: '/', icon: 'dashboard', exact: true },
		{ label: 'Projects', path: '/projects', icon: 'folder_open', exact: false },
		{ label: 'Calendar', path: '/calendar', icon: 'calendar_month', exact: false },
		{ label: 'Brand Voice', path: '/brand-voice', icon: 'verified_user', exact: false },
		{ label: 'Settings', path: '/settings', icon: 'tune', exact: false }
	];

	protected readonly contentTypeOptions = [
		{ label: 'Blog Post', value: 'blog' },
		{ label: 'Email Campaign', value: 'email' },
		{ label: 'Social Series', value: 'social' },
		{ label: 'Landing Page', value: 'landing' }
	];

	protected openCreateModal(): void {
		this.isCreateModalOpen.set(true);
		this.createdMessage.set('');
	}

	protected closeCreateModal(): void {
		this.isCreateModalOpen.set(false);
	}

	protected canCreate(): boolean {
		return this.draftTitle().trim().length > 2 && this.draftType().trim().length > 0;
	}

	protected createContent(): void {
		if (!this.canCreate()) {
			return;
		}

		const typeLabel = this.contentTypeOptions.find((item) => item.value === this.draftType())?.label ?? 'Content';
		this.createdMessage.set(`${typeLabel} draft "${this.draftTitle().trim()}" created successfully.`);
		this.draftTitle.set('');
		this.draftType.set('');
		this.draftBrief.set('');
		this.isCreateModalOpen.set(false);
	}
}