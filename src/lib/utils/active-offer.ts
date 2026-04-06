/**
 * Detect Active Offer level from CIW inspection report text.
 * Returns a level from 0-3:
 * 0 = No information
 * 1 = Some Welsh
 * 2 = Good Welsh
 * 3 = Excellent Welsh
 */
export function detectActiveOfferLevel(reportText: string): number {
  if (!reportText) return 0;

  const lower = reportText.toLowerCase();

  // Level 3 indicators — proactive, embedded Welsh
  const level3Indicators = [
    "welsh is the first language",
    "welsh is the main language",
    "welsh language is embedded",
    "fully bilingual",
    "welsh is used naturally",
    "active offer is fully implemented",
    "welsh throughout",
    "cymraeg yn naturiol",
    "dwyieithog llawn",
  ];

  // Level 2 indicators — good provision
  const level2Indicators = [
    "welsh-speaking staff",
    "welsh speaking staff",
    "staff speak welsh",
    "able to communicate in welsh",
    "welsh language provision",
    "active offer",
    "cynnig rhagweithiol",
    "offer services in welsh",
    "bilingual",
    "signage is bilingual",
    "menus are bilingual",
  ];

  // Level 1 indicators — some provision
  const level1Indicators = [
    "some welsh",
    "limited welsh",
    "basic welsh",
    "one member of staff speaks welsh",
    "some staff can speak welsh",
    "attempts to use welsh",
    "welsh greetings",
  ];

  const hasLevel3 = level3Indicators.some((i) => lower.includes(i));
  const level2Count = level2Indicators.filter((i) => lower.includes(i)).length;
  const level1Count = level1Indicators.filter((i) => lower.includes(i)).length;

  if (hasLevel3 || level2Count >= 3) return 3;
  if (level2Count >= 1) return 2;
  if (level1Count >= 1) return 1;
  return 0;
}
