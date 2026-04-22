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
    "Спорные места помечаются в карточках событий, а важные выводы связываются с несколькими источниками.",
  ],
  [
    "Контекст",
    "Экспедиции рассматриваются как часть мировой истории Великих географических открытий и развития картографии XVIII века.",
  ],
];

export default function AboutPage() {
  return (
    <main className="container page-shell flex-1">
      <div className="page-hero">
        <p className="eyebrow">О проекте</p>
        <h1 className="small-title">Методология и команда</h1>
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        {methodology.map(([title, text]) => (
          <article className="surface p-6" key={title}>
            <h2 className="text-2xl font-semibold">{title}</h2>
            <p className="mt-3 leading-7 text-[var(--muted)]">{text}</p>
          </article>
        ))}
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
