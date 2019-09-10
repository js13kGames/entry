const del = require('del');
const fs = require('fs');
const { src, dest, parallel, watch, series } = require('gulp');
const minifyCSS = require('gulp-csso');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const gulpif = require('gulp-if');
const htmlmin = require('gulp-htmlmin');
const svgmin = require('gulp-svgmin');
const inject = require('gulp-inject-string');
const gulpZip = require('gulp-zip');
const advzip = require('gulp-advzip');

const env = process.env.NODE_ENV;
const isProd = env === 'production';
const isDev = env === 'development';

function html () {
  return src('src/index.html')
    .pipe(gulpif(isProd, htmlmin({
      collapseWhitespace: true,
      removeAttributeQuotes: true,
      removeComments: true
    })))
    .pipe(dest('dist'));
}

function finalHtml () {
  return src('dist/index.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeAttributeQuotes: true,
      removeComments: true,
      minifyCSS: true,
      minifyJS: true,
      minifyURLs: true,
      removeEmptyAttributes: true,
      removeOptionalTags: true,
      useShortDoctype: true
    }))
    .pipe(dest('dist'));
}

function css () {
  return src('src/styles.css')
    .pipe(minifyCSS())
    .pipe(dest('dist'));
}

function js () {
  return src(['src/iffe-start.js', 'src/*.dep.js', 'src/*.pkg.js', 'src/index.js', 'src/iffe-end.js'], { sourcemaps: isDev })
    .pipe(concat('game.min.js'))
    .pipe(gulpif(isProd, uglify()))
    .pipe(dest('dist', { sourcemaps: isDev && '.' }));
}

function svg () {
  return src('src/assets/*.svg')
    .pipe(svgmin({
      plugins: [
        { cleanupNumericValues: { floatPrecision: 0, leadingZero: false } },
        { cleanupIDs: true },
        { cleanupAttrs: true },
        { convertPathData: true },
        { convertShapeToPath: true }
      ]
    }))
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

function injectStrings () {
  let piped = src('src/index.html')
    .pipe(inject.replace(
      '<link rel="stylesheet" href="styles.css">',
      `<style>${fs.readFileSync('dist/styles.css', 'utf8')}</style>`
    ))
    .pipe(inject.replace(
      '<script type="text/javascript" src="game.min.js"></script>',
      `<script>${fs.readFileSync('dist/game.min.js', 'utf8')}</script>`
    ));

    [
      'assets/hot-dog.svg',
      'assets/kong-back.svg',
      'assets/kong-front.svg',
      'assets/kong-right.svg',
      'assets/pizza.svg',
      'assets/kong-attack.svg',
      'assets/kong-block.svg',
      'assets/kong-disabled.svg',
      'assets/rex-attack.svg',
      'assets/rex-block.svg',
      'assets/rex-disabled.svg',
      'assets/rex-right.svg',
    ].forEach(path => {
      piped = piped.pipe(inject.replace(
        `"${path}"`, // double quotes because the uglifier makes them that way
        `svgDataURL('${fs.readFileSync('dist/' + path)}')` // ticks to avoid double quotes in SVG markup
      ));
    });

    piped
      .pipe(inject.replace(
        `svgDataURL\\('<svg width="100" height="100" fill="none" xmlns="http://www.w3.org/2000/svg">`,
        `svgDataURL100('`
      ))
      .pipe(inject.replace(
        `svgDataURL\\('<svg width="150" height="100" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url\\(#clip0\\)">`,
        `svgDataURL150('`
      ))
      .pipe(dest('dist'));
    return piped;
}

function deleteInjected () {
  return del(['./dist/*.css', './dist/*.js', './dist/assets'])
}

function zip () {
  return src('dist/**/*')
    .pipe(gulpZip('backtoskullisland.zip'))
    .pipe(advzip({ optimizationLevel: 4, iterations: 100 }))
    .pipe(dest('dist'));
}

module.exports = {
  js,
  css,
  html,
  dev: series(parallel(html, css, js, svg), dev),
  default: series(clean, parallel(html, css, js, svg), injectStrings, deleteInjected, finalHtml, zip)
};
