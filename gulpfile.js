const { src, dest, parallel, series, watch } = require("gulp");
const browserify = require("browserify");
const source = require("vinyl-source-stream");
const tsify = require("tsify");
const watchify = require("watchify");
const fancyLog = require("fancy-log");
const buffer = require("vinyl-buffer");
const uglify = require("gulp-uglify-es").default;
const browserSync = require("browser-sync").create();
const htmlmin = require("gulp-html-minifier2");
const minifyInline = require("gulp-minify-inline");
const watchedBrowserify = watchify(
  browserify({
    basedir: ".",
    debug: true,
    entries: ["src/index.ts"],
    cache: {},
    packageCache: {}
  }).plugin(tsify)
);

function html() {
  return src("src/index.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(minifyInline())
    .pipe(dest("dist"));
}

function htmlDev() {
  return src("src/index.html").pipe(dest("dist"));
}

function js() {
  return browserify({
    basedir: ".",
    entries: ["src/index.ts"]
  })
    .plugin(tsify)
    .bundle()
    .on("error", function(error) {
      console.error(error.toString());
    })
    .pipe(source("index.js"))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(dest("dist"));
}

function jsDev() {
  return watchedBrowserify
    .bundle()
    .pipe(source("index.js"))
    .pipe(buffer())
    .pipe(dest("dist"));
}

function copyJS() {
  return src("src/*.js")
    .pipe(uglify())
    .pipe(dest("dist"));
}

function initBrowserSync() {
  browserSync.init({
    server: {
      baseDir: "./dist/"
    }
  });

  watch("src/*.ts", function(done) {
    browserSync.reload();

    done();
  });
}

exports.default = series(parallel(htmlDev, copyJS), jsDev, initBrowserSync);
exports.build = series(parallel(html, copyJS), js);

watchedBrowserify.on("update", jsDev);
watchedBrowserify.on("log", fancyLog);
