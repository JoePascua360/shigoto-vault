import { expect, test } from "vitest";
import { formatPathName } from "@/utils/format-pathname";

test("remove '/' from path and remove '-' separator", () => {
  expect(formatPathName("/job-applications")).toBe("job applications");
  expect(formatPathName("/format-path-name")).toBe("format path name");
  expect(formatPathName("-test string")).toBe("");
  expect(formatPathName("/test")).toBe("test");
});
