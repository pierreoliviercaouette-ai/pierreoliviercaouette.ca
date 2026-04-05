/** Même logique que l’ancien backend (server.py) pour les paliers et points. */

export const REWARD_TIERS = [
  { threshold: 10, reward: 'Carte cadeau de 25 $', name: 'Bronze' },
  { threshold: 20, reward: 'Carte cadeau de 50 $', name: 'Argent' },
  { threshold: 40, reward: 'Carte cadeau de 100 $', name: 'Or' },
  { threshold: 75, reward: 'Carte cadeau de 250 $', name: 'Platine' },
  { threshold: 100, reward: 'Coffret Cadeau VIP', name: 'VIP' },
];

const POINTS_CONFIG = {
  referral: 1,
  google_review: 2,
  existing_client: 2,
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

  let currentTier = null;
  let nextTier = null;
  let pointsToNext = 0;
  const totalRewards = [];

  for (let i = 0; i < REWARD_TIERS.length; i++) {
    const tier = REWARD_TIERS[i];
    if (totalPoints >= tier.threshold) {
      currentTier = tier;
      totalRewards.push(tier.reward);
    } else {
      nextTier = tier;
      pointsToNext = tier.threshold - totalPoints;
      break;
    }
  }

  if (currentTier && !nextTier && totalPoints >= REWARD_TIERS[REWARD_TIERS.length - 1].threshold) {
    nextTier = null;
    pointsToNext = 0;
  }

  return {
    total_referrals: total,
    qualified_referrals: qualified,
    pending_referrals: pending,
    total_points: totalPoints,
    points_breakdown: pointsBreakdown,
    current_tier: currentTier,
    next_tier: nextTier,
    points_to_next_tier: pointsToNext,
    total_rewards_earned: totalRewards.length ? totalRewards.join(' + ') : 'Aucune récompense encore',
  };
}
