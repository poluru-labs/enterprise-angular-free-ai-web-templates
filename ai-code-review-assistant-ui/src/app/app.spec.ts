import { TestBed } from "@angular/core/testing";
import { App } from "./app";

describe("Code Review Assistant Panel", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it("renders top navigation and the requested footer", async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector("h1")?.textContent).toContain(
      "Code Review Assistant Panel",
    );
    expect(
      element.querySelector('nav[aria-label="Main navigation"]'),
    ).toBeTruthy();
    expect(element.querySelector("aside")).toBeNull();
    expect(element.querySelector("footer a")?.getAttribute("href")).toBe(
      "https://polurus.com",
    );
  });

  it("filters the queue and metrics by repository", () => {
    const app = TestBed.createComponent(App).componentInstance;
    app.repoFilter.set("web-platform");
    expect(app.pending()).toHaveLength(2);
    expect(app.accepted()).toBe(324);
    expect(app.total()).toBe(387);
    app.search.set("stable identifiers");
    expect(app.visible()).toHaveLength(1);
  });

  it("records an acceptance once and updates totals without changing code", () => {
    const app = TestBed.createComponent(App).componentInstance;
    const suggestion = app.suggestions()[0];
    const accepted = app.accepted(),
      total = app.total();
    app.openReview(suggestion);
    app.decide("Accepted");
    expect(app.accepted()).toBe(accepted + 1);
    expect(app.total()).toBe(total);
    expect(app.pending()).toHaveLength(5);
    expect(app.suggestions()[0].before).toBe(suggestion.before);
    expect(app.activity()[0]["event"]).toBe("Accepted suggestion #248");
    app.decide("Accepted");
    expect(app.accepted()).toBe(accepted + 1);
  });

  it("requires a decline note unless that preference is disabled", () => {
    const app = TestBed.createComponent(App).componentInstance;
    app.openReview(app.suggestions()[0]);
    app.decide("Declined");
    expect(app.error()).toContain("short note");
    expect(app.pending()).toHaveLength(6);
    app.note.set("The caller already validates this input.");
    app.decide("Declined");
    expect(app.pending()).toHaveLength(5);
    expect(app.suggestions()[0].note).toContain("caller");
    app.requireNote.set(false);
    app.openReview(app.suggestions()[1]);
    app.decide("Declined");
    expect(app.pending()).toHaveLength(4);
  });

  it("rejects identical snippets and adds valid new reviews", () => {
    const app = TestBed.createComponent(App).componentInstance;
    app.formTitle.set("Use a constant");
    app.formFile.set("src/value.ts");
    app.formBefore.set("let value = 1;");
    app.formAfter.set("let value = 1;");
    app.create();
    expect(app.error()).toContain("must differ");
    app.formAfter.set("const value = 1;");
    app.create();
    expect(app.suggestions()).toHaveLength(7);
    expect(app.suggestions()[0].owner).toBe("Riya Poluru");
    expect(app.suggestions()[0].status).toBe("Pending");
    expect(app.page()).toBe(1);
    expect(app.visible()[0].title).toBe("Use a constant");
  });
});
