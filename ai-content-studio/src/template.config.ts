export const templateConfig = {
	metrics: [
		{ label: 'Content in production', value: '76', trend: '+11', icon: 'edit_note' },
		{ label: 'Approval rate', value: '87.9%', trend: '+4.4%', icon: 'thumb_up' },
		{ label: 'Brand matches', value: '94.1%', trend: '+1.6%', icon: 'verified' },
		{ label: 'Published this month', value: '138', trend: '+22%', icon: 'publish' }
	],
	mustHaveFeatures: [
		{
			title: 'AI Draft Studio',
			detail: 'Generate first drafts from campaign goals, audience, and tone.',
			status: 'Enabled'
		},
		{
			title: 'Approval Workflow',
			detail: 'Route content to reviewers with due dates and audit history.',
			status: 'Enabled'
		},
		{
			title: 'Brand Guardrails',
			detail: 'Check message consistency, restricted claims, and naming rules.',
			status: 'Enabled'
		},
		{
			title: 'Performance Insights',
			detail: 'Track CTR, completion rate, and conversion lift by channel.',
			status: 'Enabled'
		}
	],
	activity: [
		{ title: 'Product launch campaign drafted', detail: '8 assets ready for review', status: 'Review' },
		{ title: 'Blog brief approved', detail: 'Topic: AI governance', status: 'Approved' },
		{ title: 'Social series scheduled', detail: 'Week of August 26', status: 'Scheduled' }
	],
	projects: [
		{ name: 'Q3 Enterprise Launch', owner: 'Ava Thomas', progress: 82, due: 'Aug 29' },
		{ name: 'Security eBook Series', owner: 'Noah Patel', progress: 57, due: 'Sep 04' },
		{ name: 'Partner Webinar Kit', owner: 'Mila Rivera', progress: 41, due: 'Sep 11' }
	],
	calendar: [
		{ day: 'Mon', item: 'Campaign brief alignment' },
		{ day: 'Tue', item: 'SEO article batch review' },
		{ day: 'Wed', item: 'Social snippets publishing' },
		{ day: 'Thu', item: 'Brand council approvals' },
		{ day: 'Fri', item: 'Performance recap and backlog grooming' }
	]
};