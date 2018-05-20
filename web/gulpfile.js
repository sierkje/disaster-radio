'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
var cssimport = require('gulp-cssimport');
var inlineSource = require('gulp-inline-source');
var eslint = require('gulp-eslint');
var js = require('./bin/build.js');

gulp.task('build:js', js.build);

gulp.task('watch:js', js.watch);

gulp.task('lint:js', () => gulp.src(['./src/**/*.js', './bin/**/*.js'])
  .pipe(eslint())
  .pipe(eslint.format()));

// with hot module reloading
gulp.task('hot:js', js.hot);

gulp.task('build:css', function() {
  return gulp.src('./src/styles.scss')
    .pipe(sassGlob())
    .pipe(sass().on('error', sass.logError))
    .pipe(cssimport())
    .pipe(gulp.dest('./static/build'));
});

gulp.task('watch:css', function() {
  gulp.watch('./src/**/*.scss', ['build:css']);
});

// not currently used
gulp.task('build:html', function() {
  return gulp.src('./static/index.html')
    .pipe(inlineSource())
    .pipe(gulp.dest('./static/build'))
});


gulp.task('build', ['build:js', 'build:css']);

gulp.task('watch', ['watch:js', 'watch:css']);

gulp.task('lint', ['lint:js']);

gulp.task('hot', ['hot:js', 'watch:css']);

gulp.task('default', ['watch']);
