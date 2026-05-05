"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CircleMarker,
  MapContainer,
  Polyline,
  Popup,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import type { LatLngTuple } from "leaflet";
import {
  getSourcesForEvent,
  type CatalogData,
  type EventType,
  type ExpeditionId,
} from "@/lib/catalog";
import {
  FIRST_SEA_ROUTE,
  FIRST_SIBERIA_ROUTE,
} from "@/data/firstExpeditionRoute";
import {
  CHIRIKOV_ROUTE,
  SECOND_AMERICA_ROUTE,
  SECOND_PREP_ROUTE,
  SECOND_RETURN_ROUTE,
  ST_PETER_LANDMARK,
} from "@/data/secondExpeditionRoute";

type TimelineEvent = CatalogData["events"][number] & {
  cardBlurb: string;
  imageMode: "map" | "photo";
  imageKind: "Архив" | "Фото";
  imageSourceLabel: string;
  imageSourceUrl: string;
  imageUrl: string;
  sequence: number;
  synthetic?: boolean;
};

type TimelineVisual = Pick<
  TimelineEvent,
  | "image"
  | "imageKind"
  | "imageMode"
  | "imageSourceLabel"
  | "imageSourceUrl"
  | "imageUrl"
>;

const eventTypes: EventType[] = [
  "переход",
  "стоянка",
  "открытие",
  "наблюдение",
  "документ",
  "шторм",
];

const expeditionColors: Record<ExpeditionId, string> = {
  first: "#0071e3",
  second: "#b66a00",
};

const importantObjects = [
  ["Берингов пролив", 66.1, 190.3],
  ["Охотское море", 55.6, 148.5],
  ["Камчатка", 56.0, 160.0],
  ["Аляска", 60.0, 212.0],
  ["Алеутские острова", 53.0, 178.0],
] as const;

function commonsSourceUrl(filename: string) {
  return `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(filename)}`;
}

