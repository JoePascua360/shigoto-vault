import { expectTypeOf, test } from "vitest";
import { GlobalConfigs } from "~/config/global-config";
import { envChecker } from "~/utils/env-checker";

test("checks if the returned value is a string for environment variables. Will fail if not.", () => {
  const keysArray = Object.keys(GlobalConfigs.dbConfig);

  for (const key of keysArray) {
    expectTypeOf({ env: envChecker(key) }).toEqualTypeOf<{
      env: string;
    }>();
  }
});
