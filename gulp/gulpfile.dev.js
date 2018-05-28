'use strict';

const gulp = require('gulp');
const plumber = require('gulp-plumber')
const browserSync = require('browser-sync').create();
const fileinclude = require('gulp-file-include');
const less = require('gulp-less');
const LessAutoprefix = require('less-plugin-autoprefix');
const autoprefix = new LessAutoprefix({browsers: ['IOS>7', 'last 4 ChromeAndroid versions']})
const sourcemaps = require('gulp-sourcemaps');

const config = require('./gulp.config.js');

const {html,style,javascript} = config;

function dev() {

  /**
   * html
   */
  gulp.task('html:dev', function () {
    gulp.src(html.from)
      .pipe(plumber())
      .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file'
      }))
      .pipe(gulp.dest(config.html.to))
      .pipe(browserSync.stream())
  })

  /**
   * style
   */
  gulp.task('style:dev', function () {
    return gulp.src(style.from)
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(less({
        plugins: [autoprefix]
      }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(style.to))
      .pipe(browserSync.stream())
  })


  /**
   * javascript
   */
  gulp.task('javascript:dev', function () {
    return gulp.src(javascript.from)
      .pipe(plumber())
      .pipe(gulp.dest(javascript.to))
      .pipe(browserSync.stream())
  })

  /**
   * serve
   */
  gulp.task('serve', ['style:dev','javascript:dev','html:dev'], function () {
    browserSync.init({
      server: config.root,
      notify: false,
      directory: true
    })

    gulp.watch(style.watch, ['style:dev'])
    gulp.watch(html.watch,['html:dev']);
    gulp.watch(javascript.watch,['javascript:dev']);
  })
}

gulp.task('default', ['serve']);

module.exports = dev;
