export const getPhasesTotalCost = (phases) => {
  return phases.reduce((acc, phase) => acc + (phase.creditsConsumed || 0), 0);
};
