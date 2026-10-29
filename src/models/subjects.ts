import type { Grade, SubjectGroup } from "./types";

export const CORE_SUBJECTS = [
  "Religion",
  "Sinhala",
  "English",
  "Science",
  "Mathematics",
  "History",
] as const;

export const GROUP_SUBJECTS: Record<Exclude<SubjectGroup, "core">, string[]> = {
  group1: ["Commerce", "Civic Education", "Tamil"],
  group2: ["Dancing", "Art", "Music"],
  group3: ["Health", "ICT", "Agriculture"],
};

export const GROUP_LABEL: Record<SubjectGroup, string> = {
  core: "Core",
  group1: "Group 1",
  group2: "Group 2",
  group3: "Group 3",
};

export const GRADE_SCALE: { grade: Grade; range: string; min: number }[] = [
  { grade: "A", range: "75 – 100", min: 75 },
  { grade: "B", range: "65 – 74", min: 65 },
  { grade: "C", range: "50 – 64", min: 50 },
  { grade: "S", range: "35 – 49", min: 35 },
  { grade: "W", range: "0 – 34", min: 0 },
];

export const PASS_MARK = 35;
export const CREDIT_MARK = 50;

export function gradeFromMarks(marks: number | null): Grade {
  if (marks === null) return "Ab";
  for (const g of GRADE_SCALE) if (marks >= g.min) return g.grade;
  return "W";
}
