import SchoolHeader from "@/views/components/SchoolHeader";
import SearchForm from "@/views/components/SearchForm";
import GradeScale from "@/views/components/GradeScale";

export default function HomePage() {
  return (
    <>
      <SchoolHeader />
      <main>
        <section className="bg-navy">
          <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:px-5 sm:py-14 md:gap-10 md:grid-cols-[1.2fr_1fr] md:items-center">
            <div>
              <h1 className="font-serif text-3xl font-bold leading-tight text-white sm:text-5xl">
                Grade 11 results
              </h1>
              <p className="mt-3 max-w-md text-base text-white/80 sm:text-lg">
                III Term Test, 2026. Enter your index number to see your marks, then download your mark sheet as a PDF.
              </p>
            </div>
            <div className="rounded-lg border-t-4 border-gold bg-navy-deep p-4 sm:p-6">
              <SearchForm />
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:px-5 sm:py-12 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-2xl font-bold text-navy">Grading scale</h2>
            <div className="mt-4"><GradeScale /></div>
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-navy">How to pass</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              <li>Pass at least 6 subjects with an S or better.</li>
              <li>Sinhala and Mathematics must be among them.</li>
              <li>At least 3 of the passed subjects must be C or better.</li>
            </ul>
          </div>
        </section>
      </main>
    </>
  );
}
