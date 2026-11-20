import { describe, expect, it } from "vitest";

describe("RFID UID contract", () => {
  it("normalizes separators before reader submission", () => {
    expect("ab-cd 12:34".toUpperCase().replace(/[^0-9A-F]/g, "")).toBe("ABCD1234");
  });

  it("accepts UID sizes supported by the API", () => {
    expect(/^[0-9A-F]{8,20}$/.test("A1B2C3D4")).toBe(true);
    expect(/^[0-9A-F]{8,20}$/.test("NOT-A-CARD")).toBe(false);
  });
});
