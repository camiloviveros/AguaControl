import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import nextPlugin from "@next/eslint-plugin-next";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: {},
});

const eslintConfig = [
  {
    plugins: {
      next: nextPlugin,
    },
  },
  ...compat.extends("next/core-web-vitals"),
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
    },
  },
];

export default eslintConfig;