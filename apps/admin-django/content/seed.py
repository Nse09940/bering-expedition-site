from __future__ import annotations

from .models import Event, Expedition, Media, Place, Source, Stage


STAGE_ROUTES = {
    "first-siberia": [
        {"x": 30.3351, "y": 59.9343},
        {"x": 39.8915, "y": 59.2205},
        {"x": 46.3054, "y": 60.7603},
        {"x": 60.8054, "y": 58.8621},
        {"x": 65.5343, "y": 57.1530},
        {"x": 68.2520, "y": 58.2006},
        {"x": 73.3962, "y": 61.2540},
        {"x": 81.5000, "y": 58.7400},
        {"x": 90.8800, "y": 58.1878},
        {"x": 92.1797, "y": 58.4497},
        {"x": 103.7861, "y": 56.7717},
        {"x": 105.7672, "y": 56.7938},
        {"x": 129.6755, "y": 62.0355},
        {"x": 143.2150, "y": 59.3620},
    ],
    "first-sea": [
        {"x": 143.2150, "y": 59.3620},
        {"x": 156.2783, "y": 52.8233},
        {"x": 158.0000, "y": 54.8000},
        {"x": 162.5200, "y": 56.2400},
        {"x": 163.0830, "y": 56.0000},
        {"x": 163.8670, "y": 58.7670},
        {"x": 179.0330, "y": 62.2500},
        {"x": 180.7500, "y": 66.0000},
        {"x": 185.2500, "y": 64.7500},
        {"x": 186.8330, "y": 64.2330},
        {"x": 188.4500, "y": 63.8670},
        {"x": 190.4170, "y": 65.8330},
        {"x": 190.3470, "y": 66.0810},
        {"x": 193.1170, "y": 67.3000},
    ],
}


