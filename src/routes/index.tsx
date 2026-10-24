import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Piano, ScanLine, Sparkles, X, Clock, ArrowRight, ChevronRight } from "lucide-react";
import { HistoryDrawer, useHistory } from "@/components/HistoryDrawer";
import { getInstrument } from "@/lib/transpose";
import { relativeTime, setSession } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Octava — Transpositor & Caderno Musical" },
      { name: "description", content: "Converta partituras e cifras entre Sax, Trompete, Clarinete, Trompa e Som Real em segundos." },
      { property: "og:title", content: "Octava — Transpositor & Caderno Musical" },
      { property: "og:description", content: "Transposição instantânea entre instrumentos, direto no celular." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Home,
});

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold text-lg font-bold text-primary-foreground shadow-glow">♪</div>
      <span className="font-display text-xl font-bold tracking-tight">Octava</span>
    </div>
  );
}

function Home() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const history = useHistory();
  const last = history[0];
  const navigate = useNavigate();

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col px-5 pb-10 pt-6 animate-in fade-in">
      <header className="flex items-center justify-between">
        <Logo />
        <HistoryDrawer>
          <button className="glass flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition active:scale-95">
            <Clock className="h-4 w-4 text-primary" /> Histórico
            <span className="rounded-md bg-primary/15 px-1.5 text-xs font-semibold text-primary">{history.length}</span>
          </button>
        </HistoryDrawer>
      </header>

      <section className="mt-10">
        <h1 className="text-[1.75rem] font-bold leading-tight tracking-tight">Transposição Instantânea</h1>
        <p className="mt-2 text-[0.95rem] text-muted-foreground">Converta partituras e cifras entre instrumentos em segundos.</p>
      </section>

      <section className="mt-8 flex flex-col gap-3">
        <Link to="/teclado" className="group relative overflow-hidden rounded-2xl border border-primary/30 bg-card p-5 shadow-layer transition active:scale-[0.98]">
          <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-primary/15 blur-3xl" />
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold text-primary-foreground shadow-glow"><Piano className="h-6 w-6" /></div>
            <div className="flex-1">
              <div className="font-display text-lg font-semibold">Entrada Manual de Notas</div>
              <div className="mt-0.5 text-sm text-muted-foreground">Digitar melodia com suporte a acidentes</div>
            </div>
            <ChevronRight className="mt-3 h-5 w-5 text-muted-foreground transition group-hover:translate-x-0.5" />
          </div>
        </Link>

        <button onClick={() => fileRef.current?.click()} className="group flex items-start gap-4 rounded-2xl border border-border/70 bg-card p-5 text-left shadow-layer transition active:scale-[0.98]">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary"><ScanLine className="h-6 w-6 text-primary" /></div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-semibold">Digitalizar Partitura</span>
              <span className="rounded-md border border-primary/40 bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-primary">PRO · IA</span>
            </div>
            <div className="mt-0.5 text-sm text-muted-foreground">Câmera ou foto da galeria</div>
          </div>
        </button>
        <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) setPreview(URL.createObjectURL(f)); e.target.value = ""; }} />
      </section>

      <section className="mt-8">
        <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Última transposição</h2>
        {last ? (
          <button onClick={() => { setSession({ notes: last.original, from: last.from, to: last.to }); navigate({ to: "/resultado" }); }}
            className="glass mt-3 w-full rounded-2xl p-4 text-left transition active:scale-[0.98]">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1 font-medium">{getInstrument(last.from).key} <ArrowRight className="h-3 w-3" /> {getInstrument(last.to).key} · {getInstrument(last.to).short}</span>
              <span>{relativeTime(last.ts)}</span>
            </div>
            <div className="mt-2 truncate font-display text-lg font-semibold text-success">{last.result.join("  ")}</div>
            <div className="truncate text-xs text-muted-foreground">Original: {last.original.join(" ")}</div>
          </button>
        ) : (
          <div className="mt-3 rounded-2xl border border-dashed border-border p-5 text-center text-sm text-muted-foreground">Suas transposições aparecerão aqui.</div>
        )}
      </section>

      {preview && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/70 p-4 backdrop-blur-md sm:items-center animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-5 shadow-layer animate-in slide-in-from-bottom-6">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-primary/40 bg-primary/10 px-2.5 py-1 text-xs font-bold tracking-wider text-primary">
                <Sparkles className="h-3.5 w-3.5" /> PRO · IA
              </span>
              <button onClick={() => setPreview(null)} aria-label="Fechar" className="rounded-full p-2 hover:bg-muted"><X className="h-5 w-5" /></button>
            </div>
            <img src={preview} alt="Partitura enviada" className="mt-4 max-h-64 w-full rounded-xl border border-border bg-muted object-contain" />
            <h2 className="mt-4 text-lg font-semibold">Em breve: Reconhecimento óptico de partituras (OMR) em tempo real</h2>
            <p className="mt-1 text-sm text-muted-foreground">Por enquanto, digite as notas manualmente.</p>
            <Link to="/teclado" className="mt-4 block rounded-xl bg-gold py-3.5 text-center font-semibold text-primary-foreground shadow-glow">Entrada Manual de Notas</Link>
          </div>
        </div>
      )}
    </main>
  );
}
