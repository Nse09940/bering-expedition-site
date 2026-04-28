"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CircleMarker,
  MapContainer,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import type { LatLngTuple, Map as LeafletMap } from "leaflet";
import {
  events,
  getSourcesForEvent,
  stages,
  type EventType,
  type ExpeditionId,
} from "@/data/bering";

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

const chirikovRoute = [
  { x: 158.6, y: 53.0 },
  { x: 160.8, y: 52.8 },
  { x: 163.2, y: 52.6 },
  { x: 166.0, y: 52.4 },
  { x: 169.8, y: 52.1 },
  { x: 174.0, y: 52.0 },
  { x: 179.0, y: 52.3 },
  { x: 184.0, y: 52.8 },
  { x: 188.6, y: 53.4 },
  { x: 193.0, y: 54.0 },
  { x: 198.0, y: 54.5 },
  { x: 203.0, y: 55.2 },
  { x: 208.0, y: 56.0 },
  { x: 213.0, y: 56.7 },
  { x: 215.4, y: 56.5 },
  { x: 218.0, y: 56.0 },
  { x: 220.0, y: 55.6 },
  { x: 222.0, y: 55.3 },
];

const importantObjects = [
  ["Берингов пролив", 66.1, 190.3],
  ["Охотское море", 55.6, 148.5],
  ["Камчатка", 56.0, 160.0],
  ["Аляска", 60.0, 212.0],
  ["Алеутские острова", 53.0, 178.0],
] as const;

function toLatLng(point: { x: number; y: number }): LatLngTuple {
  return [point.y, point.x];
}

function normalizeLongitude(longitude: number) {
  return ((((longitude + 180) % 360) + 360) % 360) - 180;
}

function unwrapRoute(points: { x: number; y: number }[]) {
  if (points.length === 0) return points;

  const unwrapped: { x: number; y: number }[] = [];
  let previousLongitude = normalizeLongitude(points[0].x);
  unwrapped.push({ x: previousLongitude, y: points[0].y });

  for (let index = 1; index < points.length; index += 1) {
    const point = points[index];
    const baseLongitude = normalizeLongitude(point.x);
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

  const dense: { x: number; y: number }[] = [];
  for (let index = 0; index < points.length - 1; index += 1) {
    const start = points[index];
    const end = points[index + 1];

    for (let step = 0; step < stepsPerSegment; step += 1) {
      const t = step / stepsPerSegment;
      dense.push({
        x: start.x + (end.x - start.x) * t,
        y: start.y + (end.y - start.y) * t,
      });
    }
  }

  dense.push(points[points.length - 1]);
  return dense;
}

function routeDensity(stageId: string) {
  if (stageId === "second-prep" || stageId === "first-siberia") return 4;
  return 6;
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

function MiniMapInvalidator() {
  const map = useMap();

  useEffect(() => {
    const timer = window.setTimeout(() => map.invalidateSize(), 120);
    return () => window.clearTimeout(timer);
  }, [map]);

  return null;
}

function RecenterMiniMap({ center }: { center: LatLngTuple }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: false });
  }, [center, map]);

  return null;
}

function EventMiniMap({ event }: { event: (typeof events)[number] }) {
  const stage = stages.find((item) => item.id === event.stageId);
  const center = toLatLng(event.coords);

  return (
    <MapContainer
      attributionControl={false}
      center={center}
      className="h-56 w-full"
      dragging={false}
      doubleClickZoom={false}
      keyboard={false}
      scrollWheelZoom={false}
      touchZoom={false}
      zoom={4}
      zoomControl={false}
      ref={(map: LeafletMap | null) => {
        if (map) window.setTimeout(() => map.invalidateSize(), 120);
      }}
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
                opacity: 0.8,
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
        pathOptions={{ color: "#ffffff", weight: 4 }}
        radius={10}
      />
      <MiniMapInvalidator />
    </MapContainer>
  );
}

export function LeafletMapContent({
  initialSelectedId,
}: {
  initialSelectedId?: string;
}) {
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
      stages.filter(
        (stage) => expedition === "all" || stage.expeditionId === expedition,
      ),
    [expedition],
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
    return events.filter((event) => {
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
  }, [expedition, progressYear, query, stageId, type]);
  const selectedEvent =
    filteredEvents.find((event) => event.id === selectedId) ??
    filteredEvents[0] ??
    events[0];

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
            routeCopies(chirikovRoute).map((positions, index) => (
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

          {importantObjects.map(([label, lat, lon]) => (
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

          {filteredEvents.map((event) => (
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
                <strong>{event.title}</strong>
                <br />
                {event.date} · {event.place}
                <br />
                {event.summary}
              </Popup>
            </CircleMarker>
          ))}
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
              <button
                className="block w-full cursor-zoom-in text-left"
                onClick={() => setIsEventMapOpen(true)}
                type="button"
              >
                <EventMiniMap event={selectedEvent} key={selectedEvent.id} />
              </button>
              <figcaption className="border-t border-black/10 px-4 py-3 text-xs text-[var(--muted)]">
                {selectedEvent.image} · Нажмите, чтобы открыть интерактивную
                карту
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
            {getSourcesForEvent(selectedEvent).map((source) => (
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
              <p className="text-sm text-[var(--muted)]">{event.date}</p>
              <h3 className="mt-1 font-semibold">{event.title}</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{event.place}</p>
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
                    stages.find((item) => item.id === selectedEvent.stageId)
                      ?.route ?? [],
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
