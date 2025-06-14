import { expect, test } from "vitest";
import { sum } from "@/utils/sum";

// sample test for husky (replace once done)
test("adds 9 + 1 to equal 10", () => {
  expect(sum(1)).toBe(10);
});

test("multiple by 2 would be equal to 20", () => {
  expect(2 * sum(1)).toBe(20);
});
