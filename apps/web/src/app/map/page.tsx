import { InteractiveMap } from "@/components/InteractiveMap";

export default function MapPage() {
  return (
    <main className="container flex-1 py-8">
      <div className="mb-6 grid gap-2">
        <p className="eyebrow">Карта</p>
        <h1 className="text-5xl font-semibold tracking-normal md:text-6xl">
          Интерактивная карта
        </h1>
      </div>
      <InteractiveMap />
    </main>
  );
}
