'use strict';

const path = require('path');
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const $ = require('gulp-load-plugins')();
const pkg = require('../package.json')
const config = require('./gulp.config.js');

const {html,style,javascript} = config;

function dev() {

  const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ];


  /**
   * html
   */
  gulp.task('html:dev', () => {
    gulp.src(html.from)
      .pipe($.plumber())
      .pipe($.fileInclude({
        prefix: '@@',
        basepath: '@file'
      }))
      .pipe(gulp.dest(config.html.to))
      .pipe(browserSync.stream())
  })

  /**
   * style
   */
  gulp.task('style:dev', () => {
    return gulp.src(style.from)
      .pipe($.plumber())
      .pipe($.sourcemaps.init())
      .pipe($.less())
      .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
      .pipe($.cssnano())
      .pipe($.sourcemaps.write('./'))
      .pipe(gulp.dest(style.to))
      .pipe(browserSync.stream())
  })


  /**
   * javascript
   */
  gulp.task('javascript:dev', () => {
    return gulp.src(javascript.from)
      .pipe($.plumber())
      .pipe($.sourcemaps.init())
      .pipe($.uglify())
      .pipe($.sourcemaps.write('.'))
      .pipe(gulp.dest(javascript.to))
      .pipe(browserSync.stream())
  })

  /**
   * plugins
   */
  gulp.task('plugins:dev',()=>{
    return gulp.src([javascript.tools,javascript.plugins])
      .pipe($.plumber())
      .pipe($.sourcemaps.init())
      .pipe($.concat('plugins.min.js'))
      .pipe($.uglify())
      .pipe($.sourcemaps.write('.'))
      .pipe(gulp.dest(javascript.to))
      .pipe(browserSync.stream())
  })

  /**
   * serve
   */
  gulp.task('serve', ['style:dev','plugins:dev','javascript:dev','html:dev'], () => {
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
