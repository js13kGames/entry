import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import linaria from 'linaria/rollup';
import css from 'rollup-plugin-css-only';

const isProduction = process.env.NODE_ENV === "production";
console.log(process.env.NODE_ENV)

export default {
  input: "src/index.tsx",
  output: {
    file: (isProduction ? "build/index.js" : "src/index.js"),
    format: "iife",
    sourcemap: !isProduction
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      typescript: require("typescript")
    }),
    linaria({
      sourceMap: !isProduction
    }),
    css({
      output: (isProduction ? "build/styles.css" : "src/styles.css"),
    }),
    isProduction && terser()
  ]
};
