import { findByIndexNumber, getExamInfo } from "@/models/student.repository";
import type { ExamInfo, StudentResult } from "@/models/types";
import { renderResultPdf } from "@/views/pdf/renderResultPdf";

export type LookupResponse =
  | { status: "ok"; result: StudentResult; exam: ExamInfo }
  | { status: "invalid"; exam: ExamInfo }
  | { status: "not_found"; exam: ExamInfo };

/** Accepts only whole numbers of up to 4 digits. */
export function parseIndexNumber(input: string): number | null {
  const trimmed = input.trim();
  if (!/^\d{1,4}$/.test(trimmed)) return null;
  return parseInt(trimmed, 10);
}

export function lookupResult(input: string): LookupResponse {
  const exam = getExamInfo();
  const index = parseIndexNumber(input);
  if (index === null) return { status: "invalid", exam };
  const result = findByIndexNumber(index);
  if (!result) return { status: "not_found", exam };
  return { status: "ok", result, exam };
}

export async function createResultPdf(input: string) {
  const response = lookupResult(input);
  if (response.status !== "ok") return { status: response.status } as const;
  const bytes = await renderResultPdf(response.result, response.exam);
  const safeName = response.result.name.replace(/[^A-Za-z0-9]+/g, "_").replace(/^_|_$/g, "");
  return {
    status: "ok",
    bytes,
    filename: `Result_${response.result.indexNumber}_${safeName}.pdf`,
  } as const;
}
