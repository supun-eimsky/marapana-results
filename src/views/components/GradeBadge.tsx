import type { Grade } from "@/models/types";

const styles: Record<Grade, string> = {
  A: "bg-navy text-white",
  B: "bg-navy-soft text-navy-deep",
  C: "bg-gold-soft text-ink",
  S: "bg-slate-100 text-slate-700",
  W: "bg-red-100 text-red-800",
  Ab: "bg-slate-200 text-slate-600 italic",
};

export default function GradeBadge({ grade }: { grade: Grade }) {
  return (
    <span className={`inline-flex min-w-[2.25rem] justify-center rounded px-2 py-0.5 text-sm font-bold ${styles[grade]}`}>
      {grade}
    </span>
  );
}
