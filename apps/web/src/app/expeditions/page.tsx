import Link from "next/link";
import { fetchCatalogData } from "@/lib/catalog";

export default async function ExpeditionsPage() {
  const { expeditions } = await fetchCatalogData();
  return (
    <main className="container page-shell flex-1">
      <div className="page-hero">
        <p className="eyebrow">Раздел</p>
        <h1 className="small-title">Экспедиции</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {expeditions.map((expedition) => (
          <Link
            className="surface p-6 transition hover:-translate-y-1"
            href={`/expeditions/${expedition.slug}`}
            key={expedition.id}
          >
            <p className="text-sm text-[var(--muted)]">{expedition.period}</p>
            <h2 className="mt-3 text-2xl font-semibold">{expedition.title}</h2>
            <p className="mt-3 leading-7 text-[var(--muted)]">
              {expedition.summary}
            </p>
            <p className="mt-5 text-sm font-semibold text-[var(--accent)]">
              Открыть
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
