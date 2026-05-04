/** Règles du concours trimestriel (points annuels, tirage pondéré). */

export const DRAW_CONFIG = {
  quarterly_draw_value: 750,
  minimum_points_required: 5,
  chances_per_point: 1,
};

const POINTS_CONFIG = {
  referral: 1,
  google_review: 1,
  existing_client: 1,
};

export function computeReferralStats(referrals = [], googleReview = null, existingClient = null) {
  const total = referrals.length;
  const qualified = referrals.filter((r) => r.status === 'qualified').length;
  const pending = referrals.filter((r) => r.status === 'pending').length;

  const reviewsList = googleReview ? [googleReview] : [];
  const verifiedReviews = reviewsList.filter((r) => r.status === 'verified').length;
  const pendingReviews = reviewsList.filter((r) => r.status === 'pending').length;

  const clientsList = existingClient ? [existingClient] : [];
  const verifiedClients = clientsList.filter((c) => c.status === 'verified').length;
  const pendingClients = clientsList.filter((c) => c.status === 'pending').length;

  const referralPoints = qualified * POINTS_CONFIG.referral;
  const reviewPoints = verifiedReviews * POINTS_CONFIG.google_review;
  const clientPoints = verifiedClients * POINTS_CONFIG.existing_client;
  const totalPoints = referralPoints + reviewPoints + clientPoints;

  const pointsBreakdown = {
    referrals: { verified: qualified, pending, points: referralPoints },
    google_reviews: { verified: verifiedReviews, pending: pendingReviews, points: reviewPoints },
    existing_clients: { verified: verifiedClients, pending: pendingClients, points: clientPoints },
  };

  const pointsToEligibility = Math.max(0, DRAW_CONFIG.minimum_points_required - totalPoints);
  const drawEligible = totalPoints >= DRAW_CONFIG.minimum_points_required;
  const drawChances = drawEligible ? totalPoints * DRAW_CONFIG.chances_per_point : 0;

  return {
    total_referrals: total,
    qualified_referrals: qualified,
    pending_referrals: pending,
    total_points: totalPoints,
    points_breakdown: pointsBreakdown,
    current_tier: null,
    next_tier: null,
    points_to_next_tier: pointsToEligibility,
    total_rewards_earned: drawEligible ? 'Admissible au tirage trimestriel' : 'Non admissible au tirage',
    quarterly_draw: {
      value: DRAW_CONFIG.quarterly_draw_value,
      minimum_points: DRAW_CONFIG.minimum_points_required,
      chances_per_point: DRAW_CONFIG.chances_per_point,
      is_eligible: drawEligible,
      points_to_eligibility: pointsToEligibility,
      chances: drawChances,
    },
  };
}
