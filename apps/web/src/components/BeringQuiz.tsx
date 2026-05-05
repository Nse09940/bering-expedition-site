"use client";

import { useState } from "react";

const questions = [
  {
    question:
      "Какую главную географическую задачу решала Первая Камчатская экспедиция?",
    answers: [
      "Проверить, соединяются ли Азия и Америка сушей",
      "Найти морской путь вокруг Африки",
      "Описать берега Австралии",
      "Основать крепость на Аляске",
    ],
    correct: 0,
    detail:
      "Экспедиция должна была проверить северо-восток Азии и понять, есть ли сухопутная связь с Америкой.",
  },
  {
    question: "Откуда начался сухопутный путь Первой Камчатской экспедиции?",
    answers: ["Санкт-Петербург", "Охотск", "Якутск", "Петропавловская гавань"],
    correct: 0,
    detail:
      "Отряд вышел из Петербурга и затем прошёл через северные и сибирские маршруты к Охотску.",
  },
  {
    question:
      "Какой город был важнейшей базой снабжения перед переходом к Охотску?",
    answers: ["Якутск", "Казань", "Тверь", "Адак"],
    correct: 0,
    detail:
      "Якутск был ключевым тыловым центром: здесь собирали людей, грузы и припасы для восточного участка.",
  },
  {
    question: "На каком судне Беринг вышел в морской поход 1728 года?",
    answers: ["Святой Гавриил", "Святой Пётр", "Святой Павел", "Надежда"],
    correct: 0,
    detail:
      "Финальный морской участок первой экспедиции проходил на боте «Святой Гавриил».",
  },
  {
    question: "Какой пролив стал главным результатом первой экспедиции?",
    answers: [
      "Берингов пролив",
      "Первый Курильский пролив",
      "Магелланов пролив",
      "Датский пролив",
    ],
    correct: 0,
    detail:
      "Проход в районе будущего Берингова пролива подтвердил отсутствие сплошной суши между Азией и Америкой.",
  },
  {
    question: "Чем Вторая Камчатская экспедиция отличалась от первой?",
    answers: [
      "Она была гораздо более масштабной научной и морской программой",
      "Она проходила только по Волге",
      "Она не выходила к Тихому океану",
      "Она занималась только торговлей",
    ],
    correct: 0,
    detail:
      "Вторая экспедиция включала подготовительные, морские, научные и картографические задачи большого масштаба.",
  },
  {
    question:
      "Из какой гавани в 1741 году вышли «Святой Пётр» и «Святой Павел»?",
    answers: ["Петропавловская гавань", "Тобольск", "Енисейск", "Кострома"],
    correct: 0,
    detail:
      "Петропавловская гавань стала тихоокеанской базой похода к берегам Северной Америки.",
  },
  {
    question:
      "Что произошло с судами Беринга и Чирикова в северной части Тихого океана?",
    answers: [
      "Они потеряли друг друга во время шторма",
      "Они сразу вернулись в Охотск",
      "Они объединились с английской эскадрой",
      "Они дошли до Австралии",
    ],
    correct: 0,
    detail:
      "После разлуки маршрут разделился на линию «Святого Петра» Беринга и линию «Святого Павла» Чирикова.",
  },
  {
    question: "Какая точка связана с достижением Беринга берегов Аляски?",
    answers: ["Остров Каяк", "Чердынь", "Уват", "Чебоксары"],
    correct: 0,
    detail:
      "Остров Каяк и район горы Святого Ильи связаны с выходом «Святого Петра» к Северной Америке.",
  },
  {
    question: "Где закончилась трагическая зимовка и умер Витус Беринг?",
    answers: [
      "Остров Беринга",
      "Остров Каяк",
      "Остров Ратманова",
      "Остров Атту",
    ],
    correct: 0,
    detail:
      "После кораблекрушения у Командорских островов команда зимовала на острове, который позднее получил имя Беринга.",
  },
];

