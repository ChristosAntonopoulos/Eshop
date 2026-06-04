import { copyFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "docs", "openapi.yaml");
const target = join(root, "public", "openapi.yaml");

copyFileSync(source, target);
console.log(`Copied ${source} → ${target}`);
