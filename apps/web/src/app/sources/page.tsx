import { SourcesCatalog } from "@/components/SourcesCatalog";

export default function SourcesPage() {
  return (
    <main className="container page-shell flex-1">
      <div className="page-hero">
        <p className="eyebrow">Каталог</p>
        <h1 className="small-title">Источники</h1>
      </div>
      <SourcesCatalog />
    </main>
  );
}
