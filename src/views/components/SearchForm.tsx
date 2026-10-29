"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export default function SearchForm({ initial = "" }: { initial?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(initial);
  const [error, setError] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!/^\d{1,4}$/.test(trimmed)) {
      setError("Enter your index number using digits only, for example 12.");
      return;
    }
    setError("");
    router.push(`/results/${parseInt(trimmed, 10)}`);
  }

  return (
    <form onSubmit={onSubmit} noValidate className="w-full">
      <label htmlFor="index" className="block text-sm font-semibold text-white">
        Index number
      </label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <input
          id="index"
          name="index"
          inputMode="numeric"
          autoComplete="off"
          maxLength={4}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? "index-error" : undefined}
          placeholder="e.g. 12"
          className="w-full rounded-md border-2 border-transparent bg-white px-4 py-3 font-serif text-2xl font-bold tracking-wide text-navy placeholder:text-ink/25 sm:max-w-[12rem] sm:text-3xl"
        />
        <button
          type="submit"
          className="rounded-md bg-gold px-6 py-3 text-base font-bold text-ink hover:bg-gold-deep hover:text-white"
        >
          View results
        </button>
      </div>
      {error && (
        <p id="index-error" role="alert" className="mt-3 rounded bg-white/95 px-3 py-2 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
    </form>
  );
}
