const CURRENT = "tm-current-notes";
const HISTORY = "tm-history";

export type HistoryItem = { id: number; original: string[]; result: string[]; instrument: string; date: string };

export function getCurrent(): string[] {
  try { return JSON.parse(localStorage.getItem(CURRENT) || "[]"); } catch { return []; }
}
export function setCurrent(notes: string[]) {
  localStorage.setItem(CURRENT, JSON.stringify(notes));
}
export function getHistory(): HistoryItem[] {
  try { return JSON.parse(localStorage.getItem(HISTORY) || "[]"); } catch { return []; }
}
export function addHistory(item: Omit<HistoryItem, "id" | "date">) {
  const list = [{ ...item, id: Date.now(), date: new Date().toLocaleString("pt-BR") }, ...getHistory()].slice(0, 10);
  localStorage.setItem(HISTORY, JSON.stringify(list));
  return list;
}
