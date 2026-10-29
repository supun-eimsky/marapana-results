import type { Outcome, SubjectResult } from "./types";
import { CREDIT_MARK, PASS_MARK } from "./subjects";

const MIN_PASSES = 6;
const MIN_CREDITS = 3;

/**
 * School pass rule:
 *  - at least 6 subjects with S or better
 *  - Sinhala (mother tongue) and Mathematics each S or better
 *  - at least 3 of the passed subjects are C or better
 */
export function evaluateOutcome(subjects: SubjectResult[]): Outcome {
  const sat = subjects.filter((s) => s.marks !== null);
  const passCount = sat.filter((s) => (s.marks as number) >= PASS_MARK).length;
  const creditCount = sat.filter((s) => (s.marks as number) >= CREDIT_MARK).length;

  if (sat.length === 0) {
    return { status: "absent", passCount: 0, creditCount: 0, reasons: [] };
  }

  const reasons: string[] = [];
  const passed = (name: string) => {
    const s = subjects.find((x) => x.subject === name);
    return !!s && s.marks !== null && s.marks >= PASS_MARK;
  };

  if (passCount < MIN_PASSES) {
    reasons.push(`Only ${passCount} subject${passCount === 1 ? "" : "s"} passed. At least ${MIN_PASSES} are needed.`);
  }
  if (!passed("Sinhala")) reasons.push("Sinhala (mother tongue) was not passed.");
  if (!passed("Mathematics")) reasons.push("Mathematics was not passed.");
  if (creditCount < MIN_CREDITS) {
    reasons.push(`Only ${creditCount} subject${creditCount === 1 ? "" : "s"} with a C or better. At least ${MIN_CREDITS} are needed.`);
  }

  return {
    status: reasons.length === 0 ? "passed" : "failed",
    passCount,
    creditCount,
    reasons,
  };
}
