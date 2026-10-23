import { describe, it, expect } from "vitest";
import { transposeNote } from "./transpose";

describe("transposição", () => {
  it("Bb: +2 semitons", () => {
    expect(["C", "G", "F"].map((n) => transposeNote(n, 2))).toEqual(["D", "A", "G"]);
  });
  it("Eb: +9 semitons", () => {
    expect(["C", "F", "G"].map((n) => transposeNote(n, 9))).toEqual(["A", "D", "E"]);
  });
  it("F: +7 semitons", () => {
    expect(["C", "F"].map((n) => transposeNote(n, 7))).toEqual(["G", "C"]);
  });
  it("C: mantém", () => {
    expect(transposeNote("E", 0)).toBe("E");
  });
  it("acidentes", () => {
    expect(transposeNote("Bb", 2)).toBe("C");
    expect(transposeNote("F#", 2)).toBe("G#");
  });
});
