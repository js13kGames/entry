const gulp = require("gulp");
const clean = require("gulp-clean");
const imagemin = require("gulp-imagemin");
const jsonMinify = require("gulp-json-minify");
const minifyHTML = require("gulp-minify-html");
const minifyCSS = require("gulp-clean-css");
const express = require("express");
const path = require("path");
const concat = require("gulp-concat");
const sourcemaps = require("gulp-sourcemaps");
const preprocess = require("gulp-preprocess");
const terser = require("gulp-terser");
const ts = require("gulp-typescript");
const project = ts.createProject("./tsconfig.json");

function handleError(err) {
  console.log(err);
  console.log(err.toString());
  this.emit("end");
}

const devBuild =
  (process.env.NODE_ENV || "development").trim().toLowerCase() ===
  "development";

let settings;
if (devBuild) {
  settings = {
    DEBUG: true,
    dest: "./build/debug",
    lib: "./build/lib",
    res: "./build/debug"
  };
} else {
  settings = {
    dest: "./build/release",
    lib: "./build/lib",
    res: "./dist/inlined"
  };
}

function buildHtml() {
  return gulp
    .src("./src/html/index.html")
    .pipe(minifyHTML())
    .pipe(gulp.dest(settings.dest));
}

function buildCss() {
  return gulp
    .src("./src/css/style.css")
    .pipe(minifyCSS())
    .pipe(gulp.dest(settings.dest));
}

function cleanPng() {
  return gulp
    .src([`${settings.res}/*.png`, `${settings.dest}/*.png`], {
      read: false
    })
    .pipe(clean());
}
function buildPng() {
  return gulp
    .src("src/res/*.png")
    .pipe(imagemin([imagemin.optipng({ optimizationLevel: 7 })]))
    .pipe(gulp.dest(settings.dest))
    .pipe(gulp.dest(settings.res));
}

function cleanJson() {
  return gulp
    .src([`${settings.res}/*.json`, `${settings.dest}/*.json`], {
      read: false
    })
    .pipe(clean());
}

function buildJson() {
  return gulp
    .src("src/res/*.json")
    .pipe(jsonMinify())
    .pipe(gulp.dest(settings.dest))
    .pipe(gulp.dest(settings.res));
}

function compile() {
  let stream = project.src();
  stream = stream.pipe(project()).on("error", handleError);
  stream = stream.js.pipe(preprocess({ context: settings }));
  return stream.pipe(gulp.dest(settings.dest));
}

function compileLib() {
  return gulp
    .src(["./src/lib/*.js"])
    .pipe(concat("lib.js"))
    .pipe(gulp.dest(settings.lib));
}

function concatJs() {
  return (
    gulp
      .src([`${settings.lib}/lib.js`, `${settings.dest}/*.js`])
      .pipe(concat("game.js"))
      .pipe(
        terser({
          compress: {
            passes: 10
          },
          toplevel: true,
          mangle: {
            properties: {
              keep_quoted: true,
              regex: /^_.*/
            }
          }
        })
      )
      .pipe(gulp.dest(settings.dest))
  );
}

function serve() {
  var htdocs = path.resolve(__dirname, settings.dest);
  var app = express();

  app.use(express.static(htdocs));
  app.listen(1234, function() {
    console.log("Server started on http://localhost:1234");
  });
}

function watch() {
  gulp.watch(["./src/res/*.png"], gulp.series(cleanPng, buildPng));
  gulp.watch(["./src/res/*.json"], gulp.series(cleanJson, buildJson));
  gulp.watch(["./src/html/*.html"], buildHtml);
  gulp.watch(["./src/css/*.css"], buildCss);
  gulp.watch(["./src/ts/**/*.ts"], gulp.series(compile, concatJs));
  gulp.watch(["./src/lib/**/*.js"], gulp.series(compileLib, concatJs));
}

exports.serve = gulp.series(
  gulp.parallel(
    gulp.series(cleanPng, buildPng),
    gulp.series(cleanJson, buildJson),
    buildHtml,
    buildCss,
    gulp.series(gulp.parallel(compile, compileLib), concatJs)
  ),
  gulp.parallel(watch, serve)
);

exports.build = gulp.parallel(
  gulp.series(cleanPng, buildPng),
  gulp.series(cleanJson, buildJson),
  buildHtml,
  buildCss,
  gulp.series(gulp.parallel(compile, compileLib), concatJs)
);
