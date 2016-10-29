'use strict';

let gulp = require('gulp');
let pug = require('gulp-pug');
let sass = require('gulp-sass');
let babel = require('gulp-babel');
let browserSync = require('browser-sync').create();

// Default config
let config = {
  'env': 'dev',
  'name': 'evil-app',
  'index': '/code/index.pug',
  'partials': '/code/ui/partials/*.pug',
  'styles': '/code/ui/*.sass',
  'scripts': '/code/ui/*.js'
};

// Tasks
gulp.task('build', ['index', 'partials', 'styles', 'scripts']);

gulp.task('serve', ['index', 'partials', 'styles', 'scripts'], () => {
  browserSync.init({
    server: {
      baseDir: [
        '/dist',
        `/usr/local/lib/node_modules/${config.name}`,
        '/code'],
      index: 'index.html' },
    host: '0.0.0.0',
    port: 8080,
    notify: false });

  gulp.watch(config.index, ['index']);
  gulp.watch(config.partials, ['partials']);
  gulp.watch(config.styles, ['styles']);
  gulp.watch(config.scripts, ['scripts']);
});

gulp.task('index', () => {
  return gulp.src(config.index)
    .pipe(pug({pretty: true}))
    .pipe(gulp.dest('/dist'))
    .pipe(browserSync.stream());
});

gulp.task('partials', () => {
  return gulp.src(config.partials)
    .pipe(pug({pretty: true}))
    .pipe(gulp.dest('/dist/partials'))
    .pipe(browserSync.stream());
});

gulp.task('styles', () => {
  return gulp.src(config.styles)
    .pipe(sass({outputStyle: 'nested'}).on('error', sass.logError))
    .pipe(gulp.dest('/dist/ui'))
    .pipe(browserSync.stream());
});

gulp.task('scripts', () => {
  return gulp.src(config.scripts)
    .pipe(babel({presets: ['latest'], minified: false}))
    .pipe(gulp.dest('/dist/ui'))
    .pipe(browserSync.stream());
});

gulp.task('default', ['serve']);
