import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "test_*.js",
    "test_*.mjs",
    "debug_*.mjs",
    "__tests__/**",
    "*.test.tsx",
    "*.test.ts",
    "screenshots/**",
    "lint_results.txt",
  ]),
]);

export default eslintConfig;
