export const avatarStyles = [
  "lorelei-neutral",
  "adventurer-neutral",
  "bottts-neutral",
  "thumbs"
];

export const personalityOptions = [
  "Calm thinker",
  "Practical planner",
  "Independent minimalist",
  "Empathetic communicator",
  "Quiet strategist"
];

export const buildAvatarUrl = (style, seed) => {
  const selectedStyle = style || "lorelei-neutral";
  const selectedSeed = encodeURIComponent(seed || "alignedlife");
  return `https://api.dicebear.com/9.x/${selectedStyle}/svg?seed=${selectedSeed}&backgroundType=gradientLinear`;
};

export const randomSeed = () => `aligned-${Math.random().toString(36).slice(2, 10)}`;
