import Link from "next/link";
import { expeditions } from "@/data/bering";

const introCards = [
  [
    "Кто такой Беринг",
    "Мореплаватель на службе России, руководивший ключевыми экспедициями к северной части Тихого океана.",
  ],
  [
    "Что за экспедиции",
    "Первая проверяла связь Азии и Америки, Вторая вывела русские суда к берегам Аляски.",
  ],
  [
    "Почему важно",
    "Маршруты изменили картографию, навигацию и последующее освоение северной Пацифики.",
  ],
];

export default function Home() {
  return (
    <main className="flex-1">
      <section className="container grid min-h-[calc(100vh-73px)] place-items-center py-14 text-center">
        <div className="mx-auto max-w-5xl">
          <p className="eyebrow">Интерактивная история</p>
          <h1 className="section-title mt-5 text-[var(--foreground)]">
            Экспедиции Витуса Беринга
          </h1>
          <p className="section-copy mx-auto mt-6 max-w-2xl">
            Маршруты, открытия и источники на одной спокойной карте.
          </p>
          <div className="mt-8 flex justify-center">
            <Link className="button-primary" href="/map">
              Открыть карту
            </Link>
          </div>
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
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
