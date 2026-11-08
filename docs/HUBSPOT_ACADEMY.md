# NBBL Academy interest — HubSpot configuration

Portal **247117755** (`nobackboardbasketballgym.com`). This document describes what must exist in HubSpot before `HUBSPOT_FORM_ACADEMY` is set in Vercel. **Nothing here was live-verified** in the Cloud Agent environment (no forms API read permission, no test submissions).

## Website behavior

| Item | Detail |
|------|--------|
| URL hash | `/#academy-interest` (FormHub tab) |
| API route | `POST /api/forms/academy` |
| Env var | `HUBSPOT_FORM_ACADEMY` (form GUID) |
| Unconfigured | HTTP **503** with clear error — no silent success |
| Segment label | `nbbl_segment` = `Academy Interest` |

Interest capture is **independent** of optional email marketing consent. Phone is used for interest follow-up only, not SMS marketing.

## Create HubSpot form

**Marketing → Forms → Create form** (non-embedded; site posts via Forms API v3).

Suggested name: **NBBL Academy Interest**

### Standard contact fields (must exist on the form)

| Internal name | Label | Notes |
|---------------|-------|--------|
| `firstname` | First name | Parent / guardian |
| `lastname` | Last name | Parent / guardian |
| `email` | Email | |
| `phone` | Phone number | Interest contact only |
| `nbbl_segment` | NBBL Segment | Hidden; value `Academy Interest` |

### New contact properties

Create under **Settings → Data Management → Properties → Contact**:

| Internal name | Label | Type | Notes |
|---------------|-------|------|--------|
| `academy_children_count` | Academy children count | Single-line text or number | Count from form |
| `academy_children_grades` | Academy children grades | Multi-line text | One line per child, e.g. `Child 1: 5th grade` |

Add both properties to the HubSpot form (visible or hidden).

Every field the API sends **must** be on the form or HubSpot rejects the submission.

### Optional marketing email consent

Checkbox on the site (default **unchecked**):

> Yes, I’d like to receive NBBL Academy launch news and marketing updates by email. I can unsubscribe at any time.

When checked, the API includes `legalConsentOptions` with:

| Subscription type | ID (reported) | Used |
|-------------------|---------------|------|
| Marketing Information | `3418397349` | **Yes** — only when checkbox is checked |
| One to One | `3418397356` | **No** — not used; phone is not a marketing SMS opt-in |

**Before go-live:** In HubSpot **Settings → Email → Subscriptions**, confirm that **Marketing Information** subscription type ID is still `3418397349`. Update `HUBSPOT_SUBSCRIPTION_MARKETING_INFORMATION_ID` in `lib/academy.ts` if your portal uses a different ID.

HubSpot honors existing unsubscribes; do not bulk-set contacts as marketing contacts outside this consent path.

### Legal / privacy processing text

The API sends `consentToProcess: true` with privacy text referencing:

`https://nobackboardbasketballgym.com/assets/NBBL%20Privacy%20Policy.pdf`

(Hosted at `/public/assets/NBBL Privacy Policy.pdf` in this repo.)

## Active list (segment)

**CRM → Lists → Create list → Active list**

| List name | Suggested filter |
|-----------|------------------|
| Academy Interest | Submitted form **NBBL Academy Interest** |

Optional secondary filter: `nbbl_segment` is equal to `Academy Interest`.

## Environment variables

Add to `.env.local` and Vercel (production):

```env
HUBSPOT_FORM_ACADEMY=<form-guid-from-hubspot>
```

Existing values should already include:

```env
HUBSPOT_PORTAL_ID=247117755
NEXT_PUBLIC_HUBSPOT_PORTAL_ID=247117755
```

## Technical abuse limits (not eligibility rules)

| Limit | Value | Location |
|-------|-------|----------|
| Max children per submission | 20 | `ACADEMY_MAX_CHILDREN` in `lib/academy.ts` |
| Max “Other” grade text | 200 chars | `lib/academy.ts` |
| Honeypot field | `companyWebsite` must be empty | `AcademyForm.tsx` / API |

## What the Cloud Agent did **not** do

- No live HubSpot form create/update
- No test contact or submission
- No subscription / marketing contact billing changes
- No production Vercel env changes or deploy

Mock-tested in CI/local: validation, grade formatting, `isHubSpotConfigured("academy")`, and `submitToHubSpot` payload shape (fetch mocked).
