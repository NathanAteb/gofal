/**
 * Prompt Templates — AIOS Intelligence Layer
 *
 * All AI reasoning prompts live here. Centralised for auditability,
 * version control, and iteration.
 */

export const SYSTEM_GOFAL = `You are the AI brain of gofal.wales — Wales' first Welsh-language care home directory.

Key context:
- gofal.wales lists ~1,000 care homes across all 22 Welsh counties
- The platform is bilingual: Welsh first, English equal
- CIW (Care Inspectorate Wales) is the regulator — NEVER say CQC
- The Active Offer means proactively offering Welsh-language care
- Revenue model: free listings → enhanced (£29/mo) → featured (£49/mo)
- Strategic goal: every claimed listing is a warm lead for Ateb voice agents (£300-500/mo)

Always be concise, data-driven, and actionable.`;

// --- Enquiry Scoring ---

export function enquiryScoringPrompt(enquiry: {
  care_type: string;
  timeline: string;
  welsh_speaker: boolean;
  message: string | null;
  care_home_claimed: boolean;
  care_home_tier: string;
}): string {
  return `Score this care home enquiry for conversion likelihood (1-10) and explain why.

Enquiry details:
- Care type needed: ${enquiry.care_type}
- Timeline: ${enquiry.timeline}
- Welsh speaker needed: ${enquiry.welsh_speaker ? "Yes" : "No"}
- Message: ${enquiry.message || "(no message)"}
- Care home is claimed: ${enquiry.care_home_claimed ? "Yes" : "No"}
- Care home listing tier: ${enquiry.care_home_tier}

Scoring criteria:
- Urgent timeline ("this week", "this month") = higher score
- Nursing/dementia care = higher value
- Welsh speaker = strategic fit for Active Offer positioning
- Claimed home = more likely to respond
- Detailed message = more serious enquiry

Return JSON:
{
  "score": <1-10>,
  "reasoning": "<one sentence>",
  "priority": "<high|medium|low>",
  "suggested_action": "<what Nathan should do>"
}`;
}

// --- Daily Briefing ---

export function dailyBriefingPrompt(data: {
  totalHomes: number;
  claimedHomes: number;
  totalEnquiries: number;
  newEnquiries: number;
  pendingClaims: number;
  recentEnquiries: Array<{
    family_name: string;
    care_type: string;
    timeline: string;
    welsh_speaker: boolean;
    status: string;
    created_at: string;
  }>;
  recentClaims: Array<{
    claimant_name: string;
    claimant_role: string;
    verified: boolean;
    created_at: string;
  }>;
}): string {
  return `Generate a morning business briefing for Nathan (founder of gofal.wales).

Today's date: ${new Date().toISOString().split("T")[0]}

Platform stats:
- Total care homes listed: ${data.totalHomes}
- Claimed listings: ${data.claimedHomes} (${data.totalHomes > 0 ? ((data.claimedHomes / data.totalHomes) * 100).toFixed(1) : 0}%)
- Total enquiries all time: ${data.totalEnquiries}
- New enquiries (last 7 days): ${data.newEnquiries}
- Pending claims (unverified): ${data.pendingClaims}

Recent enquiries (last 7 days):
${data.recentEnquiries.map((e) => `- ${e.family_name}: ${e.care_type}, timeline "${e.timeline}", Welsh speaker: ${e.welsh_speaker ? "yes" : "no"}, status: ${e.status} (${e.created_at})`).join("\n") || "None"}

Recent claims (last 7 days):
${data.recentClaims.map((c) => `- ${c.claimant_name} (${c.claimant_role}), verified: ${c.verified ? "yes" : "no"} (${c.created_at})`).join("\n") || "None"}

Generate a briefing with these sections:
1. **TL;DR** — one sentence summary of platform health
2. **Key numbers** — 3-5 bullet points with the most important metrics and week-over-week direction
3. **Action items** — 2-3 specific things Nathan should do today, prioritised
4. **Opportunities** — any patterns or opportunities spotted in the data
5. **Risk flags** — anything concerning (e.g. no enquiries, claim drop-off)

Keep it under 300 words. Be direct and honest — Nathan doesn't want sugar-coating.`;
}

// --- Outreach Email Personalisation ---

export function outreachEmailPrompt(careHome: {
  name: string;
  town: string;
  county: string;
  service_type: string;
  bed_count: number | null;
  active_offer_level: number;
  ciw_rating_care_support: string | null;
  operator_name: string | null;
}): string {
  return `Write a personalised outreach email to the manager of ${careHome.name}.

Care home details:
- Name: ${careHome.name}
- Location: ${careHome.town}, ${careHome.county}
- Type: ${careHome.service_type}
- Beds: ${careHome.bed_count || "unknown"}
- Active Offer level: ${careHome.active_offer_level}/3
- CIW Care & Support rating: ${careHome.ciw_rating_care_support || "not yet rated"}
- Operator: ${careHome.operator_name || "independent"}

Write two versions:
1. Welsh (natural, warm, not Google Translate)
2. English (warm, personal, not salesy)

The email should:
- Mention their specific CIW rating or Active Offer level if noteworthy
- Reference their location/county
- Explain they're already listed on gofal.wales (free)
- Invite them to claim and enhance their profile
- Keep each version under 150 words
- Sign off as "Nathan, gofal.wales"

Return JSON:
{
  "subject_cy": "<Welsh subject line>",
  "subject_en": "<English subject line>",
  "body_cy": "<Welsh email body>",
  "body_en": "<English email body>"
}`;
}

// --- Care Home Description Generation ---

export function descriptionPrompt(careHome: {
  name: string;
  town: string;
  county: string;
  service_type: string;
  bed_count: number | null;
  active_offer_level: number;
  ciw_rating_wellbeing: string | null;
  ciw_rating_care_support: string | null;
  ciw_rating_leadership: string | null;
  ciw_rating_environment: string | null;
  operator_name: string | null;
  registered_manager: string | null;
}): string {
  const ratings = [
    careHome.ciw_rating_wellbeing ? `Well-being: ${careHome.ciw_rating_wellbeing}` : null,
    careHome.ciw_rating_care_support ? `Care & Support: ${careHome.ciw_rating_care_support}` : null,
    careHome.ciw_rating_leadership ? `Leadership: ${careHome.ciw_rating_leadership}` : null,
    careHome.ciw_rating_environment ? `Environment: ${careHome.ciw_rating_environment}` : null,
  ].filter(Boolean).join(", ");

  return `Write a bilingual description for this Welsh care home listing.

Care home: ${careHome.name}
Location: ${careHome.town}, ${careHome.county}
Type: ${careHome.service_type}
Beds: ${careHome.bed_count || "not specified"}
Operator: ${careHome.operator_name || "independent"}
Manager: ${careHome.registered_manager || "not listed"}
CIW ratings: ${ratings || "not yet inspected"}
Active Offer level: ${careHome.active_offer_level}/3

Write:
1. English description (100-150 words) — informative, warm, factual
2. Welsh description (100-150 words) — natural Welsh, not a translation

Both should:
- Mention the town/county and what makes the location suitable for care
- Reference CIW ratings if available
- Note Welsh language provision if Active Offer level > 0
- Be suitable for a directory listing (families searching for care)
- NEVER fabricate details not provided above

Return JSON:
{
  "description_en": "<English description>",
  "description_cy": "<Welsh description>"
}`;
}
