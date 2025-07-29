import globals from "globals"
import pluginJs from "@eslint/js"
import tseslint from "typescript-eslint"
import eslintConfigPrettier from "eslint-config-prettier"
import prettier from "eslint-plugin-prettier"

/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        files: ["**/*.{js,mjs,cjs,ts}"],
        languageOptions: {
            globals: { ...globals.node }, // For Node.js environment
        },
        plugins: {
            prettier: prettier,
        },
        rules: {
            "prettier/prettier": "error", // Enforce Prettier formatting
            // Add other ESLint rules as needed
        },
        ignores: ["node_modules/", "dist/", "**/*.json"], // Ignore build and dependency folders
    },
    pluginJs.configs.recommended, // Recommended JS rules
    ...tseslint.configs.recommended, // Recommended TypeScript rules
    eslintConfigPrettier, // Disable ESLint rules that conflict with Prettier
]
