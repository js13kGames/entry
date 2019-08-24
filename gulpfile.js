const { src, dest, parallel, watch, series } = require('gulp');
const minifyCSS = require('gulp-csso');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const gulpif = require('gulp-if');
const htmlmin = require('gulp-htmlmin');
const zip = require('gulp-zip');

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
  return src(['src/*.pkg.js', 'src/index.js'], { sourcemaps: isDev })
    .pipe(concat('game.min.js'))
    .pipe(gulpif(isProd, uglify()))
    .pipe(dest('dist', { sourcemaps: isDev && '.' }));
}

function dev () {
  watch('src/*.css', css);
  watch('src/*.js', js);
  watch('src/*.html', html);
}

function z () {
  return src('dist/*')
    .pipe(zip('backtoskullisland.zip'))
    .pipe(dest('dist'));
}

module.exports = {
  js,
  css,
  html,
  dev,
  default: series( parallel(html, css, js), z )
};
