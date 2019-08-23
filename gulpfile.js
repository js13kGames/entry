const { src, dest, parallel, watch } = require('gulp');
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
    .pipe(dest('dist', { sourcemaps: isDev && '.' }));
}

function dev () {
  watch('src/*.css', css);
  watch('src/*.js', js);
  watch('src/*.html', html);
}

// TODO:
// - minify (ensure dead code elimination)
// - uglify
// - zip


module.exports = {
  js,
  css,
  html,
  dev,
  default: parallel(html, css, js)
};
