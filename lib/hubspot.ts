export type HubSpotField = { name: string; value: string };

export type InquiryKind = "creator" | "fundraiser";
export type PaidKind = "session" | "showcase";
export type AcademyKind = "academy";
export type FormKind = InquiryKind | PaidKind | AcademyKind;

/** Values written to the HubSpot `nbbl_segment` contact property. */
export const NBBL_SEGMENTS: Record<FormKind, string> = {
  session: "Paid Training Sessions",
  showcase: "Showcase Inquiries",
  creator: "Content Creator Inquiries",
  fundraiser: "Fundraiser Inquiries",
  academy: "Academy Interest",
};

export function getNbblSegment(kind: FormKind): string {
  return NBBL_SEGMENTS[kind];
}

function getFormGuid(kind: FormKind): string | undefined {
  switch (kind) {
    case "session": return process.env.HUBSPOT_FORM_SESSIONS;
    case "showcase": return process.env.HUBSPOT_FORM_SHOWCASE;
    case "creator": return process.env.HUBSPOT_FORM_CREATOR;
    case "fundraiser": return process.env.HUBSPOT_FORM_FUNDRAISER;
    case "academy": return process.env.HUBSPOT_FORM_ACADEMY;
    default: return undefined;
  }
}

export function isHubSpotConfigured(kind: FormKind): boolean {
  const portalId = process.env.HUBSPOT_PORTAL_ID;
  const formGuid = getFormGuid(kind);
  return Boolean(portalId && formGuid && !portalId.startsWith("YOUR_") && !formGuid.startsWith("YOUR_"));
}

export type HubSpotConsentCommunication = {
  value: boolean;
  subscriptionTypeId: number;
  text: string;
};

export type HubSpotSubmitOptions = {
  hutk?: string;
  pageUri?: string;
  pageName?: string;
  legalConsentOptions?: {
    consent: {
      consentToProcess: boolean;
      text: string;
      communications?: HubSpotConsentCommunication[];
    };
  };
};

export type HubSpotSubmissionResult = {
  status: number;
  responseBody: string;
  contentType?: string;
};

export async function submitToHubSpot(
  kind: FormKind,
  fields: HubSpotField[],
  options?: HubSpotSubmitOptions,
): Promise<HubSpotSubmissionResult> {
  const portalId = process.env.HUBSPOT_PORTAL_ID;
  const formGuid = getFormGuid(kind);

  if (!portalId || !formGuid) {
    console.error("[NBBL HubSpot] Submission FAILED: HubSpot is not configured", {
      kind,
      hasPortalId: Boolean(portalId),
      hasFormGuid: Boolean(formGuid),
    });
    throw new Error("HubSpot is not configured");
  }

  console.info("[NBBL HubSpot] Submitting form", {
    kind,
    portalId,
    formGuid,
    fieldNames: fields.map((field) => field.name),
  });

  const body: Record<string, unknown> = { fields };
  if (options?.legalConsentOptions) {
    body.legalConsentOptions = options.legalConsentOptions;
  }
  if (options?.hutk || options?.pageUri || options?.pageName) {
    body.context = {
      ...(options.hutk ? { hutk: options.hutk } : {}),
      ...(options.pageUri ? { pageUri: options.pageUri } : {}),
      ...(options.pageName ? { pageName: options.pageName } : {}),
    };
  }

  const endpoint = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const responseText = await response.text();
  const contentType = response.headers.get("content-type") ?? undefined;
  const diagnostics = { kind, portalId, formGuid, status: response.status, contentType, response: responseText };

  if (!response.ok) {
    console.error("[NBBL HubSpot] Submission FAILED", diagnostics);
    throw new Error(`HubSpot submission failed (${response.status}): ${responseText}`);
  }

  console.info("[NBBL HubSpot] Submission SUCCEEDED", diagnostics);
  return { status: response.status, responseBody: responseText, contentType };
}

export function toHubSpotFields(
  record: Record<string, string | number | undefined>,
): HubSpotField[] {
  return Object.entries(record)
    .filter(([, value]) => value !== undefined && value !== "")
    .map(([name, value]) => ({ name, value: String(value) }));
}
