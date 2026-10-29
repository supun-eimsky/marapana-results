import type { Metadata } from "next";
import Link from "next/link";
import { lookupResult } from "@/controllers/result.controller";
import SchoolHeader from "@/views/components/SchoolHeader";
import ResultSheet from "@/views/components/ResultSheet";
import SearchForm from "@/views/components/SearchForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your result – R/ Marapana Maha Vidyalaya" };

export default async function ResultPage({ params }: { params: Promise<{ index: string }> }) {
  const { index } = await params;
  const response = lookupResult(index);

  return (
    <>
      <SchoolHeader />
      <main>
        {response.status === "ok" ? (
          <ResultSheet result={response.result} exam={response.exam} />
        ) : (
          <div className="mx-auto max-w-xl px-5 py-14">
            <h1 className="font-serif text-3xl font-bold text-navy">
              {response.status === "invalid" ? "That index number isn’t valid" : "No result found"}
            </h1>
            <p className="mt-3">
              {response.status === "invalid"
                ? "Use digits only, for example 12."
                : `There is no Grade ${response.exam.grade} result for index number ${index.trim()}. Check the number on your admission card and try again.`}
            </p>
            <div className="mt-6 rounded-lg bg-navy p-6"><SearchForm initial="" /></div>
            <Link href="/" className="mt-6 inline-block font-semibold text-navy underline">Back to home</Link>
          </div>
        )}
      </main>
    </>
  );
}
