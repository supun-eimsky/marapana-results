import Link from "next/link";
import type { ExamInfo, StudentResult } from "@/models/types";
import GradeBadge from "./GradeBadge";

export default function ResultSheet({ result, exam }: { result: StudentResult; exam: ExamInfo }) {
  const { outcome } = result;
  const tone =
    outcome.status === "passed"
      ? "border-emerald-600 bg-emerald-50 text-emerald-900"
      : outcome.status === "absent"
        ? "border-slate-400 bg-slate-100 text-slate-800"
        : "border-red-600 bg-red-50 text-red-900";
  const headline =
    outcome.status === "passed" ? "Passed" : outcome.status === "absent" ? "Absent" : "Did not pass";

  return (
    <article className="mx-auto max-w-5xl px-4 py-6 sm:px-5 sm:py-8">
      <p className="text-sm text-ink/70">
        Grade {exam.grade} Mark Sheet, {exam.exam} {exam.year}
      </p>
      <div className="mt-1 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif break-words text-2xl font-bold text-navy sm:text-4xl">{result.name}</h1>
          <p className="mt-1 text-lg">Index number <strong>{result.indexNumber}</strong></p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row print:hidden">
          <a
            href={`/api/results/${result.indexNumber}/pdf`}
            className="rounded-md bg-navy px-5 py-3 text-center font-bold text-white hover:bg-navy-deep"
          >
            Download PDF
          </a>
          <Link href="/" className="rounded-md border-2 border-navy px-5 py-3 text-center font-bold text-navy hover:bg-navy-soft">
            Check another
          </Link>
        </div>
      </div>

      <section className={`mt-6 rounded-md border-l-8 px-5 py-4 ${tone}`} aria-label="Overall result">
        <p className="font-serif text-2xl font-bold">{headline}</p>
        {outcome.status === "absent" && <p className="mt-1">No marks have been recorded for this index number. Please contact the school office.</p>}
        {outcome.reasons.length > 0 && (
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {outcome.reasons.map((r) => <li key={r}>{r}</li>)}
          </ul>
        )}
      </section>

      <dl className="mt-6 grid grid-cols-1 gap-3 min-[480px]:grid-cols-3">
        {[
          ["Total marks", String(result.total)],
          ["Average", result.average.toFixed(2)],
          ["Rank", `${result.rank} of ${exam.totalStudents}`],
        ].map(([k, v]) => (
          <div key={k} className="rounded-md bg-white px-4 py-3 shadow-sm ring-1 ring-navy/10">
            <dt className="text-sm text-ink/70">{k}</dt>
            <dd className="font-serif text-2xl font-bold text-navy sm:text-3xl">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 rounded-md bg-white shadow-sm ring-1 ring-navy/10">
        <table className="w-full text-left">
          <caption className="sr-only">Subject grades</caption>
          <thead className="bg-navy text-white">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">Subject</th>
                                          <th scope="col" className="px-4 py-3 text-right font-semibold">Grade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy/10">
            {result.subjects.map((s) => (
              <tr key={s.group + s.subject} className={s.marks === null ? "text-ink/55" : ""}>
                <th scope="row" className="px-4 py-3 font-medium">{s.subject}</th>
                <td className="px-4 py-3 text-right"><GradeBadge grade={s.grade} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm text-ink/70">
        Grades earned:{" "}
        {(["A", "B", "C", "S", "W", "Ab"] as const).map((g) => `${g} ${result.gradeCounts[g]}`).join(", ")}
      </p>
    </article>
  );
}
