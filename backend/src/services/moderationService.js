const contactPatterns = [
  /\b\d{10}\b/, 
  /\b\+\d{1,3}[\s-]?\d{6,14}\b/, 
  /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
  /\b(telegram|whatsapp|instagram|snapchat|facebook)\b/i
];

export const hasSensitiveContactInfo = (text) => {
  return contactPatterns.some((pattern) => pattern.test(text));
};
