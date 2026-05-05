import { fetchCatalogData } from "@/lib/catalog";

const resultCards = [
  [
    "География",
    "Берега, проливы и острова северной Пацифики стали описаны точнее, чем на картах начала XVIII века.",
  ],
  [
    "Картография",
    "Наблюдения экспедиций легли в основу новых представлений о северо-востоке Азии и путях к Америке.",
  ],
  [
    "Наука",
    "Путешествия собрали сведения о природе, климате, навигации и народах регионов, через которые шёл маршрут.",
  ],
  [
    "Исторический эффект",
    "Результаты повлияли не только на карты, но и на дальнейшую государственную и морскую политику России.",
  ],
];

const interpretationBlocks = [
  [
    "Что было подтверждено",
    "Экспедиции показали, что между Азией и Америкой нет непрерывной суши в том виде, как это представлялось в некоторых более ранних схемах.",
  ],
  [
    "Что пришлось реконструировать",
    "Не вся морская траектория известна с абсолютной точностью, поэтому часть переходов на карте показана как исследовательская реконструкция по журналам и отчётам.",
  ],
  [
    "Почему важны не только открытия",
    "Для понимания походов не менее значимы зимовки, волоки, стоянки и точки снабжения: именно через них читается реальная цена маршрута.",
  ],
];

export default async function DiscoveriesPage() {
  const { events } = await fetchCatalogData();
  const discoveryEvents = events.filter((event) => event.type === "открытие");
  const observationEvents = events.filter(
    (event) => event.type === "наблюдение",
  );

  return (
    <main className="container page-shell flex-1">
      <div className="page-hero">
        <p className="eyebrow">Результаты</p>
        <h1 className="small-title">Что изменилось</h1>
        <p className="section-copy max-w-3xl">
          Открытия Беринга и Чирикова важны не только как отдельные точки на
          карте. Это цепочка изменений в представлениях о пространстве, в языке
          карт и в практической навигации северной части Тихого океана.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {resultCards.map(([title, text]) => (
          <article className="surface p-5" key={title}>
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{text}</p>
          </article>
        ))}
      </div>

      <section className="mt-10 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <article className="surface p-6">
          <h2 className="text-2xl font-semibold">
            Как интерпретировать результаты
          </h2>
          <div className="mt-5 space-y-4">
            {interpretationBlocks.map(([title, text]) => (
              <div
                className="rounded-2xl border border-black/10 bg-[var(--surface-soft)] p-4"
                key={title}
              >
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-2 leading-7 text-[var(--muted)]">{text}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="surface p-6">
          <h2 className="text-2xl font-semibold">Что видно по событиям</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-[var(--surface-soft)] p-4">
              <p className="text-3xl font-semibold">{discoveryEvents.length}</p>
              <p className="mt-2 text-sm text-[var(--muted)]">
                событий типа «открытие»
              </p>
            </div>
            <div className="rounded-2xl bg-[var(--surface-soft)] p-4">
              <p className="text-3xl font-semibold">
                {observationEvents.length}
              </p>
              <p className="mt-2 text-sm text-[var(--muted)]">
                событий типа «наблюдение»
              </p>
            </div>
          </div>
          <p className="mt-5 leading-7 text-[var(--muted)]">
            Такой разрез помогает увидеть разницу между фактом выхода к новой
            точке и постепенным накоплением знания: визуальные ориентиры,
            промеры, описания берегов и проливов.
          </p>
        </article>
      </section>

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
