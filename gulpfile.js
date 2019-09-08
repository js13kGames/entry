const browserSync = require("browser-sync");
const concat = require("gulp-concat");
const del = require("del");
const checkFileSize = require("gulp-check-filesize");
const gulp = require("gulp");
const minifyCSS = require("gulp-clean-css");
const minifyHTML = require("gulp-htmlmin");
const minifyJS = require("gulp-terser");
const replaceHTML = require("gulp-html-replace");
const sourcemaps = require("gulp-sourcemaps");
const zip = require("gulp-zip");

const paths = {
  src: {
    css: "css/*.css",
    html: "*.html",
    js: "components/*.js",
    models: "models/*.obj"
  },
  dist: {
    dir: "dist",
    css: "style.min.css",
    js: "script.min.js",
    models: "dist/models"
  },
  zip: "game.zip"
};

const server = browserSync.create();

function clean() {
  return del(paths.dist.dir, paths.zip);
}

function buildHTML() {
  return gulp.src(paths.src.html)
    .pipe(replaceHTML({
      css: paths.dist.css,
      js: paths.dist.js
    }))
    .pipe(minifyHTML({
      collapseWhitespace: true,
      decodeEntities: true,
      removeComments: true
    }))
    .pipe(gulp.dest(paths.dist.dir));
}

function buildCSS() {
  return gulp.src(paths.src.css)
    .pipe(concat(paths.dist.css))
    .pipe(minifyCSS())
    .pipe(gulp.dest(paths.dist.dir));
}

function buildJS() {
  return gulp.src(paths.src.js)
    .pipe(sourcemaps.init())
      .pipe(concat(paths.dist.js))
      .pipe(minifyJS())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.dist.dir));
}

function copyModels() {
  return gulp.src(paths.src.models)
    .pipe(gulp.dest(paths.dist.models));
}

function makeZip() {
  const thirteenKb = 13 * 1024;

  return gulp.src([`${paths.dist.dir}/**`, "!**/*.map"])
    .pipe(zip(paths.zip))
    .pipe(gulp.dest("."))
    .pipe(checkFileSize({ fileSizeLimit: thirteenKb }));
}

function reload(done) {
  server.reload();
  done();
}

function serve(done) {
  server.init({
    server: {
      baseDir: "."
    },
    open: false,
    https: true
  });
  done();
}

function watch() {
  gulp.watch(paths.src.css, gulp.series(buildCSS, makeZip, reload));
  gulp.watch(paths.src.html, gulp.series(buildHTML, makeZip, reload));
  gulp.watch(paths.src.js, gulp.series(buildJS, makeZip, reload));
  gulp.watch(paths.src.models, gulp.series(copyModels, makeZip, reload));
}

const build = gulp.series(clean, gulp.parallel(buildHTML, buildCSS, buildJS, copyModels), makeZip);

exports.build = build;
exports.clean = clean;

exports.default = gulp.series(build, serve, watch);