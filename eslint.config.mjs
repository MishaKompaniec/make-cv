import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import importPlugin from "eslint-plugin-import";
import promisePlugin from "eslint-plugin-promise";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unicorn from "eslint-plugin-unicorn";

export default defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    plugins: {
      "simple-import-sort": simpleImportSort,
      import: importPlugin,
      unicorn,
      promise: promisePlugin,
    },

    rules: {
      /* ================= IMPORTS ================= */
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      "import/no-duplicates": "error",
      "import/no-self-import": "error",
      "import/no-cycle": ["warn", { maxDepth: 2 }],
      "import/no-useless-path-segments": "error",

      /* ================= CODE QUALITY ================= */
      "unicorn/prefer-node-protocol": "error",
      "unicorn/prefer-logical-operator-over-ternary": "warn",
      "unicorn/prevent-abbreviations": "off",
      "unicorn/no-null": "off",

      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",

      /* ================= PROMISES ================= */
      "promise/no-return-wrap": "error",
      "promise/no-nesting": "warn",
      "promise/catch-or-return": "warn",

      /* ================= NEXT ================= */
      "@next/next/no-img-element": "warn",
      "@next/next/no-html-link-for-pages": "error",
      "@next/next/google-font-display": "error",
    },
  },

  globalIgnores([".next/**", "out/**", "build/**", "dist/**", "next-env.d.ts"]),
]);
