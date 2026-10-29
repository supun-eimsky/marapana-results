import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import fs from "node:fs/promises";
import path from "node:path";
import type { ExamInfo, StudentResult } from "@/models/types";
import { GRADE_SCALE, GROUP_LABEL } from "@/models/subjects";

const NAVY = rgb(0.106, 0.165, 0.561);
const GOLD = rgb(0.961, 0.725, 0.039);
const INK = rgb(0.078, 0.094, 0.227);
const MUTED = rgb(0.38, 0.4, 0.5);
const ZEBRA = rgb(0.95, 0.96, 0.985);
const RED = rgb(0.7, 0.12, 0.12);
const GREEN = rgb(0.08, 0.45, 0.25);

export async function renderResultPdf(r: StudentResult, exam: ExamInfo): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.setTitle(`${r.name} - Grade ${exam.grade} ${exam.exam} ${exam.year}`);
  pdf.setAuthor(exam.school);
  const page = pdf.addPage([595.28, 841.89]);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const W = page.getWidth();
  const H = page.getHeight();
  const M = 40;
  const inner = W - M * 2;

  const text = (s: string, x: number, y: number, size: number, font: PDFFont = regular, color = INK) =>
    page.drawText(s, { x, y, size, font, color });
  const textRight = (s: string, xRight: number, y: number, size: number, font: PDFFont = regular, color = INK) =>
    text(s, xRight - font.widthOfTextAtSize(s, size), y, size, font, color);

  // ---- Header ----
  let y = H - M;
  let textX = M;
  try {
    const bytes = await fs.readFile(path.join(process.cwd(), "public", "logo.jpg"));
    const img = await pdf.embedJpg(bytes);
    const h = 66;
    const w = (h * img.width) / img.height;
    page.drawImage(img, { x: M, y: y - h, width: w, height: h });
    textX = M + w + 16;
  } catch {
    /* the sheet is still valid without a logo */
  }
  text(exam.school, textX, y - 22, 18, bold, NAVY);
  text(`Grade ${exam.grade} Mark Sheet`, textX, y - 42, 12, bold);
  text(`${exam.exam} – ${exam.year}`, textX, y - 58, 11, regular, MUTED);

  y -= 66 + 12;
  page.drawRectangle({ x: M, y: y - 3, width: inner, height: 3, color: GOLD });
  page.drawRectangle({ x: M, y: y - 4.5, width: inner, height: 1.5, color: NAVY });
  y -= 34;

  // ---- Student ----
  text("Name", M, y + 14, 9, regular, MUTED);
  text(r.name, M, y - 2, 15, bold);
  textRight("Index number", W - M, y + 14, 9, regular, MUTED);
  textRight(String(r.indexNumber), W - M, y - 2, 15, bold);
  y -= 34;

  // ---- Overall result (top) ----
  const o = r.outcome;
  const label = o.status === "passed" ? "Passed" : o.status === "absent" ? "Absent" : "Did not pass";
  const color = o.status === "passed" ? GREEN : o.status === "absent" ? MUTED : RED;
  const lines: string[] =
    o.status === "absent"
      ? ["No marks have been recorded for this index number."]
      : o.reasons.map((x) => `- ${x}`);
  const boxH = 50 + lines.length * 15;
  page.drawRectangle({ x: M, y: y - boxH + 14, width: inner, height: boxH, color: ZEBRA });
  page.drawRectangle({ x: M, y: y - boxH + 14, width: 6, height: boxH, color });
  text("Overall result", M + 20, y - 4, 9, regular, MUTED);
  text(label, M + 20, y - 26, 20, bold, color);
  let ly = y - 44;
  for (const l of lines) {
    text(l, M + 20, ly, 10);
    ly -= 15;
  }
  y -= boxH + 14;

  // ---- Table (grades only) ----
  const rowH = 25;
  page.drawRectangle({ x: M, y: y - rowH + 8, width: inner, height: rowH, color: NAVY });
  const headY = y - rowH + 8 + 8;
  text("Subject", M + 10, headY, 10, bold, rgb(1, 1, 1));
  textRight("Grade", M + inner - 10, headY, 10, bold, rgb(1, 1, 1));
  y -= rowH;

  r.subjects.forEach((s, i) => {
    const top = y - rowH + 8;
    if (i % 2 === 0) page.drawRectangle({ x: M, y: top, width: inner, height: rowH, color: ZEBRA });
    const ty = top + 8;
    const absent = s.marks === null;
    const c = absent ? MUTED : INK;
    text(s.subject, M + 10, ty, 11, regular, c);
    textRight(s.grade, M + inner - 10, ty, 11, bold, s.grade === "W" ? RED : c);
    y -= rowH;
  });
  page.drawRectangle({ x: M, y: y + 7.5, width: inner, height: 1, color: NAVY });
  y -= 34;

  // ---- Summary ----
  const boxW = (inner - 24) / 3;
  const summary: [string, string][] = [
    ["Total marks", String(r.total)],
    ["Average", r.average.toFixed(2)],
    ["Rank", `${r.rank} of ${exam.totalStudents}`],
  ];
  summary.forEach(([lab, value], i) => {
    const x = M + i * (boxW + 12);
    page.drawRectangle({ x, y: y - 30, width: boxW, height: 56, borderColor: NAVY, borderWidth: 1 });
    text(lab, x + 12, y + 10, 9, regular, MUTED);
    text(value, x + 12, y - 16, 17, bold, NAVY);
  });
  y -= 56;

  // ---- Grade counts ----
  const counts = (["A", "B", "C", "S", "W", "Ab"] as const).map((g) => `${g}: ${r.gradeCounts[g]}`).join("      ");
  text("Grades", M, y, 10, bold);
  text(counts, M + 52, y, 10, regular);

  // ---- Scale + footer ----
  const footerY = M + 30;
  page.drawRectangle({ x: M, y: footerY + 20, width: inner, height: 0.75, color: MUTED });
  text("Grading scale", M, footerY + 6, 8, bold, MUTED);
  const scale = GRADE_SCALE.map((g) => `${g.grade} ${g.range}`).join("    ") + "    Ab absent";
  text(scale, M + 66, footerY + 6, 8, regular, MUTED);
  text(
    "To pass: 6 subjects with S or better, including Sinhala and Mathematics, with at least 3 at C or better.",
    M,
    footerY - 8,
    8,
    regular,
    MUTED
  );
  textRight(`Printed ${new Date().toISOString().slice(0, 10)}`, W - M, footerY - 22, 8, regular, MUTED);

  return pdf.save();
}
