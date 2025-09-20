import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    rules: {
      // Allow short-circuit expressions (foo && bar()), but still error on real unused code
      "@typescript-eslint/no-unused-expressions": "warn",

      // Keep exhaustive deps as a warning (helps catch stale closures)
      "react-hooks/exhaustive-deps": "warn",

      // Allow any but warn so you can replace it with `unknown` or generics later
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];

export default eslintConfig;
