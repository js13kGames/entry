import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";

const isProduction = process.env.NODE_ENV === "production";

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
    isProduction && terser()
  ]
};
