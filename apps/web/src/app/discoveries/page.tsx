import { fetchCatalogData } from "@/lib/catalog";

const resultCards = [
  ["География", "Берега, проливы и острова северной Пацифики стали понятнее."],
  ["Картография", "Наблюдения легли в основу новых карт XVIII века."],
  ["Наука", "Экспедиции собрали природные и этнографические сведения."],
  ["Освоение", "Маршруты подготовили дальнейшее движение к Алеутам и Аляске."],
];

export default async function DiscoveriesPage() {
  const { events } = await fetchCatalogData();
  const discoveryEvents = events.filter((event) => event.type === "открытие");

  return (
    <main className="container page-shell flex-1">
      <div className="page-hero">
        <p className="eyebrow">Результаты</p>
        <h1 className="small-title">Что изменилось</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {resultCards.map(([title, text]) => (
          <article className="surface p-5" key={title}>
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{text}</p>
          </article>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Открытия</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {discoveryEvents.map((event) => (
            <article className="surface p-5" key={event.id}>
              <p className="text-sm text-[var(--muted)]">{event.date}</p>
              <h3 className="mt-2 text-xl font-semibold">{event.title}</h3>
              <p className="mt-2 text-sm text-[var(--accent-warm)]">
                {event.place}
              </p>
              <p className="mt-3 leading-7 text-[var(--muted)]">
                {event.summary}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
