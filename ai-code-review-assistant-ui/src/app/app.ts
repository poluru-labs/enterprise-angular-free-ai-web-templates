import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from "@angular/core";
import { DecimalPipe } from "@angular/common";
import {
  EdsAlertComponent,
  EdsAvatarComponent,
  EdsBadgeComponent,
  EdsButtonComponent,
  EdsCardComponent,
  EdsDataTableComponent,
  EdsIconComponent,
  EdsInputComponent,
  EdsModalComponent,
  EdsProgressBarComponent,
  EdsSegmentedControlComponent,
  EdsSelectComponent,
  EdsSwitchComponent,
  EdsTabsComponent,
  EdsTextareaComponent,
} from "@poluru-labs/enterprise-design-system-angular";
type Status = "Pending" | "Accepted" | "Declined";
interface Suggestion {
  id: number;
  title: string;
  repo: string;
  file: string;
  owner: string;
  category: string;
  status: Status;
  before: string;
  after: string;
  note: string;
}
@Component({
  selector: "app-root",
  imports: [
    DecimalPipe,
    EdsAlertComponent,
    EdsAvatarComponent,
    EdsBadgeComponent,
    EdsButtonComponent,
    EdsCardComponent,
    EdsDataTableComponent,
    EdsIconComponent,
    EdsInputComponent,
    EdsModalComponent,
    EdsProgressBarComponent,
    EdsSegmentedControlComponent,
    EdsSelectComponent,
    EdsSwitchComponent,
    EdsTabsComponent,
    EdsTextareaComponent,
  ],
  templateUrl: "./app.html",
  styleUrl: "./app.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly page = signal(0);
  readonly repoFilter = signal("all");
  readonly search = signal("");
  readonly queueTab = signal(0);
  readonly period = signal("week");
  readonly notice = signal("");
  readonly modal = signal<"review" | "create" | null>(null);
  readonly selected = signal<Suggestion | null>(null);
  readonly note = signal("");
  readonly error = signal("");
  readonly requireNote = signal(true);
  readonly highlightCode = signal(true);
  readonly formTitle = signal("");
  readonly formRepo = signal("web-platform");
  readonly formFile = signal("");
  readonly formBefore = signal("");
  readonly formAfter = signal("");
  readonly nav = [
    { label: "Overview" },
    { label: "Review queue" },
    { label: "Repositories" },
    { label: "Team" },
    { label: "Activity" },
    { label: "Settings" },
  ];
  readonly tabs = [
    { label: "Pending review" },
    { label: "Accepted" },
    { label: "Declined" },
    { label: "All suggestions" },
  ];
  readonly periods = [
    { label: "This week", value: "week" },
    { label: "This month", value: "month" },
  ];
  readonly repos = [
    {
      name: "web-platform",
      language: "TypeScript",
      owner: "Aarav Poluru",
      accepted: 324,
      declined: 61,
      minutes: 4.2,
      color: "blue",
    },
    {
      name: "payments-service",
      language: "Python",
      owner: "Mira Poluru",
      accepted: 218,
      declined: 40,
      minutes: 5.1,
      color: "yellow",
    },
    {
      name: "design-system",
      language: "TypeScript",
      owner: "Kiran Poluru",
      accepted: 145,
      declined: 32,
      minutes: 3.8,
      color: "purple",
    },
    {
      name: "data-pipeline",
      language: "Go",
      owner: "Nila Poluru",
      accepted: 99,
      declined: 18,
      minutes: 4.6,
      color: "green",
    },
  ];
  readonly repoOptions = this.repos.map((r) => ({
    label: r.name,
    value: r.name,
  }));
  readonly filters = [
    { label: "All repositories", value: "all" },
    ...this.repoOptions,
  ];
  readonly suggestions = signal<Suggestion[]>([
    {
      id: 248,
      title: "Handle empty results before mapping",
      repo: "web-platform",
      file: "src/services/user.service.ts",
      owner: "Aarav Poluru",
      category: "Reliability",
      status: "Pending",
      before:
        "export function getNames(users?: User[]) {\n  return users.map(user => user.name);\n}",
      after:
        "export function getNames(users?: User[]) {\n  return (users ?? []).map(user => user.name);\n}",
      note: "",
    },
    {
      id: 247,
      title: "Use a decimal for currency calculations",
      repo: "payments-service",
      file: "services/checkout.py",
      owner: "Mira Poluru",
      category: "Correctness",
      status: "Pending",
      before: "def total(price, quantity):\n    return float(price) * quantity",
      after:
        "from decimal import Decimal\n\ndef total(price, quantity):\n    return Decimal(str(price)) * quantity",
      note: "",
    },
    {
      id: 246,
      title: "Give icon buttons an accessible label",
      repo: "design-system",
      file: "src/components/close-button.html",
      owner: "Kiran Poluru",
      category: "Accessibility",
      status: "Pending",
      before:
        '<button type="button">\n  <span aria-hidden="true">×</span>\n</button>',
      after:
        '<button type="button" aria-label="Close dialog">\n  <span aria-hidden="true">×</span>\n</button>',
      note: "",
    },
    {
      id: 245,
      title: "Return early when the source is empty",
      repo: "data-pipeline",
      file: "pipeline/transform.go",
      owner: "Nila Poluru",
      category: "Performance",
      status: "Pending",
      before:
        "func transform(rows []Row) []Result {\n    results := make([]Result, 0)\n    for _, row := range rows {\n        results = append(results, convert(row))\n    }\n    return results\n}",
      after:
        "func transform(rows []Row) []Result {\n    if len(rows) == 0 { return []Result{} }\n    results := make([]Result, 0, len(rows))\n    for _, row := range rows {\n        results = append(results, convert(row))\n    }\n    return results\n}",
      note: "",
    },
    {
      id: 244,
      title: "Use stable identifiers for list rendering",
      repo: "web-platform",
      file: "src/components/list.html",
      owner: "Tara Poluru",
      category: "Maintainability",
      status: "Pending",
      before:
        '@for (item of items; track $index) {\n  <app-item [item]="item" />\n}',
      after:
        '@for (item of items; track item.id) {\n  <app-item [item]="item" />\n}',
      note: "",
    },
    {
      id: 243,
      title: "Avoid a mutable default argument",
      repo: "payments-service",
      file: "services/invoice.py",
      owner: "Dev Poluru",
      category: "Reliability",
      status: "Pending",
      before: 'def invoice(items=[]):\n    return {"items": items}',
      after:
        'def invoice(items=None):\n    return {"items": [] if items is None else items}',
      note: "",
    },
  ]);
  readonly activity = signal<Record<string, string | number>[]>([
    {
      event: "Published review guidelines",
      repo: "All repositories",
      member: "Riya Poluru",
      time: "Today, 09:12",
    },
    {
      event: "Completed weekly quality review",
      repo: "web-platform",
      member: "Aarav Poluru",
      time: "Today, 08:45",
    },
  ]);
  readonly activityColumns = [
    { key: "event", label: "Event" },
    { key: "repo", label: "Repository" },
    { key: "member", label: "Member" },
    { key: "time", label: "Time" },
  ];
  readonly teamColumns = [
    { key: "name", label: "Reviewer" },
    { key: "repo", label: "Repository" },
    { key: "reviews", label: "Historical decisions" },
    { key: "acceptance", label: "Acceptance" },
  ];
  readonly team = this.repos.map((r) => ({
    name: r.owner,
    repo: r.name,
    reviews: r.accepted + r.declined,
    acceptance:
      ((r.accepted / (r.accepted + r.declined)) * 100).toFixed(1) + "%",
  }));
  readonly scopedRepos = computed(() =>
    this.repos.filter(
      (r) => this.repoFilter() === "all" || r.name === this.repoFilter(),
    ),
  );
  readonly scoped = computed(() =>
    this.suggestions().filter(
      (s) => this.repoFilter() === "all" || s.repo === this.repoFilter(),
    ),
  );
  readonly pending = computed(() =>
    this.scoped().filter((s) => s.status === "Pending"),
  );
  readonly accepted = computed(
    () =>
      this.scopedRepos().reduce((n, r) => n + r.accepted, 0) +
      this.scoped().filter((s) => s.status === "Accepted").length,
  );
  readonly declined = computed(
    () =>
      this.scopedRepos().reduce((n, r) => n + r.declined, 0) +
      this.scoped().filter((s) => s.status === "Declined").length,
  );
  readonly acceptance = computed(
    () => (this.accepted() / (this.accepted() + this.declined())) * 100,
  );
  readonly total = computed(
    () => this.accepted() + this.declined() + this.pending().length,
  );
  readonly savedHours = computed(() =>
    this.scopedRepos().reduce(
      (sum, r) =>
        sum +
        ((r.accepted +
          this.scoped().filter(
            (s) => s.repo === r.name && s.status === "Accepted",
          ).length) *
          r.minutes) /
          60,
      0,
    ),
  );
  readonly visible = computed(() =>
    this.scoped().filter(
      (s) =>
        (this.queueTab() === 3 ||
          s.status === ["Pending", "Accepted", "Declined"][this.queueTab()]) &&
        `${s.title} ${s.repo} ${s.owner}`
          .toLowerCase()
          .includes(this.search().toLowerCase()),
    ),
  );
  readonly spotlight = computed(() => this.pending()[0]);
  readonly trend = computed(() =>
    this.period() === "week"
      ? [65, 73, 69, 80, 75, 88, 84]
      : [54, 62, 59, 71, 66, 75, 72, 80, 76, 85, 79, 88],
  );
  navigate(index: number) {
    this.page.set(index);
    this.error.set("");
  }
  repoStats(name: string) {
    const r = this.repos.find((r) => r.name === name)!;
    const accepted =
      r.accepted +
      this.suggestions().filter(
        (s) => s.repo === name && s.status === "Accepted",
      ).length;
    const declined =
      r.declined +
      this.suggestions().filter(
        (s) => s.repo === name && s.status === "Declined",
      ).length;
    return {
      accepted,
      total: accepted + declined,
      rate: (accepted / (accepted + declined)) * 100,
      hours: (accepted * r.minutes) / 60,
    };
  }
  openReview(suggestion: Suggestion) {
    this.selected.set(suggestion);
    this.note.set(suggestion.note);
    this.error.set("");
    this.modal.set("review");
  }
  decide(status: "Accepted" | "Declined") {
    const current = this.selected();
    if (
      !current ||
      this.suggestions().find((s) => s.id === current.id)?.status !== "Pending"
    )
      return;
    if (status === "Declined" && this.requireNote() && !this.note().trim()) {
      this.error.set(
        "Add a short note explaining why this suggestion should be declined.",
      );
      return;
    }
    this.suggestions.update((rows) =>
      rows.map((s) =>
        s.id === current.id ? { ...s, status, note: this.note().trim() } : s,
      ),
    );
    this.activity.update((rows) => [
      {
        event: `${status} suggestion #${current.id}`,
        repo: current.repo,
        member: "Riya Poluru",
        time: "Just now",
      },
      ...rows,
    ]);
    this.modal.set(null);
    this.notice.set(
      `Suggestion #${current.id} ${status.toLowerCase()}. This records a demo decision; repository files are not changed.`,
    );
  }
  openCreate() {
    this.formTitle.set("");
    this.formFile.set("");
    this.formBefore.set("");
    this.formAfter.set("");
    this.formRepo.set(
      this.repoFilter() === "all" ? "web-platform" : this.repoFilter(),
    );
    this.error.set("");
    this.modal.set("create");
  }
  create() {
    if (
      ![
        this.formTitle(),
        this.formFile(),
        this.formBefore(),
        this.formAfter(),
      ].every((s) => s.trim())
    ) {
      this.error.set(
        "Complete the title, file path, original code, and suggested code.",
      );
      return;
    }
    if (this.formBefore().trim() === this.formAfter().trim()) {
      this.error.set("The suggested code must differ from the original.");
      return;
    }
    const id = Math.max(...this.suggestions().map((s) => s.id)) + 1;
    this.suggestions.update((rows) => [
      {
        id,
        title: this.formTitle().trim(),
        file: this.formFile().trim(),
        repo: this.formRepo(),
        owner: "Riya Poluru",
        category: "Manual review",
        status: "Pending",
        before: this.formBefore(),
        after: this.formAfter(),
        note: "",
      },
      ...rows,
    ]);
    this.activity.update((rows) => [
      {
        event: `Submitted suggestion #${id}`,
        repo: this.formRepo(),
        member: "Riya Poluru",
        time: "Just now",
      },
      ...rows,
    ]);
    this.repoFilter.set(this.formRepo());
    this.queueTab.set(0);
    this.search.set("");
    this.navigate(1);
    this.modal.set(null);
    this.notice.set(`Suggestion #${id} is ready for review.`);
  }
  exportReport() {
    const rows = [
      [
        "Repository",
        "Accepted",
        "Decided",
        "Acceptance %",
        "Estimated hours saved",
      ],
      ...this.scopedRepos().map((r) => {
        const s = this.repoStats(r.name);
        return [
          r.name,
          s.accepted,
          s.total,
          s.rate.toFixed(1),
          s.hours.toFixed(1),
        ];
      }),
    ];
    const csv = rows
      .map((row) =>
        row.map((v) => '"' + String(v).replaceAll('"', '""') + '"').join(","),
      )
      .join("\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "code-review-productivity.csv";
    a.click();
    URL.revokeObjectURL(url);
    this.notice.set("Repository productivity report exported.");
  }
}
