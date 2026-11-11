// HubSpot Forms integration for the website contact / project inquiry form.
//
// Submissions go to HubSpot's public (unauthenticated) Forms Submission API,
// which supports CORS and needs no API token, so nothing secret ships to the
// browser. Portal and form IDs are public identifiers by design.
//
// Field names and dropdown option values below were taken from the published
// form definition ("Incaendo Website Project Inquiry"). If the HubSpot form is
// edited, keep this file in sync with it.

export const HUBSPOT_PORTAL_ID = '247936160'
export const HUBSPOT_FORM_ID = 'f9e71662-d369-42b4-a9f4-15faf91bf131'
export const HUBSPOT_REGION = 'na2'

// HubSpot hosts non-na1 accounts on region-suffixed hosts (api-na2, api-eu1…),
// the same pattern HubSpot's own embed script uses.
const apiHost =
  HUBSPOT_REGION && HUBSPOT_REGION !== 'na1'
    ? `https://api-${HUBSPOT_REGION}.hsforms.com`
    : 'https://api.hsforms.com'

// HubSpot tracking code loader for this portal/region (sets `hubspotutk`).
export const HUBSPOT_TRACKING_SCRIPT_URL = `https://js${
  HUBSPOT_REGION && HUBSPOT_REGION !== 'na1' ? `-${HUBSPOT_REGION}` : ''
}.hs-scripts.com/${HUBSPOT_PORTAL_ID}.js`

export const HUBSPOT_SUBMIT_URL = `${apiHost}/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_ID}`

const CONTACT_OBJECT = '0-1'

// Visitor-facing failure copy; technical details only go to the console.
export const SUBMIT_FAILED_MESSAGE =
  'Please check your connection and try again.'

// Website form control name -> HubSpot contact property (all on the contact
// object, per the form's `0-1/<property>` field references).
export const HUBSPOT_FIELD_MAP = {
  name: 'full_name',
  email: 'email',
  company: 'company',
  phone: 'phone',
  topic: 'services',
  budget: 'project_budget',
  message: 'project_details',
}

const readCookie = (name) => {
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : ''
}

/**
 * Builds the HubSpot v3 submission body from the website form's FormData.
 * Empty optional values are left out so they never blank existing contact
 * data in HubSpot.
 */
export function buildHubSpotPayload(formData) {
  const fields = Object.entries(HUBSPOT_FIELD_MAP).flatMap(
    ([formName, hubspotName]) => {
      const raw = formData.get(formName)
      const value = typeof raw === 'string' ? raw.trim() : ''
      return value
        ? [{ objectTypeId: CONTACT_OBJECT, name: hubspotName, value }]
        : []
    },
  )

  const context = {
    pageUri: window.location.href,
    pageName: document.title,
  }
  // Links the submission to the visitor's HubSpot tracking cookie if the
  // HubSpot tracking code is present on the site; harmless otherwise.
  const hutk = readCookie('hubspotutk')
  if (hutk) context.hutk = hutk

  return { fields, context }
}

/**
 * Turns a failed HubSpot response into a visitor-facing message plus any
 * per-field errors (keyed by website form control name).
 */
export async function describeHubSpotError(response) {
  let errors = []
  try {
    const body = await response.json()
    if (Array.isArray(body?.errors)) errors = body.errors
  } catch {
    // Non-JSON body; fall through to the generic message.
  }

  // Logged for whoever debugs the integration; contains no visitor data
  // beyond what HubSpot echoes back about the failed fields.
  console.error(
    '[contact-form] HubSpot submission failed',
    response.status,
    errors,
  )

  const types = new Set(errors.map((e) => e?.errorType))
  const messages = errors.map((e) => String(e?.message ?? ''))
  const fieldErrors = {}
  const mentions = (hubspotName) =>
    messages.some(
      (m) => m.includes(`0-1/${hubspotName}`) || m.includes(`.${hubspotName}`),
    )

  if (types.has('INVALID_EMAIL') || types.has('BLOCKED_EMAIL')) {
    fieldErrors.email = 'Enter a valid work email address.'
  }

  if (
    types.has('REQUIRED_FIELD') ||
    types.has('VALUE_NOT_IN_FIELD_DEFINITION')
  ) {
    Object.entries(HUBSPOT_FIELD_MAP).forEach(([formName, hubspotName]) => {
      if (!fieldErrors[formName] && mentions(hubspotName)) {
        fieldErrors[formName] = 'Please check this field.'
      }
    })
  }

  return {
    message: SUBMIT_FAILED_MESSAGE,
    fieldErrors,
  }
}
