import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, RotateCcw, Trash2, History } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { getHistory, removeHistory, setSession, relativeTime, type HistoryItem } from "@/lib/store";
import { getInstrument } from "@/lib/transpose";

export function useHistory() {
  const [list, setList] = useState<HistoryItem[]>([]);
  useEffect(() => {
    const load = () => setList(getHistory());
    load();
    window.addEventListener("octava-history", load);
    return () => window.removeEventListener("octava-history", load);
  }, []);
  return list;
}

export function HistoryDrawer({ children }: { children: ReactNode }) {
  const list = useHistory();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="bottom" className="max-h-[85vh] rounded-t-3xl border-border/60 bg-card/95 backdrop-blur-xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-left"><History className="h-5 w-5 text-primary" /> Histórico</SheetTitle>
        </SheetHeader>
        <div className="mt-2 overflow-y-auto px-4 pb-6">
          {list.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">Nenhuma transposição salva ainda.</p>
          ) : (
            <ul className="space-y-2">
              {list.map((h) => (
                <li key={h.id} className="rounded-2xl border border-border/60 bg-secondary/50 p-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 font-medium">
                      {getInstrument(h.from).key} <ArrowRight className="h-3 w-3" /> {getInstrument(h.to).key}
                      <span className="ml-1 font-normal">· {getInstrument(h.to).short}</span>
                    </span>
                    <span>{relativeTime(h.ts)}</span>
                  </div>
                  <div className="mt-1.5 truncate text-sm">
                    <span className="text-muted-foreground">{h.original.join(" ")}</span>
                    <span className="mx-1.5 text-muted-foreground">→</span>
                    <span className="font-semibold text-success">{h.result.join(" ")}</span>
                  </div>
                  <div className="mt-2.5 flex gap-2">
                    <button onClick={() => { setSession({ notes: h.original, from: h.from, to: h.to }); setOpen(false); navigate({ to: "/teclado" }); }}
                      className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold transition active:scale-95">
                      <RotateCcw className="h-3.5 w-3.5" /> Reutilizar
                    </button>
                    <button onClick={() => removeHistory(h.id)} aria-label="Excluir"
                      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-destructive transition active:scale-95">
                      <Trash2 className="h-3.5 w-3.5" /> Excluir
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
