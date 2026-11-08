"use client";

import { trackEvent } from "@/lib/analytics";
import {
  ACADEMY_DATA_PROCESSING_CONSENT_LABEL,
  ACADEMY_GRADE_OPTIONS,
  ACADEMY_MARKETING_CONSENT_LABEL,
  ACADEMY_MAX_CHILDREN,
  type ChildGradeEntry,
} from "@/lib/academy";
import { serializeAcademyFormPayload } from "@/lib/academy-client-payload";
import { FormEvent, useEffect, useMemo, useState } from "react";

type AcademyFields = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  childCount: string;
  childGrades: ChildGradeEntry[];
  dataProcessingConsent: boolean;
  marketingOptIn: boolean;
  botCheck: string;
};

const emptyFields: AcademyFields = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  childCount: "1",
  childGrades: [{ grade: "" }],
  dataProcessingConsent: false,
  marketingOptIn: false,
  botCheck: "",
};

function getHubSpotCookie(): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(/(?:^|;\s*)hubspotutk=([^;]+)/);
  return match?.[1];
}

function resizeGrades(count: number, current: ChildGradeEntry[]): ChildGradeEntry[] {
  if (count < 1) return [{ grade: "" }];
  if (current.length === count) return current;
  if (current.length > count) return current.slice(0, count);
  return [...current, ...Array.from({ length: count - current.length }, () => ({ grade: "" }))];
}

