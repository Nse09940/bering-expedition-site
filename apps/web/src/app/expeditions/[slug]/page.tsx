import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchCatalogData, getExpeditionBySlug } from "@/lib/catalog";

type ExpeditionPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const { expeditions } = await fetchCatalogData();
  return expeditions.map((expedition) => ({ slug: expedition.slug }));
}

export default async function ExpeditionPage({ params }: ExpeditionPageProps) {
  const { slug } = await params;
  const data = await fetchCatalogData();
  const expedition = getExpeditionBySlug(data, slug);

  if (!expedition) {
    notFound();
  }

  const expeditionStages = data.stages.filter(
    (stage) => stage.expeditionId === expedition.id,
  );
  const expeditionEvents = data.events.filter(
    (event) => event.expeditionId === expedition.id,
  );

  return (
    <main className="container page-shell flex-1">
      <div className="page-hero">
        <p className="eyebrow">{expedition.period}</p>
        <h1 className="small-title">{expedition.title}</h1>
        <p className="section-copy max-w-3xl">{expedition.summary}</p>
        <Link className="button-secondary w-fit" href="/map">
          Открыть на карте
        </Link>
      </div>

      <section className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="surface p-6">
          <h2 className="text-2xl font-semibold">Этапы</h2>
          <div className="mt-5 space-y-3">
            {expeditionStages.map((stage) => (
              <article
                className="rounded-2xl border border-black/10 bg-[var(--surface-soft)] p-4"
                key={stage.id}
              >
                <p className="text-sm text-[var(--muted)]">{stage.period}</p>
                <h3 className="mt-2 text-lg font-semibold">{stage.title}</h3>
                <p className="mt-2 leading-7 text-[var(--muted)]">
                  {stage.summary}
                </p>
              </article>
            ))}
          </div>
        </div>

        <aside className="surface p-5">
          <h2 className="text-xl font-semibold">Итоги</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--muted)]">
            {expedition.results.map((result) => (
              <li key={result}>{result}</li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">События</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {expeditionEvents.map((event) => (
            <article className="surface p-5" key={event.id}>
              <p className="text-sm text-[var(--muted)]">{event.date}</p>
              <h3 className="mt-2 text-xl font-semibold">{event.title}</h3>
              <p className="mt-2 text-sm text-[var(--muted-strong)]">
                {event.place}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
