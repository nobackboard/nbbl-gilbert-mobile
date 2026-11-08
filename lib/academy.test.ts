import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ACADEMY_MAX_CHILDREN,
  formatAcademyGradesForHubSpot,
  normalizeChildGrades,
  parseChildCount,
  validateAcademySubmission,
} from "./academy.ts";

describe("parseChildCount", () => {
  it("accepts positive integers", () => {
    assert.equal(parseChildCount(3), 3);
    assert.equal(parseChildCount("4"), 4);
  });

  it("rejects invalid values", () => {
    assert.equal(parseChildCount(0), 0);
    assert.equal(parseChildCount("abc"), null);
    assert.equal(parseChildCount(1.5), null);
  });
});

describe("normalizeChildGrades", () => {
  it("requires one grade per child and allows duplicates", () => {
    const result = normalizeChildGrades(
      [{ grade: "3" }, { grade: "3" }, { grade: "other", gradeOther: "Homeschool 5th" }],
      3,
    );
    assert.deepEqual(result, [
      { grade: "3" },
      { grade: "3" },
      { grade: "other", gradeOther: "Homeschool 5th" },
    ]);
  });

  it("rejects count mismatch", () => {
    const message = normalizeChildGrades([{ grade: "5" }], 2);
    assert.equal(typeof message, "string");
  });

  it("requires text when Other is selected", () => {
    const message = normalizeChildGrades([{ grade: "other" }], 1);
    assert.match(String(message), /Other/);
  });
});

describe("formatAcademyGradesForHubSpot", () => {
  it("formats readable lines", () => {
    const text = formatAcademyGradesForHubSpot([
      { grade: "5" },
      { grade: "other", gradeOther: "7th equivalent" },
    ]);
    assert.match(text, /Child 1: 5th grade/);
    assert.match(text, /Child 2: Other — 7th equivalent/);
  });
});

describe("validateAcademySubmission", () => {
  const base = {
    firstName: "Alex",
    lastName: "Jordan",
    email: "parent@example.com",
    phone: "4805550100",
    childCount: 2,
    childGrades: [{ grade: "4" }, { grade: "6" }],
    marketingOptIn: false,
    companyWebsite: "",
  };

  it("passes valid payload", () => {
    assert.equal(validateAcademySubmission(base), null);
  });

  it("blocks honeypot", () => {
    assert.match(
      validateAcademySubmission({ ...base, companyWebsite: "https://spam.test" }) ?? "",
      /Unable to submit/,
    );
  });

  it("enforces technical child max", () => {
    const message = validateAcademySubmission({
      ...base,
      childCount: ACADEMY_MAX_CHILDREN + 1,
      childGrades: [],
    });
    assert.match(String(message), /technical limit/);
  });
});