export default function AcademyForm() {
  const [fields, setFields] = useState<AcademyFields>(emptyFields);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const parsedCount = useMemo(() => {
    const value = Number.parseInt(fields.childCount, 10);
    if (!Number.isInteger(value) || value < 1) return 1;
    return Math.min(value, ACADEMY_MAX_CHILDREN);
  }, [fields.childCount]);

  useEffect(() => {
    setFields((current) => ({
      ...current,
      childGrades: resizeGrades(parsedCount, current.childGrades),
    }));
  }, [parsedCount]);

  function updateField<K extends keyof AcademyFields>(key: K, value: AcademyFields[K]) {
    setFields((current) => ({ ...current, [key]: value }));
    setError(null);
    setSuccess(null);
  }

  function updateChildGrade(index: number, patch: Partial<ChildGradeEntry>) {
    setFields((current) => {
      const childGrades = current.childGrades.map((entry, i) =>
        i === index ? { ...entry, ...patch } : entry,
      );
      return { ...current, childGrades };
    });
    setError(null);
    setSuccess(null);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/forms/academy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...serializeAcademyFormPayload({
            firstName: fields.firstName,
            lastName: fields.lastName,
            email: fields.email,
            phone: fields.phone,
            childCount: parsedCount,
            childGrades: fields.childGrades,
            dataProcessingConsent: fields.dataProcessingConsent,
            marketingOptIn: fields.marketingOptIn,
            botCheck: fields.botCheck,
          }),
          hutk: getHubSpotCookie(),
        }),
      });

      const data = (await response.json()) as {
        success?: boolean;
        error?: string;
        stage?: "configuration" | "validation" | "hubspot";
        code?: string;
        hubspot?: "submitted" | "failed";
        hubspotDiagnostic?: { status: number; responseBody: string; contentType?: string };
      };

      console.info("[NBBL HubSpot] Academy form result", {
        hubspot: data.hubspot ?? "failed",
        httpStatus: response.status,
        hubspotDiagnostic: data.hubspotDiagnostic,
      });

      if (data.hubspot === "submitted") {
        console.info("[NBBL HubSpot] Academy form ADDED to HubSpot", data.hubspotDiagnostic);
      } else {
        console.error("[NBBL HubSpot] Academy form NOT added to HubSpot", {
          error: data.error,
          hubspotDiagnostic: data.hubspotDiagnostic,
        });
      }

      if (!response.ok || !data.success) {
        const fallback =
          data.stage === "hubspot"
            ? "We could not save your interest in HubSpot. Please try again or email info@nobackboard.com."
            : data.stage === "configuration"
              ? "Academy interest is not configured yet. Email info@nobackboard.com."
              : "Unable to submit your request.";
        throw new Error(data.error ?? fallback);
      }

      trackEvent("contact_submit", { form: "academy" });
      setSuccess(
        "Thank you — you're on the NBBL Academy interest list. This is not enrollment or payment, and it does not reserve a place. Our team may follow up with launch details.",
      );
      setFields(emptyFields);
    } catch (submitError) {
      console.error("[NBBL HubSpot] Academy form request failed", submitError);
      setError(submitError instanceof Error ? submitError.message : "Unable to submit your request.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return <div className="form-message form-message-success">{success}</div>;
  }

  return (
    <form className="nbbl-form academy-form" onSubmit={handleSubmit}>
      <p className="form-note">
        Join the <strong>NBBL Academy interest list</strong> for parents and guardians. We use your
        email and phone only for <strong>Academy interest follow-up</strong> (not enrollment or
        payment). Optional email below is separate Academy marketing — unchecked unless you opt in.
      </p>

      <div className="form-grid">
        <label className="form-field">
          <span>Parent / guardian first name *</span>
          <input
            value={fields.firstName}
            onChange={(e) => updateField("firstName", e.target.value)}
            autoComplete="given-name"
            required
          />
        </label>
        <label className="form-field">
          <span>Parent / guardian last name *</span>
          <input
            value={fields.lastName}
            onChange={(e) => updateField("lastName", e.target.value)}
            autoComplete="family-name"
            required
          />
        </label>
        <label className="form-field">
          <span>Email *</span>
          <input
            type="email"
            value={fields.email}
            onChange={(e) => updateField("email", e.target.value)}
            autoComplete="email"
            required
          />
        </label>
        <label className="form-field">
          <span>Phone *</span>
          <input
            type="tel"
            value={fields.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            autoComplete="tel"
            required
          />
          <small>For interest follow-up only — not a text-message marketing opt-in.</small>
        </label>
        <label className="form-field">
          <span>How many children are you interested in? *</span>
          <input
            type="number"
            min={1}
            max={ACADEMY_MAX_CHILDREN}
            step={1}
            value={fields.childCount}
            onChange={(e) => updateField("childCount", e.target.value)}
            required
          />
          <small>
            Enter a positive whole number (max {ACADEMY_MAX_CHILDREN} per submission — technical
            limit).
          </small>
        </label>

        <div className="form-field form-field-full academy-grades-block">
          <span>Current grade — one per child *</span>
          <small>
            Select each child&apos;s current grade. Duplicate grades are allowed. We do not collect
            child names, dates of birth, schools, or child contact details.
          </small>
          <div className="academy-grade-rows">
            {fields.childGrades.map((entry, index) => (
              <div className="academy-grade-row" key={`child-grade-${index}`}>
                <label className="form-field">
                  <span>Child {index + 1}</span>
                  <select
                    value={entry.grade}
                    onChange={(e) =>
                      updateChildGrade(index, {
                        grade: e.target.value,
                        gradeOther: e.target.value === "other" ? entry.gradeOther : undefined,
                      })
                    }
                    required
                  >
                    <option value="" disabled>
                      Select grade
                    </option>
                    {ACADEMY_GRADE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                {entry.grade === "other" ? (
                  <label className="form-field">
                    <span>Describe current grade *</span>
                    <input
                      value={entry.gradeOther ?? ""}
                      onChange={(e) => updateChildGrade(index, { gradeOther: e.target.value })}
                      placeholder="e.g. Homeschooled — 7th grade equivalent"
                      required
                      maxLength={200}
                    />
                  </label>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <label className="form-field form-field-full form-checkbox form-checkbox-required">
          <input
            type="checkbox"
            checked={fields.dataProcessingConsent}
            onChange={(e) => updateField("dataProcessingConsent", e.target.checked)}
            required
          />
          <span>
            {ACADEMY_DATA_PROCESSING_CONSENT_LABEL}{" "}
            <a href="/assets/NBBL%20Privacy%20Policy.pdf" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>
          </span>
        </label>

        <label className="form-field form-field-full form-checkbox">
          <input
            type="checkbox"
            checked={fields.marketingOptIn}
            onChange={(e) => updateField("marketingOptIn", e.target.checked)}
          />
          <span>{ACADEMY_MARKETING_CONSENT_LABEL}</span>
        </label>

        <p className="form-note form-field-full">
          By submitting, you confirm this is an <strong>interest request only</strong>. It does not
          enroll a child, collect payment, or guarantee a spot.
        </p>

        <div className="academy-honeypot" aria-hidden="true">
          <label className="form-field">
            <span>Leave empty</span>
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              inputMode="none"
              value={fields.botCheck}
              onChange={(e) => updateField("botCheck", e.target.value)}
              data-lpignore="true"
              data-1p-ignore
            />
          </label>
        </div>
      </div>

      {error ? <div className="form-message form-message-error">{error}</div> : null}
      <button type="submit" className="btn primary" disabled={submitting}>
        {submitting ? "Submitting..." : "Join Academy interest list"}
      </button>
    </form>
  );
}
