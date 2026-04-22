"use client";

import dynamic from "next/dynamic";

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

export function InteractiveMap() {
  return <LeafletMapContent />;
}
