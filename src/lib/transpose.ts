export const SHARPS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
export const FLATS = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

export const NOTE_NAMES: Record<string, string> = {
  C: "Dó", D: "Ré", E: "Mi", F: "Fá", G: "Sol", A: "Lá", B: "Si",
};

export type InstrumentId = "eb" | "bb" | "f" | "c";

export const INSTRUMENTS: { id: InstrumentId; label: string; tuning: string; offset: number; icon: string }[] = [
  { id: "eb", label: "Sax Alto / Sax Barítono", tuning: "Mi♭ (Eb)", offset: 9, icon: "🎷" },
  { id: "bb", label: "Sax Tenor / Trompete / Clarinete", tuning: "Si♭ (Bb)", offset: 2, icon: "🎺" },
  { id: "f", label: "Trompa", tuning: "Fá (F)", offset: 7, icon: "📯" },
  { id: "c", label: "Tuba / Flauta / Teclado / Baixo", tuning: "Dó (C) – Concerto", offset: 0, icon: "🎹" },
];

export function noteIndex(note: string): number {
  const base = "CDEFGAB".indexOf(note[0]);
  if (base < 0) throw new Error(`Nota inválida: ${note}`);
  const semis = [0, 2, 4, 5, 7, 9, 11][base];
  let acc = 0;
  for (const ch of note.slice(1)) acc += ch === "#" ? 1 : ch === "b" ? -1 : 0;
  return (((semis + acc) % 12) + 12) % 12;
}

export function transposeNote(note: string, offset: number, useFlats = note.includes("b")): string {
  const idx = (noteIndex(note) + offset) % 12;
  return (useFlats ? FLATS : SHARPS)[idx];
}

export function transposeNotes(notes: string[], offset: number): string[] {
  return notes.map((n) => transposeNote(n, offset));
}
