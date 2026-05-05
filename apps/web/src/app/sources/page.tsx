import { SourcesCatalog } from "@/components/SourcesCatalog";
import { fetchCatalogData } from "@/lib/catalog";

export default async function SourcesPage() {
  const data = await fetchCatalogData();

  return (
    <main className="container page-shell flex-1">
      <div className="page-hero">
        <p className="eyebrow">Каталог</p>
        <h1 className="small-title">Источники</h1>
        <p className="section-copy max-w-3xl">
          Здесь собраны журналы, карты, донесения, архивные публикации и
          исследования, на которые опирается проект. Каталог нужен не только для
          проверки фактов, но и для понимания того, как реконструируется маршрут
          и почему некоторые точки обозначены как спорные или примерные.
        </p>
      </div>
      <SourcesCatalog data={data} />
    </main>
  );
}
