import data from "@/data/results.json";
import type { ExamInfo, RawStudent, StudentResult } from "./types";
import { buildStudentResult, totalOf } from "./student.model";

const raw = data.students as unknown as RawStudent[];

// Ranks use standard competition ranking: equal totals share a rank (1, 2, 2, 4 ...).
const results: Map<number, StudentResult> = (() => {
  const totals = raw.map(totalOf);
  const map = new Map<number, StudentResult>();
  raw.forEach((student, i) => {
    const rank = 1 + totals.filter((t) => t > totals[i]).length;
    map.set(student.indexNumber, buildStudentResult(student, rank));
  });
  return map;
})();

export function getExamInfo(): ExamInfo {
  return {
    school: data.school,
    grade: data.grade,
    exam: data.exam,
    year: data.year,
    totalStudents: raw.length,
  };
}

export function findByIndexNumber(indexNumber: number): StudentResult | null {
  return results.get(indexNumber) ?? null;
}
