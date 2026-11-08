import { NextResponse } from "next/server";
import { submitAcademyInterest } from "@/lib/academy-submit";
import { parseJsonBody } from "@/lib/validation";

type AcademyBody = {
  fields?: Record<string, unknown>;
  hutk?: string;
};

export async function POST(request: Request) {
  const body = parseJsonBody<AcademyBody>(await request.json());
  if (!body?.fields) {
    return NextResponse.json(
      { success: false, error: "Invalid request body", stage: "validation", code: "invalid_body" },
      { status: 400 },
    );
  }
  const result = await submitAcademyInterest({
    fields: body.fields,
    hutk: body?.hutk,
    pageUri: request.headers.get("referer") ?? undefined,
  });

  if (result.ok) {
    console.info("[NBBL HubSpot] Academy interest submission confirmed", {
      status: result.hubspotDiagnostic.status,
    });
    return NextResponse.json({
      success: true,
      stage: result.stage,
      hubspot: result.hubspot,
      hubspotDiagnostic: result.hubspotDiagnostic,
    });
  }

  if (result.stage === "hubspot") {
    console.error("[NBBL HubSpot] Academy interest submission failed");
  }

  return NextResponse.json(
    {
      success: false,
      error: result.error,
      stage: result.stage,
      ...(result.code ? { code: result.code } : {}),
      ...(result.hubspot ? { hubspot: result.hubspot } : {}),
    },
    { status: result.status },
  );
}
