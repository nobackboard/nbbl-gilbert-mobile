import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it, mock } from "node:test";
import {
  getNbblSegment,
  isHubSpotConfigured,
  submitToHubSpot,
  type HubSpotField,
} from "./hubspot.ts";

describe("getNbblSegment", () => {
  it("includes academy interest label", () => {
    assert.equal(getNbblSegment("academy"), "Academy Interest");
  });
});

describe("isHubSpotConfigured", () => {
  const original = { ...process.env };

  beforeEach(() => {
    process.env.HUBSPOT_PORTAL_ID = "247117755";
    process.env.HUBSPOT_FORM_ACADEMY = "00000000-0000-0000-0000-000000000001";
  });

  afterEach(() => {
    process.env = { ...original };
  });

  it("is false when academy form guid is missing", () => {
    delete process.env.HUBSPOT_FORM_ACADEMY;
    assert.equal(isHubSpotConfigured("academy"), false);
  });

  it("is true when portal and academy guid are set", () => {
    assert.equal(isHubSpotConfigured("academy"), true);
  });
});

describe("submitToHubSpot (mocked fetch)", () => {
  const original = { ...process.env };
  let fetchCalls: Array<{ url: string; init?: RequestInit }> = [];

  beforeEach(() => {
    process.env.HUBSPOT_PORTAL_ID = "247117755";
    process.env.HUBSPOT_FORM_ACADEMY = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee";
    fetchCalls = [];
    mock.method(globalThis, "fetch", async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === "string" ? input : input.toString();
      fetchCalls.push({ url, init });
      return new Response(JSON.stringify({ inlineMessage: "Thanks" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    });
  });

  afterEach(() => {
    mock.restoreAll();
    process.env = { ...original };
  });

  it("posts fields and optional legalConsentOptions for academy", async () => {
    const fields: HubSpotField[] = [
      { name: "firstname", value: "Sam" },
      { name: "lastname", value: "Lee" },
    ];
    await submitToHubSpot("academy", fields, {
      legalConsentOptions: {
        consent: {
          consentToProcess: true,
          text: "privacy",
          communications: [
            { value: true, subscriptionTypeId: 3418397349, text: "marketing opt-in" },
          ],
        },
      },
    });
    assert.equal(fetchCalls.length, 1);
    assert.match(fetchCalls[0]?.url ?? "", /247117755\/aaaaaaaa-bbbb/);
    const body = JSON.parse(String(fetchCalls[0]?.init?.body));
    assert.deepEqual(body.fields, fields);
    assert.ok(body.legalConsentOptions);
  });
});
