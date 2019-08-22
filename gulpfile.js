const { src, dest, parallel } = require('gulp');
const minifyCSS = require('gulp-csso');
const concat = require('gulp-concat');

const env = process.env.NODE_ENV;
const isProd = env === 'production';
const isDev = env === 'development';

function html () {
  return src('src/index.html')
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
    .pipe(dest('dist', { sourcemaps: isDev }));
}

// TODO:
// - minify (ensure dead code elimination)
// - uglify
// - zip

module.exports = {
  js,
  css,
  html,
  default: parallel(html, css, js)
};
