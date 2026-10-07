import { existsSync } from "node:fs";
import { join } from "node:path";
import {
  assertPerformanceBudgets,
  measurePerformanceBudgets,
} from "../src/lib/performance/performance-budgets";

const candidates = ["dist/client", "dist", ".output/public"];
const clientDirectory = candidates.find((path) => existsSync(path));

if (!clientDirectory) {
  throw new Error(
    `No client build output found. Expected one of: ${candidates.join(", ")}`,
  );
}

const result = measurePerformanceBudgets(clientDirectory);
console.log(
  JSON.stringify({
    directory: join(process.cwd(), clientDirectory),
    ...result,
  }),
);
assertPerformanceBudgets(result);
