import { terser } from "rollup-plugin-terser"

const { DEBUG = false, MINIFY = false } = process.env

export default {
  input: "./src/js/index.js",
  output: {
    format: "iife",
    file: "./dist/game.js",
    sourcemap: DEBUG,
    freeze: DEBUG,
    indent: DEBUG ? "  " : false,
    preferConst: true,
    strict: false,
  },
  plugins: [
    MINIFY &&
      terser({
        ecma: 9,
        module: true,
        toplevel: true,
        compress: {
          keep_fargs: false,
          passes: 5,
          pure_funcs: ["assert", "debug"],
          pure_getters: true,
          unsafe: true,
          unsafe_arrows: true,
          unsafe_comps: true,
          unsafe_math: true,
          unsafe_methods: true,
        },
        mangle: {
          properties: true,
        },
      }),
  ],
}