export type ExpeditionId = "first" | "second";

export type SourceType =
  | "Журнал"
  | "Карта"
  | "Донесение"
  | "Архив"
  | "Исследование";

export type EventType =
  | "переход"
  | "стоянка"
  | "открытие"
  | "наблюдение"
  | "документ"
  | "шторм";

export type Source = {
  id: string;
  title: string;
  author: string;
  type: SourceType;
  year: string;
  origin: string;
  archiveLink: string;
  description: string;
};

export type RoutePoint = {
  x: number;
  y: number;
};

export type RouteEvent = {
  id: string;
  expeditionId: ExpeditionId;
  stageId: string;
  title: string;
  place: string;
  date: string;
  year: number;
  type: EventType;
  summary: string;
  quote: string;
  sourceIds: string[];
  image: string;
  coords: RoutePoint;
  accuracy: string;
};

export type Stage = {
  id: string;
  expeditionId: ExpeditionId;
  title: string;
  period: string;
  summary: string;
  route: RoutePoint[];
};

export type Expedition = {
  id: ExpeditionId;
  slug: string;
  title: string;
  shortTitle: string;
  period: string;
  summary: string;
  goal: string;
  results: string[];
};

export type CatalogData = {
  expeditions: Expedition[];
  stages: Stage[];
  events: RouteEvent[];
  sources: Source[];
};

const FALLBACK_DATA: CatalogData = {
  expeditions: [],
  stages: [],
  events: [],
  sources: [],
};

function getApiBaseUrl() {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_API_URL ?? "/api";
  }
  return process.env.NEXT_PUBLIC_API_URL ?? "http://backend:8000/api";
}

export async function fetchCatalogData(): Promise<CatalogData> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/content`, {
      cache: "no-store",
    });
    if (!response.ok) return FALLBACK_DATA;
    return (await response.json()) as CatalogData;
  } catch {
    return FALLBACK_DATA;
  }
}

export function getSourcesForEvent(data: CatalogData, event: RouteEvent) {
  return event.sourceIds
    .map((id) => data.sources.find((source) => source.id === id))
    .filter(Boolean) as Source[];
}

export function getExpeditionBySlug(data: CatalogData, slug: string) {
  return data.expeditions.find((expedition) => expedition.slug === slug);
}
