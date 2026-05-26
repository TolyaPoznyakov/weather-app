import js from "@eslint/js"
import vue from "eslint-plugin-vue"
import prettier from "eslint-config-prettier"
import globals from "globals"

export default [
  js.configs.recommended,
  ...vue.configs["flat/recommended"],
  prettier,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    rules: {
      "no-console": "warn",
      "no-debugger": "warn",
      "no-unused-vars": "warn",
      "vue/multi-word-component-names": "off",
    },
  },
]
