import type { InstrumentId } from "./transpose";

const CURRENT = "octava-session";
const HISTORY = "octava-history";

export type Session = { notes: string[]; from: InstrumentId; to: InstrumentId };
export type HistoryItem = { id: number; original: string[]; result: string[]; from: InstrumentId; to: InstrumentId; ts: number };

const DEFAULT: Session = { notes: [], from: "c", to: "eb" };

export function getSession(): Session {
  try { return { ...DEFAULT, ...JSON.parse(localStorage.getItem(CURRENT) || "{}") }; } catch { return DEFAULT; }
}
export function setSession(s: Session) {
  localStorage.setItem(CURRENT, JSON.stringify(s));
}
export function getHistory(): HistoryItem[] {
  try {
    const l = JSON.parse(localStorage.getItem(HISTORY) || "[]");
    return Array.isArray(l) ? l.filter((h) => h && h.from && h.to) : [];
  } catch { return []; }
}
function save(list: HistoryItem[]) {
  localStorage.setItem(HISTORY, JSON.stringify(list));
  window.dispatchEvent(new Event("octava-history"));
  return list;
}
export function addHistory(item: Omit<HistoryItem, "id" | "ts">) {
  return save([{ ...item, id: Date.now(), ts: Date.now() }, ...getHistory()].slice(0, 30));
}
export function removeHistory(id: number) {
  return save(getHistory().filter((h) => h.id !== id));
}

export function relativeTime(ts: number): string {
  const s = Math.round((Date.now() - ts) / 1000);
  if (s < 60) return "agora";
  const m = Math.round(s / 60);
  if (m < 60) return `há ${m} min`;
  const h = Math.round(m / 60);
  if (h < 24) return `há ${h} h`;
  const d = Math.round(h / 24);
  return d === 1 ? "ontem" : `há ${d} dias`;
}
