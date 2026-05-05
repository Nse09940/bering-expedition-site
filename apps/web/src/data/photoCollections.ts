import type { ExpeditionId } from "@/lib/catalog";

export type PhotoCard = {
  title: string;
  description: string;
  imageUrl: string;
  sourceUrl: string;
  sourceLabel: string;
  kind: "Фото" | "Архив";
};

function commonsSourceUrl(filename: string) {
  return `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(filename)}`;
}

function commonsImageUrl(filename: string) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=960`;
}

const SOURCES = {
  avachaBay: commonsSourceUrl(
    "Center of Petropavlovsk-Kamchatsky Avacha Bay.jpg",
  ),
  petropavlovskVolcano: commonsSourceUrl(
    "Petropavlovsk-Kamchatsky with Koryaksky Volcano in background.jpg",
  ),
  beringIsland: commonsSourceUrl("Bering island.jpg"),
  beringBeach: commonsSourceUrl(
    "Beach and rock formation, Bering Island, Russia, 1880-1900 (AL+CA 3273).jpg",
  ),
  kayakIsland: commonsSourceUrl("Kayak Island 8304.JPG"),
  koryakskyVolcano: commonsSourceUrl(
    "Koryaksky Volcano - Kamchatka, Russian Federation - Summer 1993.jpg",
  ),
};

function commonsPhoto(
  title: string,
  description: string,
  filename: string,
  kind: PhotoCard["kind"] = "Фото",
): PhotoCard {
  return {
    title,
    description,
    imageUrl: commonsImageUrl(filename),
    sourceUrl: commonsSourceUrl(filename),
    sourceLabel: "Wikimedia Commons",
    kind,
  };
}

export const HOME_PHOTOS: PhotoCard[] = [
  {
    title: "Авачинская бухта",
    description:
      "Современный вид камчатского побережья помогает представить пространство, в котором заканчивалась сухопутная подготовка и начинался океанский этап.",
    imageUrl: "/history/avacha-bay.jpg",
    sourceUrl: SOURCES.avachaBay,
    sourceLabel: "Wikimedia Commons",
    kind: "Фото",
  },
  {
    title: "Петропавловск и Корякский вулкан",
    description:
      "Визуальный образ Камчатки, через которую проходила поздняя подготовка второй экспедиции и откуда начинался выход 1741 года.",
    imageUrl: "/history/petropavlovsk-volcano.jpg",
    sourceUrl: SOURCES.petropavlovskVolcano,
    sourceLabel: "Wikimedia Commons",
    kind: "Фото",
  },
  {
    title: "Остров Беринга",
    description:
      "Командоры стали местом самой трагической развязки второй экспедиции, поэтому современный образ острова важен для восприятия всей истории.",
    imageUrl: "/history/bering-island.jpg",
    sourceUrl: SOURCES.beringIsland,
    sourceLabel: "Wikimedia Commons",
    kind: "Фото",
  },
  {
    title: "Остров Каяк, Аляска",
    description:
      "Район выхода Беринга к американскому берегу. Это одна из главных точек второй экспедиции на карте сайта.",
    imageUrl: "/history/kayak-island.jpg",
    sourceUrl: SOURCES.kayakIsland,
    sourceLabel: "Wikimedia Commons",
    kind: "Фото",
  },
  {
    title: "Берег острова Беринга",
    description:
      "Архивная фотография показывает суровый ландшафт Командорских островов, с которым столкнулись участники обратного пути.",
    imageUrl: "/history/bering-beach.jpg",
    sourceUrl: SOURCES.beringBeach,
    sourceLabel: "Wikimedia Commons",
    kind: "Архив",
  },
  {
    title: "Корякский вулкан",
    description:
      "Один из самых узнаваемых ориентиров Камчатки, который визуально связывает карту сайта с реальным рельефом региона.",
    imageUrl: "/history/koryaksky-volcano.jpg",
    sourceUrl: SOURCES.koryakskyVolcano,
    sourceLabel: "Wikimedia Commons",
    kind: "Фото",
  },
];

export const EXPEDITIONS_OVERVIEW_PHOTOS: PhotoCard[] = [
  {
    title: "Камчатский ландшафт",
    description:
      "Камчатка была не просто фоном экспедиций, а пространством, где строилась инфраструктура выхода в океан.",
    imageUrl: "/history/avacha-bay.jpg",
    sourceUrl: SOURCES.avachaBay,
    sourceLabel: "Wikimedia Commons",
    kind: "Фото",
  },
  {
    title: "Петропавловск-Камчатский",
    description:
      "Вторая экспедиция связана с будущей Петропавловской гаванью особенно тесно, поэтому этот вид хорошо работает как визуальная опора раздела.",
    imageUrl: "/history/petropavlovsk-volcano.jpg",
    sourceUrl: SOURCES.petropavlovskVolcano,
    sourceLabel: "Wikimedia Commons",
    kind: "Фото",
  },
  {
    title: "Американский берег",
    description:
      "Остров Каяк визуально напоминает, что вторая экспедиция была не только сибирским, но и североамериканским сюжетом.",
    imageUrl: "/history/kayak-island.jpg",
    sourceUrl: SOURCES.kayakIsland,
    sourceLabel: "Wikimedia Commons",
    kind: "Фото",
  },
  {
    title: "Командорский финал",
    description:
      "Остров Беринга и его берега помогают почувствовать драматический конец обратного пути.",
    imageUrl: "/history/bering-island.jpg",
    sourceUrl: SOURCES.beringIsland,
    sourceLabel: "Wikimedia Commons",
    kind: "Фото",
  },
  commonsPhoto(
    "Охотск",
    "Охотск был главным тихоокеанским портом, где сухопутная логистика переходила в судостроение и морской этап.",
    "Ohotsk.jpg",
  ),
  commonsPhoto(
    "Тобольский кремль",
    "Тобольск показывает административную сторону экспедиций: через такие узлы проходили люди, грузы и распоряжения.",
    "Tobolsk Kremlin by Dmitry Medvedev.jpg",
  ),
  commonsPhoto(
    "Берингов пролив",
    "Пролив визуально связывает главный итог первой экспедиции с картографией северо-востока Азии.",
    "BeringSt-close-VE.jpg",
    "Архив",
  ),
  commonsPhoto(
    "Гора Святого Ильи",
    "Один из главных ориентиров американского берега, связанный с выходом второй экспедиции к Аляске.",
    "Mt Saint Elias, South Central Alaska.jpg",
  ),
  commonsPhoto(
    "Шумагинские острова",
    "Южноаляскинский участок обратного пути «Святого Петра», где история второй экспедиции становилась всё драматичнее.",
    "Shumagins, Big Koniuji Island with MV Tiglax.jpg",
  ),
  commonsPhoto(
    "Уналашка",
    "Алеутская дуга была важной цепью ориентиров на обратном пути из района Аляски к Камчатке.",
    "UnalaskaAlaska.jpg",
  ),
  commonsPhoto(
    "Атту",
    "Западная часть Алеутской цепи помогает увидеть масштаб обратного перехода через северную Пацифику.",
    "Attu sat.jpg",
    "Архив",
  ),
  commonsPhoto(
    "Карта северной Пацифики",
    "Для реконструированных океанских участков точнее использовать карту региона, а не случайное фото моря.",
    "Pacific Ocean laea location map.svg",
    "Архив",
  ),
];

export const EXPEDITION_PHOTOS: Record<ExpeditionId, PhotoCard[]> = {
  first: [
    {
      title: "Камчатка как пространство финального этапа",
      description:
        "Современный вид акватории помогает сделать первую экспедицию не только текстовой, но и географически осязаемой.",
      imageUrl: "/history/avacha-bay.jpg",
      sourceUrl: SOURCES.avachaBay,
      sourceLabel: "Wikimedia Commons",
      kind: "Фото",
    },
    {
      title: "Камчатский рельеф",
      description:
        "Вулканический пейзаж подчёркивает, насколько крайним и трудным был регион, к которому продвигалась первая экспедиция.",
      imageUrl: "/history/koryaksky-volcano.jpg",
      sourceUrl: SOURCES.koryakskyVolcano,
      sourceLabel: "Wikimedia Commons",
      kind: "Фото",
    },
    {
      title: "Образ тихоокеанского побережья",
      description:
        "Для чтения морской части маршрута важно видеть не только линии на карте, но и реальный северотиxоокеанский горизонт.",
      imageUrl: "/history/petropavlovsk-volcano.jpg",
      sourceUrl: SOURCES.petropavlovskVolcano,
      sourceLabel: "Wikimedia Commons",
      kind: "Фото",
    },
    {
      title: "Остров Каяк как северотиxоокеанский ориентир",
      description:
        "Этот кадр не иллюстрирует саму первую экспедицию буквально, но помогает почувствовать природную среду северной Пацифики, к которой вёл весь поиск.",
      imageUrl: "/history/kayak-island.jpg",
      sourceUrl: SOURCES.kayakIsland,
      sourceLabel: "Wikimedia Commons",
      kind: "Фото",
    },
    {
      title: "Крайний север Пацифики",
      description:
        "Пейзажные фото делают страницу менее абстрактной и лучше связывают сухопутный маршрут с его океанским итогом.",
      imageUrl: "/history/bering-island.jpg",
      sourceUrl: SOURCES.beringIsland,
      sourceLabel: "Wikimedia Commons",
      kind: "Фото",
    },
    {
      title: "Архивный берег Командор",
      description:
        "Архивная фотография работает как дополнительный визуальный фон для понимания сурового мира северной Пацифики XVIII века.",
      imageUrl: "/history/bering-beach.jpg",
      sourceUrl: SOURCES.beringBeach,
      sourceLabel: "Wikimedia Commons",
      kind: "Архив",
    },
    commonsPhoto(
      "Тобольск",
      "Тобольск был одним из главных административных узлов сибирского перехода первой экспедиции.",
      "Tobolsk Kremlin by Dmitry Medvedev.jpg",
    ),
    commonsPhoto(
      "Енисейск",
      "Енисейск показывает среднесибирский узел между кетским, енисейским и ангарским направлениями.",
      "Dudareva Street in Yeniseisk.jpg",
    ),
    commonsPhoto(
      "Якутск",
      "Якутск был важнейшей базой снабжения перед переходом к Охотску.",
      "Yakutsk - 190228 DSC 5382.jpg",
    ),
    commonsPhoto(
      "Охотск",
      "Охотск завершал сухопутную фазу и открывал путь к морской подготовке на Тихом океане.",
      "Ohotsk.jpg",
    ),
    commonsPhoto(
      "Охотское море",
      "Переход через Охотское море связывал материковую базу с Камчаткой.",
      "Freezing the waters of the Sea of Okhotsk. Magadan.jpg",
    ),
    commonsPhoto(
      "Усть-Камчатский район",
      "Район устья Камчатки связан со стартом северного морского похода первой экспедиции.",
      "Ust-Kamchatsky District, Kamchatka Krai, Russia - panoramio.jpg",
    ),
    commonsPhoto(
      "Остров Святого Лаврентия",
      "Остров был важным ориентиром в северной части Берингова моря.",
      "Wfm st lawrence island.jpg",
    ),
    commonsPhoto(
      "Острова Диомида",
      "Диомиды помогают визуально понять пространство Берингова пролива между Азией и Америкой.",
      "Diomede Islands Bering Sea Jul 2006.jpg",
    ),
    commonsPhoto(
      "Мыс Дежнёва",
      "Восточная оконечность Азии связана с ключевым районом наблюдений первой экспедиции.",
      "Cape Dezhnev w umiac.JPG",
      "Архив",
    ),
    commonsPhoto(
      "Берингов пролив",
      "Главный географический район, ради которого первая экспедиция прошла огромный путь через Сибирь.",
      "BeringSt-close-VE.jpg",
      "Архив",
    ),
  ],
  second: [
    {
      title: "Авачинская бухта",
      description:
        "Вторая экспедиция особенно тесно связана с Камчаткой, поэтому этот вид помогает собрать воедино её подготовительный этап.",
      imageUrl: "/history/avacha-bay.jpg",
      sourceUrl: SOURCES.avachaBay,
      sourceLabel: "Wikimedia Commons",
      kind: "Фото",
    },
    {
      title: "Петропавловск и Корякский вулкан",
      description:
        "Фотография передаёт масштаб ландшафта, на фоне которого создавалась база для океанского выхода 1741 года.",
      imageUrl: "/history/petropavlovsk-volcano.jpg",
      sourceUrl: SOURCES.petropavlovskVolcano,
      sourceLabel: "Wikimedia Commons",
      kind: "Фото",
    },
    {
      title: "Корякский вулкан",
      description:
        "Отдельный вид на камчатский рельеф усиливает ощущение реального пространства, а не только схемы маршрута.",
      imageUrl: "/history/koryaksky-volcano.jpg",
      sourceUrl: SOURCES.koryakskyVolcano,
      sourceLabel: "Wikimedia Commons",
      kind: "Фото",
    },
    {
      title: "Остров Каяк",
      description:
        "Район, к которому вышел Беринг после разлуки судов и северо-восточного поиска американского берега.",
      imageUrl: "/history/kayak-island.jpg",
      sourceUrl: SOURCES.kayakIsland,
      sourceLabel: "Wikimedia Commons",
      kind: "Фото",
    },
    {
      title: "Остров Беринга",
      description:
        "Командорский этап завершил маршрут катастрофой и зимовкой, поэтому современный вид острова усиливает драматургию раздела.",
      imageUrl: "/history/bering-island.jpg",
      sourceUrl: SOURCES.beringIsland,
      sourceLabel: "Wikimedia Commons",
      kind: "Фото",
    },
    {
      title: "Берег острова Беринга",
      description:
        "Архивный кадр с Командор показывает, насколько суровой была среда обратного пути и зимовки команды.",
      imageUrl: "/history/bering-beach.jpg",
      sourceUrl: SOURCES.beringBeach,
      sourceLabel: "Wikimedia Commons",
      kind: "Архив",
    },
    commonsPhoto(
      "Охотск",
      "Охотск был портом и верфью, где подготовительная логистика второй экспедиции переходила к морю.",
      "Ohotsk.jpg",
    ),
    commonsPhoto(
      "Мыс Лопатка и юг Камчатки",
      "Южная Камчатка важна для перехода от Охотского моря к Авачинской губе.",
      "Kamchatka peninsula topo.jpg",
      "Архив",
    ),
    commonsPhoto(
      "Гора Святого Ильи",
      "Ориентир американского берега, связанный с подходом «Святого Петра» к Аляске.",
      "Mt Saint Elias, South Central Alaska.jpg",
    ),
    commonsPhoto(
      "Шумагинские острова",
      "Островной район обратного пути, получивший место в истории экспедиции после смерти матроса Шумагина.",
      "Shumagins, Big Koniuji Island with MV Tiglax.jpg",
    ),
    commonsPhoto(
      "Остров Унга",
      "Один из ориентиров Шумагинской группы на обратном пути от Аляски.",
      "Unga Island NPS.jpg",
    ),
    commonsPhoto(
      "Унимак",
      "Восточная часть Алеутской дуги на пути от Аляски к Командорам.",
      "Unimak island.jpg",
    ),
    commonsPhoto(
      "Уналашка",
      "Алеутская точка, показывающая протяжённость обратного пути «Святого Петра».",
      "UnalaskaAlaska.jpg",
    ),
    commonsPhoto(
      "Умнак",
      "Островной ориентир в центральной части Алеутской дуги.",
      "MountVsevidof.jpg",
    ),
    commonsPhoto(
      "Атка",
      "Атка помогает показать, как маршрут шёл вдоль Алеутских островов к западу.",
      "Atka.JPG",
    ),
    commonsPhoto(
      "Адак",
      "Адак относится к западному участку Алеутской цепи на обратном пути.",
      "Adak - Adak Island.jpg",
    ),
    commonsPhoto(
      "Амчитка",
      "Ещё один западноалеутский ориентир перед выходом к Ближним островам и Командорам.",
      "Amchitka Island, Harlequin Beach.jpg",
    ),
    commonsPhoto(
      "Кыска",
      "Кыска показывает дальнюю западную часть алеутского маршрута.",
      "Kiska Island volcano.jpg",
    ),
    commonsPhoto(
      "Атту",
      "Ближние острова подчёркивают, насколько далеко на запад ушёл обратный путь.",
      "Attu sat.jpg",
      "Архив",
    ),
    commonsPhoto(
      "Остров Медный",
      "Командорские острова были последним рубежом перед катастрофой «Святого Петра».",
      "Medny-Island.JPG",
      "Архив",
    ),
    commonsPhoto(
      "Архипелаг Александра",
      "Региональная карта помогает корректно показать линию Чирикова у юго-восточной Аляски.",
      "Alexander archipelago.jpg",
      "Архив",
    ),
    commonsPhoto(
      "Остров Принца Уэльского",
      "Район мыса Аддингтон связан с попытками Чирикова исследовать американский берег.",
      "Map of Alaska highlighting Prince of Wales Island.png",
      "Архив",
    ),
    commonsPhoto(
      "Кадьяк",
      "Кадьяк относится к обратному пути ветки Чирикова через залив Аляска.",
      "Kodiak, View from Pillar Mountain.jpg",
    ),
    commonsPhoto(
      "Кенайский полуостров",
      "Кенайский район помогает визуально связать линию Чирикова с южной Аляской.",
      "Lakes and mountains on the Kenai Peninsula.jpg",
    ),
  ],
};
