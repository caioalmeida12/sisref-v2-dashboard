import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";

export default [
  {
    languageOptions: {
      globals: globals.browser
    },
    settings: {
      react: {
        version: "detect"
      }
    },
    files: ["**/*.ts", "**/*.tsx"],
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReactConfig,
];