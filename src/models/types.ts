export type Grade = "A" | "B" | "C" | "S" | "W" | "Ab";
export type SubjectGroup = "core" | "group1" | "group2" | "group3";

export interface RawStudent {
  indexNumber: number;
  name: string;
  /** Subject name -> marks. A missing subject or null means the student was absent. */
  marks: Record<string, number | null>;
}

export interface SubjectResult {
  subject: string;
  group: SubjectGroup;
  marks: number | null;
  grade: Grade;
}

export type OutcomeStatus = "passed" | "failed" | "absent";

export interface Outcome {
  status: OutcomeStatus;
  /** Subjects with S or better */
  passCount: number;
  /** Subjects with C or better */
  creditCount: number;
  /** Plain-language reasons the student did not pass (empty when passed) */
  reasons: string[];
}

export interface StudentResult {
  indexNumber: number;
  name: string;
  subjects: SubjectResult[];
  total: number;
  average: number;
  rank: number;
  gradeCounts: Record<Grade, number>;
  outcome: Outcome;
}

export interface ExamInfo {
  school: string;
  grade: number;
  exam: string;
  year: number;
  totalStudents: number;
}
