import { NextResponse } from "next/server";
import {
  ACADEMY_MARKETING_CONSENT_LABEL,
  formatAcademyGradesForHubSpot,
  HUBSPOT_SUBSCRIPTION_MARKETING_INFORMATION_ID,
  normalizeChildGrades,
  parseChildCount,
  parseMarketingOptIn,
  validateAcademySubmission,
} from "@/lib/academy";
import { getNbblSegment, isHubSpotConfigured, submitToHubSpot, toHubSpotFields } from "@/lib/hubspot";
import { getStringField, parseJsonBody, validateEmailField } from "@/lib/validation";

type AcademyBody = {
  fields?: Record<string, unknown>;
  hutk?: string;
};

const PRIVACY_CONSENT_TEXT =
  "By submitting this form, you agree that NBBL may store your contact details to follow up about NBBL Academy interest. See our Privacy Policy at https://nobackboardbasketballgym.com/assets/NBBL%20Privacy%20Policy.pdf";

export async function POST(request: Request) {
  const body = parseJsonBody<AcademyBody>(await request.json());
  if (!body?.fields) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!isHubSpotConfigured("academy")) {
    return NextResponse.json(
      {
        error:
          "HubSpot is not configured for NBBL Academy interest. Add HUBSPOT_FORM_ACADEMY to your environment, or email info@nobackboard.com.",
        hubspot: "failed",
      },
      { status: 503 },
    );
  }

  const fields = body.fields;
  const firstName = getStringField(fields, "firstName");
  const lastName = getStringField(fields, "lastName");
  const email = getStringField(fields, "email");
  const phone = getStringField(fields, "phone");
  const companyWebsite = getStringField(fields, "companyWebsite");

  const validationError = validateAcademySubmission({
    firstName,
    lastName,
    email,
    phone,
    childCount: fields.childCount,
    childGrades: fields.childGrades,
    marketingOptIn: fields.marketingOptIn,
    companyWebsite,
  });
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const emailError = validateEmailField(fields, "email");
  if (emailError) {
    return NextResponse.json({ error: emailError }, { status: 400 });
  }

  const childCount = parseChildCount(fields.childCount)!;
  const childGrades = normalizeChildGrades(fields.childGrades, childCount);
  if (typeof childGrades === "string") {
    return NextResponse.json({ error: childGrades }, { status: 400 });
  }

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

  const legalConsentOptions = marketingOptIn
    ? {
        consent: {
          consentToProcess: true,
          text: PRIVACY_CONSENT_TEXT,
          communications: [
            {
              value: true,
              subscriptionTypeId: HUBSPOT_SUBSCRIPTION_MARKETING_INFORMATION_ID,
              text: ACADEMY_MARKETING_CONSENT_LABEL,
            },
          ],
        },
      }
    : undefined;

  try {
    const result = await submitToHubSpot("academy", hubspotFields, {
      hutk: body.hutk,
      pageUri: request.headers.get("referer") ?? undefined,
      pageName: "NBBL Gilbert — Academy Interest",
      legalConsentOptions,
    });
    console.info("[NBBL HubSpot] Academy interest submission confirmed", {
      marketingOptIn,
      status: result.status,
      response: result.responseBody,
    });
    return NextResponse.json({
      success: true,
      hubspot: "submitted",
      hubspotDiagnostic: {
        status: result.status,
        responseBody: result.responseBody,
        contentType: result.contentType,
      },
    });
  } catch (error) {
    console.error("[NBBL HubSpot] Academy interest submission failed", error);
    return NextResponse.json(
      { error: "Unable to submit your request right now. Please try again.", hubspot: "failed" },
      { status: 500 },
    );
  }
}
