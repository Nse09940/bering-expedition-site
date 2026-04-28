import { SourcesCatalog } from "@/components/SourcesCatalog";
import { fetchCatalogData } from "@/lib/catalog";

export default async function SourcesPage() {
  const data = await fetchCatalogData();
  return (
    <main className="container page-shell flex-1">
      <div className="page-hero">
        <p className="eyebrow">Каталог</p>
        <h1 className="small-title">Источники</h1>
      </div>
      <SourcesCatalog data={data} />
    </main>
  );
}
