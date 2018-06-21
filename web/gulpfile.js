'use strict';

var gulp = require('gulp');
const rename = require('gulp-rename');
var sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob')
const autoprefixer = require('gulp-autoprefixer')
var cssimport = require('gulp-cssimport');
var inlineSource = require('gulp-inline-source');
var js = require('./bin/build.js');

gulp.task('build:js', js.build);

gulp.task('watch:js', js.watch);

// with hot module reloading
gulp.task('hot:js', js.hot);

gulp.task('build:css', function() {
  return gulp.src('./src/core/index.scss')
    .pipe(sassGlob())
    .pipe(sass().on('error', sass.logError))
    .pipe(cssimport())
    .pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
    .pipe(rename('disaster.radio.css'))
    .pipe(gulp.dest('./static/assets/'));
});

gulp.task('watch:css', function() {
  gulp.watch('./src/css/**/*.scss', ['build:css']);
});

gulp.task('build:html', function() {
  return gulp.src('./src/core/index.html')
    .pipe(inlineSource())
    .pipe(gulp.dest('./static/'))
});


gulp.task('build', ['build:html', 'build:js', 'build:css']);

gulp.task('watch', ['watch:js', 'watch:css']);

gulp.task('hot', ['hot:js', 'watch:css']);