def seed_content() -> None:
    first, _ = Expedition.objects.update_or_create(
        code="first",
        defaults={
            "title": "Первая Камчатская экспедиция",
            "period": "1725-1730",
            "summary": "Переход к Охотску и морской выход на боте «Святой Гавриил».",
            "goal": "Выяснить, существует ли пролив между Азией и Америкой.",
            "results": "Пройден пролив, уточнены карты северной Пацифики.",
        },
    )
    second, _ = Expedition.objects.update_or_create(
        code="second",
        defaults={
            "title": "Вторая Камчатская экспедиция",
            "period": "1733-1743",
            "summary": "Крупнейшая исследовательская программа Российской империи XVIII века.",
            "goal": "Достичь берегов Северной Америки и описать северные моря.",
            "results": "Описаны маршруты к Аляске, Алеутским островам и обратный путь.",
        },
    )

    first_siberia, _ = Stage.objects.update_or_create(
        code="first-siberia",
        defaults={
            "expedition": first,
            "title": "Сухопутный переход к Охотску",
            "period": "1725-1727",
            "summary": "Переход через Сибирь к тихоокеанской базе.",
            "sort_order": 1,
        },
    )
    first_sea, _ = Stage.objects.update_or_create(
        code="first-sea",
        defaults={
            "expedition": first,
            "title": "Плавание «Святого Гавриила»",
            "period": "1728-1729",
            "summary": "Северный морской этап и вопрос о проливе.",
            "sort_order": 2,
        },
    )
    second_prep, _ = Stage.objects.update_or_create(
        code="second-prep",
        defaults={
            "expedition": second,
            "title": "Подготовка и переходы отрядов",
            "period": "1733-1740",
            "summary": "Подготовка баз, людей и судов.",
            "sort_order": 1,
        },
    )
    second_america, _ = Stage.objects.update_or_create(
        code="second-america",
        defaults={
            "expedition": second,
            "title": "Плавание к Америке",
            "period": "1741",
            "summary": "Выход к американскому берегу.",
            "sort_order": 2,
        },
    )
    second_return, _ = Stage.objects.update_or_create(
        code="second-return",
        defaults={
            "expedition": second,
            "title": "Возвращение и кораблекрушение",
            "period": "1741-1742",
            "summary": "Обратный путь, зимовка и возвращение на Камчатку.",
            "sort_order": 3,
        },
    )

    first_siberia.route_geojson = {"points": STAGE_ROUTES["first-siberia"]}
    first_siberia.save(update_fields=["route_geojson"])
    first_sea.route_geojson = {"points": STAGE_ROUTES["first-sea"]}
    first_sea.save(update_fields=["route_geojson"])

    places = {
        "petersburg": ("Санкт-Петербург", 59.9343, 30.3351),
        "yakutsk": ("Якутск", 62.0355, 129.6755),
        "okhotsk": ("Охотск", 59.3625, 143.2427),
        "bering-strait": ("Берингов пролив", 66.1000, -169.7000),
        "st-lawrence": ("Остров Святого Лаврентия", 63.4000, -170.4000),
        "petropavlovsk": ("Петропавловск-Камчатский", 53.0452, 158.6483),
        "alaska": ("Каяк-Айленд, Аляска", 59.8000, -144.6000),
        "shumagin": ("Шумагинские острова", 55.2000, -160.8000),
        "aleutians": ("Алеутская гряда", 52.9000, 173.2000),
        "bering-island": ("Остров Беринга", 55.0000, 166.3000),
    }
    place_objs = {}
    for code, (name, lat, lon) in places.items():
        place_objs[code], _ = Place.objects.update_or_create(
            code=code,
            defaults={"name": name, "latitude": lat, "longitude": lon},
        )

    sources_data = [
        (
            "berg-1725-1742",
            "Л. С. Берг",
            "Открытие Камчатки и Камчатские экспедиции Беринга. 1725-1742",
            "Исследование",
            "1935",
            "Президентская библиотека; оригинал: ГПИБ.",
            "https://www.prlib.ru/item/355601",
            "Классическое историко-географическое исследование по Первой и Второй Камчатским экспедициям.",
        ),
        (
            "pokrovsky-docs",
            "А. А. Покровский",
            "Экспедиция Беринга: сборник документов",
            "Архив",
            "1941",
            "Электронная библиотека Русского географического общества.",
            "https://elib.rgo.ru/handle/123456789/230885",
            "Публикация документов экспедиции: рапорты, инструкции, журнальные и административные материалы.",
        ),
        (
            "vakhtin-first-sea",
            "В. В. Вахтин",
            "Первая морская экспедиция Беринга для решения вопроса, соединяется ли Азия с Америкой",
            "Исследование",
            "1890",
            "Президентская библиотека; оригинал: СПбГУ.",
            "https://www.prlib.ru/item/678676",
            "Исследование Первой Камчатской экспедиции с опорой на журналы Чаплина и материалы морского ведомства.",
        ),
        (
            "okhotina-meller-1741-1742",
            "Н. Охотина-Линд",
            "Вторая Камчатская экспедиция. Морские отряды. [Ч. 5.] 1741-1742",
            "Архив",
            "2018",
            "Электронная библиотека исторических документов.",
            "https://docs.historyrussia.org/ru/nodes/473247-vtoraya-kamchatskaya-ekspeditsiya-morskie-otryady-ch-5-1741-1742",
            "Документальный сборник по морским отрядам Второй Камчатской экспедиции за 1741-1742 годы.",
        ),
        (
            "dall-early-expeditions",
            "William Healey Dall",
            "Early Expeditions to the Region of Bering Sea and Strait",
            "Исследование",
            "1891",
            "Open Library / Internet Archive.",
            "https://openlibrary.org/books/OL24995318M/Early_expeditions_to_the_region_of_Bering_Sea_and_Strait",
            "Англоязычная публикация по ранним экспедициям в районе Берингова моря и пролива.",
        ),
        (
            "ostrovsky-bering",
            "Б. Г. Островский",
            "Беринг: очерк жизни и полярных исследований русского мореплавателя",
            "Исследование",
            "1939",
            "Президентская библиотека; оригинал: Русское географическое общество.",
            "https://www.prlib.ru/item/677761",
            "Биографический очерк о Беринге и контексте его экспедиций.",
        ),
    ]
    source_objs = {}
    for code, author, title, source_type, year, origin, link, desc in sources_data:
        source_objs[code], _ = Source.objects.update_or_create(
            code=code,
            defaults={
                "author": author,
                "title": title,
                "type": source_type,
                "year": year,
                "origin": origin,
                "archive_link": link,
                "description": desc,
            },
        )

    media_data = [
        ("route-first", "Схема маршрута Первой экспедиции", "map", "https://history.dymnikov.tech/docs/img/route-first.png"),
        ("route-second", "Схема маршрута Второй экспедиции", "map", "https://history.dymnikov.tech/docs/img/route-second.png"),
        ("bering-portrait", "Портрет Витуса Беринга", "image", "https://history.dymnikov.tech/docs/img/bering-portrait.png"),
    ]
    media_objs = {}
    for code, title, media_type, url in media_data:
        media_objs[code], _ = Media.objects.update_or_create(
            code=code,
            defaults={"title": title, "media_type": media_type, "url": url},
        )

    events_data = [
        ("petersburg-start", first, first_siberia, "petersburg", "Выход из Петербурга", "5 февраля 1725", 1725, "документ", ["pokrovsky-docs"], ["route-first"]),
        ("yakutsk-logistics", first, first_siberia, "yakutsk", "Якутск как база снабжения", "1726", 1726, "стоянка", ["pokrovsky-docs"], ["route-first"]),
        ("okhotsk-build", first, first_siberia, "okhotsk", "Сборка судов в Охотске", "1727", 1727, "стоянка", ["berg-1725-1742"], ["route-first"]),
        ("bering-strait", first, first_sea, "bering-strait", "Проход в районе Берингова пролива", "август 1728", 1728, "открытие", ["vakhtin-first-sea", "dall-early-expeditions"], ["route-first"]),
        ("saint-lawrence-island", first, first_sea, "st-lawrence", "Остров Святого Лаврентия", "август 1728", 1728, "открытие", ["vakhtin-first-sea"], ["route-first"]),
        ("petropavlovsk", second, second_prep, "petropavlovsk", "Основание гавани Петропавловска", "1740", 1740, "стоянка", ["pokrovsky-docs", "ostrovsky-bering"], ["route-second"]),
        ("vessels-departure", second, second_america, "petropavlovsk", "Выход «Святого Петра» и «Святого Павла»", "июнь 1741", 1741, "переход", ["okhotina-meller-1741-1742"], ["route-second"]),
        ("alaska-coast", second, second_america, "alaska", "Достижение берегов Северной Америки", "июль 1741", 1741, "открытие", ["okhotina-meller-1741-1742", "ostrovsky-bering"], ["route-second"]),
        ("shumagin-islands", second, second_return, "shumagin", "Шумагинские острова", "август 1741", 1741, "наблюдение", ["okhotina-meller-1741-1742"], ["route-second"]),
        ("aleutians", second, second_return, "aleutians", "Алеутские острова на обратном пути", "1741", 1741, "наблюдение", ["okhotina-meller-1741-1742", "dall-early-expeditions"], ["route-second"]),
        ("bering-island", second, second_return, "bering-island", "Кораблекрушение «Святого Петра»", "декабрь 1741", 1741, "шторм", ["okhotina-meller-1741-1742", "berg-1725-1742"], ["route-second"]),
        ("survivors-return", second, second_return, "petropavlovsk", "Возвращение выживших на Камчатку", "1742", 1742, "переход", ["okhotina-meller-1741-1742", "berg-1725-1742"], ["route-second"]),
    ]

    for code, expedition, stage, place_code, title, date_label, year, event_type, source_codes, media_codes in events_data:
        place = place_objs[place_code]
        event, _ = Event.objects.update_or_create(
            code=code,
            defaults={
                "expedition": expedition,
                "stage": stage,
                "place": place,
                "title": title,
                "date_label": date_label,
                "year": year,
                "event_type": event_type,
                "summary": title,
                "quote": "",
                "latitude": place.latitude,
                "longitude": place.longitude,
                "accuracy": place.accuracy,
            },
        )
        event.sources.set([source_objs[item] for item in source_codes])
        event.media.set([media_objs[item] for item in media_codes])
