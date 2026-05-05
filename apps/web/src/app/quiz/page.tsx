import { BeringQuiz } from "@/components/BeringQuiz";

export default function QuizPage() {
  return (
    <main className="container page-shell flex-1">
      <div className="page-hero">
        <p className="eyebrow">Интерактивный раздел</p>
        <h1 className="small-title">Викторина</h1>
        <p className="section-copy max-w-3xl">
          Проверь, насколько хорошо ты понял маршруты, ключевые точки и события
          экспедиций Витуса Беринга. Вопросы построены по материалам карты,
          карточек событий и раздела экспедиций.
        </p>
      </div>
      <BeringQuiz />
    </main>
  );
}
