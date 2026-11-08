import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it, mock } from "node:test";
import { serializeAcademyFormPayload } from "./academy-client-payload.ts";
import { submitAcademyInterest } from "./academy-submit.ts";

const syntheticFields = {
  firstName: "Preview",
  lastName: "Tester",
  email: "preview.tester@example.com",
  phone: "4805550199",
  childCount: 1,
  childGrades: [{ grade: "12" }],
  dataProcessingConsent: true,
  marketingOptIn: false,
  botCheck: "",
};

describe("serializeAcademyFormPayload", () => {
  it("matches AcademyForm POST body shape", () => {
    const body = serializeAcademyFormPayload(syntheticFields);
    assert.equal(body.fields.childCount, 1);
    assert.deepEqual(body.fields.childGrades, [{ grade: "12" }]);
    assert.equal(body.fields.dataProcessingConsent, true);
    assert.equal(body.fields.marketingOptIn, false);
    assert.equal(body.fields.botCheck, "");
    assert.equal("companyWebsite" in body.fields, false);
  });
});

describe("submitAcademyInterest", () => {
  const original = { ...process.env };

  beforeEach(() => {
    process.env.HUBSPOT_PORTAL_ID = "247117755";
    process.env.HUBSPOT_FORM_ACADEMY = "0fd98b79-27df-4e09-a366-6383c4baef6a";
  });

  afterEach(() => {
    process.env = { ...original };
    mock.restoreAll();
  });

  it("returns validation stage when legacy companyWebsite honeypot is filled", async () => {
    const payload = serializeAcademyFormPayload(syntheticFields).fields;
    const result = await submitAcademyInterest({
      fields: { ...payload, companyWebsite: "https://legacy-autofill.example" },
    });
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.code, "honeypot");
    assert.equal(result.stage, "validation");
  });

  it("returns validation stage when honeypot is filled (autofill regression)", async () => {
    const result = await submitAcademyInterest({
      fields: {
        ...serializeAcademyFormPayload({ ...syntheticFields, botCheck: "https://autofill.example" })
          .fields,
      },
    });
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.status, 400);
    assert.equal(result.stage, "validation");
    assert.equal(result.code, "honeypot");
  });

  it("returns validation stage when data processing consent is false", async () => {
    const result = await submitAcademyInterest({
      fields: serializeAcademyFormPayload({ ...syntheticFields, dataProcessingConsent: false }).fields,
    });
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.stage, "validation");
    assert.equal(result.code, "data_processing_consent");
  });

  it("accepts synthetic UI payload without calling HubSpot when fetch mock fails", async () => {
    mock.method(globalThis, "fetch", async () => {
      throw new Error("fetch should not run in validation-only path");
    });
    const blocked = await submitAcademyInterest({
      fields: serializeAcademyFormPayload({ ...syntheticFields, botCheck: "filled" }).fields,
    });
    assert.equal(blocked.ok, false);
  });

  it("distinguishes hubspot stage on successful mocked submission", async () => {
    mock.method(globalThis, "fetch", async () => {
      return new Response(JSON.stringify({ inlineMessage: "Thanks" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    });

    const result = await submitAcademyInterest({
      fields: serializeAcademyFormPayload(syntheticFields).fields,
    });
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.stage, "hubspot");
    assert.equal(result.hubspot, "submitted");
  });

  it("returns hubspot failure stage when HubSpot responds with error", async () => {
    mock.method(globalThis, "fetch", async () => {
      return new Response("field error", { status: 400 });
    });

    const result = await submitAcademyInterest({
      fields: serializeAcademyFormPayload(syntheticFields).fields,
    });
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.stage, "hubspot");
    assert.equal(result.status, 500);
    assert.equal(result.hubspot, "failed");
  });
});
