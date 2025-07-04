import { showToast } from "@/utils/show-toast";
import { expect, test } from "vitest";

test("showtoast test", () => {
  const testObject = {
    label: "Test Label",
    onClick: () => {
      console.log(" Test Function");
    },
  };

  expect(showToast("success", "Success")).toBe(1);
  expect(showToast("error", "Error", testObject)).toBe(2);
});
