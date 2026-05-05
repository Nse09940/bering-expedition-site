"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { CatalogData, SourceType } from "@/lib/catalog";

const types: Array<SourceType | "Все"> = [
  "Все",
  "Журнал",
  "Карта",
  "Донесение",
  "Архив",
  "Исследование",
];

const archiveOptions = [
  "Все",
  "prlib.ru",
  "elib.rgo.ru",
  "docs.historyrussia.org",
  "openlibrary.org",
];

export function SourcesCatalog({ data }: { data: CatalogData }) {
  const { events, sources } = data;
  const [query, setQuery] = useState("");
  const [type, setType] = useState<SourceType | "Все">("Все");
  const [year, setYear] = useState("Все");
  const [author, setAuthor] = useState("Все");
  const [archive, setArchive] = useState("Все");

  const years = useMemo(
    () => ["Все", ...Array.from(new Set(sources.map((source) => source.year)))],
    [],
  );
  const authors = useMemo(
    () => [
      "Все",
      ...Array.from(new Set(sources.map((source) => source.author))),
    ],
    [],
  );

  const filteredSources = useMemo(() => {
    const lowerQuery = query.trim().toLowerCase();
    return sources.filter((source) => {
      const matchesQuery =
        lowerQuery.length === 0 ||
        `${source.title} ${source.author} ${source.origin} ${source.description}`
          .toLowerCase()
          .includes(lowerQuery);
      const matchesType = type === "Все" || source.type === type;
      const matchesYear = year === "Все" || source.year === year;
      const matchesAuthor = author === "Все" || source.author === author;
      const matchesArchive =
        archive === "Все" || source.archiveLink.includes(archive);

      return (
        matchesQuery &&
        matchesType &&
        matchesYear &&
        matchesAuthor &&
        matchesArchive
      );
    });
  }, [archive, author, query, type, year]);

  return (
    <div className="space-y-5">
      <div className="surface grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-5">
        <label className="text-sm text-[var(--muted-strong)]">
          Поиск
          <input
            className="control mt-2 w-full px-3 py-2 outline-none focus:border-[var(--accent)]"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Автор, карта, архив..."
            value={query}
          />
        </label>
        <label className="text-sm text-[var(--muted-strong)]">
          Тип
          <select
            className="control mt-2 w-full px-3 py-2 outline-none focus:border-[var(--accent)]"
            onChange={(event) =>
              setType(event.target.value as SourceType | "Все")
            }
            value={type}
          >
            {types.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-[var(--muted-strong)]">
          Год
          <select
            className="control mt-2 w-full px-3 py-2 outline-none focus:border-[var(--accent)]"
            onChange={(event) => setYear(event.target.value)}
            value={year}
          >
            {years.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-[var(--muted-strong)]">
          Автор
          <select
            className="control mt-2 w-full px-3 py-2 outline-none focus:border-[var(--accent)]"
            onChange={(event) => setAuthor(event.target.value)}
            value={author}
          >
            {authors.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-[var(--muted-strong)]">
          Архив
          <select
            className="control mt-2 w-full px-3 py-2 outline-none focus:border-[var(--accent)]"
            onChange={(event) => setArchive(event.target.value)}
            value={archive}
          >
            {archiveOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredSources.map((source) => {
          const linkedEvents = events.filter((event) =>
            event.sourceIds.includes(source.id),
          );
          return (
            <article
              className="surface scroll-mt-28 p-5"
              id={`source-${source.id}`}
              key={source.id}
            >
              <p className="text-sm text-[var(--muted)]">
                {source.type} · {source.year}
              </p>
              <h2 className="mt-3 text-xl font-semibold">{source.title}</h2>
              <p className="mt-2 text-sm text-[var(--muted-strong)]">
                {source.author} · {source.origin}
              </p>
              <p className="mt-3 leading-7 text-[var(--muted)]">
                {source.description}
              </p>
              <a
                className="mt-4 inline-flex text-sm font-semibold text-[var(--accent)]"
                href={source.archiveLink}
              >
                Архив / каталог
              </a>
              <div className="mt-4 border-t border-black/10 pt-4">
                <p className="text-sm font-semibold">Связанные события</p>
                {linkedEvents.length === 0 ? (
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    Пока не привязан
                  </p>
                ) : (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {linkedEvents.map((event) => (
                      <Link
                        className="rounded-full bg-[var(--accent-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--accent)]"
                        href={`/map?event=${event.id}`}
                        key={event.id}
                      >
                        {event.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
