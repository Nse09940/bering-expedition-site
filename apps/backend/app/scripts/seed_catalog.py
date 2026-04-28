from __future__ import annotations

import json
from datetime import date

from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.models import Citation, Event, Expedition, Location, RouteSegment, Source, Stage


EXPEDITIONS = [
    {
        "slug": "first-kamchatka",
        "title": "Первая Камчатская экспедиция",
        "summary": "Переход из Петербурга через Сибирь к Охотску и морской выход на боте «Святой Гавриил».",
        "period_start": date(1725, 1, 1),
        "period_end": date(1730, 12, 31),
    },
    {
        "slug": "second-kamchatka",
        "title": "Вторая Камчатская экспедиция",
        "summary": "Крупнейшая исследовательская программа Российской империи XVIII века.",
        "period_start": date(1733, 1, 1),
        "period_end": date(1743, 12, 31),
    },
]

STAGES = [
    ("first-kamchatka", "first-siberia", "Сухопутный переход к Охотску", 1, date(1725, 1, 1), date(1727, 12, 31)),
    ("first-kamchatka", "first-sea", "Плавание «Святого Гавриила»", 2, date(1728, 1, 1), date(1729, 12, 31)),
    ("second-kamchatka", "second-prep", "Подготовка и переходы отрядов", 1, date(1733, 1, 1), date(1740, 12, 31)),
    ("second-kamchatka", "second-america", "Плавание к Америке", 2, date(1741, 1, 1), date(1741, 12, 31)),
    ("second-kamchatka", "second-return", "Возвращение и кораблекрушение", 3, date(1741, 1, 1), date(1742, 12, 31)),
]

ROUTES = {
    "first-siberia": [{"x": 30.3, "y": 59.9}, {"x": 68.3, "y": 58.2}, {"x": 129.7, "y": 62.0}, {"x": 143.2, "y": 59.4}],
    "first-sea": [{"x": 143.2, "y": 59.4}, {"x": 162.3, "y": 56.3}, {"x": 190.3, "y": 66.1}, {"x": 189.6, "y": 63.4}],
    "second-prep": [{"x": 30.3, "y": 59.9}, {"x": 113.5, "y": 52.0}, {"x": 143.2, "y": 59.4}, {"x": 158.6, "y": 53.0}],
    "second-america": [{"x": 158.6, "y": 53.0}, {"x": 179.6, "y": 53.0}, {"x": 199.0, "y": 56.0}, {"x": 215.5, "y": 59.9}],
    "second-return": [{"x": 215.5, "y": 59.9}, {"x": 199.2, "y": 55.2}, {"x": 173.2, "y": 52.9}, {"x": 158.6, "y": 53.0}],
}

SOURCES = [
    ("berg-1725-1742", "Открытие Камчатки и Камчатские экспедиции Беринга. 1725-1742", "Л. С. Берг", "Исследование", 1935, "Историко-географическое исследование", "https://e-heritage.ru/", "Обзор по обеим экспедициям."),
    ("pokrovsky-docs", "Экспедиция Беринга: сборник документов", "А. А. Покровский", "Донесение", 1941, "Сборник документов", "https://runivers.ru/", "База для точных цитат, дат, формулировок."),
    ("vakhtin-first-sea", "Первая морская экспедиция Беринга", "В. В. Вахтин", "Исследование", 1964, "Исследование Первой экспедиции", "https://elibrary.ru/", "Источник по проливу между Азией и Америкой."),
    ("okhotina-meller-1741-1742", "Вторая Камчатская экспедиция. Морские отряды. 1741-1742", "Н. Охотина-Линд, П. У. Меллер", "Исследование", 2006, "Морские отряды", "https://cyberleninka.ru/", "Поход к Америке, обратный путь и зимовка."),
    ("dall-early-expeditions", "Early Expeditions to the Region of Bering Sea and Strait", "William H. Dall", "Исследование", 1870, "Англоязычная историография", "https://books.google.com/", "Для сверки западной историографии."),
    ("ostrovsky-bering", "Беринг", "Б. Г. Островский", "Исследование", 1951, "Биография и обзор экспедиций", "https://www.litres.ru/", "Ключевые события и значение открытий."),
]

