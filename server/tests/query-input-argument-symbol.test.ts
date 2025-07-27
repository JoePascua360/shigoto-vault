import { expect, test } from "vitest";
import { queryInputArgumentSymbol } from "~/utils/query-input-argument-symbol";

test("Returns any number of postgres input symbol according to given length", () => {
  expect(queryInputArgumentSymbol(2, 10, 1)).toBe(
    "($1, $2, $3, $4, $5, $6, $7, $8, $9, $10), ($11, $12, $13, $14, $15, $16, $17, $18, $19, $20)"
  );
  expect(queryInputArgumentSymbol(2, 2, 5)).toBe("($5, $6), ($7, $8)");
});
