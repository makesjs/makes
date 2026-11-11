import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";

export default defineConfig([{
  files: ["lib/**/*.js", "test/**/*.{mjs,js}"],
  plugins: { js },
  extends: [js.configs.recommended],

  languageOptions: {
    globals: {
      ...globals.node,
    },

    ecmaVersion: 2022,
    sourceType: "module",
  },

  rules: {
    "no-prototype-builtins": 0,
    "preserve-caught-error": 0,
    indent: ["error", 2],
    "linebreak-style": ["error", "unix"],
    semi: ["error", "always"],
  },
}]);