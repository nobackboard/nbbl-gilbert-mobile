/**
 * NBBL Academy interest capture — validation and HubSpot field assembly.
 * Abuse limits below are technical (API/UI), not business eligibility rules.
 */

/** Maximum children per submission (technical limit — prevents oversized payloads). */
export const ACADEMY_MAX_CHILDREN = 20;

export const ACADEMY_GRADE_OPTIONS = [
  { value: "pre-k", label: "Pre-K" },
  { value: "kindergarten", label: "Kindergarten" },
  { value: "1", label: "1st grade" },
  { value: "2", label: "2nd grade" },
  { value: "3", label: "3rd grade" },
  { value: "4", label: "4th grade" },
  { value: "5", label: "5th grade" },
  { value: "6", label: "6th grade" },
  { value: "7", label: "7th grade" },
  { value: "8", label: "8th grade" },
  { value: "9", label: "9th grade" },
  { value: "10", label: "10th grade" },
  { value: "11", label: "11th grade" },
  { value: "12", label: "12th grade" },
  { value: "other", label: "Other" },
] as const;

export type AcademyGradeValue = (typeof ACADEMY_GRADE_OPTIONS)[number]["value"];

export const ACADEMY_MARKETING_CONSENT_LABEL =
  "Yes, I’d like to receive NBBL Academy launch news and marketing updates by email. I can unsubscribe at any time.";

/**
 * HubSpot subscription type: Marketing Information (portal 247117755).
 * Unverified in this environment — confirm in HubSpot Settings → Email → Subscriptions before go-live.
 */
export const HUBSPOT_SUBSCRIPTION_MARKETING_INFORMATION_ID = 3418397349;

export type ChildGradeEntry = {
  grade: string;
  gradeOther?: string;
};

export function parseChildCount(raw: unknown): number | null {
  if (typeof raw === "number" && Number.isInteger(raw)) {
    return raw;
  }
  if (typeof raw === "string" && raw.trim() !== "") {
    const parsed = Number.parseInt(raw.trim(), 10);
    if (Number.isInteger(parsed)) {
      return parsed;
    }
  }
  return null;
}

export function normalizeChildGrades(raw: unknown, childCount: number): ChildGradeEntry[] | string {
  if (!Array.isArray(raw)) {
    return "Child grades must be an array";
  }
  if (raw.length !== childCount) {
    return `Provide exactly ${childCount} grade selection(s), one per interested child`;
  }

  const entries: ChildGradeEntry[] = [];
  for (let i = 0; i < raw.length; i += 1) {
    const item = raw[i];
    if (!item || typeof item !== "object") {
      return `Invalid grade entry for child ${i + 1}`;
    }
    const record = item as Record<string, unknown>;
    const grade = typeof record.grade === "string" ? record.grade.trim() : "";
    if (!grade) {
      return `Missing grade for child ${i + 1}`;
    }
    const validValues = ACADEMY_GRADE_OPTIONS.map((opt) => opt.value);
    if (!validValues.includes(grade as AcademyGradeValue)) {
      return `Invalid grade for child ${i + 1}`;
    }
    const gradeOther =
      typeof record.gradeOther === "string" ? record.gradeOther.trim() : "";
    if (grade === "other" && !gradeOther) {
      return `Describe the current grade when Other is selected (child ${i + 1})`;
    }
    if (grade === "other" && gradeOther.length > 200) {
      return `Grade description is too long for child ${i + 1} (max 200 characters)`;
    }
    entries.push({
      grade,
      ...(grade === "other" ? { gradeOther } : {}),
    });
  }
  return entries;
}

export function formatGradeLabel(grade: string, gradeOther?: string): string {
  if (grade === "other") {
    return `Other — ${gradeOther ?? ""}`;
  }
  const match = ACADEMY_GRADE_OPTIONS.find((opt) => opt.value === grade);
  return match?.label ?? grade;
}

export function formatAcademyGradesForHubSpot(entries: ChildGradeEntry[]): string {
  return entries
    .map((entry, index) => `Child ${index + 1}: ${formatGradeLabel(entry.grade, entry.gradeOther)}`)
    .join("\n");
}

export type AcademyValidationInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  childCount: unknown;
  childGrades: unknown;
  marketingOptIn: unknown;
  companyWebsite?: string;
};

export function validateAcademySubmission(input: AcademyValidationInput): string | null {
  if (input.companyWebsite?.trim()) {
    return "Unable to submit request";
  }
  if (!input.firstName) {
    return "Missing required field: firstName";
  }
  if (!input.lastName) {
    return "Missing required field: lastName";
  }
  if (!input.email) {
    return "Missing required field: email";
  }
  if (!input.phone) {
    return "Missing required field: phone";
  }
  const childCount = parseChildCount(input.childCount);
  if (childCount === null || childCount < 1) {
    return "Number of interested children must be a positive whole number";
  }
  if (childCount > ACADEMY_MAX_CHILDREN) {
    return `Number of interested children cannot exceed ${ACADEMY_MAX_CHILDREN} per submission (technical limit). Email info@nobackboard.com if you need to register more.`;
  }
  const gradesResult = normalizeChildGrades(input.childGrades, childCount);
  if (typeof gradesResult === "string") {
    return gradesResult;
  }
  if (typeof input.marketingOptIn !== "boolean") {
    return "Invalid marketing preference";
  }
  return null;
}

export function parseMarketingOptIn(raw: unknown): boolean {
  return raw === true;
}
