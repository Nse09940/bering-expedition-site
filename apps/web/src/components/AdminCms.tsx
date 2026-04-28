"use client";

import { useMemo, useState } from "react";

type DraftStatus = "draft" | "published";

type CmsItem = {
  id: string;
  entity: string;
  title: string;
  source: string;
  status: DraftStatus;
  updatedAt: string;
};

const initialItems: CmsItem[] = [];

const entities = [
  "Экспедиции",
  "Этапы",
  "События",
  "Геоточки",
  "Маршруты",
  "Источники",
  "Медиа",
];
const roles = [
  ["Гость", "Просмотр карты, экспедиций, открытий и источников."],
  [
    "Редактор",
    "Добавление и правка событий, маршрутов, цитат, изображений и источников.",
  ],
  [
    "Администратор",
    "Пользователи, роли, публикации, настройки и резервные копии.",
  ],
];

export function AdminCms() {
  const [items, setItems] = useState(initialItems);
  const [entity, setEntity] = useState("События");
  const [title, setTitle] = useState("");
  const [source, setSource] = useState("");
  const [status, setStatus] = useState<DraftStatus>("draft");
  const [selectedEntity, setSelectedEntity] = useState("Все");

  const validationErrors = [
    title.trim().length === 0 ? "Название обязательно" : "",
    source.trim().length === 0 ? "Источник или ссылка обязательны" : "",
  ].filter(Boolean);

  const filteredItems = useMemo(() => {
    return selectedEntity === "Все"
      ? items
      : items.filter((item) => item.entity === selectedEntity);
  }, [items, selectedEntity]);

  function addItem() {
    if (validationErrors.length > 0) return;
    setItems((current) => [
      {
        id: `${entity}-${Date.now()}`,
        entity,
        title,
        source,
        status,
        updatedAt: new Date().toISOString().slice(0, 10),
      },
      ...current,
    ]);
    setTitle("");
    setSource("");
    setStatus("draft");
  }

  function toggleStatus(id: string) {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, status: item.status === "draft" ? "published" : "draft" }
          : item,
      ),
    );
  }

  function deleteItem(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-3">
        {roles.map(([role, text]) => (
          <article className="surface p-5" key={role}>
            <h2 className="text-xl font-semibold">{role}</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{text}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-[360px_1fr]">
        <form
          className="surface space-y-4 p-5"
          onSubmit={(event) => {
            event.preventDefault();
            addItem();
          }}
        >
          <h2 className="text-2xl font-semibold">Новая запись</h2>
          <label className="block text-sm text-[var(--muted-strong)]">
            Сущность
            <select
              className="control mt-2 w-full px-3 py-2"
              onChange={(event) => setEntity(event.target.value)}
              value={entity}
            >
              {entities.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm text-[var(--muted-strong)]">
            Название
            <input
              className="control mt-2 w-full px-3 py-2"
              onChange={(event) => setTitle(event.target.value)}
              value={title}
            />
          </label>
          <label className="block text-sm text-[var(--muted-strong)]">
            Источник / архив / файл
            <input
              className="control mt-2 w-full px-3 py-2"
              onChange={(event) => setSource(event.target.value)}
              value={source}
            />
          </label>
          <label className="block text-sm text-[var(--muted-strong)]">
            Статус
            <select
              className="control mt-2 w-full px-3 py-2"
              onChange={(event) => setStatus(event.target.value as DraftStatus)}
              value={status}
            >
              <option value="draft">Черновик</option>
              <option value="published">Опубликовано</option>
            </select>
          </label>
          {validationErrors.length > 0 && (
            <div className="rounded-2xl bg-red-50 p-3 text-sm text-red-700">
              {validationErrors.join(". ")}
            </div>
          )}
          <button className="button-primary w-full" type="submit">
            Добавить
          </button>
        </form>

        <div className="space-y-4">
          <div className="surface flex flex-wrap items-center justify-between gap-4 p-4">
            <h2 className="text-2xl font-semibold">Записи CMS</h2>
            <select
              className="control px-3 py-2"
              onChange={(event) => setSelectedEntity(event.target.value)}
              value={selectedEntity}
            >
              <option value="Все">Все</option>
              {entities.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-3">
            {filteredItems.map((item) => (
              <article
                className="surface grid gap-3 p-4 md:grid-cols-[1fr_auto]"
                key={item.id}
              >
                <div>
                  <p className="text-sm text-[var(--muted)]">
                    {item.entity} · {item.updatedAt}
                  </p>
                  <h3 className="mt-1 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    {item.source}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 md:justify-end">
                  <button
                    className="rounded-full bg-[var(--accent-soft)] px-3 py-2 text-sm text-[var(--accent)]"
                    onClick={() => toggleStatus(item.id)}
                    type="button"
                  >
                    {item.status === "draft" ? "Опубликовать" : "В черновик"}
                  </button>
                  <button
                    className="rounded-full bg-red-50 px-3 py-2 text-sm text-red-700"
                    onClick={() => deleteItem(item.id)}
                    type="button"
                  >
                    Удалить
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
