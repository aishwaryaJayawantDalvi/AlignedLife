import PDFDocument from "pdfkit";

export const generateAgreementPdf = (agreement, users) => {
  const doc = new PDFDocument({ margin: 50 });
  const chunks = [];

  doc.on("data", (chunk) => chunks.push(chunk));

  doc.fontSize(20).text("AlignedLife Mutual Agreement", { underline: true });
  doc.moveDown();

  doc.fontSize(12).text(`Participant A: ${users.userA}`);
  doc.text(`Participant B: ${users.userB}`);
  doc.text(`Created: ${new Date(agreement.createdAt).toLocaleDateString()}`);
  doc.moveDown();

  doc.text(`Relationship Type: ${agreement.relationshipType}`);
  doc.text(`Living Plan: ${agreement.livingPlan}`);
  doc.text(`Family Interaction: ${agreement.familyInteraction}`);
  doc.text(`Kids: ${agreement.kids}`);
  doc.text(
    `Duration: ${agreement.durationType}${agreement.durationType === "Temporary" ? ` (${agreement.temporaryYears} years)` : ""}`
  );
  doc.moveDown();
  doc.text("Exit Plan:");
  doc.text(agreement.exitPlan);
  doc.moveDown();
  doc.text("This document reflects mutual understanding and does not replace legal advice.");

  doc.end();

  return new Promise((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });
};