function commonsImageUrl(filename: string) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=960`;
}

function commonsPhotoVisual(
  image: string,
  filename: string,
  kind: TimelineVisual["imageKind"] = "Фото",
): TimelineVisual {
  return {
    image,
    imageMode: "photo",
    imageKind: kind,
    imageSourceLabel: "Wikimedia Commons",
    imageSourceUrl: commonsSourceUrl(filename),
    imageUrl: commonsImageUrl(filename),
  };
}

const EVENT_VISUALS = {
  admiralty: {
    image: "Адмиралтейство в Санкт-Петербурге",
    imageMode: "photo" as const,
    imageKind: "Фото" as const,
    imageSourceLabel: "Wikimedia Commons",
    imageSourceUrl: commonsSourceUrl("Admiralty SPB.jpg"),
    imageUrl: commonsImageUrl("Admiralty SPB.jpg"),
  },
  tobolsk: {
    image: "Тобольский кремль",
    imageMode: "photo" as const,
    imageKind: "Фото" as const,
    imageSourceLabel: "Wikimedia Commons",
    imageSourceUrl: commonsSourceUrl("Tobolsk Kremlin by Dmitry Medvedev.jpg"),
    imageUrl: commonsImageUrl("Tobolsk Kremlin by Dmitry Medvedev.jpg"),
  },
  yakutsk: {
    image: "Якутск",
    imageMode: "photo" as const,
    imageKind: "Фото" as const,
    imageSourceLabel: "Wikimedia Commons",
    imageSourceUrl: commonsSourceUrl("Yakutsk - 190228 DSC 5382.jpg"),
    imageUrl: commonsImageUrl("Yakutsk - 190228 DSC 5382.jpg"),
  },
  okhotsk: {
    image: "Охотск",
    imageMode: "photo" as const,
    imageKind: "Фото" as const,
    imageSourceLabel: "Wikimedia Commons",
    imageSourceUrl: commonsSourceUrl("Ohotsk.jpg"),
    imageUrl: commonsImageUrl("Ohotsk.jpg"),
  },
  avacha: {
    image: "Авачинская бухта",
    imageMode: "photo" as const,
    imageKind: "Фото" as const,
    imageSourceLabel: "Wikimedia Commons",
    imageSourceUrl: commonsSourceUrl(
      "Center of Petropavlovsk-Kamchatsky Avacha Bay.jpg",
    ),
    imageUrl: "/history/avacha-bay.jpg",
  },
  petropavlovsk: {
    image: "Петропавловск-Камчатский и Корякский вулкан",
    imageMode: "photo" as const,
    imageKind: "Фото" as const,
    imageSourceLabel: "Wikimedia Commons",
    imageSourceUrl: commonsSourceUrl(
      "Petropavlovsk-Kamchatsky with Koryaksky Volcano in background.jpg",
    ),
    imageUrl: "/history/petropavlovsk-volcano.jpg",
  },
  volcano: {
    image: "Камчатский вулканический ландшафт",
    imageMode: "photo" as const,
    imageKind: "Фото" as const,
    imageSourceLabel: "Wikimedia Commons",
    imageSourceUrl: commonsSourceUrl(
      "Koryaksky Volcano - Kamchatka, Russian Federation - Summer 1993.jpg",
    ),
    imageUrl: "/history/koryaksky-volcano.jpg",
  },
  kayak: {
    image: "Северная тихоокеанская береговая линия",
    imageMode: "photo" as const,
    imageKind: "Фото" as const,
    imageSourceLabel: "Wikimedia Commons",
    imageSourceUrl: commonsSourceUrl("Kayak Island 8304.JPG"),
    imageUrl: "/history/kayak-island.jpg",
  },
  beringIsland: {
    image: "Остров Беринга",
    imageMode: "photo" as const,
    imageKind: "Фото" as const,
    imageSourceLabel: "Wikimedia Commons",
    imageSourceUrl: commonsSourceUrl("Bering island.jpg"),
    imageUrl: "/history/bering-island.jpg",
  },
  beringBeach: {
    image: "Северотихоокеанский берег",
    imageMode: "photo" as const,
    imageKind: "Архив" as const,
    imageSourceLabel: "Wikimedia Commons",
    imageSourceUrl: commonsSourceUrl(
      "Beach and rock formation, Bering Island, Russia, 1880-1900 (AL+CA 3273).jpg",
    ),
    imageUrl: "/history/bering-beach.jpg",
  },
  strait: {
    image: "Берингов пролив",
    imageMode: "photo" as const,
    imageKind: "Фото" as const,
    imageSourceLabel: "Wikimedia Commons",
    imageSourceUrl: commonsSourceUrl("BeringSt-close-VE.jpg"),
    imageUrl: commonsImageUrl("BeringSt-close-VE.jpg"),
  },
  mapCard: {
    image: "Карта точки",
    imageMode: "map" as const,
    imageKind: "Архив" as const,
    imageSourceLabel: "Координаты маршрута",
    imageSourceUrl: "",
    imageUrl: "",
  },
};

const FIRST_ROUTE_POINT_VISUALS: Record<string, TimelineVisual> = {
  "Санкт-Петербург": EVENT_VISUALS.admiralty,
  "Санкт-Петербург / Адмиралтейство": EVENT_VISUALS.admiralty,
  Шлиссельбург: commonsPhotoVisual(
    "Шлиссельбург",
    "Oreshek (fortress) view01.jpg",
  ),
  "Новая Ладога": commonsPhotoVisual("Новая Ладога", "Gdnl 02.JPG"),
  Тихвин: commonsPhotoVisual("Тихвин", "Tikhvin.jpg"),
  Устюжна: commonsPhotoVisual("Устюжна", "Sobornaya square (Ustyuzhna).jpg"),
  Вологда: commonsPhotoVisual("Вологда", "Sophia panorama 2.jpg"),
  Тотьма: commonsPhotoVisual("Тотьма", "Collage Totma.jpg"),
  "Великий Устюг": commonsPhotoVisual(
    "Великий Устюг",
    "RU VU Krasnaya SpasPreobr-2-brightened.jpg",
  ),
  Сольвычегодск: commonsPhotoVisual(
    "Сольвычегодск",
    "Благовещенский собор. Сольвычегодск.jpg",
  ),
  Лальск: commonsPhotoVisual(
    "Лальск",
    "Ансамбль Воскресенского собора поселка Лальск 02.jpg",
  ),
  Кайгородок: commonsPhotoVisual(
    "Койгородский район",
    "Location Koygorodsky District Komi Republic.svg",
    "Архив",
  ),
  Чердынь: commonsPhotoVisual(
    "Чердынь",
    "Исторический центр города Чердынь у реки Колва.jpg",
  ),
  Соликамск: commonsPhotoVisual("Соликамск", "Троицкий собор (Соликамск).jpg"),
  Верхотурье: commonsPhotoVisual("Верхотурье", "Verchotur'e.jpg"),
  Туринск: commonsPhotoVisual("Туринск", "Дом С.А. Чиркова.jpeg"),
  Тюмень: commonsPhotoVisual(
    "Тюмень",
    "Крестовоздвиженская церковь (Тюмень)-2.jpg",
  ),
  Тобольск: EVENT_VISUALS.tobolsk,
  Абалак: commonsPhotoVisual("Абалак", "Никольская церковь с.Абалак.JPG"),
  Уват: commonsPhotoVisual(
    "Уват",
    "Kulturdomo en Uvato (eksa preĝejo de la Neartefarita Savinto — Tuko de Edeso) 01.jpg",
  ),
  "Ханты-Мансийск": commonsPhotoVisual(
    "Ханты-Мансийск",
    "Khanty-Mansiysk Cathedral.jpg",
  ),
  "Ханты-Мансийск / район слияния Иртыша и Оби": commonsPhotoVisual(
    "Ханты-Мансийск",
    "Khanty-Mansiysk Cathedral.jpg",
  ),
  Нефтеюганск: commonsPhotoVisual(
    "Нефтеюганск",
    "Речной порт Нефтеюганска.jpg",
  ),
  "Нефтеюганск / Обь": commonsPhotoVisual(
    "Нефтеюганск",
    "Речной порт Нефтеюганска.jpg",
  ),
  Сургут: commonsPhotoVisual("Сургут", "Surgut, Russia 06.jpg"),
  Нижневартовск: commonsPhotoVisual(
    "Нижневартовск",
    "Nizhnevartovsk, lake Komsomolskoye skyline.jpg",
  ),
  "Нижневартовск / Обь": commonsPhotoVisual(
    "Нижневартовск",
    "Nizhnevartovsk, lake Komsomolskoye skyline.jpg",
  ),
  "Александровское / Обь": commonsPhotoVisual("Обь", "River Ob.jpg"),
  Колпашево: commonsPhotoVisual("Колпашево", "Ferry in Kolpashevo.jpg"),
  "Колпашево / Обь": commonsPhotoVisual("Колпашево", "Ferry in Kolpashevo.jpg"),
  Нарым: commonsPhotoVisual(
    "Нарым",
    "Parabelskiy r-n, Tomskaya oblast', Russia - panoramio.jpg",
  ),
  Парабель: commonsPhotoVisual(
    "Парабель",
    "Ледовая переправа реке Парабель.jpg",
  ),
  "Парабель / вход в бассейн Кети": commonsPhotoVisual(
    "Парабель",
    "Ледовая переправа реке Парабель.jpg",
  ),
  "Белый Яр на Кети": commonsPhotoVisual(
    "Кеть",
    "Mouth of the Ket' (2024-07-01 Sentinel-2 L2A).png",
    "Архив",
  ),
  "Среднее течение Кети": commonsPhotoVisual(
    "Бассейн реки Кеть",
    "Ket basin.png",
    "Архив",
  ),
  "Маковское / Маковский острог": commonsPhotoVisual(
    "Кетский путь",
    "Drawing Book of Siberia 10 map.jpeg",
    "Архив",
  ),
  Демьянское: commonsPhotoVisual(
    "Демьянское",
    "Въезд в Демьянское - panoramio.jpg",
  ),
  Енисейск: commonsPhotoVisual("Енисейск", "Dudareva Street in Yeniseisk.jpg"),
  "Стрелка Ангары и Енисея / район": commonsPhotoVisual(
    "Стрелка Ангары и Енисея",
    "4Y1A9115 (29324156381).jpg",
  ),
  "Мотыгино / Ангара": commonsPhotoVisual(
    "Ангара у Мотыгинского района",
    "Прогулка по реке Ангаре.JPG",
  ),
  Кодинск: commonsPhotoVisual("Кодинск", "Kodinsk.JPG"),
  "Кодинск / Ангара": commonsPhotoVisual("Кодинск", "Kodinsk.JPG"),
  "Усть-Илимск": commonsPhotoVisual("Усть-Илимск", "Gorod Ust-Ilimsk.jpg"),
  "Усть-Илимск / район Илимска": commonsPhotoVisual(
    "Усть-Илимск",
    "Gorod Ust-Ilimsk.jpg",
  ),
  Илимск: commonsPhotoVisual(
    "Илимск",
    "Taltsy Museum Irkutsk Ostrog Tower 200007280018.jpg",
  ),
  "Илимск / историческое место": commonsPhotoVisual(
    "Илимск",
    "Taltsy Museum Irkutsk Ostrog Tower 200007280018.jpg",
  ),
  "Усть-Кут": commonsPhotoVisual("Усть-Кут", "Полет над городом усть-кут.jpg"),
  Киренск: commonsPhotoVisual("Киренск", "Privet iz kirenska.jpg"),
  Витим: commonsPhotoVisual("Витим", "Vitim posle Bambuyki.jpg"),
  "Витим / Лена": commonsPhotoVisual("Витим", "Vitim posle Bambuyki.jpg"),
  Ленск: commonsPhotoVisual("Ленск", "Aeroport Lensk.jpg"),
  "Ленск / Лена": commonsPhotoVisual("Ленск", "Aeroport Lensk.jpg"),
  Олёкминск: commonsPhotoVisual(
    "Олёкминск",
    "Aerial view towards Olëkminsk in afternoon - panoramio.jpg",
  ),
  Покровск: commonsPhotoVisual(
    "Покровск",
    "Круиз Якутск - Ленские столбы - Тикси - Якутск, 2017 (058).jpg",
  ),
  "Покровск / Лена": commonsPhotoVisual(
    "Покровск",
    "Круиз Якутск - Ленские столбы - Тикси - Якутск, 2017 (058).jpg",
  ),
  Якутск: EVENT_VISUALS.yakutsk,
  "Усть-Мая": commonsPhotoVisual("Река Мая", "Mayaokt.jpg"),
  Нелькан: commonsPhotoVisual("Нелькан", "Nelkan view 02.jpg"),
  "Юдомский Крест / район волока к Охотску": commonsPhotoVisual(
    "Район Юдомы и Маи",
    "Ust-Yudoma 2020-06-29-23 59 Sentinel-2 L2A.jpg",
    "Архив",
  ),
  Охотск: EVENT_VISUALS.okhotsk,
  "Выход из Охотска в море": EVENT_VISUALS.okhotsk,
  "Охотское море": commonsPhotoVisual(
    "Охотское море",
    "Freezing the waters of the Sea of Okhotsk. Magadan.jpg",
  ),
  "Охотское море / переход к Камчатке 1": commonsPhotoVisual(
    "Охотское море",
    "Freezing the waters of the Sea of Okhotsk. Magadan.jpg",
  ),
  "Охотское море / переход к Камчатке 2": commonsPhotoVisual(
    "Охотское море",
    "Freezing the waters of the Sea of Okhotsk. Magadan.jpg",
  ),
  "Охотское море / переход к Камчатке 3": commonsPhotoVisual(
    "Охотское море",
    "Freezing the waters of the Sea of Okhotsk. Magadan.jpg",
  ),
  "Устье реки Большой / западная Камчатка": commonsPhotoVisual(
    "Река Большая",
    "Bystraja-wikimapia.jpg",
  ),
  "Большерецкий острог": commonsPhotoVisual(
    "Усть-Большерецк",
    "Ust-Bolshereck-wikimapia.jpg",
  ),
  "Переход через Срединный хребет 1": commonsPhotoVisual(
    "Срединный хребет",
    "Срединный хребет.jpg",
  ),
  "Переход через Срединный хребет 2": commonsPhotoVisual(
    "Срединный хребет",
    "Срединный хребет (район рек Левая Белая и Правая Киревна).jpg",
  ),
  "Долина реки Камчатки / район Мильково": commonsPhotoVisual(
    "Мильково",
    "Milkovo View.jpg",
  ),
  "Верхнекамчатск / Верхнекамчатский острог": commonsPhotoVisual(
    "Историческая карта Камчатки",
    "Carte historique du Kamtchatka-fr.svg",
    "Архив",
  ),
  "Река Камчатка / ниже Верхнекамчатска": commonsPhotoVisual(
    "Река Камчатка",
    "Meanders of Kamchatka river.jpg",
  ),
  "Козыревск / река Камчатка": commonsPhotoVisual(
    "Козыревск",
    "Street - Kozyrevsk, Kamchatka, Russian Federation - Summer 1993.jpg",
  ),
  Ключи: commonsPhotoVisual("Ключи", "Klyuchi.jpg"),
  "Ключи / река Камчатка": commonsPhotoVisual("Ключи", "Klyuchi.jpg"),
  "Нижнекамчатский острог": commonsPhotoVisual(
    "Нижнекамчатск",
    "Nizhnekamchatsk in XVIII century.jpg",
    "Архив",
  ),
  "Устье реки Камчатки / старт морского похода": commonsPhotoVisual(
    "Усть-Камчатский район",
    "Ust-Kamchatsky District, Kamchatka Krai, Russia - panoramio.jpg",
  ),
  "Камчатский залив": commonsPhotoVisual(
    "Камчатский залив",
    "Commander Islands Map - Russian.png",
    "Архив",
  ),
  "Камчатский залив / выход в океан": commonsPhotoVisual(
    "Камчатский залив",
    "Commander Islands Map - Russian.png",
    "Архив",
  ),
  "Вдоль восточной Камчатки 1": commonsPhotoVisual(
    "Камчатский полуостров",
    "Kamchatka peninsula topo.jpg",
    "Архив",
  ),
  "Карагинский залив": commonsPhotoVisual(
    "Карагинский залив",
    "KamchatkaKaraginskiyGulf.png",
    "Архив",
  ),
  "Остров Карагинский / ориентир": commonsPhotoVisual(
    "Остров Карагинский",
    "Okhotsk-Japan5KRG.png",
    "Архив",
  ),
  "Олюторский залив": commonsPhotoVisual(
    "Олюторский залив",
    "KamchatkaOlyutorskyGulf.png",
    "Архив",
  ),
  "Мыс Олюторский / район": commonsPhotoVisual(
    "Побережье между мысом Олюторским и Чукоткой",
    "Mercator Map of the Bering Sea from the Northeast Coast of Asia, Between Cape Olutor and Cape Chukotka- Taken from Captain Litke's Map, Supplemented by an Insert of the Anadyr Inlet WDL153.png",
    "Архив",
  ),
  "Корякское побережье / переход 1": commonsPhotoVisual(
    "Корякское побережье",
    "Mercator Map of the Bering Sea from the Northeast Coast of Asia, Between Cape Olutor and Cape Chukotka- Taken from Captain Litke's Map, Supplemented by an Insert of the Anadyr Inlet WDL153.png",
    "Архив",
  ),
  "Корякское побережье / переход 2": commonsPhotoVisual(
    "Корякское побережье",
    "Mercator Map of the Bering Sea from the Northeast Coast of Asia, Between Cape Olutor and Cape Chukotka- Taken from Captain Litke's Map, Supplemented by an Insert of the Anadyr Inlet WDL153.png",
    "Архив",
  ),
  "Мыс Наварин": commonsPhotoVisual("Мыс Наварин", "Cape Navarin.png", "Архив"),
  "Мыс Наварин / район": commonsPhotoVisual(
    "Мыс Наварин",
    "Cape Navarin.png",
    "Архив",
  ),
  "Анадырский залив": commonsPhotoVisual(
    "Анадырский залив",
    "Gulf of Anadyr.jpg",
  ),
  "Анадырский залив / южная часть": commonsPhotoVisual(
    "Анадырский залив",
    "Gulf of Anadyr.jpg",
  ),
  "Анадырский залив / восточная часть": commonsPhotoVisual(
    "Анадырский залив",
    "Gulf of Anadyr.jpg",
  ),
  "Залив Креста": commonsPhotoVisual("Залив Креста", "Залив Креста.jpg"),
  "Бухта Провидения": commonsPhotoVisual(
    "Бухта Провидения",
    "Provideniya Airport - ground view.jpg",
  ),
  "Бухта Провидения / ориентир": commonsPhotoVisual(
    "Бухта Провидения",
    "Provideniya Airport - ground view.jpg",
  ),
  "Район встречи с чукчами / мыс Чукотский": commonsPhotoVisual(
    "Чукотское побережье",
    "Cape Dezhnev w umiac.JPG",
    "Архив",
  ),
  "Остров Святого Лаврентия": commonsPhotoVisual(
    "Остров Святого Лаврентия",
    "Wfm st lawrence island.jpg",
  ),
  "Остров Святого Лаврентия / видимый ориентир": commonsPhotoVisual(
    "Остров Святого Лаврентия",
    "Wfm st lawrence island.jpg",
  ),
  "Остров Ратманова": commonsPhotoVisual(
    "Остров Ратманова",
    "Diomede Islands Bering Sea Jul 2006.jpg",
  ),
  "Остров Ратманова / Большой Диомид": commonsPhotoVisual(
    "Остров Ратманова",
    "Diomede Islands Bering Sea Jul 2006.jpg",
  ),
  "Мыс Дежнёва": commonsPhotoVisual("Мыс Дежнёва", "Dezhnev Lighthouse.jpg"),
  "Мыс Дежнёва / восточная оконечность Азии": commonsPhotoVisual(
    "Мыс Дежнёва",
    "Dezhnev Lighthouse.jpg",
  ),
  "Берингов пролив": EVENT_VISUALS.strait,
  "Берингов пролив / южный вход": EVENT_VISUALS.strait,
  "Берингов пролив / севернее Диомидов": EVENT_VISUALS.strait,
  "Северная точка разворота Беринга": commonsPhotoVisual(
    "Чукотское море и Берингов пролив",
    "Chukchi Sea.png",
    "Архив",
  ),
};

const SECOND_ROUTE_POINT_VISUALS: Record<string, TimelineVisual> = {
  ...FIRST_ROUTE_POINT_VISUALS,
  Тверь: commonsPhotoVisual("Тверь", "Площадь Михаила Тверского.jpg"),
  "Тверь / выход к Волге": commonsPhotoVisual(
    "Тверь",
    "Площадь Михаила Тверского.jpg",
  ),
  Углич: commonsPhotoVisual("Углич", "Building of City Duma in Uglich.jpg"),
  "Углич / Волга": commonsPhotoVisual(
    "Углич",
    "Building of City Duma in Uglich.jpg",
  ),
  Ярославль: commonsPhotoVisual("Ярославль", "Yarolslav colage.png"),
  "Ярославль / Волга": commonsPhotoVisual("Ярославль", "Yarolslav colage.png"),
  Кострома: commonsPhotoVisual("Кострома", "Ipatiev02.jpg"),
  "Кострома / Волга": commonsPhotoVisual("Кострома", "Ipatiev02.jpg"),
  "Нижний Новгород": commonsPhotoVisual(
    "Нижний Новгород",
    "Nizhny Novgorod 2025-04-29 Minin and Pozharsky square 01.jpg",
  ),
  "Нижний Новгород / Волга": commonsPhotoVisual(
    "Нижний Новгород",
    "Nizhny Novgorod 2025-04-29 Minin and Pozharsky square 01.jpg",
  ),
  Чебоксары: commonsPhotoVisual(
    "Чебоксары",
    "Cheboksary. View of downtown.jpg",
  ),
  "Чебоксары / Волга": commonsPhotoVisual(
    "Чебоксары",
    "Cheboksary. View of downtown.jpg",
  ),
  Казань: commonsPhotoVisual("Казань", "KAZ Collage 2015.png"),
  "Казань / переход на Каму": commonsPhotoVisual(
    "Казань",
    "KAZ Collage 2015.png",
  ),
  Чистополь: commonsPhotoVisual(
    "Чистополь",
    "Чистополь (с высоты пятиэтажки).JPG",
  ),
  "Чистополь / Кама": commonsPhotoVisual(
    "Чистополь",
    "Чистополь (с высоты пятиэтажки).JPG",
  ),
  Елабуга: commonsPhotoVisual(
    "Елабуга",
    "Shishkinskiye prudy (park in Elabuga)-14.jpg",
  ),
  "Елабуга / Кама": commonsPhotoVisual(
    "Елабуга",
    "Shishkinskiye prudy (park in Elabuga)-14.jpg",
  ),
  Сарапул: commonsPhotoVisual("Сарапул", "Sarapul Fire Tower.jpg"),
  "Сарапул / Кама": commonsPhotoVisual("Сарапул", "Sarapul Fire Tower.jpg"),
  Оса: commonsPhotoVisual(
    "Оса",
    "Оса. Возведение здания летнего театра 1909.jpg",
    "Архив",
  ),
  "Оса / Камский путь": commonsPhotoVisual(
    "Оса",
    "Оса. Возведение здания летнего театра 1909.jpg",
    "Архив",
  ),
  Кунгур: commonsPhotoVisual("Кунгур", "Kungur view.jpg"),
  "Кунгур / сухопутный переход": commonsPhotoVisual(
    "Кунгур",
    "Kungur view.jpg",
  ),
  Екатеринбург: commonsPhotoVisual(
    "Екатеринбург",
    "Views of Yekaterinburg from Vysotsky viewpoint - 12.jpg",
  ),
  "Екатеринбург / Урал": commonsPhotoVisual(
    "Екатеринбург",
    "Views of Yekaterinburg from Vysotsky viewpoint - 12.jpg",
  ),
  Тара: commonsPhotoVisual("Тара", "Panorama Tara.jpg"),
  "Тара / Иртыш": commonsPhotoVisual("Тара", "Panorama Tara.jpg"),
  Томск: commonsPhotoVisual(
    "Томск",
    "Tomsk, view from the fire-observation tower.jpg",
  ),
  Красноярск: commonsPhotoVisual(
    "Красноярск",
    "Aerial view of Krasnoyarsk 1.jpg",
  ),
  Иркутск: commonsPhotoVisual("Иркутск", "Иркутск. Нижняя Набережная.JPG"),
  "Охотск / выход в море": EVENT_VISUALS.okhotsk,
  "Рейд у устья реки Большой": commonsPhotoVisual(
    "Река Большая",
    "Bystraja-wikimapia.jpg",
  ),
  "Большерецкий район": commonsPhotoVisual(
    "Усть-Большерецк",
    "Ust-Bolshereck-wikimapia.jpg",
  ),
  "Мыс Лопатка": commonsPhotoVisual(
    "Юг Камчатки",
    "Kamchatka peninsula topo.jpg",
    "Архив",
  ),
  "Мыс Лопатка / юг Камчатки": commonsPhotoVisual(
    "Юг Камчатки",
    "Kamchatka peninsula topo.jpg",
    "Архив",
  ),
  "Первый Курильский пролив / район": commonsPhotoVisual(
    "Первый Курильский пролив",
    "Shumshu.jpg",
    "Архив",
  ),
  "Тихий океан восточнее Лопатки": commonsPhotoVisual(
    "Северная Пацифика у Камчатки",
    "Pacific Ocean laea location map.svg",
    "Архив",
  ),
  "Вход в Авачинскую бухту": EVENT_VISUALS.avacha,
  "Авачинская губа": EVENT_VISUALS.avacha,
  "Авачинская губа / выход": EVENT_VISUALS.avacha,
  "Петропавловская гавань": EVENT_VISUALS.petropavlovsk,
  "Петропавловская гавань / старт 1741": EVENT_VISUALS.petropavlovsk,
  "Район разлуки Св. Петра и Св. Павла": commonsPhotoVisual(
    "Северная часть Тихого океана",
    "Pacific Ocean laea location map.svg",
    "Архив",
  ),
  "Тихий океан": commonsPhotoVisual(
    "Северная часть Тихого океана",
    "Pacific Ocean laea location map.svg",
    "Архив",
  ),
  "Поиск Св. Павла на той же параллели": commonsPhotoVisual(
    "Поиск «Святого Павла»",
    "Pacific Ocean laea location map.svg",
    "Архив",
  ),
  "Поворот к югу": commonsPhotoVisual(
    "Поворот в северной Пацифике",
    "Pacific Ocean laea location map.svg",
    "Архив",
  ),
  "Поворот на восток-северо-восток": commonsPhotoVisual(
    "Поворот к Америке",
    "Pacific Ocean laea location map.svg",
    "Архив",
  ),
  "Поворот к северу после неудачного поиска": commonsPhotoVisual(
    "Поворот к северу",
    "Pacific Ocean laea location map.svg",
    "Архив",
  ),
  "Северо-восточный ход к Америке 1": commonsPhotoVisual(
    "Северо-восточный ход к Америке",
    "Pacific Ocean laea location map.svg",
    "Архив",
  ),
  "Северо-восточный ход к Америке 2": commonsPhotoVisual(
    "Северо-восточный ход к Америке",
    "Pacific Ocean laea location map.svg",
    "Архив",
  ),
  "Место наблюдения земли / широта 58°38'": commonsPhotoVisual(
    "Район наблюдения американского берега",
    "Mt Saint Elias, South Central Alaska.jpg",
  ),
  "Южная точка поиска земли Хуана де Гамы": commonsPhotoVisual(
    "Поиск земли Хуана де Гамы",
    "Pacific Ocean laea location map.svg",
    "Архив",
  ),
  "Гора Святого Ильи": commonsPhotoVisual(
    "Гора Святого Ильи",
    "Mt Saint Elias, South Central Alaska.jpg",
  ),
  "Гора Святого Ильи / видимый ориентир": commonsPhotoVisual(
    "Гора Святого Ильи",
    "Mt Saint Elias, South Central Alaska.jpg",
  ),
  "Остров Каяк": EVENT_VISUALS.kayak,
  "Остров Каяк / мыс Святого Ильи": EVENT_VISUALS.kayak,
  "Остров Каяк / начало обратного пути": EVENT_VISUALS.kayak,
  "Место высадки Стеллера на Каяке / ориентир": EVENT_VISUALS.kayak,
  "Залив Аляска / отход на запад": commonsPhotoVisual(
    "Залив Аляска",
    "Pacific Ocean laea location map.svg",
    "Архив",
  ),
  "Остров Чирикова": commonsPhotoVisual(
    "Остров Чирикова",
    "Kodiak Island map.png",
    "Архив",
  ),
  "Остров Чирикова / Туманный": commonsPhotoVisual(
    "Остров Чирикова",
    "Kodiak Island map.png",
    "Архив",
  ),
  "Острова Семиди / ориентир": commonsPhotoVisual(
    "Острова Семиди",
    "Kodiak Island map.png",
    "Архив",
  ),
  "Шумагинские острова": commonsPhotoVisual(
    "Шумагинские острова",
    "Shumagins, Big Koniuji Island with MV Tiglax.jpg",
  ),
  "Остров Нагай / Шумагинские острова": commonsPhotoVisual(
    "Остров Нагай",
    "Shumagin Islands, Nagai Island, 1985.jpg",
  ),
  "Остров Унга / Шумагинские острова": commonsPhotoVisual(
    "Остров Унга",
    "Unga Island NPS.jpg",
  ),
  Унимак: commonsPhotoVisual("Унимак", "Unimak island.jpg"),
  "Район Унимакского прохода": commonsPhotoVisual(
    "Унимак",
    "Unimak island.jpg",
  ),
  Уналашка: commonsPhotoVisual("Уналашка", "UnalaskaAlaska.jpg"),
  "Уналашка / Алеутские острова": commonsPhotoVisual(
    "Уналашка",
    "UnalaskaAlaska.jpg",
  ),
  Умнак: commonsPhotoVisual("Умнак", "MountVsevidof.jpg"),
  "Умнак / Алеутские острова": commonsPhotoVisual("Умнак", "MountVsevidof.jpg"),
  Юнаска: commonsPhotoVisual(
    "Алеутская дуга",
    "Pacific Ocean laea location map.svg",
    "Архив",
  ),
  "Юнаска / Алеутские острова": commonsPhotoVisual(
    "Алеутская дуга",
    "Pacific Ocean laea location map.svg",
    "Архив",
  ),
  Атка: commonsPhotoVisual("Атка", "Atka.JPG"),
  "Атка / Алеутские острова": commonsPhotoVisual("Атка", "Atka.JPG"),
  Адак: commonsPhotoVisual("Адак", "Adak - Adak Island.jpg"),
  "Адак / Алеутские острова": commonsPhotoVisual(
    "Адак",
    "Adak - Adak Island.jpg",
  ),
  Амчитка: commonsPhotoVisual(
    "Амчитка",
    "Amchitka Island, Harlequin Beach.jpg",
  ),
  "Амчитка / Алеутские острова": commonsPhotoVisual(
    "Амчитка",
    "Amchitka Island, Harlequin Beach.jpg",
  ),
  Кыска: commonsPhotoVisual("Кыска", "Kiska Island volcano.jpg"),
  "Кыска / Алеутские острова": commonsPhotoVisual(
    "Кыска",
    "Kiska Island volcano.jpg",
  ),
  Атту: commonsPhotoVisual("Атту", "Attu sat.jpg", "Архив"),
  "Атту / Ближние острова": commonsPhotoVisual("Атту", "Attu sat.jpg", "Архив"),
  "К югу от Командорских островов": commonsPhotoVisual(
    "Командорские острова",
    "Medny-Island.JPG",
    "Архив",
  ),
  "Остров Медный": commonsPhotoVisual(
    "Остров Медный",
    "Medny-Island.JPG",
    "Архив",
  ),
  "Остров Медный / Командорские острова": commonsPhotoVisual(
    "Остров Медный",
    "Medny-Island.JPG",
    "Архив",
  ),
  "Командорская бухта / место зимовки и гибели Беринга":
    EVENT_VISUALS.beringIsland,
  "Переход от острова Беринга к Камчатке": EVENT_VISUALS.beringIsland,
  "Вход в Авачинскую бухту / возвращение": EVENT_VISUALS.avacha,
  "Вход в Авачинскую бухту / возвращение Св. Павла": EVENT_VISUALS.avacha,
  "Бейкер-Айленд / район первого наблюдения земли Чириковым":
    commonsPhotoVisual(
      "Архипелаг Александра",
      "Alexander archipelago.jpg",
      "Архив",
    ),
  "Мыс Аддингтон / запад о. Принца Уэльского": commonsPhotoVisual(
    "Остров Принца Уэльского",
    "Map of Alaska highlighting Prince of Wales Island.png",
    "Архив",
  ),
  "О. Баранова / район Ситки": commonsPhotoVisual(
    "Остров Баранова",
    "Alexander archipelago.jpg",
    "Архив",
  ),
  "Бухта Таканис / Якоби": commonsPhotoVisual(
    "Бухта Якоби",
    "Alexander archipelago.jpg",
    "Архив",
  ),
  "Кенайский полуостров / ориентир": commonsPhotoVisual(
    "Кенайский полуостров",
    "Lakes and mountains on the Kenai Peninsula.jpg",
  ),
  Кадьяк: commonsPhotoVisual("Кадьяк", "Kodiak, View from Pillar Mountain.jpg"),
  "Кадьяк / ориентир": commonsPhotoVisual(
    "Кадьяк",
    "Kodiak, View from Pillar Mountain.jpg",
  ),
  "Св. Павел": commonsPhotoVisual(
    "Маршрут «Святого Павла»",
    "Pacific Ocean laea location map.svg",
    "Архив",
  ),
  "Обратный путь Св. Павла": commonsPhotoVisual(
    "Обратный путь «Святого Павла»",
    "Pacific Ocean laea location map.svg",
    "Архив",
  ),
  "Северная часть Тихого океана к Камчатке": commonsPhotoVisual(
    "Северная часть Тихого океана",
    "Pacific Ocean laea location map.svg",
    "Архив",
  ),
  "Северная часть Тихого океана к Камчатке 2": commonsPhotoVisual(
    "Северная часть Тихого океана",
    "Pacific Ocean laea location map.svg",
    "Архив",
  ),
};

const FIRST_EVENT_OVERRIDES: Partial<
  Record<
    string,
    Pick<
      TimelineEvent,
      | "accuracy"
      | "cardBlurb"
      | "image"
      | "imageMode"
      | "imageKind"
      | "imageSourceLabel"
      | "imageSourceUrl"
      | "imageUrl"
      | "quote"
      | "summary"
    >
  >
> = {
  "petersburg-start": {
    summary:
      "Старт экспедиции в столице обозначил переход от правительственного замысла к реальному маршруту: здесь были оформлены распоряжения, собраны люди и началось движение на северо-восток через весь материк.",
    quote: "Стартовая точка первой Камчатской экспедиции.",
    accuracy:
      "Описание привязано к исходной точке маршрута и дате выхода из Петербурга.",
    cardBlurb:
      "Начало большого сухопутного перехода из столицы к тихоокеанскому побережью.",
    ...EVENT_VISUALS.admiralty,
  },
  "tobolsk-transit": {
    summary:
      "Тобольск был главным административным узлом Сибирской губернии. Здесь экспедиция задержалась до ледохода, расширила состав и готовила дальнейшую перевозку людей, инструментов и тяжёлого груза по Иртышу, Оби и Кети.",
    quote:
      "После Тобольска сухопутная дорога фактически уступала место речной логистике.",
    accuracy:
      "Подтверждённый пункт маршрута; дальнейший ход к Енисейску описан через Иртыш, Обь, Кеть, Маковский острог и волок.",
    cardBlurb:
      "Здесь маршрут переходил от сибирского административного центра к большому речному пути через Иртыш, Обь и Кеть.",
    ...EVENT_VISUALS.tobolsk,
  },
  "yakutsk-logistics": {
    summary:
      "Якутск был конечным пунктом большого перехода через Западную и Восточную Сибирь и базой подготовки к самому трудному броску на Охотск. К нему экспедиция пришла после Илимска, Усть-Кута и спуска по Лене.",
    quote:
      "Якутск завершал ленский участок и открывал дорогу к Охотскому морю.",
    accuracy:
      "Подтверждённый пункт маршрута; источники датируют прибытие отряда Беринга в Якутск июнем 1726 года.",
    cardBlurb:
      "После спуска по Лене экспедиция сосредоточила здесь людей, грузы и снабжение перед переходом к Охотску.",
    ...EVENT_VISUALS.yakutsk,
  },
  "okhotsk-build": {
    summary:
      "Выход к Охотску завершал многолетний сухопутный марш. Здесь команда переходила от речной и трактовой логистики к судостроению и подготовке морского этапа на Тихом океане.",
    quote: "Финиш сухопутного перехода и начало морской подготовки.",
    accuracy: "Карточка описывает восточную базу первой Камчатской экспедиции.",
    cardBlurb:
      "В Охотске экспедиция завершила сухопутный этап и занялась судами.",
    ...EVENT_VISUALS.okhotsk,
  },
  "nizhne-kamchatsk": {
    summary:
      "Выход от Нижнекамчатска обозначал переход к собственно северному морскому поиску. Отсюда «Святой Гавриил» начинал движение вдоль побережья и к районам, где предстояло проверить конфигурацию северо-восточной Азии.",
    quote: "Один из главных стартов морского этапа 1728 года.",
    accuracy:
      "Описание привязано к точке выхода судна на завершающую часть маршрута.",
    cardBlurb:
      "Нижнекамчатск стал стартовой базой северного плавания на «Святом Гаврииле».",
    ...EVENT_VISUALS.mapCard,
  },
  "bering-strait": {
    summary:
      "Проход в районе будущего Берингова пролива был кульминацией всей экспедиции: команда проверяла, отделена ли Азия от американского берега, и фиксировала северный проход в арктическом направлении.",
    quote: "Кульминационный участок плавания 1728 года.",
    accuracy: "Описание относится к ключевому району наблюдений у пролива.",
    cardBlurb:
      "Именно здесь маршрут подошёл к главному географическому вопросу экспедиции.",
    ...EVENT_VISUALS.strait,
  },
  "saint-lawrence-island": {
    summary:
      "Остров Святого Лаврентия был важным ориентиром северного плавания. Его наблюдение помогало соотнести курс судна с положением азиатского побережья и уточнять структуру северотихоокеанского пространства.",
    quote: "Ориентир морского поиска в северной части Тихого океана.",
    accuracy: "Карточка описывает ориентир по пути к району пролива.",
    cardBlurb:
      "Наблюдение острова помогало читать пространство между Чукоткой и океаном.",
    ...EVENT_VISUALS.mapCard,
  },
};

const SECOND_EVENT_OVERRIDES: Partial<
  Record<
    string,
    Pick<
      TimelineEvent,
      | "accuracy"
      | "cardBlurb"
      | "image"
      | "imageMode"
      | "imageKind"
      | "imageSourceLabel"
      | "imageSourceUrl"
      | "imageUrl"
      | "quote"
      | "summary"
    >
  >
> = {
  petropavlovsk: {
    summary:
      "Основание гавани создавало опорную тихоокеанскую базу всей второй экспедиции: именно отсюда должны были расходиться морские отряды и формироваться океанская инфраструктура.",
    quote: "Петропавловская гавань как база большой тихоокеанской программы.",
    accuracy:
      "Описание относится к опорному пункту морских отрядов второй экспедиции.",
    cardBlurb:
      "Создание гавани превратило Камчатку в полноценную базу дальнего плавания.",
    ...EVENT_VISUALS.petropavlovsk,
  },
  "vessels-departure": {
    summary:
      "Выход «Святого Петра» и «Святого Павла» открывал главный океанский этап 1741 года, когда экспедиция переходила от подготовки к поиску американского берега и северной акватории.",
    quote: "Старт главного морского похода 1741 года.",
    accuracy:
      "Карточка описывает момент выхода двух судов из Петропавловской гавани.",
    cardBlurb:
      "Отсюда начался самый известный морской этап второй Камчатской экспедиции.",
    ...EVENT_VISUALS.avacha,
  },
  "ships-separate": {
    summary:
      "Разделение судов в океане меняло ход всей экспедиции: далее Берингу и Чирикову пришлось продолжать поиск берегов и ориентиров уже раздельно, что создало две линии открытий.",
    quote: "Точка, после которой маршруты Беринга и Чирикова расходятся.",
    accuracy: "Описание относится к реконструированному району разлуки судов.",
    cardBlurb:
      "После этой точки две главные ветви второй экспедиции пошли разными курсами.",
    ...EVENT_VISUALS.mapCard,
  },
  "alaska-coast": {
    summary:
      "Достижение берегов Северной Америки стало главным географическим результатом плавания Беринга: экспедиция вышла к американскому побережью и тем самым расширила картину северной Пацифики.",
    quote: "Главная точка встречи экспедиции с американским берегом.",
    accuracy: "Карточка описывает район выхода к побережью Аляски.",
    cardBlurb: "Здесь экспедиция Беринга дошла до североамериканского берега.",
    ...EVENT_VISUALS.kayak,
  },
  "shumagin-islands": {
    summary:
      "Шумагинские острова стали заметным ориентиром на обратном пути и частью цепи наблюдений, по которым команда пыталась читать Алеутскую дугу и выбирать курс к западу.",
    quote: "Один из главных ориентиров обратного маршрута 1741 года.",
    accuracy: "Описание связано с островным участком обратного пути.",
    cardBlurb:
      "Островной пояс здесь помогал ориентироваться при отходе от американского берега.",
    ...EVENT_VISUALS.mapCard,
  },
  aleutians: {
    summary:
      "Наблюдения Алеутских островов на обратном пути постепенно связывали разрозненные островные ориентиры в единую картину северной части Тихого океана.",
    quote: "Островные ориентиры, формировавшие новую карту акватории.",
    accuracy: "Карточка описывает алеутский сегмент обратного пути.",
    cardBlurb:
      "Маршрут через Алеуты постепенно складывал новую географию северной Пацифики.",
    ...EVENT_VISUALS.mapCard,
  },
  "bering-island": {
    summary:
      "Кораблекрушение у острова Беринга стало трагическим финалом плавания «Святого Петра». Здесь экспедиция потеряла судно, оказалась на вынужденной зимовке и пережила гибель командира.",
    quote: "Самая драматическая точка всей второй экспедиции.",
    accuracy: "Описание относится к месту зимовки и гибели Беринга.",
    cardBlurb: "Именно здесь обратный путь превратился в борьбу за выживание.",
    ...EVENT_VISUALS.beringIsland,
  },
  "survivors-return": {
    summary:
      "Возвращение выживших на Камчатку завершало экспедицию уже после катастрофы. Этот этап закреплял не только картографические результаты, но и человеческую цену похода.",
    quote: "Финальное возвращение после зимовки и утраты судна.",
    accuracy: "Карточка описывает заключительный переход уцелевшей команды.",
    cardBlurb:
      "Финал экспедиции наступил только после тяжёлого возвращения с Командор.",
    ...EVENT_VISUALS.avacha,
  },
};

function toLatLng(point: { x: number; y: number }): LatLngTuple {
  return [point.y, point.x];
}

function isNamedRoutePoint(
  point: CatalogData["stages"][number]["route"][number],
): point is CatalogData["stages"][number]["route"][number] & { name: string } {
  return typeof point.name === "string" && point.name.length > 0;
}

const ALWAYS_LABELED_POINTS = new Set([
  "Санкт-Петербург / Адмиралтейство",
  "Тобольск",
  "Якутск",
  "Охотск",
  "Петропавловская гавань",
  "Остров Каяк / мыс Святого Ильи",
  "Остров Унга / Шумагинские острова",
  "Командорская бухта / место зимовки и гибели Беринга",
  "Северная точка разворота Беринга",
  "Район разлуки Св. Петра и Св. Павла",
  "Бухта Таканис / Якоби",
  "Мыс Дежнёва / восточная оконечность Азии",
  "Залив Креста",
  "Нижнекамчатский острог",
  "Большерецкий острог",
  "Петропавловская гавань / старт 1741",
]);

[
  "Шлиссельбург",
  "Великий Устюг",
  "Верхотурье",
  "Большерецкий район",
  "Первый Курильский пролив / район",
  "Бейкер-Айленд / район первого наблюдения земли Чириковым",
  "Мыс Аддингтон / запад о. Принца Уэльского",
  "О. Баранова / район Ситки",
  "Уналашка / Алеутские острова",
  "Атту / Ближние острова",
  "Остров Медный / Командорские острова",
  "Остров Святого Лаврентия / видимый ориентир",
  "Берингов пролив / южный вход",
  "Сургут",
  "Нарым",
  "Парабель / вход в бассейн Кети",
  "Маковское / Маковский острог",
  "Енисейск",
  "Илимск / историческое место",
  "Усть-Кут",
  "Киренск",
  "Витим / Лена",
  "Олёкминск",
  "Казань / переход на Каму",
  "Екатеринбург / Урал",
  "Томск",
  "Красноярск",
  "Иркутск",
  "Мыс Лопатка / юг Камчатки",
  "Гора Святого Ильи / видимый ориентир",
  "Место высадки Стеллера на Каяке / ориентир",
  "Остров Нагай / Шумагинские острова",
  "Уналашка / Алеутские острова",
  "Адак / Алеутские острова",
  "Бейкер-Айленд / район первого наблюдения земли Чириковым",
  "Мыс Аддингтон / запад о. Принца Уэльского",
  "Бухта Таканис / Якоби",
].forEach((point) => ALWAYS_LABELED_POINTS.add(point));

const FIRST_ROUTE_POINT_SUMMARIES: Record<string, string> = {
  Тобольск:
    "Тобольск был главным административным узлом Сибирской губернии. Здесь экспедиция задержалась до ледохода, расширила состав и готовила дальнейшую перевозку людей, инструментов и тяжёлого груза по сибирским рекам.",
  Абалак:
    "Абалак отмечает ближайший к Тобольску иртышский участок. Для карты это локальный ориентир выхода из тобольского района к речному ходу на север и восток.",
  Уват: "Уват показывает продвижение вниз по Иртышу после Тобольска. Этот участок исторически корректен как часть водного пути, по которому экспедиция уходила от сухопутной дороги к системе Иртыша и Оби.",
  Демьянское:
    "Демьянское относится к иртышско-обскому участку между Тобольском и Самаровским районом. Точка помогает показать, что путь был не прямой дорогой, а последовательным движением по речной системе.",
  "Ханты-Мансийск / район слияния Иртыша и Оби":
    "Эта точка обозначает район Самарова и слияния Иртыша с Обью. Для экспедиции это важный географический переход: после Иртыша маршрут включался в Обь и далее вёл к Нарыму.",
  "Нефтеюганск / Обь":
    "Нефтеюганск добавлен как современный ориентир на Оби. Исторически это не отдельная остановка Беринга, а реконструкционная точка речного хода между слиянием Иртыша и Сургутом.",
  Сургут:
    "Сургут подтверждён как пункт продвижения экспедиции после выхода из Тобольска. В источниках он упоминается на пути к Маковскому острогу и Енисейску, поэтому это одна из исторически надёжных точек западносибирского сегмента.",
  "Нижневартовск / Обь":
    "Нижневартовск используется как современный ориентир на среднем обском участке. Он показывает направление движения по Оби к Нарыму, но саму карточку следует читать как реконструкцию речного коридора.",
  "Александровское / Обь":
    "Александровское обозначает верхнеобский переход к Нарыму. Это не ключевая документальная остановка экспедиции, а аккуратная географическая опора для чтения длинного речного отрезка.",
  "Колпашево / Обь":
    "Колпашево показывает приближение к нарымскому району на Оби. Точка нужна, чтобы не оставлять большой участок пустым и показать реальную речную логику маршрута.",
  Нарым:
    "Нарым важен исторически: источники описывают движение от Тобольска по Иртышу и Оби до Нарыма, а затем вход в Кеть. Это одна из главных подтверждённых точек между Тобольском и Енисейском.",
  "Парабель / вход в бассейн Кети":
    "Парабель отмечает вход в бассейн Кети после обского участка. Здесь маршрут менял речную систему: от Оби экспедиция переходила к Кети, чтобы двигаться в сторону Маковского острога.",
  "Белый Яр на Кети":
    "Белый Яр показывает продвижение вверх по Кети. Это реконструкционная точка речного хода, добавленная не как отдельная стоянка, а как географически точный ориентир на пути к Маковскому острогу.",
  "Среднее течение Кети":
    "Среднее течение Кети показывает самый протяжённый и малонаселённый участок между Обью и Маковским острогом. Карточка подчёркивает, что здесь экспедиция двигалась по водной системе, а не по сухопутной дороге.",
  "Маковское / Маковский острог":
    "Маковский острог был ключевой точкой: сюда экспедиция дошла по Кети, а затем через волок переходила к Енисейску. Это исторически надёжная точка, прямо связанная с описанием пути Тобольск — Енисейск.",
  Енисейск:
    "Енисейск был главным перевалочным пунктом после Кети и волока. Здесь экспедиция добирала людей и ресурсы, а дальше уходила на восток к Ангаре, Илимску и Ленскому пути.",
  "Стрелка Ангары и Енисея / район":
    "Стрелка Ангары и Енисея обозначает переход от енисейского узла к ангарскому направлению. Это географический ориентир маршрута, связывающий Енисейск с дальнейшим движением к Илимску.",
  "Мотыгино / Ангара":
    "Мотыгино добавлено как современный ориентир на Ангаре. Исторически оно показывает ангарский коридор движения на восток, где путь зависел от реки, порогов и местной проводки.",
  "Кодинск / Ангара":
    "Кодинск — реконструкционный ориентир на Ангаре между Енисейском и илимским районом. Он помогает показать, что среднесибирский участок был длинной речной связкой, а не прямой линией на карте.",
  "Усть-Илимск / район Илимска":
    "Усть-Илимск отмечает современный район исторического Илимского пути. Эта точка нужна для чтения перехода к Илимскому острогу, одному из ключевых пунктов маршрута.",
  "Илимск / историческое место":
    "Илимский острог — исторически подтверждённый пункт. Отряд пришёл сюда осенью, перед замерзанием рек, и дальше был связан с Ленским волоком к Усть-Куту.",
  "Усть-Кут":
    "Усть-Кут был выходом к Лене после перехода от Илимска. Здесь экспедиция могла зимовать и ждать вскрытия реки, чтобы весной 1726 года быстро спуститься по Лене к Якутску.",
  Киренск:
    "Киренск показывает движение вниз по Лене после Усть-Кута. Это корректная реконструкция речного пути: экспедиция шла к Якутску именно ленским направлением.",
  "Витим / Лена":
    "Витим отмечает важный ленский ориентир на длинном сплаве к Якутску. Карточка показывает, как маршрут после Усть-Кута превращался в протяжённое движение по главной реке Восточной Сибири.",
  "Ленск / Лена":
    "Ленск добавлен как современный ориентир на Лене. Это не документальная остановка XVIII века, а географически точная точка, объясняющая ход вниз по реке к Якутску.",
  Олёкминск:
    "Олёкминск — крупный исторический ленский район на подходе к Якутску. Он помогает показать, что финальная часть пути к Якутску шла по реке через цепочку восточносибирских речных ориентиров.",
  "Покровск / Лена":
    "Покровск показывает ближайший к Якутску ленский участок. Карточка завершает реконструкцию речного перехода от Усть-Кута к Якутскому острогу.",
  Якутск:
    "Якутск был конечным пунктом большого сибирского перехода и базой подготовки к труднейшему пути на Охотск. Источники датируют прибытие отряда Беринга сюда июнем 1726 года.",
};

const SECOND_ROUTE_POINT_SUMMARIES: Record<string, string> = {
  "Санкт-Петербург / Адмиралтейство":
    "Для Второй Камчатской экспедиции Петербург был административным стартом огромной государственной программы. Отсюда отправлялись распоряжения, люди, инструменты и материалы для тихоокеанских и северных отрядов.",
  "Тверь / выход к Волге":
    "Тверь показывает переход к волжскому пути. На подготовительном этапе второй экспедиции движение через Волгу и Каму было удобнее для крупного снабжения, чем северный путь первой экспедиции.",
  "Ярославль / Волга":
    "Ярославль был крупным волжским узлом. Для карты это важная точка логистики: экспедиция двигалась не маленьким отрядом, а сложной системой грузов, мастеровых и документов.",
  "Нижний Новгород / Волга":
    "Нижний Новгород связывал верхнюю Волгу с дальнейшим движением к Казани и Каме. Эта точка подчёркивает масштаб подготовительного перехода второй экспедиции через внутренние речные магистрали.",
  "Казань / переход на Каму":
    "Казань обозначает переход от Волги к Камскому направлению. Для второй экспедиции это был логичный путь к Уралу, Сибири и дальнейшей доставке грузов на восток.",
  "Екатеринбург / Урал":
    "Екатеринбург показывает уральский переход. Здесь маршрут покидал волжско-камский коридор и входил в сибирскую часть пути к Тобольску, Якутску и Охотску.",
  Тобольск:
    "Тобольск снова выступал главным сибирским административным узлом. Во второй экспедиции здесь концентрировалась часть управления и снабжения намного более крупного предприятия, чем в 1725 году.",
  "Тара / Иртыш":
    "Тара отмечает иртышское направление восточного движения. Точка нужна, чтобы показать отличие подготовительного пути второй экспедиции от маршрута первой: часть движения шла южнее, через более развитые сибирские центры.",
  Томск:
    "Томск был крупным сибирским городом и ориентиром на пути к Енисею. Карточка показывает административно-речной коридор, которым пользовались при переброске людей и материалов.",
  Енисейск:
    "Енисейск оставался важным среднесибирским узлом. Через него подготовительная линия связывала Западную Сибирь с Ангарой, Илимским районом и путём к Лене.",
  Красноярск:
    "Красноярск добавлен как крупный енисейский пункт второй экспедиции. Он помогает показать, что подготовительный маршрут шёл через сеть сибирских городов, а не одной прямой линией.",
  Иркутск:
    "Иркутск был важным административным и транспортным центром Восточной Сибири. Для второй экспедиции он связан с управлением, снабжением и движением к Байкальско-Ленскому коридору.",
  "Илимск / историческое место":
    "Илимск сохранял значение как исторический узел между Ангарой и Ленским путём. Через этот район маршрут соединял среднесибирские реки с Усть-Кутом и дальнейшим спуском к Якутску.",
  "Усть-Кут / выход на Лену":
    "Усть-Кут обозначает выход к Лене. Отсюда восточное движение становилось ленским: грузы и люди могли спускаться к Якутску по главной реке Восточной Сибири.",
  Якутск:
    "Якутск был главным тыловым центром второй экспедиции на востоке. Здесь Беринг долго занимался снабжением, распределением грузов и подготовкой переброски к Охотску.",
  Охотск:
    "Охотск был главным тихоокеанским портом и верфью экспедиции. Здесь подготовка превращалась в судостроение и морской выход к Камчатке.",
  "Охотск / выход в море":
    "Выход из Охотска открывал морской переход к Камчатке. Для второй экспедиции это был критический участок: тяжёлые грузы и люди переходили из речной логистики в охотоморскую.",
  "Большерецкий район":
    "Большерецкий район показывает западнокамчатский вход после перехода через Охотское море. Через этот район экспедиционные грузы и люди попадали внутрь Камчатки.",
  "Мыс Лопатка / юг Камчатки":
    "Мыс Лопатка обозначает южную оконечность Камчатки и поворот к восточному побережью. Это важный ориентир на пути к Авачинской губе и будущей Петропавловской гавани.",
  "Петропавловская гавань":
    "Петропавловская гавань стала тихоокеанской базой похода 1741 года. Отсюда вышли пакетботы «Святой Пётр» Беринга и «Святой Павел» Чирикова.",
  "Район разлуки Св. Петра и Св. Павла":
    "Здесь маршрут показывает штормовой район, где пакетботы потеряли друг друга. После разлуки экспедиция фактически разделилась на два самостоятельных поиска американского берега.",
  "Южная точка поиска земли Хуана де Гамы":
    "Эта реконструкционная точка показывает ошибочный, но исторически важный поиск предполагаемой земли Хуана де Гамы. Не найдя её, «Святой Пётр» изменил курс к северо-востоку.",
  "Гора Святого Ильи / видимый ориентир":
    "Гора Святого Ильи стала одним из первых мощных визуальных ориентиров американского берега для команды Беринга. Её наблюдение подтвердило приближение к Северной Америке.",
  "Остров Каяк / мыс Святого Ильи":
    "Остров Каяк связан с достижением района Аляски и высадкой партии Стеллера. Это одна из главных точек европейского контакта с северо-западным побережьем Америки в ходе экспедиции.",
  "Место высадки Стеллера на Каяке / ориентир":
    "Эта точка отмечает короткую, но научно важную высадку Георга Стеллера. Она дала наблюдения по природе Аляски, хотя Беринг не задержался у берега надолго.",
  "Остров Чирикова / Туманный":
    "Остров Чирикова отмечает обратный путь «Святого Петра» вдоль южной Аляски. Это один из ориентиров между Каяком и Шумагинскими островами.",
  "Остров Нагай / Шумагинские острова":
    "Шумагинские острова получили имя после смерти матроса Никиты Шумагина. Здесь команда столкнулась с болезнями, нехваткой воды и тяжёлым состоянием судна.",
  "Уналашка / Алеутские острова":
    "Уналашка показывает алеутский участок обратного пути. Вторая экспедиция впервые внесла в русскую карту ряд островов этой дуги.",
  "Атту / Ближние острова":
    "Атту обозначает западную часть Алеутской цепи, по которой «Святой Пётр» возвращался к Камчатке. Это уже крайний участок перед Командорскими островами.",
  "Командорская бухта / место зимовки и гибели Беринга":
    "Командорская бухта на острове Беринга стала трагическим финалом похода «Святого Петра»: судно было выброшено на берег, команда зимовала в тяжёлых условиях, а Беринг умер в декабре 1741 года.",
  "Петропавловская гавань / старт 1741":
    "Старт из Петропавловской гавани 4 июня 1741 года открыл главный океанский поиск берегов Америки.",
  "Бейкер-Айленд / район первого наблюдения земли Чириковым":
    "Район Бейкер-Айленд относится к линии Чирикова: «Святой Павел» достиг северо-западного побережья Америки южнее беринговского района и первым увидел землю в районе архипелага Александра.",
  "Мыс Аддингтон / запад о. Принца Уэльского":
    "Мыс Аддингтон показывает район у острова Принца Уэльского, где Чириков пытался установить контакт с берегом. Отправленные шлюпки не вернулись, и это стало одной из драматических потерь похода.",
  "Бухта Таканис / Якоби":
    "Бухта Таканис связана с дальнейшим движением Чирикова вдоль берега Аляски. Эта точка показывает, что ветка «Святого Павла» была отдельным маршрутом, а не дублем пути Беринга.",
  "Кадьяк / ориентир":
    "Кадьяк отмечает обратный путь Чирикова через залив Аляска к Алеутской дуге и Камчатке.",
};

function getMapLabel(name: string) {
  return name.split(" / ")[0];
}

function unwrapRoute(points: { x: number; y: number }[]) {
  if (points.length === 0) return points;

  const unwrapped: { x: number; y: number }[] = [];
  let previousLongitude = points[0].x;
  unwrapped.push({ x: previousLongitude, y: points[0].y });

  for (let index = 1; index < points.length; index += 1) {
    const point = points[index];
    const baseLongitude = point.x;
    const candidates = [
      baseLongitude - 360,
      baseLongitude,
      baseLongitude + 360,
    ];
    const bestLongitude = candidates.reduce((best, candidate) =>
      Math.abs(candidate - previousLongitude) <
      Math.abs(best - previousLongitude)
        ? candidate
        : best,
    );
    unwrapped.push({ x: bestLongitude, y: point.y });
    previousLongitude = bestLongitude;
  }

  return unwrapped;
}

function routeCopies(points: { x: number; y: number }[]) {
  const unwrapped = unwrapRoute(points);
  const offsets = [-360, 0];
  return offsets.map((offset) =>
    unwrapped.map((point) => [point.y, point.x + offset] as LatLngTuple),
  );
}

function densifyRoute(
  points: { x: number; y: number }[],
  stepsPerSegment = 10,
) {
  if (points.length < 2) return points;
  if (points.length === 2) {
    const dense: { x: number; y: number }[] = [];
    for (let step = 0; step < stepsPerSegment; step += 1) {
      const t = step / stepsPerSegment;
      dense.push({
        x: points[0].x + (points[1].x - points[0].x) * t,
        y: points[0].y + (points[1].y - points[0].y) * t,
      });
    }
    dense.push(points[1]);
    return dense;
  }

  const unwrapped = unwrapRoute(points);
  const dense: { x: number; y: number }[] = [];

  for (let index = 0; index < unwrapped.length - 1; index += 1) {
    const p0 = unwrapped[Math.max(0, index - 1)];
    const p1 = unwrapped[index];
    const p2 = unwrapped[index + 1];
    const p3 = unwrapped[Math.min(unwrapped.length - 1, index + 2)];

    for (let step = 0; step < stepsPerSegment; step += 1) {
      const t = step / stepsPerSegment;
      const t2 = t * t;
      const t3 = t2 * t;

      dense.push({
        x:
          0.5 *
          (2 * p1.x +
            (-p0.x + p2.x) * t +
            (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
            (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
        y:
          0.5 *
          (2 * p1.y +
            (-p0.y + p2.y) * t +
            (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
            (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
      });
    }
  }

  dense.push(unwrapped[unwrapped.length - 1]);
  return dense;
}

function routeDensity(stageId: string) {
  if (stageId === "second-prep" || stageId === "first-siberia") return 4;
  return 6;
}

function parseStagePeriod(period: string) {
  const matches = period.match(/\d{4}/g)?.map(Number) ?? [];
  if (matches.length === 0) return { start: 1725, end: 1725 };
  if (matches.length === 1) return { start: matches[0], end: matches[0] };
  return { start: matches[0], end: matches[matches.length - 1] };
}

function interpolateRouteYear(period: string, index: number, total: number) {
  const { start, end } = parseStagePeriod(period);
  if (total <= 1 || start === end) return start;
  const ratio = index / Math.max(total - 1, 1);
  return Math.round(start + (end - start) * ratio);
}

function pointDistanceSq(
  left: { x: number; y: number },
  right: { x: number; y: number },
) {
  return (left.x - right.x) ** 2 + (left.y - right.y) ** 2;
}

function closestRoutePointIndex(
  route: { x: number; y: number }[],
  coords: { x: number; y: number },
) {
  let bestIndex = 0;
  let bestDistance = Number.POSITIVE_INFINITY;

  route.forEach((point, index) => {
    const distance = pointDistanceSq(point, coords);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  });

  return bestIndex;
}

function hasCloseEvent(
  events: TimelineEvent[],
  stageId: string,
  coords: { x: number; y: number },
  thresholdSq = 0.005,
) {
  return events.some(
    (event) =>
      event.stageId === stageId &&
      pointDistanceSq(event.coords, coords) <= thresholdSq,
  );
}

function getSyntheticFirstEventSummary(
  stage: CatalogData["stages"][number],
  point: { name: string; x: number; y: number },
) {
  const exactSummary =
    FIRST_ROUTE_POINT_SUMMARIES[point.name] ??
    FIRST_ROUTE_POINT_SUMMARIES[getMapLabel(point.name)];
  if (exactSummary) return exactSummary;

  if (stage.id === "first-siberia") {
    if (point.x < 40) {
      return `Точка «${getMapLabel(point.name)}» относится к самому началу маршрута, когда экспедиция ещё шла по северо-западным городам и переводила столичный замысел в реальный сухопутный поход к Сибири.`;
    }
    if (point.x < 60) {
      return `Точка «${getMapLabel(point.name)}» показывает продвижение через Русский Север и Приуралье, где маршрут держался на цепочке городов, острогов и перевалочных стоянок.`;
    }
    if (point.x < 85) {
      return `Точка «${getMapLabel(point.name)}» относится к западносибирскому участку пути через Тобольск, Обь и соседние речные линии, где движение зависело от навигации, переправ и сезонной логистики.`;
    }
    if (point.x < 110) {
      return `Точка «${getMapLabel(point.name)}» лежит на среднесибирском сегменте маршрута, связывавшем между собой Кеть, Енисей, Ангару и сеть острогов, через которые экспедиция продвигалась дальше на восток.`;
    }
    if (point.x < 135) {
      return `Точка «${getMapLabel(point.name)}» относится к ленско-якутскому участку похода, где усиливалась роль снабжения, местных складов и подготовки к броску от внутренних рек к тихоокеанскому побережью.`;
    }
    return `Точка «${getMapLabel(point.name)}» находится на финальном восточном отрезке сухопутного перехода, где маршрут сходился к Охотску и морской подготовке первой Камчатской экспедиции.`;
  }

  if (point.x < 156) {
    return `Точка «${getMapLabel(point.name)}» относится к выходу из Охотска и переходу через Охотское море, когда экспедиция ещё только переводила сухопутную работу в морской формат плавания.`;
  }
  if (point.x < 163) {
    return `Точка «${getMapLabel(point.name)}» лежит на камчатском внутреннем участке маршрута, где путь связывал западное побережье, речную долину Камчатки и остроги полуострова.`;
  }
  if (point.x < 170) {
    return `Точка «${getMapLabel(point.name)}» относится к движению вдоль восточной Камчатки, когда «Святой Гавриил» выходил в более открытую акваторию и брал курс на север.`;
  }
  if (point.x < 179) {
    return `Точка «${getMapLabel(point.name)}» показывает корякско-чукотский сегмент плавания, где маршрут последовательно поднимался вдоль северо-восточного побережья Азии.`;
  }
  if (point.x < 188) {
    return `Точка «${getMapLabel(point.name)}» лежит на подступах к району Чукотки и северного поворота, где экспедиция проверяла конфигурацию берегов и соотносила курс с видимыми ориентирами.`;
  }
  return `Точка «${getMapLabel(point.name)}» относится к району Берингова пролива и его северных ориентиров, где решался главный географический вопрос первой экспедиции.`;
}

function getSyntheticFirstEventVisual(
  stage: CatalogData["stages"][number],
  point: { name: string; x: number; y: number },
) {
  const label = getMapLabel(point.name);
  const exactVisual =
    FIRST_ROUTE_POINT_VISUALS[point.name] ?? FIRST_ROUTE_POINT_VISUALS[label];

  if (exactVisual) return exactVisual;

  return EVENT_VISUALS.mapCard;
}

function getSyntheticSecondEventSummary(
  stage: CatalogData["stages"][number],
  point: { name: string; x: number; y: number },
) {
  const exactSummary =
    SECOND_ROUTE_POINT_SUMMARIES[point.name] ??
    SECOND_ROUTE_POINT_SUMMARIES[getMapLabel(point.name)];
  if (exactSummary) return exactSummary;

  if (stage.id === "second-prep") {
    if (point.x < 60) {
      return `Точка «${getMapLabel(point.name)}» относится к западному подготовительному пути второй экспедиции: через Волгу, Каму и Урал к Сибири двигались люди, припасы и материалы для будущих морских отрядов.`;
    }
    if (point.x < 105) {
      return `Точка «${getMapLabel(point.name)}» показывает сибирскую часть подготовки: маршрут связывал Тобольск, иртышско-обские и енисейско-ангарские узлы с дальнейшим выходом к Лене.`;
    }
    if (point.x < 145) {
      return `Точка «${getMapLabel(point.name)}» относится к восточносибирскому снабженческому коридору второй экспедиции: Лена, Якутск, Алдано-Майский путь и Охотск были связаны перевозкой людей и грузов.`;
    }
    return `Точка «${getMapLabel(point.name)}» показывает переход от Охотска к Камчатке, где подготовка экспедиции превращалась в тихоокеанское судостроение и морскую базу.`;
  }

  if (stage.id === "second-america") {
    if (point.x < 176) {
      return `Точка «${getMapLabel(point.name)}» относится к стартовому океанскому ходу 1741 года, когда «Святой Пётр» и «Святой Павел» вышли из Петропавловской гавани и шли вместе до разлуки.`;
    }
    if (point.x < 200) {
      return `Точка «${getMapLabel(point.name)}» показывает реконструированный поиск в северной Пацифике после разлуки судов, включая развороты и отказ от поисков предполагаемой земли Хуана де Гамы.`;
    }
    return `Точка «${getMapLabel(point.name)}» относится к подходу «Святого Петра» к Америке: району горы Святого Ильи, острова Каяк и краткой высадки у аляскинского берега.`;
  }

  if (point.x > 200) {
    return `Точка «${getMapLabel(point.name)}» относится к отходу «Святого Петра» от Аляски после короткой стоянки у Каяка и началу тяжёлого обратного пути.`;
  }
  if (point.x > 180) {
    return `Точка «${getMapLabel(point.name)}» показывает участок вдоль южной Аляски и Алеутской дуги, где команда фиксировала острова, но всё сильнее страдала от болезней, нехватки воды и повреждений судна.`;
  }
  if (point.x > 168) {
    return `Точка «${getMapLabel(point.name)}» относится к западной части Алеутской цепи и подступам к Командорам, где обратный путь «Святого Петра» стал борьбой за выживание.`;
  }
  return `Точка «${getMapLabel(point.name)}» показывает финал обратного пути: катастрофу у Командорских островов, зимовку и возвращение выживших к Камчатке.`;
}

function getSyntheticSecondEventVisual(point: { name: string }) {
  const label = getMapLabel(point.name);
  return (
    SECOND_ROUTE_POINT_VISUALS[point.name] ??
    SECOND_ROUTE_POINT_VISUALS[label] ??
    EVENT_VISUALS.mapCard
  );
}

function getDefaultEventVisual(
  event: CatalogData["events"][number],
  stage: CatalogData["stages"][number] | undefined,
) {
  if (event.expeditionId === "first") {
    if (event.id === "saint-lawrence-island") return EVENT_VISUALS.mapCard;
    if (event.id === "nizhne-kamchatsk") return EVENT_VISUALS.mapCard;
    if (stage?.id === "first-siberia") return EVENT_VISUALS.mapCard;
    if (stage?.id === "first-sea") return EVENT_VISUALS.mapCard;
  }

  if (event.expeditionId === "second") {
    if (event.id === "ships-separate") return EVENT_VISUALS.mapCard;
    if (event.id === "shumagin-islands") return EVENT_VISUALS.mapCard;
    if (event.id === "aleutians") return EVENT_VISUALS.mapCard;
  }

  if (stage?.id === "second-return") return EVENT_VISUALS.mapCard;
  if (stage?.id === "second-america") return EVENT_VISUALS.mapCard;
  if (stage?.id === "second-prep") return EVENT_VISUALS.mapCard;

  return EVENT_VISUALS.mapCard;
}

function enrichTimelineEvent(
  event: CatalogData["events"][number],
  stage: CatalogData["stages"][number] | undefined,
): Omit<TimelineEvent, "sequence"> {
  if (event.expeditionId === "first") {
    const override = FIRST_EVENT_OVERRIDES[event.id];
    if (override) {
      return {
        ...event,
        ...override,
      };
    }
  }

  if (event.expeditionId === "second") {
    const override = SECOND_EVENT_OVERRIDES[event.id];
    if (override) {
      return {
        ...event,
        ...override,
      };
    }
  }

  const defaultVisual = getDefaultEventVisual(event, stage);

  return {
    ...event,
    summary:
      event.summary.length > 80
        ? event.summary
        : `${event.summary}. Этот эпизод входит в этап «${stage?.title ?? "Маршрут"}» и помогает читать карту как последовательность связанных переходов и наблюдений.`,
    quote:
      event.quote.length > 40
        ? event.quote
        : `Эпизод маршрута: ${event.title}.`,
    accuracy:
      event.accuracy ||
      "Описание отображает историческое событие на линии маршрута и привязано к текущей карте проекта.",
    cardBlurb:
      event.summary.length > 100
        ? event.summary
        : `${event.summary}. Ключевой эпизод этапа «${stage?.title ?? "Маршрут"}».`,
    ...defaultVisual,
  };
}

function FitVisibleBounds({
  points,
  disabled,
}: {
  points: LatLngTuple[];
  disabled?: boolean;
}) {
  const map = useMap();

  useEffect(() => {
    if (disabled || points.length === 0) return;
    map.fitBounds(points, { padding: [42, 42], maxZoom: 5, animate: false });
  }, [disabled, map, points]);

  return null;
}

function RecenterMiniMap({ center }: { center: LatLngTuple }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: false });
  }, [center, map]);

  return null;
}

function EventMiniMap({
  event,
  stages,
}: {
  event: TimelineEvent;
  stages: CatalogData["stages"];
}) {
  const stage = stages.find((item) => item.id === event.stageId);
  const center = toLatLng(event.coords);

  return (
    <MapContainer
      attributionControl={false}
      center={center}
      className="h-full w-full"
      dragging={false}
      doubleClickZoom={false}
      keyboard={false}
      scrollWheelZoom={false}
      touchZoom={false}
      zoom={4}
      zoomControl={false}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
      <RecenterMiniMap center={center} />
      {stage &&
        routeCopies(densifyRoute(stage.route, routeDensity(stage.id))).map(
          (positions, index) => (
            <Polyline
              key={`${stage.id}-${index}`}
              pathOptions={{
                color: expeditionColors[stage.expeditionId],
                lineCap: "round",
                lineJoin: "round",
                opacity: 0.82,
                weight: 4,
              }}
              positions={positions}
            />
          ),
        )}
      <CircleMarker
        center={center}
        fillColor={expeditionColors[event.expeditionId]}
        fillOpacity={1}
        pathOptions={{ color: "#ffffff", weight: 3 }}
        radius={9}
      />
    </MapContainer>
  );
}

function MapEventPopup({ event }: { event: TimelineEvent }) {
  return (
    <article className="w-[280px] overflow-hidden rounded-2xl bg-white text-slate-900">
      {event.imageMode === "photo" ? (
        <div className="aspect-[16/9] overflow-hidden bg-slate-100">
          <img
            alt={event.title}
            className="h-full w-full object-cover"
            loading="lazy"
            src={event.imageUrl}
          />
        </div>
      ) : (
        <div className="bg-gradient-to-br from-slate-100 to-white p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Карта точки
          </p>
          <p className="mt-2 text-sm font-semibold">{event.place}</p>
          <p className="mt-1 text-xs text-slate-500">
            {event.coords.y.toFixed(3)}°, {event.coords.x.toFixed(3)}°
          </p>
        </div>
      )}
      <div className="space-y-2 p-4">
        <p className="text-xs font-medium text-[var(--accent-warm)]">
          {event.date} · {event.type}
        </p>
        <h3 className="text-base font-semibold leading-tight">{event.title}</h3>
        <p className="text-xs font-medium text-slate-500">{event.place}</p>
        <p className="text-sm leading-6 text-slate-700">{event.cardBlurb}</p>
        {event.quote && (
          <p className="rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-600">
            {event.quote}
          </p>
        )}
        <p className="border-t border-slate-200 pt-2 text-[11px] leading-5 text-slate-500">
          {event.accuracy}
        </p>
        {event.imageMode === "photo" && (
          <a
            className="inline-flex text-xs font-semibold text-[var(--accent)] underline-offset-2 hover:underline"
            href={event.imageSourceUrl}
            rel="noreferrer"
            target="_blank"
          >
            Источник изображения: {event.imageSourceLabel}
          </a>
        )}
      </div>
    </article>
  );
}

export function LeafletMapContent({
  data,
  initialSelectedId,
}: {
  data: CatalogData;
  initialSelectedId?: string;
}) {
  const { events, stages } = data;
  const stagesWithRouteOverrides = useMemo(
    () =>
      stages.map((stage) => {
        if (stage.id === "first-siberia") {
          return { ...stage, route: FIRST_SIBERIA_ROUTE };
        }
        if (stage.id === "first-sea") {
          return { ...stage, route: FIRST_SEA_ROUTE };
        }
        if (stage.id === "second-prep") {
          return { ...stage, route: SECOND_PREP_ROUTE };
        }
        if (stage.id === "second-america") {
          return { ...stage, route: SECOND_AMERICA_ROUTE };
        }
        if (stage.id === "second-return") {
          return { ...stage, route: SECOND_RETURN_ROUTE };
        }
        return stage;
      }),
    [stages],
  );
  const timelineEvents = useMemo<TimelineEvent[]>(() => {
    const stageSequence = new Map(
      stagesWithRouteOverrides.map((stage, index) => [stage.id, index]),
    );

    const originalEvents = events.map((event) => {
      const stage = stagesWithRouteOverrides.find(
        (item) => item.id === event.stageId,
      );
      const closestPointIndex = stage
        ? closestRoutePointIndex(stage.route, event.coords)
        : 0;
      const sequence =
        (stageSequence.get(event.stageId) ?? 0) * 1000 +
        closestPointIndex +
        0.5;

      return { ...enrichTimelineEvent(event, stage), sequence };
    });

    const syntheticFirstRouteEvents = stagesWithRouteOverrides
      .filter((stage) => stage.expeditionId === "first")
      .flatMap((stage) =>
        stage.route.filter(isNamedRoutePoint).flatMap((point, index, route) => {
          if (hasCloseEvent(originalEvents, stage.id, point)) return [];

          const year = interpolateRouteYear(stage.period, index, route.length);
          const visual = getSyntheticFirstEventVisual(stage, point);
          return [
            {
              id: `route-point-${stage.id}-${index}`,
              expeditionId: "first" as const,
              stageId: stage.id,
              title: getMapLabel(point.name),
              place: point.name,
              date: String(year),
              year,
              type: stage.id === "first-sea" ? "наблюдение" : "переход",
              summary: getSyntheticFirstEventSummary(stage, point),
              quote:
                stage.id === "first-sea"
                  ? "Ориентир морского этапа первой Камчатской экспедиции."
                  : "Ориентир сухопутного этапа первой Камчатской экспедиции.",
              sourceIds: [],
              image: visual.image,
              imageMode: visual.imageMode,
              imageKind: visual.imageKind,
              imageSourceLabel: visual.imageSourceLabel,
              imageSourceUrl: visual.imageSourceUrl,
              imageUrl: visual.imageUrl,
              coords: point,
              accuracy:
                "Маршрутная карточка автоматически добавлена по координате точки и описана как часть реконструированного пути экспедиции.",
              cardBlurb: getSyntheticFirstEventSummary(stage, point),
              synthetic: true,
              sequence: (stageSequence.get(stage.id) ?? 0) * 1000 + index,
            },
          ] satisfies TimelineEvent[];
        }),
      );

    const syntheticSecondRouteEvents = stagesWithRouteOverrides
      .filter((stage) => stage.expeditionId === "second")
      .flatMap((stage) =>
        stage.route.filter(isNamedRoutePoint).flatMap((point, index, route) => {
          if (hasCloseEvent(originalEvents, stage.id, point)) return [];

          const year = interpolateRouteYear(stage.period, index, route.length);
          const visual = getSyntheticSecondEventVisual(point);
          const summary = getSyntheticSecondEventSummary(stage, point);
          return [
            {
              id: `route-point-${stage.id}-${index}`,
              expeditionId: "second" as const,
              stageId: stage.id,
              title: getMapLabel(point.name),
              place: point.name,
              date: String(year),
              year,
              type:
                stage.id === "second-prep"
                  ? "переход"
                  : stage.id === "second-america"
                    ? "наблюдение"
                    : "переход",
              summary,
              quote:
                stage.id === "second-prep"
                  ? "Ориентир подготовительного пути Второй Камчатской экспедиции."
                  : "Ориентир морского маршрута Второй Камчатской экспедиции.",
              sourceIds: [],
              image: visual.image,
              imageMode: visual.imageMode,
              imageKind: visual.imageKind,
              imageSourceLabel: visual.imageSourceLabel,
              imageSourceUrl: visual.imageSourceUrl,
              imageUrl: visual.imageUrl,
              coords: point,
              accuracy:
                "Маршрутная карточка добавлена по координате точки; подтверждённые пункты отделены в описании от реконструированных морских и речных ориентиров.",
              cardBlurb: summary,
              synthetic: true,
              sequence: (stageSequence.get(stage.id) ?? 0) * 1000 + index,
            },
          ] satisfies TimelineEvent[];
        }),
      );

    const chirikovStage = stagesWithRouteOverrides.find(
      (stage) => stage.id === "second-america",
    );
    const syntheticChirikovRouteEvents = chirikovStage
      ? CHIRIKOV_ROUTE.flatMap((point, index, route) => {
          const visual = getSyntheticSecondEventVisual(point);
          const summary = getSyntheticSecondEventSummary(chirikovStage, point);
          const year = interpolateRouteYear(
            chirikovStage.period,
            index,
            route.length,
          );
          return [
            {
              id: `route-point-chirikov-${index}`,
              expeditionId: "second" as const,
              stageId: chirikovStage.id,
              title: getMapLabel(point.name),
              place: point.name,
              date: String(year),
              year,
              type: "наблюдение" as const,
              summary,
              quote:
                "Ориентир отдельной ветки «Святого Павла» под командованием Алексея Чирикова.",
              sourceIds: [],
              image: visual.image,
              imageMode: visual.imageMode,
              imageKind: visual.imageKind,
              imageSourceLabel: visual.imageSourceLabel,
              imageSourceUrl: visual.imageSourceUrl,
              imageUrl: visual.imageUrl,
              coords: point,
              accuracy:
                "Точка относится к реконструированной ветке Чирикова; подтверждённые береговые ориентиры выделены по названию.",
              cardBlurb: summary,
              synthetic: true,
              sequence:
                (stageSequence.get(chirikovStage.id) ?? 0) * 1000 + 500 + index,
            },
          ] satisfies TimelineEvent[];
        })
      : [];

    return [
      ...originalEvents,
      ...syntheticFirstRouteEvents,
      ...syntheticSecondRouteEvents,
      ...syntheticChirikovRouteEvents,
    ].sort((left, right) => left.sequence - right.sequence);
  }, [events, stagesWithRouteOverrides]);
  const [expedition, setExpedition] = useState<ExpeditionId | "all">("all");
  const [stageId, setStageId] = useState("all");
  const [type, setType] = useState<EventType | "all">("all");
  const [year, setYear] = useState(1741);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(
    initialSelectedId ?? "alaska-coast",
  );
  const [playing, setPlaying] = useState(false);
  const [playProgress, setPlayProgress] = useState(1);
  const [isEventMapOpen, setIsEventMapOpen] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setPlayProgress((current) => {
        if (current >= 1) return 0;
        return Math.min(current + 0.025, 1);
      });
    }, 120);
    return () => window.clearInterval(timer);
  }, [playing]);

  const availableStages = useMemo(
    () =>
      stagesWithRouteOverrides.filter(
        (stage) => expedition === "all" || stage.expeditionId === expedition,
      ),
    [expedition, stagesWithRouteOverrides],
  );

  const visibleStages = useMemo(
    () =>
      availableStages.filter(
        (stage) => stageId === "all" || stage.id === stageId,
      ),
    [availableStages, stageId],
  );

  const denseVisibleStages = useMemo(
    () =>
      visibleStages.map((stage) => ({
        ...stage,
        denseRoute: densifyRoute(stage.route, routeDensity(stage.id)),
      })),
    [visibleStages],
  );

  const visibleFirstExpeditionWaypoints = useMemo(
    () =>
      visibleStages
        .filter((stage) => stage.expeditionId === "first")
        .flatMap((stage) =>
          stage.route.filter(isNamedRoutePoint).map((point, index, route) => ({
            ...point,
            stageId: stage.id,
            stageTitle: stage.title,
            isTerminal: index === 0 || index === route.length - 1,
            isKeyLabel:
              index === 0 ||
              index === route.length - 1 ||
              ALWAYS_LABELED_POINTS.has(point.name),
          })),
        ),
    [visibleStages],
  );

  const visibleSecondExpeditionWaypoints = useMemo(
    () =>
      visibleStages
        .filter((stage) => stage.expeditionId === "second")
        .flatMap((stage) =>
          stage.route.filter(isNamedRoutePoint).map((point, index, route) => ({
            ...point,
            stageId: stage.id,
            stageTitle: stage.title,
            isTerminal: index === 0 || index === route.length - 1,
            isKeyLabel:
              index === 0 ||
              index === route.length - 1 ||
              ALWAYS_LABELED_POINTS.has(point.name),
          })),
        ),
    [visibleStages],
  );

  const showDetailMarkers =
    stageId !== "all" ||
    expedition !== "all" ||
    type !== "all" ||
    query.trim().length > 0;
  const firstWaypointsToRender = visibleFirstExpeditionWaypoints;
  const secondWaypointsToRender = visibleSecondExpeditionWaypoints;

  const allVisibleRoutePoints = useMemo(
    () => denseVisibleStages.flatMap((stage) => stage.denseRoute),
    [denseVisibleStages],
  );

  const routeProgressPoint = useMemo(() => {
    if (!playing || allVisibleRoutePoints.length === 0) return null;
    const index = Math.max(
      0,
      Math.min(
        allVisibleRoutePoints.length - 1,
        Math.floor(playProgress * (allVisibleRoutePoints.length - 1)),
      ),
    );
    return allVisibleRoutePoints[index];
  }, [allVisibleRoutePoints, playProgress, playing]);

  const progressYear = playing
    ? 1725 + Math.round(playProgress * (1742 - 1725))
    : year;

  const filteredEvents = useMemo(() => {
    const lowerQuery = query.trim().toLowerCase();
    return timelineEvents.filter((event) => {
      const matchesExpedition =
        expedition === "all" || event.expeditionId === expedition;
      const matchesStage = stageId === "all" || event.stageId === stageId;
      const matchesType = type === "all" || event.type === type;
      const matchesYear = event.year <= progressYear;
      const matchesQuery =
        lowerQuery.length === 0 ||
        `${event.title} ${event.place} ${event.summary}`
          .toLowerCase()
          .includes(lowerQuery);

      return (
        matchesExpedition &&
        matchesStage &&
        matchesType &&
        matchesYear &&
        matchesQuery
      );
    });
  }, [expedition, progressYear, query, stageId, timelineEvents, type]);
  const visibleMapEvents = useMemo(
    () => filteredEvents.filter((event) => !event.synthetic),
    [filteredEvents],
  );
  const firstWaypointEvents = useMemo(() => {
    const pointEvents = new Map<string, TimelineEvent>();

    visibleStages
      .filter((stage) => stage.expeditionId === "first")
      .forEach((stage) => {
        stage.route.filter(isNamedRoutePoint).forEach((point) => {
          const nearestEvent = filteredEvents
            .filter(
              (event) =>
                event.expeditionId === "first" && event.stageId === stage.id,
            )
            .sort(
              (left, right) =>
                pointDistanceSq(left.coords, point) -
                pointDistanceSq(right.coords, point),
            )[0];

          if (nearestEvent) {
            pointEvents.set(`${stage.id}:${point.name}`, nearestEvent);
          }
        });
      });

    return pointEvents;
  }, [filteredEvents, visibleStages]);
  const secondWaypointEvents = useMemo(() => {
    const pointEvents = new Map<string, TimelineEvent>();

    visibleStages
      .filter((stage) => stage.expeditionId === "second")
      .forEach((stage) => {
        stage.route.filter(isNamedRoutePoint).forEach((point) => {
          const nearestEvent = filteredEvents
            .filter(
              (event) =>
                event.expeditionId === "second" && event.stageId === stage.id,
            )
            .sort(
              (left, right) =>
                pointDistanceSq(left.coords, point) -
                pointDistanceSq(right.coords, point),
            )[0];

          if (nearestEvent) {
            pointEvents.set(`${stage.id}:${point.name}`, nearestEvent);
          }
        });
      });

    return pointEvents;
  }, [filteredEvents, visibleStages]);
  const chirikovWaypointEvents = useMemo(() => {
    const pointEvents = new Map<string, TimelineEvent>();

    CHIRIKOV_ROUTE.forEach((point, index) => {
      const event =
        filteredEvents.find(
          (item) => item.id === `route-point-chirikov-${index}`,
        ) ??
        filteredEvents
          .filter((item) => item.id.startsWith("route-point-chirikov-"))
          .sort(
            (left, right) =>
              pointDistanceSq(left.coords, point) -
              pointDistanceSq(right.coords, point),
          )[0];

      if (event) {
        pointEvents.set(point.name, event);
      }
    });

    return pointEvents;
  }, [filteredEvents]);
  const selectedEvent =
    filteredEvents.find((event) => event.id === selectedId) ??
    filteredEvents[0] ??
    timelineEvents[0];

  const visibleBounds = useMemo(() => {
    const routePoints = denseVisibleStages.flatMap((stage) =>
      stage.denseRoute.map(toLatLng),
    );
    const eventPoints = filteredEvents.map((event) => toLatLng(event.coords));
    return [...routePoints, ...eventPoints];
  }, [denseVisibleStages, filteredEvents]);

  const displayedStageRoutes = useMemo(() => {
    if (!playing) {
      return denseVisibleStages.map((stage) => ({
        ...stage,
        displayedRoute: stage.denseRoute,
      }));
    }

    let remainingPoints = Math.max(
      2,
      Math.ceil(playProgress * allVisibleRoutePoints.length),
    );
    return denseVisibleStages
      .map((stage) => {
        const take = Math.min(stage.denseRoute.length, remainingPoints);
        remainingPoints -= take;
        return { ...stage, displayedRoute: stage.denseRoute.slice(0, take) };
      })
      .filter((stage) => stage.displayedRoute.length >= 2);
  }, [allVisibleRoutePoints.length, denseVisibleStages, playProgress, playing]);

  const showChirikovRoute =
    progressYear >= 1741 &&
    expedition !== "first" &&
    (stageId === "all" || stageId === "second-america");

  return (
    <div className="space-y-5">
      <section className="surface grid gap-4 p-4 lg:grid-cols-5">
        <label className="text-sm text-[var(--muted-strong)]">
          Поиск
          <input
            className="control mt-2 w-full px-3 py-2 outline-none focus:border-[var(--accent)]"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Аляска, Охотск..."
            value={query}
          />
        </label>

        <label className="text-sm text-[var(--muted-strong)]">
          Экспедиция
          <select
            className="control mt-2 w-full px-3 py-2 outline-none focus:border-[var(--accent)]"
            onChange={(event) => {
              setExpedition(event.target.value as ExpeditionId | "all");
              setStageId("all");
            }}
            value={expedition}
          >
            <option value="all">Все</option>
            <option value="first">Первая</option>
            <option value="second">Вторая</option>
          </select>
        </label>

        <label className="text-sm text-[var(--muted-strong)]">
          Этап
          <select
            className="control mt-2 w-full px-3 py-2 outline-none focus:border-[var(--accent)]"
            onChange={(event) => setStageId(event.target.value)}
            value={stageId}
          >
            <option value="all">Все этапы</option>
            {availableStages.map((stage) => (
              <option key={stage.id} value={stage.id}>
                {stage.title}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm text-[var(--muted-strong)]">
          Тип
          <select
            className="control mt-2 w-full px-3 py-2 outline-none focus:border-[var(--accent)]"
            onChange={(event) =>
              setType(event.target.value as EventType | "all")
            }
            value={type}
          >
            <option value="all">Все</option>
            {eventTypes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <div className="rounded-2xl border border-[var(--border)] bg-gradient-to-br from-white to-[var(--surface-soft)] px-3 py-3 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[var(--foreground)] shadow-sm">
              {playing ? `Год: ${progressYear}` : `Год: ${year}`}
            </span>
            <button
              className="rounded-full bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-white transition hover:brightness-95"
              onClick={() => {
                setPlaying((value) => !value);
                if (!playing && playProgress >= 1) setPlayProgress(0);
              }}
              type="button"
            >
              {playing ? "Пауза" : "▶ Play"}
            </button>
          </div>
          <input
            className="mt-3 w-full accent-[var(--accent)]"
            max={1742}
            min={1725}
            onChange={(event) => {
              setPlaying(false);
              setYear(Number(event.target.value));
              setPlayProgress(
                (Number(event.target.value) - 1725) / (1742 - 1725),
              );
            }}
            type="range"
            value={year}
          />
          <div className="mt-1.5 flex items-center justify-between text-[11px] font-medium tracking-wide text-[var(--muted)]">
            <span>1725</span>
            <span>1742</span>
          </div>
        </div>
      </section>

      <section className="map-frame relative min-h-[760px] overflow-hidden">
        <MapContainer
          attributionControl
          center={[58, 135]}
          className="h-[760px] w-full"
          maxZoom={8}
          minZoom={2}
          scrollWheelZoom
          worldCopyJump={false}
          zoom={3}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          <FitVisibleBounds disabled={playing} points={visibleBounds} />

          {displayedStageRoutes.map((stage) =>
            routeCopies(stage.displayedRoute).map((positions, index) => (
              <Polyline
                eventHandlers={{
                  click: () => setStageId(stage.id),
                }}
                key={`${stage.id}-${index}`}
                pathOptions={{
                  color: expeditionColors[stage.expeditionId],
                  dashArray: stage.id === "second-prep" ? "8 8" : undefined,
                  lineCap: "round",
                  lineJoin: "round",
                  opacity: 0.94,
                  weight: 6,
                }}
                positions={positions}
              >
                <Popup>
                  <strong>{stage.title}</strong>
                  <br />
                  {stage.period}
                  <br />
                  {stage.summary}
                </Popup>
              </Polyline>
            )),
          )}
          {firstWaypointsToRender.map((point) => (
            <CircleMarker
              center={toLatLng(point)}
              eventHandlers={{
                click: () => {
                  const event = firstWaypointEvents.get(
                    `${point.stageId}:${point.name}`,
                  );
                  if (event) setSelectedId(event.id);
                },
              }}
              fillColor={point.isTerminal ? "#0f4c81" : "#f4b400"}
              fillOpacity={0.95}
              key={`${point.stageId}-${point.name}`}
              pathOptions={{
                color: point.isTerminal ? "#f8fafc" : "#0f4c81",
                opacity: 1,
                weight: point.isTerminal ? 3 : 2,
              }}
              radius={point.isTerminal ? 7 : 4}
            >
              <Popup>
                {firstWaypointEvents.has(`${point.stageId}:${point.name}`) ? (
                  <MapEventPopup
                    event={
                      firstWaypointEvents.get(
                        `${point.stageId}:${point.name}`,
                      ) as TimelineEvent
                    }
                  />
                ) : (
                  <>
                    <strong>{point.name}</strong>
                    <br />
                    {point.stageTitle}
                  </>
                )}
              </Popup>
              {point.isKeyLabel && (
                <Tooltip
                  className="rounded-full border border-white/70 bg-white/92 px-2 py-1 text-[11px] font-semibold text-slate-800 shadow-sm"
                  direction="top"
                  offset={[0, -8]}
                  opacity={1}
                  permanent
                >
                  {getMapLabel(point.name)}
                </Tooltip>
              )}
            </CircleMarker>
          ))}
          {secondWaypointsToRender.map((point) => (
            <CircleMarker
              center={toLatLng(point)}
              eventHandlers={{
                click: () => {
                  const event = secondWaypointEvents.get(
                    `${point.stageId}:${point.name}`,
                  );
                  if (event) setSelectedId(event.id);
                },
              }}
              fillColor={point.isTerminal ? "#8b5a00" : "#e59f1c"}
              fillOpacity={0.9}
              key={`${point.stageId}-${point.name}`}
              pathOptions={{
                color: point.isTerminal ? "#fff7ed" : "#7a4100",
                opacity: 0.95,
                weight: point.isTerminal ? 3 : 1.75,
              }}
              radius={point.isTerminal ? 6 : 3.5}
            >
              <Popup>
                {secondWaypointEvents.has(`${point.stageId}:${point.name}`) ? (
                  <MapEventPopup
                    event={
                      secondWaypointEvents.get(
                        `${point.stageId}:${point.name}`,
                      ) as TimelineEvent
                    }
                  />
                ) : (
                  <>
                    <strong>{point.name}</strong>
                    <br />
                    {point.stageTitle}
                  </>
                )}
              </Popup>
              {point.isKeyLabel && (
                <Tooltip
                  className="rounded-full border border-white/70 bg-white/92 px-2 py-1 text-[11px] font-semibold text-slate-800 shadow-sm"
                  direction="top"
                  offset={[0, -8]}
                  opacity={1}
                  permanent
                >
                  {getMapLabel(point.name)}
                </Tooltip>
              )}
            </CircleMarker>
          ))}
          {routeProgressPoint && (
            <CircleMarker
              center={toLatLng(routeProgressPoint)}
              fillColor="#1d1d1f"
              fillOpacity={1}
              pathOptions={{ color: "#ffffff", weight: 4 }}
              radius={9}
            >
              <Popup>Текущая позиция проигрывания</Popup>
            </CircleMarker>
          )}

          {showChirikovRoute &&
            routeCopies(CHIRIKOV_ROUTE).map((positions, index) => (
              <Polyline
                key={`chirikov-${index}`}
                pathOptions={{
                  color: "#7c3aed",
                  dashArray: "8 8",
                  lineCap: "round",
                  lineJoin: "round",
                  opacity: 0.9,
                  weight: 5,
                }}
                positions={positions}
              >
                <Popup>Ветка «Святого Павла» А. И. Чирикова</Popup>
              </Polyline>
            ))}
          {showChirikovRoute &&
            CHIRIKOV_ROUTE.map((point, index, route) => {
              const event = chirikovWaypointEvents.get(point.name);
              const isTerminal = index === 0 || index === route.length - 1;
              const isKeyLabel =
                isTerminal || ALWAYS_LABELED_POINTS.has(point.name);

              return (
                <CircleMarker
                  center={toLatLng(point)}
                  eventHandlers={{
                    click: () => {
                      if (event) setSelectedId(event.id);
                    },
                  }}
                  fillColor={isTerminal ? "#5b21b6" : "#a855f7"}
                  fillOpacity={0.92}
                  key={`chirikov-point-${point.name}`}
                  pathOptions={{
                    color: isTerminal ? "#ffffff" : "#4c1d95",
                    opacity: 0.95,
                    weight: isTerminal ? 3 : 1.75,
                  }}
                  radius={isTerminal ? 6 : 3.5}
                >
                  <Popup>
                    {event ? (
                      <MapEventPopup event={event} />
                    ) : (
                      <>
                        <strong>{point.name}</strong>
                        <br />
                        Ветка «Святого Павла» А. И. Чирикова
                      </>
                    )}
                  </Popup>
                  {isKeyLabel && (
                    <Tooltip
                      className="rounded-full border border-white/70 bg-white/92 px-2 py-1 text-[11px] font-semibold text-slate-800 shadow-sm"
                      direction="top"
                      offset={[0, -8]}
                      opacity={1}
                      permanent
                    >
                      {getMapLabel(point.name)}
                    </Tooltip>
                  )}
                </CircleMarker>
              );
            })}
          {showChirikovRoute && (
            <CircleMarker
              center={toLatLng(ST_PETER_LANDMARK)}
              fillColor="#7c3aed"
              fillOpacity={0.9}
              pathOptions={{ color: "#ffffff", weight: 2.5 }}
              radius={7}
            >
              <Popup>
                <strong>{ST_PETER_LANDMARK.name}</strong>
                <br />
                Ориентир на пути «Св. Петра»
              </Popup>
              <Tooltip
                className="rounded-full border border-white/70 bg-white/92 px-2 py-1 text-[11px] font-semibold text-slate-800 shadow-sm"
                direction="top"
                offset={[0, -8]}
                opacity={1}
                permanent
              >
                {getMapLabel(ST_PETER_LANDMARK.name)}
              </Tooltip>
            </CircleMarker>
          )}

          {showDetailMarkers &&
            importantObjects.map(([label, lat, lon]) => (
              <CircleMarker
                center={[lat, lon]}
                fillColor="#1d1d1f"
                fillOpacity={0.22}
                key={label}
                pathOptions={{ color: "#ffffff", weight: 1 }}
                radius={5}
              >
                <Popup>{label}</Popup>
              </CircleMarker>
            ))}

          {(showDetailMarkers ? visibleMapEvents : [selectedEvent]).map(
            (event) => (
              <CircleMarker
                center={toLatLng(event.coords)}
                eventHandlers={{
                  click: () => setSelectedId(event.id),
                }}
                fillColor={expeditionColors[event.expeditionId]}
                fillOpacity={event.id === selectedEvent.id ? 1 : 0.82}
                key={event.id}
                pathOptions={{
                  color: "#ffffff",
                  opacity: 1,
                  weight: event.id === selectedEvent.id ? 4 : 3,
                }}
                radius={event.id === selectedEvent.id ? 11 : 8}
              >
                <Popup>
                  <MapEventPopup event={event} />
                </Popup>
              </CircleMarker>
            ),
          )}
        </MapContainer>

        <div className="absolute bottom-5 left-5 z-[500] flex flex-wrap gap-2 text-xs">
          <span className="legend-item legend-item--first">
            Синий: 1-я Камчатская
          </span>
          <span className="legend-item legend-item--second">
            Оранжевый: 2-я Камчатская
          </span>
          <span className="legend-item legend-item--chirikov">
            Фиолетовый пунктир: маршрут Чирикова
          </span>
          <span className="legend-item">{filteredEvents.length} событий</span>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <article className="surface p-6">
          <p className="text-sm text-[var(--muted)]">Карточка события</p>
          <h2 className="mt-2 text-3xl font-semibold">{selectedEvent.title}</h2>
          <p className="mt-2 text-sm text-[var(--accent-warm)]">
            {selectedEvent.date} · {selectedEvent.place} · {selectedEvent.type}
          </p>
          <div className="mt-5 grid gap-5 md:grid-cols-[220px_1fr]">
            <figure className="overflow-hidden rounded-3xl border border-black/10 bg-[var(--surface-soft)]">
              {selectedEvent.imageMode === "photo" ? (
                <div className="aspect-[4/3] bg-[var(--surface-soft)]">
                  <img
                    alt={selectedEvent.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    src={selectedEvent.imageUrl}
                  />
                </div>
              ) : (
                <div className="aspect-[4/3] bg-[var(--surface-soft)]">
                  <EventMiniMap
                    event={selectedEvent}
                    stages={stagesWithRouteOverrides}
                  />
                </div>
              )}
              <figcaption className="border-t border-black/10 px-4 py-3 text-xs text-[var(--muted)]">
                <div className="flex flex-wrap items-center gap-2">
                  <span>{selectedEvent.image}</span>
                  {selectedEvent.imageMode === "photo" ? (
                    <>
                      <span>·</span>
                      <a
                        className="text-[var(--accent)] underline-offset-2 hover:underline"
                        href={selectedEvent.imageSourceUrl}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {selectedEvent.imageSourceLabel}
                      </a>
                    </>
                  ) : (
                    <>
                      <span>·</span>
                      <span>{selectedEvent.imageSourceLabel}</span>
                    </>
                  )}
                </div>
                <button
                  className="mt-3 rounded-full bg-[var(--accent-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--accent)]"
                  onClick={() => setIsEventMapOpen(true)}
                  type="button"
                >
                  Открыть карту события
                </button>
              </figcaption>
            </figure>
            <div>
              <p className="leading-7 text-[var(--muted)]">
                {selectedEvent.summary}
              </p>
              <p className="mt-4 text-sm leading-6 text-[var(--muted-strong)]">
                «{selectedEvent.quote}»
              </p>
              <p className="mt-3 text-xs leading-5 text-[var(--muted)]">
                {selectedEvent.accuracy}
              </p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {getSourcesForEvent(data, selectedEvent).map((source) => (
              <a
                className="rounded-full bg-[var(--accent-soft)] px-3 py-2 text-sm text-[var(--accent)]"
                href={`/sources#source-${source.id}`}
                key={source.id}
              >
                {source.title}
              </a>
            ))}
          </div>
        </article>

        <div className="grid auto-rows-max content-start gap-3 self-start sm:grid-cols-2">
          {filteredEvents.map((event) => (
            <button
              className={`surface p-4 text-left transition hover:-translate-y-0.5 ${
                event.id === selectedEvent.id ? "border-[var(--accent)]" : ""
              }`}
              key={event.id}
              onClick={() => setSelectedId(event.id)}
              type="button"
            >
              {event.imageMode === "photo" ? (
                <div className="mb-3 overflow-hidden rounded-2xl border border-black/10 bg-[var(--surface-soft)]">
                  <div className="aspect-[16/9]">
                    <img
                      alt={event.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      src={event.imageUrl}
                    />
                  </div>
                </div>
              ) : (
                <div className="mb-3 rounded-2xl border border-black/10 bg-gradient-to-br from-[var(--surface-soft)] to-white p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                    Карта точки
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
                    {event.place}
                  </p>
                  <p className="mt-2 text-xs text-[var(--muted)]">
                    {event.coords.y.toFixed(3)}°, {event.coords.x.toFixed(3)}°
                  </p>
                </div>
              )}
              <p className="text-sm text-[var(--muted)]">{event.date}</p>
              <h3 className="mt-1 font-semibold">{event.title}</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{event.place}</p>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                {event.cardBlurb}
              </p>
            </button>
          ))}
        </div>
      </section>

      {isEventMapOpen && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setIsEventMapOpen(false)}
          role="presentation"
        >
          <div
            className="map-frame w-full max-w-6xl overflow-hidden bg-white"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="flex items-start justify-between border-b border-black/10 px-5 py-4">
              <div>
                <p className="text-xs text-[var(--muted)]">
                  Интерактивная карта события
                </p>
                <h3 className="text-xl font-semibold">{selectedEvent.title}</h3>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {selectedEvent.date} · {selectedEvent.place}
                </p>
              </div>
              <button
                className="rounded-full bg-[var(--accent-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--accent)]"
                onClick={() => setIsEventMapOpen(false)}
                type="button"
              >
                Закрыть
              </button>
            </div>
            <div className="h-[70vh] min-h-[420px]">
              <MapContainer
                attributionControl
                center={toLatLng(selectedEvent.coords)}
                className="h-full w-full"
                maxZoom={10}
                minZoom={2}
                scrollWheelZoom
                worldCopyJump={false}
                zoom={4}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />
                <RecenterMiniMap center={toLatLng(selectedEvent.coords)} />
                {routeCopies(
                  densifyRoute(
                    stagesWithRouteOverrides.find(
                      (item) => item.id === selectedEvent.stageId,
                    )?.route ?? [],
                    routeDensity(selectedEvent.stageId),
                  ),
                ).map((positions, index) => (
                  <Polyline
                    key={`modal-stage-${selectedEvent.stageId}-${index}`}
                    pathOptions={{
                      color: expeditionColors[selectedEvent.expeditionId],
                      lineCap: "round",
                      lineJoin: "round",
                      opacity: 0.9,
                      weight: 6,
                    }}
                    positions={positions}
                  />
                ))}
                <CircleMarker
                  center={toLatLng(selectedEvent.coords)}
                  fillColor={expeditionColors[selectedEvent.expeditionId]}
                  fillOpacity={1}
                  pathOptions={{ color: "#ffffff", weight: 4 }}
                  radius={10}
                >
                  <Popup>
                    <strong>{selectedEvent.title}</strong>
                    <br />
                    {selectedEvent.summary}
                  </Popup>
                </CircleMarker>
              </MapContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
