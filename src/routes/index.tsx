import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Keyboard, Camera, Sparkles, X } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Transpositor Musical — Transponha notas em 2 cliques" },
      { name: "description", content: "Transponha notas para Sax, Trompete, Clarinete, Trompa e mais, de forma instantânea no celular." },
      { property: "og:title", content: "Transpositor Musical" },
      { property: "og:description", content: "Transponha notas para seu instrumento em 2 cliques." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Home,
});

function Home() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col px-5 py-10">
      <header className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gold text-3xl shadow-glow">♪</div>
        <h1 className="text-3xl font-bold tracking-tight">Transpositor Musical</h1>
        <p className="mt-2 text-muted-foreground">Transponha notas para seu instrumento em 2 cliques</p>
      </header>

      <div className="mt-12 flex flex-1 flex-col gap-5">
        <Link to="/teclado" className="flex items-center gap-4 rounded-3xl bg-gold p-6 text-primary-foreground shadow-glow active:scale-[0.98] transition">
          <Keyboard className="h-10 w-10" />
          <div>
            <div className="text-xl font-bold font-display">Digitar Notas</div>
            <div className="text-sm opacity-80">Teclado virtual de notas</div>
          </div>
        </Link>
        <button onClick={() => fileRef.current?.click()} className="flex items-center gap-4 rounded-3xl border-2 border-primary/50 bg-card p-6 text-left active:scale-[0.98] transition">
          <Camera className="h-10 w-10 text-primary" />
          <div>
            <div className="text-xl font-bold font-display">Tirar Foto da Partitura</div>
            <div className="text-sm text-muted-foreground">Câmera ou galeria</div>
          </div>
        </button>
        <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) setPreview(URL.createObjectURL(f)); e.target.value = ""; }} />
      </div>

      {preview && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 p-4 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-md rounded-3xl border border-primary/40 bg-card p-5 animate-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-sm font-semibold text-accent-foreground">
                <Sparkles className="h-4 w-4" /> Versão Pro
              </span>
              <button onClick={() => setPreview(null)} aria-label="Fechar" className="rounded-full p-2 hover:bg-muted"><X /></button>
            </div>
            <img src={preview} alt="Partitura enviada" className="mt-4 max-h-72 w-full rounded-2xl object-contain bg-muted" />
            <h2 className="mt-4 text-lg font-bold">Em breve: Reconhecimento OMR por IA</h2>
            <p className="mt-1 text-sm text-muted-foreground">A leitura automática de partituras chegará na versão Pro. Por enquanto, digite as notas manualmente.</p>
            <Link to="/teclado" className="mt-4 block rounded-2xl bg-gold py-4 text-center font-bold text-primary-foreground">Digitar Notas</Link>
          </div>
        </div>
      )}
    </main>
  );
}
