# NBBL Academy interest — HubSpot configuration

Portal **247117755** (`nobackboardbasketballgym.com`). **Backend HubSpot schema was not verified by the Cloud Agent** (no forms API permission). The checklist below combines Michael’s reported draft UI with this repo’s API mapping — confirm in HubSpot before publish.

## Draft form (manually created — unpublished)

| Field | Value |
|-------|--------|
| Form name | NBBL Academy Interest |
| Portal ID | `247117755` |
| Form GUID | `0fd98b79-27df-4e09-a366-6383c4baef6a` |
| Status | **Draft** (unpublished at time of last update) |
| Vercel env | `HUBSPOT_FORM_ACADEMY=0fd98b79-27df-4e09-a366-6383c4baef6a` (set at deploy — **not** changed by agent) |

### Reported draft fields (preview UI — not API-verified)

- Required: parent first name, last name, email, phone, children count, children grades
- Hidden: `nbbl_segment` = `Academy Interest`
- **Required (unchecked):** data processing — *“I agree to allow NO BACKBOARD BASKETBALL LEAGUE to store and process my personal data.”* + Privacy Policy link
- **Optional (unchecked):** Marketing Information subscription (`3418397349`) — *“Yes, I’d like to receive NBBL Academy launch news and marketing updates by email. I can unsubscribe at any time.”*

### Verified contact properties (per Michael)

| Internal name | Type |
|---------------|------|
| `academy_children_count` | Number |
| `academy_children_grades` | Textarea |

Standard fields: `firstname`, `lastname`, `email`, `phone`, `nbbl_segment`.

## Website behavior

| Item | Detail |
|------|--------|
| URL hash | `/#academy-interest` (FormHub tab) |
| API route | `POST /api/forms/academy` |
| Unconfigured | HTTP **503** — no silent success |
| Segment | `nbbl_segment` = `Academy Interest` |

Interest capture is **independent** of optional email marketing. Phone is for interest follow-up only, not SMS marketing.

## Consent alignment (site ↔ HubSpot API)

The site **never** sends `consentToProcess: true` unless the visitor checks the **required** data-processing checkbox (`lib/academy.ts` → `buildAcademyLegalConsentOptions`).

| User action | `legalConsentOptions` |
|-------------|------------------------|
| Data processing **unchecked** | Request rejected (400); no HubSpot call |
| Data processing **checked**, marketing **unchecked** | `consentToProcess: true` + processing text only |
| Both **checked** | Above + `communications` for subscription `3418397349` |

Marketing consent text and processing text match the HubSpot draft labels in `lib/academy.ts`.

Privacy PDF: `https://nobackboardbasketballgym.com/assets/NBBL%20Privacy%20Policy.pdf`

## Remaining release steps

1. **Publish** HubSpot form **NBBL Academy Interest** (draft → live) after field/consent review.
2. Confirm hidden `nbbl_segment` default and consent blocks match API expectations (HubSpot may require exact legal text on the form and in API payloads).
3. Set `HUBSPOT_FORM_ACADEMY=0fd98b79-27df-4e09-a366-6383c4baef6a` in **Vercel production** (and preview if desired); keep `HUBSPOT_PORTAL_ID=247117755`.
4. **Merge** website PR and **deploy** the site (agent does not merge/deploy).
5. Submit one **test** interest from staging/production; confirm contact properties and consent in HubSpot (no agent live submission).
6. Create or update **Academy Interest** active list (form submission filter).
7. If HubSpot rejects API submissions, compare form field internal names and legal consent configuration with fields sent from `app/api/forms/academy/route.ts`.

## Technical abuse limits (not eligibility)

| Limit | Value |
|-------|-------|
| Max children per submission | 20 |
| Max “Other” grade text | 200 chars |
| Honeypot | `botCheck` must be empty (do not label like a website field — autofill) |

## What the Cloud Agent did **not** do

- No live HubSpot reads/submissions
- No HubSpot publish
- No Vercel production env changes
- No merge or production deploy

Mock-tested: validation, consent payloads (processing false/true × marketing false/true), `isHubSpotConfigured`, mocked `submitToHubSpot`.
