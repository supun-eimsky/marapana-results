import { GRADE_SCALE } from "@/models/subjects";
import GradeBadge from "./GradeBadge";

export default function GradeScale() {
  return (
    <dl className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2 text-sm">
      {GRADE_SCALE.map((g) => (
        <div key={g.grade} className="contents">
          <dt><GradeBadge grade={g.grade} /></dt>
          <dd>{g.range} marks</dd>
        </div>
      ))}
      <div className="contents">
        <dt><GradeBadge grade="Ab" /></dt>
        <dd>Absent</dd>
      </div>
    </dl>
  );
}
