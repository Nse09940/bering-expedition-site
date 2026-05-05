import Link from "next/link";
import { PhotoGrid } from "@/components/PhotoGrid";
import { HOME_PHOTOS } from "@/data/photoCollections";
import { fetchCatalogData } from "@/lib/catalog";

const introCards = [
  [
    "Кто такой Беринг",
    "Мореплаватель на русской службе, руководивший экспедициями, которые связали историю Сибири, Камчатки и северной части Тихого океана.",
  ],
  [
    "Что за экспедиции",
    "Первая Камчатская проверяла, соединяются ли Азия и Америка сушей. Вторая стала большим научным и морским проектом с выходом к берегам Аляски.",
  ],
  [
    "Почему это важно",
    "Маршруты Беринга изменили картографию XVIII века, повлияли на навигацию в северной Пацифике и задали направление дальнейшим исследованиям.",
  ],
];

const studyBlocks = [
  [
    "Как читать проект",
    "Сайт соединяет маршрут, события, документы и результаты. Можно идти по этапам экспедиции или смотреть карту как единую историю движения на восток.",
  ],
  [
    "На что обращать внимание",
    "Важно не только место открытия, но и логистика: волоки, зимовки, переправы и морские переходы. Именно они определяли темп и риск экспедиции.",
  ],
  [
    "Что здесь можно сравнить",
    "Первая экспедиция показывает проверку гипотезы, вторая — уже сложную исследовательскую систему с несколькими маршрутами и научными наблюдениями.",
  ],
];

const timeline = [
  [
    "1725",
    "Указ о подготовке Первой Камчатской экспедиции и начале движения на восток.",
  ],
  [
    "1728",
    "Проход через Берингов пролив и подтверждение отсутствия сухопутной связи между Азией и Америкой.",
  ],
  [
    "1733",
    "Старт Второй Камчатской экспедиции как масштабного государственного проекта.",
  ],
  [
    "1741",
    "Выход пакетботов «Св. Пётр» и «Св. Павел» к берегам Северной Америки.",
  ],
  [
    "1742",
    "Возвращение выживших участников и закрепление результатов в отчётах, картах и описаниях.",
  ],
];

export default async function Home() {
  const { expeditions, stages, events, sources } = await fetchCatalogData();
  const quickFacts = [
    ["Экспедиции", String(expeditions.length).padStart(2, "0")],
    ["Этапы маршрутов", String(stages.length).padStart(2, "0")],
    ["События", String(events.length).padStart(2, "0")],
    ["Источники", String(sources.length).padStart(2, "0")],
  ];

  return (
    <main className="flex-1">
      <section className="container grid min-h-[calc(100vh-73px)] place-items-center py-14 text-center">
        <div className="mx-auto max-w-5xl">
          <p className="eyebrow">Интерактивная история</p>
          <h1 className="section-title mt-5 text-[var(--foreground)]">
            Экспедиции Витуса Беринга
          </h1>
          <p className="section-copy mx-auto mt-6 max-w-2xl">
            Маршруты, открытия, спорные точки, документы эпохи и теперь ещё
            визуальные материалы по Камчатке, Командорам и северной Пацифике.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link className="button-primary" href="/map">
              Открыть карту
            </Link>
            <Link className="button-secondary" href="/discoveries">
              Смотреть результаты
            </Link>
          </div>
        </div>
      </section>

      <section className="container pb-10">
        <div className="grid gap-4 md:grid-cols-4">
          {quickFacts.map(([label, value]) => (
            <article className="surface p-5 text-center" key={label}>
              <p className="text-3xl font-semibold">{value}</p>
              <p className="mt-2 text-sm text-[var(--muted)]">{label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container pb-10">
        <div className="grid gap-4 md:grid-cols-3">
          {introCards.map(([title, text]) => (
            <article className="surface p-6" key={title}>
              <h2 className="text-xl font-semibold">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                {text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="container pb-20">
        <PhotoGrid
          description="Эти изображения не заменяют карту, а делают маршрут менее абстрактным: показывают Камчатку, Командоры, американский берег и природный мир северной Пацифики."
          eyebrow="Галерея"
          photos={HOME_PHOTOS}
          title="Фотографии и визуальные материалы"
        />
      </section>

      <section className="container pb-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Маршруты</p>
            <h2 className="small-title text-[clamp(2rem,4vw,3.5rem)]">
              Две экспедиции
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-[var(--muted)]">
            Каждая карточка ведёт в подробный разбор этапов, событий и итогов.
            Так проще переходить от общего сюжета к маршруту и обратно.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {expeditions.map((expedition) => (
            <Link
              className="surface p-6 transition hover:-translate-y-1"
              href={`/expeditions/${expedition.slug}`}
              key={expedition.id}
            >
              <p className="text-sm text-[var(--muted)]">{expedition.period}</p>
              <h2 className="mt-3 text-2xl font-semibold">
                {expedition.title}
              </h2>
              <p className="mt-3 line-clamp-2 leading-7 text-[var(--muted)]">
                {expedition.summary}
              </p>
              <p className="mt-5 text-sm font-semibold text-[var(--accent)]">
                Перейти к разбору
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container pb-20">
        <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="surface p-6">
            <p className="eyebrow">Хронология</p>
            <h2 className="mt-3 text-2xl font-semibold">
              Как разворачивалась история
            </h2>
            <div className="mt-6 space-y-4">
              {timeline.map(([year, text]) => (
                <div
                  className="rounded-2xl border border-black/10 bg-[var(--surface-soft)] p-4"
                  key={year}
                >
                  <p className="text-sm font-semibold text-[var(--accent)]">
                    {year}
                  </p>
                  <p className="mt-2 leading-7 text-[var(--muted)]">{text}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="surface p-6">
            <p className="eyebrow">Как изучать</p>
            <h2 className="mt-3 text-2xl font-semibold">Что искать на сайте</h2>
            <div className="mt-6 space-y-4">
              {studyBlocks.map(([title, text]) => (
                <div key={title}>
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="mt-2 leading-7 text-[var(--muted)]">{text}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
