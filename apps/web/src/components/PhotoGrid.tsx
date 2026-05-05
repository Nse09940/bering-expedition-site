import type { PhotoCard } from "@/data/photoCollections";

type PhotoGridProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  photos: PhotoCard[];
};

export function PhotoGrid({
  eyebrow,
  title,
  description,
  photos,
}: PhotoGridProps) {
  return (
    <section>
      <div className="mb-6">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2 className="mt-2 text-2xl font-semibold">{title}</h2>
        {description ? (
          <p className="mt-3 max-w-3xl leading-7 text-[var(--muted)]">
            {description}
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {photos.map((photo) => (
          <article className="surface overflow-hidden" key={photo.imageUrl}>
            <div className="aspect-[4/3] bg-[var(--surface-soft)]">
              <img
                alt={photo.title}
                className="h-full w-full object-cover"
                loading="lazy"
                src={photo.imageUrl}
              />
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold">{photo.title}</h3>
                <span className="legend-item text-xs">{photo.kind}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                {photo.description}
              </p>
              <a
                className="mt-4 inline-flex text-sm font-semibold text-[var(--accent)]"
                href={photo.sourceUrl}
                rel="noreferrer"
                target="_blank"
              >
                Источник: {photo.sourceLabel}
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
