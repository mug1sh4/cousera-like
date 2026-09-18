/**
 * Formats level values strictly to "Level I / Level II / Level III"
 * Per specification: "Normalize level labels to 'Level I / Level II / Level III' only,
 * everywhere a level is shown — catalog filters, course cards (landing, catalog, dashboards),
 * course detail page, admin course table. Remove '(Foundation)'-style parentheticals and
 * remove the separate difficulty badge ('Beginner/Intermediate/Advanced') from all user-facing display."
 */
export function formatLevel(val: string | undefined | null): string {
  if (!val) return 'Level I';
  const lower = val.trim().toLowerCase();
  if (lower === 'foundation' || lower === 'beginner' || lower === 'level 1' || lower === 'level i' || lower.includes('level i')) {
    return 'Level I';
  }
  if (lower === 'intermediate' || lower === 'level 2' || lower === 'level ii' || lower.includes('level ii')) {
    return 'Level II';
  }
  if (lower === 'advanced' || lower === 'expert' || lower === 'level 3' || lower === 'level iii' || lower.includes('level iii')) {
    return 'Level III';
  }
  return val;
}

// Kept for backward-compatibility if referenced internally
export const formatDifficulty = formatLevel;

export function formatDuration(val: string | undefined): string {
  return val || '4 Weeks';
}
