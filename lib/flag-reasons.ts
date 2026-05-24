/** Maps stored flag reason codes to admin-facing labels. */
export const FLAG_REASON_LABELS: Record<string, string> = {
  'no-longer-safe': 'No longer feels safe for LGBTQ+ people',
  'closed-or-moved': 'Closed or moved',
  'harassment-or-violence': 'Harassment, threats, or violence',
  'police-or-authorities': 'Police or authorities regularly present',
  other: 'Other safety concern',
};

export function formatFlagReason(code: string): string {
  return FLAG_REASON_LABELS[code] ?? code;
}
