/* eslint-env node */

const gulp = require('gulp')
const sass = require('gulp-sass')
const sassGlob = require('gulp-sass-glob')
const autoprefixer = require('gulp-autoprefixer')
const cssimport = require('gulp-cssimport')
// const inlineSource = require('gulp-inline-source');
const eslint = require('gulp-eslint')
const stylelint = require('gulp-stylelint')
const { buildJs, watchJs, hotModuleReplacement } = require('./bin/build.js')

/**
 * CSS (scss) tasks.
 */
gulp.task('build:css', () => gulp
  .src('./src/styles.scss')
  .pipe(sassGlob())
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
  .pipe(cssimport())
  .pipe(gulp.dest('./static/build')))

gulp.task('watch:css', () => gulp.watch('./src/**/*.scss', ['build:css']))

gulp.task('lint:css', () => gulp
  .src('src/**/*.scss')
  .pipe(stylelint({
    failAfterError: true,
    reporters: [{ formatter: 'string', console: true }],
  })))

/**
 * JavaScript (js) tasks.
 */
gulp.task('build:js', buildJs)
gulp.task('watch:js', watchJs)
gulp.task('hot:js', hotModuleReplacement)
gulp.task('lint:js', () => gulp
  .src(['./src/**/*.js', './bin/**/*.js'])
  .pipe(eslint())
  .pipe(eslint.format()))

/**
 * HTML tasks.
 */
// Not currently used:
// gulp.task('build:html', () => gulp
//   .src('./static/index.html')
//   .pipe(inlineSource())
//   .pipe(gulp.dest('./static/build')));

/**
 * Grouped tasks.
 */
gulp.task('build', ['build:js', 'build:css'])
gulp.task('watch', ['watch:js', 'watch:css'])
gulp.task('hot', ['hot:js', 'watch:css'])
gulp.task('lint', ['lint:js', 'lint:css'])

/**
 * Default task.
 */
gulp.task('default', ['watch', 'lint'])
