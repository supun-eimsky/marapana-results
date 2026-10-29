import type { Grade, RawStudent, StudentResult, SubjectGroup, SubjectResult } from "./types";
import { CORE_SUBJECTS, GROUP_SUBJECTS, gradeFromMarks } from "./subjects";
import { evaluateOutcome } from "./pass-rules";

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Turns a raw record into a full 9-subject result (missing subjects are shown as absent). */
export function buildStudentResult(raw: RawStudent, rank: number): StudentResult {
  const subjects: SubjectResult[] = [];
  const add = (subject: string, group: SubjectGroup) => {
    const marks = raw.marks[subject] ?? null;
    subjects.push({ subject, group, marks, grade: gradeFromMarks(marks) });
  };

  for (const s of CORE_SUBJECTS) add(s, "core");

  for (const group of ["group1", "group2", "group3"] as const) {
    const chosen = GROUP_SUBJECTS[group].find((s) => s in raw.marks);
    if (chosen) add(chosen, group);
    else {
      subjects.push({ subject: `Optional subject ${group.slice(-1)}`, group, marks: null, grade: "Ab" });
    }
  }

  const sat = subjects.filter((s) => s.marks !== null);
  const total = sat.reduce((sum, s) => sum + (s.marks as number), 0);
  const average = sat.length ? round2(total / sat.length) : 0;

  const gradeCounts: Record<Grade, number> = { A: 0, B: 0, C: 0, S: 0, W: 0, Ab: 0 };
  for (const s of subjects) gradeCounts[s.grade] += 1;

  return {
    indexNumber: raw.indexNumber,
    name: raw.name,
    subjects,
    total,
    average,
    rank,
    gradeCounts,
    outcome: evaluateOutcome(subjects),
  };
}

export function totalOf(raw: RawStudent): number {
  return Object.values(raw.marks).reduce<number>((sum, m) => sum + (m ?? 0), 0);
}
