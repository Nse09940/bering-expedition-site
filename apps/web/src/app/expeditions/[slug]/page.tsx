import Link from "next/link";
import { notFound } from "next/navigation";
import { PhotoGrid } from "@/components/PhotoGrid";
import { EXPEDITION_NARRATIVES } from "@/data/expeditionNarratives";
import { EXPEDITION_PHOTOS } from "@/data/photoCollections";
import { fetchCatalogData, getExpeditionBySlug } from "@/lib/catalog";

type ExpeditionPageProps = {
  params: Promise<{ slug: string }>;
};

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
  const eventTypes = new Set(expeditionEvents.map((event) => event.type));
  const narrative = EXPEDITION_NARRATIVES[expedition.id];
  const totalEpisodes = expeditionEvents.length + narrative.highlights.length;
  const photos = EXPEDITION_PHOTOS[expedition.id];

  return (
    <main className="container page-shell flex-1">
      <div className="page-hero">
        <p className="eyebrow">{expedition.period}</p>
        <h1 className="small-title">{expedition.title}</h1>
        <p className="section-copy max-w-3xl">{expedition.summary}</p>
        <div className="flex flex-wrap gap-4 text-sm text-[var(--muted)]">
          <span>{narrative.detailedStages.length} подробных этапов</span>
          <span>{totalEpisodes} эпизодов и ключевых точек</span>
          <span>{photos.length} визуальных материалов</span>
          <span>{eventTypes.size} типа исторических записей</span>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link className="button-primary w-fit" href="/map">
            Открыть на карте
          </Link>
          <Link className="button-secondary w-fit" href="/discoveries">
            Смотреть результаты
          </Link>
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="surface p-6">
          <h2 className="text-2xl font-semibold">Подробный ход экспедиции</h2>
          <p className="mt-3 max-w-3xl leading-7 text-[var(--muted)]">
            {narrative.overview}
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {narrative.detailedStages.map((stage, index) => (
              <article
                className="rounded-2xl border border-black/10 bg-[var(--surface-soft)] p-4"
                key={`${stage.title}-${index}`}
              >
                <p className="text-sm text-[var(--muted)]">
                  Этап {index + 1} · {stage.period}
                </p>
                <h3 className="mt-2 text-lg font-semibold">{stage.title}</h3>
                <p className="mt-2 leading-7 text-[var(--muted)]">
                  {stage.summary}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {stage.places.map((place) => (
                    <span
                      className="legend-item text-xs"
                      key={`${stage.title}-${place}`}
                    >
                      {place}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <article className="surface p-5">
            <h2 className="text-xl font-semibold">Цель</h2>
            <p className="mt-4 leading-7 text-[var(--muted)]">
              {expedition.goal}
            </p>
          </article>

          <article className="surface p-5">
            <h2 className="text-xl font-semibold">Итоги</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--muted)]">
              {expedition.results.map((result) => (
                <li key={result}>{result}</li>
              ))}
            </ul>
          </article>

          <article className="surface p-5">
            <h2 className="text-xl font-semibold">Структура материалов</h2>
            <div className="mt-4 grid gap-3">
              <div className="rounded-2xl bg-[var(--surface-soft)] p-4">
                <p className="text-3xl font-semibold">
                  {narrative.detailedStages.length}
                </p>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  подробных этапов
                </p>
              </div>
              <div className="rounded-2xl bg-[var(--surface-soft)] p-4">
                <p className="text-3xl font-semibold">
                  {expeditionStages.length}
                </p>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  крупных этапа в каталоге
                </p>
              </div>
              <div className="rounded-2xl bg-[var(--surface-soft)] p-4">
                <p className="text-3xl font-semibold">{photos.length}</p>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  фотографий и материалов
                </p>
              </div>
            </div>
          </article>
        </aside>
      </section>

      <section className="mt-10">
        <div className="mb-5">
          <p className="eyebrow">Теория</p>
          <h2 className="mt-3 text-2xl font-semibold">Исторический контекст</h2>
          <p className="mt-3 max-w-3xl leading-7 text-[var(--muted)]">
            Эти блоки объясняют, почему маршрут устроен именно так и какие
            выводы можно делать без искажения исторической картины.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {narrative.theory.map((block) => (
            <article className="surface p-6" key={block.title}>
              <h3 className="text-xl font-semibold">{block.title}</h3>
              <p className="mt-3 leading-7 text-[var(--muted)]">{block.body}</p>
              <a
                className="mt-4 inline-flex text-sm font-semibold text-[var(--accent)]"
                href={block.sourceUrl}
                rel="noreferrer"
                target="_blank"
              >
                Источник: {block.sourceLabel}
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <PhotoGrid
          description="Галерея собрана так, чтобы страница экспедиции не оставалась чисто текстовой: здесь есть пейзажи маршрута, командорский контекст и научные материалы."
          eyebrow="Галерея экспедиции"
          photos={photos}
          title="Фотографии и визуальные материалы"
        />
      </section>

      <section className="mt-10 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <article className="surface p-6">
          <h2 className="text-2xl font-semibold">Как читать эту экспедицию</h2>
          <div className="mt-5 space-y-4 text-sm leading-7 text-[var(--muted)]">
            <p>
              Сначала смотри на сухопутную и речную логистику: именно она
              определяет, как экспедиция вообще могла дойти до Тихого океана.
            </p>
            <p>
              Затем переходи к морской части и сопоставляй маршрут с
              наблюдениями, открытиями и развилками. Так лучше видно, где линия
              маршрута опирается на журнал, а где является реконструкцией.
            </p>
            <p>
              После этого смотри галерею: изображения делают карту и список
              событий менее абстрактными, связывая маршрут с реальным ландшафтом
              и научным контекстом эпохи.
            </p>
          </div>
        </article>

        <article className="surface p-6">
          <h2 className="text-2xl font-semibold">Крупные этапы каталога</h2>
          <div className="mt-5 space-y-3">
            {expeditionStages.map((stage, index) => (
              <article
                className="rounded-2xl border border-black/10 bg-[var(--surface-soft)] p-4"
                key={stage.id}
              >
                <p className="text-sm text-[var(--muted)]">
                  Блок {index + 1} · {stage.period}
                </p>
                <h3 className="mt-2 text-lg font-semibold">{stage.title}</h3>
                <p className="mt-2 leading-7 text-[var(--muted)]">
                  {stage.summary}
                </p>
              </article>
            ))}
          </div>
          <p className="mt-5 leading-7 text-[var(--muted)]">
            Каталог хранит укрупнённую структуру, а подробное деление выше
            раскрывает внутреннюю динамику тех же переходов.
          </p>
        </article>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">События и ключевые точки</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {narrative.highlights.map((item) => (
            <article
              className="surface p-5"
              key={`${item.title}-${item.place}`}
            >
              <p className="text-sm text-[var(--muted)]">{item.period}</p>
              <h3 className="mt-2 text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-[var(--accent-warm)]">
                {item.place}
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">
                {item.kind}
              </p>
              <p className="mt-3 leading-7 text-[var(--muted)]">
                {item.summary}
              </p>
            </article>
          ))}
          {expeditionEvents.map((event) => (
            <article className="surface p-5" key={event.id}>
              <p className="text-sm text-[var(--muted)]">{event.date}</p>
              <h3 className="mt-2 text-xl font-semibold">{event.title}</h3>
              <p className="mt-2 text-sm text-[var(--muted-strong)]">
                {event.place}
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">
                Событие каталога
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
