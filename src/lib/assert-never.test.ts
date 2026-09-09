import { describe, expect, it } from "vitest";
import { assertNever } from "./assert-never";

describe("assertNever", () => {
  it("бросает исключение", () => {
    expect(() => assertNever("неучтённый" as never)).toThrow();
  });

  it("включает в сообщение полученное значение", () => {
    expect(() => assertNever("неучтённый" as never)).toThrow("неучтённый");
  });
});
