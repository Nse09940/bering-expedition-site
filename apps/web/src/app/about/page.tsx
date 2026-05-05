import { team } from "@/data/bering";

const methodology = [
  [
    "Сбор данных",
    "События, маршруты, цитаты и медиа заносятся только вместе с источником: названием, автором или происхождением, датой и ссылкой на архив или каталог.",
  ],
  [
    "Геопривязка",
    "Каждая точка получает современные координаты и пометку точности: точное место, район, реконструкция или обобщённая привязка.",
  ],
  [
    "Достоверность",
    "Спорные места помечаются в карточках событий, а важные выводы связываются с несколькими источниками и пояснениями к их интерпретации.",
  ],
  [
    "Контекст",
    "Экспедиции рассматриваются как часть мировой истории географических открытий, развития картографии XVIII века и освоения северной Пацифики.",
  ],
];

const mapReadingGuide = [
  [
    "Точка",
    "Координата, которую можно уверенно связать с конкретным историческим местом или устойчивым современным ориентиром.",
  ],
  [
    "Примерно",
    "Локализация известна в пределах района, бухты, островной группы или речного участка, но не сводится к одной бесспорной точке.",
  ],
  [
    "Реконструкция",
    "Маршрутная позиция восстановлена по журналам, отчётам, курсам и последовательности переходов, а не по прямому указанию точных координат.",
  ],
];

const principles = [
  "Мы сохраняем различие между историческим фактом, современной геопривязкой и исследовательской реконструкцией.",
  "Если маршрут проходит через спорный участок, это должно быть видно в подписи, типе точки или пояснительном тексте.",
  "Карта не подменяет источники: она помогает их читать, сопоставлять и видеть пространственную логику экспедиции.",
];

export default function AboutPage() {
  return (
    <main className="container page-shell flex-1">
      <div className="page-hero">
        <p className="eyebrow">О проекте</p>
        <h1 className="small-title">Методология и команда</h1>
        <p className="section-copy max-w-3xl">
          Этот сайт не просто пересказывает школьный сюжет об экспедициях
          Беринга. Он показывает, как исторические маршруты превращаются в
          проверяемую карту с уровнями точности, привязкой к источникам и
          понятной структурой этапов.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        {methodology.map(([title, text]) => (
          <article className="surface p-6" key={title}>
            <h2 className="text-2xl font-semibold">{title}</h2>
            <p className="mt-3 leading-7 text-[var(--muted)]">{text}</p>
          </article>
        ))}
      </section>

      <section className="mt-10 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <article className="surface p-6">
          <h2 className="text-2xl font-semibold">Как читать карту</h2>
          <div className="mt-5 space-y-4">
            {mapReadingGuide.map(([title, text]) => (
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
          <h2 className="text-2xl font-semibold">Принципы интерпретации</h2>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-[var(--muted)]">
            {principles.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="mt-10">
        <h2 className="text-3xl font-semibold">Кто что делал</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {team.map(([name, role]) => (
            <article className="surface p-6" key={name}>
              <h3 className="text-xl font-semibold">{name}</h3>
              <p className="mt-3 text-[var(--muted)]">{role}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
