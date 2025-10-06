import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

/**
 * Returns CLI version read at runtime from the project's package.json.
 * Works both from src/ and from dist/ (CJS/ESM).
 */
export function getVersion(): string {
  const candidates = [
    // dist/helpers -> project/package.json
    path.resolve(__dirname, "..", "..", "package.json"),
    // dist/ -> (in case helper ends up there)
    path.resolve(__dirname, "..", "package.json"),
    // fallback: current working dir (useful in tests)
    path.resolve(process.cwd(), "package.json"),
  ];

  for (const p of candidates) {
    if (existsSync(p)) {
      const raw = readFileSync(p, "utf8");
      const pkg = JSON.parse(raw);
      return String(pkg.version ?? "");
    }
  }

  throw new Error(`package.json not found in: ${candidates.join(" | ")}`);
}
