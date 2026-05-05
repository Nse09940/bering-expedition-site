import Link from "next/link";
import { PhotoGrid } from "@/components/PhotoGrid";
import { EXPEDITION_NARRATIVES } from "@/data/expeditionNarratives";
import { EXPEDITIONS_OVERVIEW_PHOTOS } from "@/data/photoCollections";
import { fetchCatalogData } from "@/lib/catalog";

const theoryCards = [
  {
    title: "Экспедиция как логистика",
    text: "В XVIII веке открытие начиналось задолго до моря: нужно было провести людей, инструменты, железо, парусину, провиант и документы через реки, волоки, зимовки и административные центры.",
  },
  {
    title: "Карта не равна прямой линии",
    text: "Маршрут Беринга нельзя рисовать как простую стрелку на восток. Исторически точнее показывать цепочку речных систем, портов, острогов, промежуточных баз и реконструированных морских участков.",
  },
  {
    title: "Первая и вторая экспедиции решали разные задачи",
    text: "Первая проверяла главный географический вопрос о связи Азии и Америки. Вторая выросла в масштабную программу картографии, морского поиска, науки и управления восточными окраинами.",
  },
  {
    title: "Факт и реконструкция должны быть разделены",
    text: "Документально подтверждённые пункты, современные географические ориентиры и реконструированные точки маршрута имеют разный статус. Это важно показывать в подписях, карточках и пояснениях.",
  },
];

export default async function ExpeditionsPage() {
  const { expeditions, stages, events } = await fetchCatalogData();

  const comparisonRows = expeditions.map((expedition) => {
    const expeditionStages = stages.filter(
      (stage) => stage.expeditionId === expedition.id,
    );
    const expeditionEvents = events.filter(
      (event) => event.expeditionId === expedition.id,
    );

    return {
      ...expedition,
      stageCount: expeditionStages.length,
      eventCount: expeditionEvents.length,
      mainStage: expeditionStages[0]?.title ?? "Маршрут уточняется",
    };
  });

  return (
    <main className="container page-shell flex-1">
      <div className="page-hero">
        <p className="eyebrow">Раздел</p>
        <h1 className="small-title">Экспедиции</h1>
        <p className="section-copy max-w-3xl">
          Здесь собраны две связанные, но разные по масштабу истории: проверка
          географической гипотезы и большой тихоокеанский проект с несколькими
          маршрутами, судами, визуальными материалами и научными наблюдениями.
        </p>
      </div>

      <section className="mb-10 grid gap-4 md:grid-cols-2">
        {comparisonRows.map((expedition) => (
          <article className="surface p-6" key={`${expedition.id}-overview`}>
            <p className="text-sm text-[var(--muted)]">{expedition.period}</p>
            <h2 className="mt-3 text-2xl font-semibold">{expedition.title}</h2>
            <p className="mt-3 leading-7 text-[var(--muted)]">
              {expedition.goal}
            </p>
            <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-2xl bg-[var(--surface-soft)] p-3">
                <p className="font-semibold">{expedition.stageCount}</p>
                <p className="mt-1 text-[var(--muted)]">этапов</p>
              </div>
              <div className="rounded-2xl bg-[var(--surface-soft)] p-3">
                <p className="font-semibold">{expedition.eventCount}</p>
                <p className="mt-1 text-[var(--muted)]">событий</p>
              </div>
              <div className="rounded-2xl bg-[var(--surface-soft)] p-3">
                <p className="font-semibold">{expedition.results.length}</p>
                <p className="mt-1 text-[var(--muted)]">итогов</p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-6 text-[var(--muted)]">
              Опорный этап: {expedition.mainStage}
            </p>
          </article>
        ))}
      </section>

      <section className="mb-10 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="surface p-6">
          <p className="eyebrow">Сравнение</p>
          <h2 className="mt-3 text-2xl font-semibold">
            Чем различаются походы
          </h2>
          <div className="mt-6 space-y-4 text-sm leading-7 text-[var(--muted)]">
            <p>
              Первая Камчатская экспедиция строилась вокруг одного главного
              вопроса: можно ли пройти вдоль северо-восточной Азии так, чтобы
              доказать отсутствие перешейка с Америкой.
            </p>
            <p>
              Вторая экспедиция была шире: помимо морского поиска и выхода к
              берегам Америки она включала логистику через всю Сибирь, научные
              наблюдения, картографию и отдельную линию Чирикова.
            </p>
            <p>
              Поэтому здесь важно смотреть не только итог, но и то, как меняется
              сама структура маршрута: от одной проверочной миссии к системе
              этапов и развилок.
            </p>
          </div>
        </article>

        <article className="surface p-6">
          <p className="eyebrow">Навигация</p>
          <h2 className="mt-3 text-2xl font-semibold">Как читать раздел</h2>
          <div className="mt-6 space-y-4 text-sm leading-7 text-[var(--muted)]">
            <p>
              Сначала открой карточку экспедиции и просмотри этапы в
              хронологическом порядке.
            </p>
            <p>
              Затем перейди на карту и сравни реальные расстояния между
              сухопутной и морской частями.
            </p>
            <p>
              После этого вернись к событиям и открытиям: так видно, где были
              наблюдения, а где реконструкция маршрута.
            </p>
          </div>
        </article>
      </section>

      <section className="mb-10">
        <div className="mb-5">
          <p className="eyebrow">Теория</p>
          <h2 className="mt-3 text-2xl font-semibold">
            Как исторически правильно читать экспедиции
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {theoryCards.map((card) => (
            <article className="surface p-6" key={card.title}>
              <h3 className="text-xl font-semibold">{card.title}</h3>
              <p className="mt-3 leading-7 text-[var(--muted)]">{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-10 grid gap-4 lg:grid-cols-2">
        {expeditions.map((expedition) => {
          const narrative = EXPEDITION_NARRATIVES[expedition.id];

          return (
            <article className="surface p-6" key={`${expedition.id}-theory`}>
              <p className="eyebrow">{expedition.title}</p>
              <h2 className="mt-3 text-2xl font-semibold">
                Теоретическая основа
              </h2>
              <div className="mt-5 space-y-4">
                {narrative.theory.map((block) => (
                  <div
                    className="rounded-2xl border border-black/10 bg-[var(--surface-soft)] p-4"
                    key={block.title}
                  >
                    <h3 className="font-semibold">{block.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                      {block.body}
                    </p>
                    <a
                      className="mt-3 inline-flex text-sm font-semibold text-[var(--accent)]"
                      href={block.sourceUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Источник: {block.sourceLabel}
                    </a>
                  </div>
                ))}
              </div>
            </article>
          );
        })}
      </section>

      <section className="mb-10">
        <PhotoGrid
          description="Подборка усиливает визуальную часть раздела: здесь есть и современные фотографии, и научные, и архивные материалы, связанные с пространством экспедиций."
          eyebrow="Визуальные материалы"
          photos={EXPEDITIONS_OVERVIEW_PHOTOS}
          title="Галерея северной Пацифики"
        />
      </section>

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
