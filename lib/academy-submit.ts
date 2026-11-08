import {
  ACADEMY_HONEYPOT_ERROR,
  buildAcademyLegalConsentOptions,
  formatAcademyGradesForHubSpot,
  normalizeChildGrades,
  parseChildCount,
  parseDataProcessingConsent,
  parseMarketingOptIn,
  validateAcademySubmission,
} from "@/lib/academy";
import { getNbblSegment, isHubSpotConfigured, submitToHubSpot, toHubSpotFields } from "@/lib/hubspot";
import { getStringField, validateEmailField } from "@/lib/validation";

export type AcademySubmitStage = "configuration" | "validation" | "hubspot";

export type AcademySubmitFailure = {
  ok: false;
  status: 400 | 500 | 503;
  stage: AcademySubmitStage;
  error: string;
  code?: string;
  hubspot?: "failed";
};

export type AcademySubmitSuccess = {
  ok: true;
  status: 200;
  stage: "hubspot";
  hubspot: "submitted";
  hubspotDiagnostic: {
    status: number;
    responseBody: string;
    contentType?: string;
  };
};

export type AcademySubmitResult = AcademySubmitSuccess | AcademySubmitFailure;

export type AcademySubmitInput = {
  fields: Record<string, unknown>;
  hutk?: string;
  pageUri?: string;
};

export function classifyAcademyValidationError(message: string): string | undefined {
  if (message === ACADEMY_HONEYPOT_ERROR) {
    return "honeypot";
  }
  if (message.includes("data processing")) {
    return "data_processing_consent";
  }
  if (message.includes("grade") || message.includes("child")) {
    return "child_grades";
  }
  return "validation";
}

export async function submitAcademyInterest(input: AcademySubmitInput): Promise<AcademySubmitResult> {
  if (!input?.fields || typeof input.fields !== "object") {
    return {
      ok: false,
      status: 400,
      stage: "validation",
      code: "invalid_body",
      error: "Invalid request body",
    };
  }

  if (!isHubSpotConfigured("academy")) {
    return {
      ok: false,
      status: 503,
      stage: "configuration",
      error:
        "HubSpot is not configured for NBBL Academy interest. Add HUBSPOT_FORM_ACADEMY to your environment, or email info@nobackboard.com.",
      hubspot: "failed",
    };
  }

  const fields = input.fields;
  const firstName = getStringField(fields, "firstName");
  const lastName = getStringField(fields, "lastName");
  const email = getStringField(fields, "email");
  const phone = getStringField(fields, "phone");
  const botCheck =
    getStringField(fields, "botCheck") || getStringField(fields, "companyWebsite");

  const validationError = validateAcademySubmission({
    firstName,
    lastName,
    email,
    phone,
    childCount: fields.childCount,
    childGrades: fields.childGrades,
    dataProcessingConsent: fields.dataProcessingConsent,
    marketingOptIn: fields.marketingOptIn,
    botCheck,
  });
  if (validationError) {
    return {
      ok: false,
      status: 400,
      stage: "validation",
      code: classifyAcademyValidationError(validationError),
      error: validationError,
    };
  }

  const emailError = validateEmailField(fields, "email");
  if (emailError) {
    return {
      ok: false,
      status: 400,
      stage: "validation",
      code: "email",
      error: emailError,
    };
  }

  const childCount = parseChildCount(fields.childCount)!;
  const childGrades = normalizeChildGrades(fields.childGrades, childCount);
  if (typeof childGrades === "string") {
    return {
      ok: false,
      status: 400,
      stage: "validation",
      code: "child_grades",
      error: childGrades,
    };
  }

  const dataProcessingConsent = parseDataProcessingConsent(fields.dataProcessingConsent);
  const marketingOptIn = parseMarketingOptIn(fields.marketingOptIn);
  const gradesText = formatAcademyGradesForHubSpot(childGrades);

  const hubspotFields = toHubSpotFields({
    firstname: firstName,
    lastname: lastName,
    email,
    phone,
    academy_children_count: String(childCount),
    academy_children_grades: gradesText,
    nbbl_segment: getNbblSegment("academy"),
  });

  const legalConsentOptions = buildAcademyLegalConsentOptions(dataProcessingConsent, marketingOptIn);
  if (!legalConsentOptions) {
    return {
      ok: false,
      status: 400,
      stage: "validation",
      code: "data_processing_consent",
      error: "You must agree to data processing before submitting",
    };
  }

  try {
    const result = await submitToHubSpot("academy", hubspotFields, {
      hutk: input.hutk,
      pageUri: input.pageUri,
      pageName: "NBBL Gilbert — Academy Interest",
      legalConsentOptions,
    });
    return {
      ok: true,
      status: 200,
      stage: "hubspot",
      hubspot: "submitted",
      hubspotDiagnostic: {
        status: result.status,
        responseBody: result.responseBody,
        contentType: result.contentType,
      },
    };
  } catch {
    return {
      ok: false,
      status: 500,
      stage: "hubspot",
      hubspot: "failed",
      error: "Unable to submit your request right now. Please try again.",
    };
  }
}
