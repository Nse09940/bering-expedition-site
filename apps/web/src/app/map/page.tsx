import { InteractiveMap } from "@/components/InteractiveMap";
import { fetchCatalogData } from "@/lib/catalog";

export default async function MapPage({
  searchParams,
}: {
  searchParams?: { event?: string };
}) {
  const data = await fetchCatalogData();
  return (
    <main className="container flex-1 py-8">
      <div className="mb-6 grid gap-2">
        <p className="eyebrow">Карта</p>
        <h1 className="text-5xl font-semibold tracking-normal md:text-6xl">
          Интерактивная карта
        </h1>
      </div>
      <InteractiveMap data={data} initialSelectedId={searchParams?.event} />
    </main>
  );
}
