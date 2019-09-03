const del = require('del');
const { src, dest, parallel, watch, series } = require('gulp');
const minifyCSS = require('gulp-csso');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const gulpif = require('gulp-if');
const htmlmin = require('gulp-htmlmin');
const svgo = require('gulp-svgo');
const gulpZip = require('gulp-zip');

const env = process.env.NODE_ENV;
const isProd = env === 'production';
const isDev = env === 'development';

function html () {
  return src('src/index.html')
    .pipe(gulpif(isProd, htmlmin({ collapseWhitespace: true })))
    .pipe(dest('dist'));
}

function css () {
  return src('src/styles.css')
    .pipe(minifyCSS())
    .pipe(dest('dist'));
}

function js () {
  return src(['src/iffe-start.js', 'src/*.pkg.js', 'src/index.js', 'src/iffe-end.js'], { sourcemaps: isDev })
    .pipe(concat('game.min.js'))
    .pipe(gulpif(isProd, uglify()))
    .pipe(dest('dist', { sourcemaps: isDev && '.' }));
}

function svg () {
  return src('src/assets/*.svg')
    .pipe(svgo())
    .pipe(dest('dist/assets'));
}

function dev () {
  watch('src/*.css', css);
  watch('src/*.js', js);
  watch('src/*.html', html);
  watch('src/assets/*.svg', svg);
}

function clean () {
  return del('./dist/*');
}

function zip () {
  return src('dist/**/*')
    .pipe(gulpZip('backtoskullisland.zip'))
    .pipe(dest('dist'));
}

module.exports = {
  js,
  css,
  html,
  dev: series(parallel(html, css, js, svg), dev),
  default: series(clean, parallel(html, css, js, svg), zip)
};
