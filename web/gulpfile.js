'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
var cssimport = require('gulp-cssimport');
var inlineSource = require('gulp-inline-source');
var eslint = require('gulp-eslint');
const stylelint = require('gulp-stylelint');
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
    .pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
    .pipe(cssimport())
    .pipe(gulp.dest('./static/build'));
});

gulp.task('watch:css', function() {
  gulp.watch('./src/**/*.scss', ['build:css']);
});

gulp.task('lint:css', () => gulp.src('src/**/*.scss')
  .pipe(stylelint({
    failAfterError: true,
    reporters: [{ formatter: 'string', console: true }],
  })));

// not currently used
gulp.task('build:html', function() {
  return gulp.src('./static/index.html')
    .pipe(inlineSource())
    .pipe(gulp.dest('./static/build'))
});


gulp.task('build', ['build:js', 'build:css']);

gulp.task('watch', ['watch:js', 'watch:css']);

gulp.task('lint', ['lint:js', 'lint:css']);

gulp.task('hot', ['hot:js', 'watch:css']);

gulp.task('default', ['watch']);