EVENTS = [
    ("petersburg-start", "first-kamchatka", "first-siberia", "Санкт-Петербург", 59.9, 30.3, "Выход из Петербурга", "документ", "5 февраля 1725", 1725, ["pokrovsky-docs"]),
    ("tobolsk-transit", "first-kamchatka", "first-siberia", "Тобольск", 58.2, 68.3, "Переход через Тобольск", "переход", "1725", 1725, ["berg-1725-1742", "pokrovsky-docs"]),
    ("yakutsk-logistics", "first-kamchatka", "first-siberia", "Якутск", 62.0, 129.7, "Якутск как база снабжения", "стоянка", "1726", 1726, ["pokrovsky-docs"]),
    ("okhotsk-build", "first-kamchatka", "first-siberia", "Охотск", 59.4, 143.2, "Сборка судов в Охотске", "стоянка", "1727", 1727, ["pokrovsky-docs", "berg-1725-1742"]),
    ("nizhne-kamchatsk", "first-kamchatka", "first-sea", "Нижнекамчатск", 56.3, 162.3, "Выход от Нижнекамчатска", "переход", "13 июля 1728", 1728, ["berg-1725-1742", "vakhtin-first-sea"]),
    ("bering-strait", "first-kamchatka", "first-sea", "Берингов пролив", 66.1, 190.3, "Проход в районе будущего Берингова пролива", "открытие", "август 1728", 1728, ["vakhtin-first-sea", "dall-early-expeditions"]),
    ("saint-lawrence-island", "first-kamchatka", "first-sea", "Остров Святого Лаврентия", 63.4, 189.6, "Остров Святого Лаврентия", "открытие", "август 1728", 1728, ["vakhtin-first-sea", "dall-early-expeditions"]),
    ("petropavlovsk", "second-kamchatka", "second-prep", "Авачинская губа", 53.0, 158.6, "Основание гавани Петропавловска", "стоянка", "1740", 1740, ["pokrovsky-docs", "ostrovsky-bering"]),
    ("vessels-departure", "second-kamchatka", "second-america", "Петропавловская гавань", 52.9, 158.9, "Выход «Святого Петра» и «Святого Павла»", "переход", "июнь 1741", 1741, ["okhotina-meller-1741-1742", "ostrovsky-bering"]),
    ("ships-separate", "second-kamchatka", "second-america", "северная часть Тихого океана", 52.5, 171.0, "Разделение судов", "шторм", "июнь 1741", 1741, ["okhotina-meller-1741-1742"]),
    ("alaska-coast", "second-kamchatka", "second-america", "район Каяк-Айленд, Аляска", 59.9, 215.5, "Достижение берегов Северной Америки", "открытие", "июль 1741", 1741, ["okhotina-meller-1741-1742", "ostrovsky-bering"]),
    ("shumagin-islands", "second-kamchatka", "second-return", "Шумагинские острова", 55.2, 199.2, "Шумагинские острова", "наблюдение", "август 1741", 1741, ["okhotina-meller-1741-1742", "dall-early-expeditions"]),
    ("aleutians", "second-kamchatka", "second-return", "Алеутская гряда", 52.9, 173.2, "Алеутские острова на обратном пути", "наблюдение", "1741", 1741, ["okhotina-meller-1741-1742", "dall-early-expeditions"]),
    ("bering-island", "second-kamchatka", "second-return", "остров Беринга", 55.0, 166.3, "Кораблекрушение «Святого Петра»", "шторм", "декабрь 1741", 1741, ["okhotina-meller-1741-1742", "berg-1725-1742"]),
    ("survivors-return", "second-kamchatka", "second-return", "Петропавловская гавань", 53.0, 158.6, "Возвращение выживших на Камчатку", "переход", "1742", 1742, ["okhotina-meller-1741-1742", "berg-1725-1742"]),
]


def seed() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(Expedition.id).first():
            print("Catalog already seeded, skip")
            return

        expedition_by_slug: dict[str, Expedition] = {}
        for item in EXPEDITIONS:
            expedition = Expedition(status="published", **item)
            db.add(expedition)
            db.flush()
            expedition_by_slug[item["slug"]] = expedition

        stage_by_code: dict[str, Stage] = {}
        for expedition_slug, code, title, order, period_start, period_end in STAGES:
            stage = Stage(
                expedition_id=expedition_by_slug[expedition_slug].id,
                title=title,
                order=order,
                summary=title,
                period_start=period_start,
                period_end=period_end,
            )
            db.add(stage)
            db.flush()
            stage_by_code[code] = stage
            segment = RouteSegment(
                stage_id=stage.id,
                title=f"{title} (основной маршрут)",
                order=1,
                geojson=json.dumps({"points": ROUTES[code]}, ensure_ascii=False),
            )
            db.add(segment)

        source_by_code: dict[str, Source] = {}
        for code, title, author, source_type, year, origin, archive_link, description in SOURCES:
            source = Source(
                title=title,
                author=author,
                source_type=source_type,
                publication_year=year,
                origin=origin,
                archive_link=archive_link,
                description=description,
            )
            db.add(source)
            db.flush()
            source_by_code[code] = source

        for code, exp_slug, stage_code, place_name, lat, lon, title, event_type, date_label, year, source_codes in EVENTS:
            location = Location(
                historical_name=place_name,
                modern_name=place_name,
                description="",
                accuracy_note="",
                latitude=lat,
                longitude=lon,
            )
            db.add(location)
            db.flush()
            event = Event(
                expedition_id=expedition_by_slug[exp_slug].id,
                stage_id=stage_by_code[stage_code].id,
                location_id=location.id,
                title=title,
                slug=code,
                event_type=event_type,
                summary=title,
                happened_at=date(year, 1, 1),
                status="published",
            )
            db.add(event)
            db.flush()
            for source_code in source_codes:
                db.add(
                    Citation(
                        event_id=event.id,
                        source_id=source_by_code[source_code].id,
                        quote=date_label,
                        page_reference="",
                    ),
                )
        db.commit()
        print("Catalog seeded")
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