function scoreLabel(score: number) {
  if (score === questions.length)
    return "Отлично: маршрут знаешь почти как штурман экспедиции.";
  if (score >= 7)
    return "Хороший результат: основные события и география понятны.";
  if (score >= 4)
    return "Неплохо, но стоит ещё раз пройти карту и карточки событий.";
  return "Лучше начать с разделов «Карта» и «Экспедиции», а потом попробовать снова.";
}

export function BeringQuiz() {
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number>
  >({});
  const [showResult, setShowResult] = useState(false);

  const answeredCount = Object.keys(selectedAnswers).length;
  const score = questions.reduce(
    (sum, item, index) =>
      sum + (selectedAnswers[index] === item.correct ? 1 : 0),
    0,
  );
  const progress = Math.round((answeredCount / questions.length) * 100);

  return (
    <div className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
      <aside className="surface sticky top-24 h-fit overflow-hidden p-6">
        <p className="eyebrow">Проверка знаний</p>
        <h2 className="mt-3 text-3xl font-semibold">10 вопросов</h2>
        <p className="mt-4 leading-7 text-[var(--muted)]">
          Отвечай по порядку или выбирай любые карточки. После ответа появится
          пояснение, чтобы викторина работала как повторение материала.
        </p>
        <div className="mt-6 rounded-3xl bg-[var(--surface-soft)] p-4">
          <div className="flex items-center justify-between text-sm font-semibold">
            <span>Прогресс</span>
            <span>{progress}%</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/10">
            <div
              className="h-full rounded-full bg-[var(--accent)] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Ответов: {answeredCount} из {questions.length}
          </p>
        </div>
        <button
          className="button-primary mt-5 w-full"
          onClick={() => setShowResult(true)}
          type="button"
        >
          Показать результат
        </button>
        {showResult && (
          <div className="mt-5 rounded-3xl border border-black/10 bg-white p-4">
            <p className="text-4xl font-semibold">
              {score}/{questions.length}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              {scoreLabel(score)}
            </p>
            <button
              className="mt-4 text-sm font-semibold text-[var(--accent)]"
              onClick={() => {
                setSelectedAnswers({});
                setShowResult(false);
              }}
              type="button"
            >
              Пройти заново
            </button>
          </div>
        )}
      </aside>

      <section className="grid gap-4">
        {questions.map((item, questionIndex) => {
          const selected = selectedAnswers[questionIndex];
          const answered = selected !== undefined;

          return (
            <article
              className="surface overflow-hidden p-5 transition hover:-translate-y-0.5"
              key={item.question}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[var(--accent-warm)]">
                    Вопрос {questionIndex + 1}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold leading-tight">
                    {item.question}
                  </h3>
                </div>
                {answered && (
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      selected === item.correct
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {selected === item.correct ? "Верно" : "Нужно повторить"}
                  </span>
                )}
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {item.answers.map((answer, answerIndex) => {
                  const isSelected = selected === answerIndex;
                  const isCorrect = item.correct === answerIndex;
                  const stateClass =
                    answered && isCorrect
                      ? "border-emerald-400 bg-emerald-50 text-emerald-900"
                      : answered && isSelected
                        ? "border-red-300 bg-red-50 text-red-900"
                        : "border-black/10 bg-[var(--surface-soft)] hover:border-[var(--accent)] hover:bg-white";

                  return (
                    <button
                      className={`rounded-2xl border p-4 text-left text-sm leading-6 transition ${stateClass}`}
                      key={answer}
                      onClick={() =>
                        setSelectedAnswers((current) => ({
                          ...current,
                          [questionIndex]: answerIndex,
                        }))
                      }
                      type="button"
                    >
                      {answer}
                    </button>
                  );
                })}
              </div>

              {answered && (
                <p className="mt-4 rounded-2xl bg-[var(--accent-soft)] p-4 text-sm leading-6 text-[var(--muted-strong)]">
                  {item.detail}
                </p>
              )}
            </article>
          );
        })}
      </section>
    </div>
  );
}
