import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Delete, Trash2 } from "lucide-react";
import { NOTE_NAMES } from "@/lib/transpose";
import { getCurrent, setCurrent } from "@/lib/store";

export const Route = createFileRoute("/teclado")({
  head: () => ({
    meta: [
      { title: "Teclado de Notas — Transpositor Musical" },
      { name: "description", content: "Digite as notas em som real com botões grandes e acidentes." },
      { property: "og:title", content: "Teclado de Notas — Transpositor Musical" },
      { property: "og:description", content: "Digite as notas que deseja transpor." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Teclado,
});

function Teclado() {
  const [notes, setNotes] = useState<string[]>([]);
  const [pending, setPending] = useState<"#" | "b" | null>(null);
  const navigate = useNavigate();

  useEffect(() => setNotes(getCurrent()), []);
  const update = (n: string[]) => { setNotes(n); setCurrent(n); };

  const addNote = (n: string) => { update([...notes, n + (pending ?? "")]); setPending(null); };
  const accidental = (a: "#" | "b") => {
    const last = notes[notes.length - 1];
    if (last && last.length === 1) update([...notes.slice(0, -1), last + a]);
    else setPending(pending === a ? null : a);
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col px-4 py-5">
      <div className="flex items-center gap-2">
        <Link to="/" className="rounded-full p-2 hover:bg-muted" aria-label="Voltar"><ArrowLeft /></Link>
        <h1 className="text-xl font-bold">Teclado de Notas</h1>
      </div>

      <section className="mt-4 rounded-3xl border border-border bg-card p-4">
        <div className="min-h-20 break-words font-display text-2xl font-bold text-primary">
          {notes.length ? notes.join(" - ") : <span className="text-base font-normal text-muted-foreground">Toque nas notas abaixo…</span>}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button onClick={() => update([])} className="flex items-center justify-center gap-2 rounded-xl bg-secondary py-3 text-sm font-semibold"><Trash2 className="h-4 w-4" /> Limpar Tudo</button>
          <button onClick={() => update(notes.slice(0, -1))} className="flex items-center justify-center gap-2 rounded-xl bg-secondary py-3 text-sm font-semibold"><Delete className="h-4 w-4" /> Apagar Última</button>
        </div>
      </section>

      <section className="mt-5 grid grid-cols-4 gap-3">
        {Object.entries(NOTE_NAMES).map(([c, n]) => (
          <button key={c} onClick={() => addNote(c)} className="flex aspect-square flex-col items-center justify-center rounded-2xl bg-secondary active:bg-accent active:scale-95 transition">
            <span className="font-display text-3xl font-bold">{c}{pending ?? ""}</span>
            <span className="text-xs text-muted-foreground">{n}</span>
          </button>
        ))}
        {(["#", "b"] as const).map((a) => (
          <button key={a} onClick={() => accidental(a)}
            className={`col-span-2 flex flex-col items-center justify-center rounded-2xl border-2 py-3 transition active:scale-95 ${pending === a ? "border-primary bg-accent text-accent-foreground" : "border-border bg-card"}`}>
            <span className="font-display text-2xl font-bold">{a === "#" ? "♯" : "♭"}</span>
            <span className="text-xs text-muted-foreground">{a === "#" ? "Sustenido" : "Bemol"}</span>
          </button>
        ))}
      </section>
      <div className="flex-1" />
      <button disabled={!notes.length} onClick={() => navigate({ to: "/resultado" })}
        className="mt-6 rounded-2xl bg-gold py-5 font-display text-lg font-bold text-primary-foreground shadow-glow disabled:opacity-40">
        Escolher Instrumento & Transpor
      </button>
    </main>
  );
}
