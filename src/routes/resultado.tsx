import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Copy, RotateCcw, Check } from "lucide-react";
import { INSTRUMENTS, transposeNotes, type InstrumentId } from "@/lib/transpose";
import { addHistory, getCurrent, getHistory, setCurrent, type HistoryItem } from "@/lib/store";

export const Route = createFileRoute("/resultado")({
  head: () => ({
    meta: [
      { title: "Instrumento e Resultado — Transpositor Musical" },
      { name: "description", content: "Escolha seu instrumento e veja as notas transpostas na hora." },
      { property: "og:title", content: "Instrumento e Resultado — Transpositor Musical" },
      { property: "og:description", content: "Notas transpostas para Eb, Bb, F ou C." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Resultado,
});

function Resultado() {
  const [notes, setNotes] = useState<string[]>([]);
  const [sel, setSel] = useState<InstrumentId | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { setNotes(getCurrent()); setHistory(getHistory()); }, []);

  const inst = INSTRUMENTS.find((i) => i.id === sel);
  const result = inst ? transposeNotes(notes, inst.offset) : [];

  const choose = (id: InstrumentId) => {
    setSel(id);
    const i = INSTRUMENTS.find((x) => x.id === id)!;
    if (notes.length) setHistory(addHistory({ original: notes, result: transposeNotes(notes, i.offset), instrument: i.label }));
  };

  const copy = async () => {
    await navigator.clipboard.writeText(result.join(" - "));
    setCopied(true); setTimeout(() => setCopied(false), 1500);
  };

  return (
    <main className="mx-auto min-h-screen max-w-md px-4 py-5">
      <div className="flex items-center gap-2">
        <Link to="/teclado" className="rounded-full p-2 hover:bg-muted" aria-label="Voltar"><ArrowLeft /></Link>
        <h1 className="text-xl font-bold">Escolha o Instrumento</h1>
      </div>

      <section className="mt-4 grid grid-cols-2 gap-3">
        {INSTRUMENTS.map((i) => (
          <button key={i.id} onClick={() => choose(i.id)}
            className={`flex flex-col items-start rounded-2xl border-2 p-4 text-left transition active:scale-95 ${sel === i.id ? "border-primary bg-accent shadow-glow" : "border-border bg-card"}`}>
            <span className="text-3xl">{i.icon}</span>
            <span className="mt-2 text-sm font-bold leading-tight">{i.label}</span>
            <span className="mt-1 text-xs text-primary">{i.tuning}</span>
          </button>
        ))}
      </section>

      {inst && (
        <section className="mt-5 rounded-3xl border border-primary/40 bg-card p-5 animate-in fade-in">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Som real (Dó)</div>
          <div className="mt-1 font-display text-xl">{notes.join(" - ")}</div>
          <div className="mt-4 text-xs uppercase tracking-widest text-primary">Para {inst.tuning}</div>
          <div className="mt-1 font-display text-3xl font-bold text-success">{result.join(" - ")}</div>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <button onClick={copy} className="flex items-center justify-center gap-2 rounded-xl bg-gold py-4 font-bold text-primary-foreground">
              {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />} {copied ? "Copiado!" : "Copiar Notas"}
            </button>
            <button onClick={() => { setCurrent([]); navigate({ to: "/teclado" }); }} className="flex items-center justify-center gap-2 rounded-xl bg-secondary py-4 font-bold">
              <RotateCcw className="h-5 w-5" /> Nova Transposição
            </button>
          </div>
        </section>
      )}

      {history.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Histórico</h2>
          <ul className="mt-3 space-y-2">
            {history.map((h) => (
              <li key={h.id} className="rounded-2xl bg-card p-3 text-sm">
                <div className="text-xs text-muted-foreground">{h.instrument} · {h.date}</div>
                <div className="mt-1">{h.original.join(" ")} → <span className="font-bold text-primary">{h.result.join(" ")}</span></div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
