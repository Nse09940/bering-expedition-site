"use client";

import dynamic from "next/dynamic";
import type { CatalogData } from "@/lib/catalog";

const LeafletMapContent = dynamic(
  () =>
    import("./LeafletMapContent").then((module) => module.LeafletMapContent),
  {
    loading: () => (
      <div className="map-frame grid min-h-[760px] place-items-center text-[var(--muted)]">
        Загрузка карты...
      </div>
    ),
    ssr: false,
  },
);

export function InteractiveMap({
  data,
  initialSelectedId,
}: {
  data: CatalogData;
  initialSelectedId?: string;
}) {
  return (
    <LeafletMapContent data={data} initialSelectedId={initialSelectedId} />
  );
}
