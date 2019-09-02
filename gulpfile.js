'use strict';

const path = require('path'),
  gulp = require('gulp'),
  fs = require('fs-extra'),
  mustache = require('gulp-mustache'),
  gulpSequence = require('gulp-sequence'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  sass = require('gulp-sass'),
  zip = require('gulp-zip'),
  size = require('gulp-size'),
  micro = require('gulp-micro'),
  htmlmin = require('gulp-htmlmin'),
  express = require('express'),
  del = require('del'),
  Q = require('q');

const appBuildPath = './app.build.json';

let appBuild = null;

  
function renderTemplate(templateSettings, valuesObj) {
  var combinedObj = Object.assign({}, valuesObj, templateSettings.extraSettings);
  var stream = gulp.src(templateSettings.from)
    .pipe(mustache(combinedObj))
    .pipe(rename(path.basename(templateSettings.to)))
    .pipe(gulp.dest(path.dirname(templateSettings.to)));
  console.log('rendering ' + templateSettings.to);
  return stream;
}

function getAppBuild() {
  return fs.readJsonSync(appBuildPath);
}

function reloadSettings() {
  appBuild = getAppBuild();
}

reloadSettings();

gulp.task('concat-js', () => {
  return gulp.src(appBuild.concat.js.files)
    .pipe(concat(path.basename(appBuild.concat.js.output)))
    .pipe(gulp.dest(path.dirname(appBuild.concat.js.output)));
});

gulp.task('wrap-js', ['concat-js'], () => {
  const content = fs.readFileSync(appBuild.wrap.from, 'utf8');
  return gulp.src(appBuild.wrap.wrapper)
    .pipe(mustache({ content: content, gameSettings: JSON.stringify(appBuild.game) }))
    .pipe(rename(path.basename(appBuild.wrap.to)))
    .pipe(gulp.dest(path.dirname(appBuild.wrap.to)));
});

gulp.task('minify-js', ['wrap-js'], () => {
  return gulp.src(appBuild.minify.js.from)
    .pipe(uglify(appBuild.minify.js.options))
    .pipe(rename(path.basename(appBuild.minify.js.to)))
    .pipe(gulp.dest(path.dirname(appBuild.minify.js.to)));
});

gulp.task('sass-css', () => {
  return gulp.src(appBuild.sass.from)
    .pipe(sass(appBuild.sass.options))
    .pipe(rename(path.basename(appBuild.sass.to)))
    .pipe(gulp.dest(path.dirname(appBuild.sass.to)));
});

gulp.task('render-html-dev', () => {
  return renderTemplate(appBuild.templates.indexHtmlDev, appBuild);
});

gulp.task('render-html', () => {
  return renderTemplate(appBuild.templates.indexHtml, appBuild);
});

gulp.task('minify-html', ['render-html'], () => {
  return gulp.src(appBuild.minify.html.from)
    .pipe(htmlmin(appBuild.minify.html.options))
    .pipe(rename(path.basename(appBuild.minify.html.to)))
    .pipe(gulp.dest(path.dirname(appBuild.minify.html.to)));
});

gulp.task('build-js-dev', ['wrap-js']);
gulp.task('build-js', ['minify-js']);

gulp.task('build-html-dev', ['render-html-dev']);
gulp.task('build-html', ['minify-html']);

gulp.task('build-css', ['sass-css']);

gulp.task('static-export', ['build-js', 'build-html', 'build-css'], () => {
  del.sync('build');
  const promises = [];
  appBuild.export.files.forEach((file) => {
    const deferred = Q.defer();
    gulp.src(file.from)
      .pipe(gulp.dest(path.join(appBuild.export.path, file.to)))
      .on('end', ()=>deferred.resolve());
    promises.push(deferred.promise);
  });
  return Q.all(promises);
});

gulp.task('build-dev', ['build-js-dev', 'build-html-dev', 'build-css']);
gulp.task('build', ['static-export']);

gulp.task('dev', ['build-dev'], (cb) => {
  const app = express();
  
  app.use('/c.css', express.static('src/style/c.css'));
  app.use('/bundle-wrap.js', express.static('src/js/bundle-wrap.js'));
  
  app.get('/', function (req, resp) {
    resp.set('Content-Type', 'text/html');
    resp.send(fs.readFileSync('src/views/dev.html'));
  });
  
  app.listen(8080, () => {
    console.log('Listening to 8080...');
  });
});

gulp.task('prod', ['build'], (cb) => {
  const app = express();
  
  app.use('/c.css', express.static('build/c.css'));
  app.use('/b.js', express.static('build/b.js'));
  
  app.get('/', function (req, resp) {
    resp.set('Content-Type', 'text/html');
    resp.send(fs.readFileSync('build/index.html'));
  });
  
  app.listen(8080, () => {
    console.log('Listening to 8080...');
  });
});

gulp.task('dist', ['build'], () => {
  return gulp.src('build/*')
    .pipe(zip('archive.zip'))
    .pipe(size())
    .pipe(micro({ limit: 13 * 1024 }))
    .pipe(gulp.dest('dist'));
});
