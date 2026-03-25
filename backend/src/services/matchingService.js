export const calculateCompatibility = (a, b) => {
  let score = 0;

  if (a.marriageIntention === b.marriageIntention) score += 35;
  if (a.kidsPreference === b.kidsPreference) score += 30;
  if (a.relocationWillingness === b.relocationWillingness) score += 20;

  const compatibleLiving =
    a.livingPreference === b.livingPreference ||
    (a.livingPreference === "Separate rooms" && b.livingPreference === "Same house") ||
    (b.livingPreference === "Separate rooms" && a.livingPreference === "Same house");

  if (compatibleLiving) score += 15;

  return Math.max(0, Math.min(100, score));
};
