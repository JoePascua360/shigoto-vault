import { expect, test } from "vitest";
import { formatPathName } from "@/utils/format-pathname";

test("remove '/' from path and remove '-' word separator", () => {
  expect(formatPathName("/job-applications")).toBe("job applications");
  expect(formatPathName("/app/job-applications")).toBe("job applications");
  expect(formatPathName("/app/path-1/path2/path-3")).toBe("path 1");
  expect(formatPathName("-test string")).toBe("test string");
  expect(formatPathName("/test")).toBe("test");
});
