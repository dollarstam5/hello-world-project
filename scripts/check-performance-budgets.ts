import { statSync } from "node:fs";
import { join } from "node:path";
import { assertPerformanceBudgets } from "../src/lib/performance/performance-budget-policy";
import { measurePerformanceBudgets } from "./performance-budget-measurement";

const candidates = ["dist/client", "dist", ".output/public"];
const clientDirectory = candidates.find((path) => {
  try {
    return statSync(path).isDirectory();
  } catch {
    return false;
  }
});

if (!clientDirectory) {
  throw new Error("No client build output found. Expected one of: " + candidates.join(", "));
}

const result = measurePerformanceBudgets(clientDirectory);
console.log(
  JSON.stringify({
    directory: join(process.cwd(), clientDirectory),
    compression: "gzip level 9",
    aggregation: "maximum per HTML entry page (not sum across routes)",
    ...result,
  }),
);
assertPerformanceBudgets(result);
