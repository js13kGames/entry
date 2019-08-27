const concat = require("gulp-concat");
const del = require("del");
const checkFileSize = require("gulp-check-filesize");
const gulp = require("gulp");
const minifyCSS = require("gulp-clean-css");
const minifyHTML = require("gulp-htmlmin");
const minifyJS = require("gulp-terser");
const replaceHTML = require("gulp-html-replace");
const zip = require("gulp-zip");

const paths = {
  src: {
    css: "css/*.css",
    html: "*.html",
    js: "js/*.js",
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
    .pipe(concat(paths.dist.js))
    .pipe(minifyJS())
    .pipe(gulp.dest(paths.dist.dir));
}

function copyModels() {
  return gulp.src(paths.src.models)
    .pipe(gulp.dest(paths.dist.models));
}

function makeZip() {
  const thirteenKb = 13 * 1024;

  return gulp.src(`${paths.dist.dir}/**`)
    .pipe(zip(paths.zip))
    .pipe(gulp.dest("."))
    .pipe(checkFileSize({ fileSizeLimit: thirteenKb }));
}

const build = gulp.series(clean, gulp.parallel(buildHTML, buildCSS, buildJS, copyModels));

exports.default = gulp.series(build, makeZip);