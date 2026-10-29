import Image from "next/image";
import Link from "next/link";

export default function SchoolHeader() {
  return (
    <header className="border-b-4 border-gold bg-white print:border-b-2">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 sm:gap-4 sm:px-5 sm:py-4">
        <Link href="/" className="flex items-center gap-3 sm:gap-4">
          <Image src="/logo.jpg" alt="R/ Marapana Maha Vidyalaya crest" width={64} height={63} priority className="h-12 w-auto sm:h-16" />
          <span>
            <span className="block font-serif text-base font-bold leading-tight text-navy sm:text-2xl">
              R/ Marapana Maha Vidyalaya
            </span>
            <span lang="si" className="block font-sinhala text-sm text-ink/70">
             
            </span>
          </span>
        </Link>
      </div>
    </header>
  );
}
