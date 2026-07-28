import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import storybook from "eslint-plugin-storybook";
import prettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";
import { globalIgnores } from "eslint/config";
import globals from "globals";

export default tseslint.config([
  globalIgnores(["dist", "storybook-static", "coverage"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [js.configs.recommended, tseslint.configs.recommended, prettier],
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: reactHooks.configs["recommended-latest"].rules,
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
    },
  },
  ...storybook.configs["flat/recommended"],
]);
