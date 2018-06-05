'use strict';

const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const config = require('./gulp.config.js');

const plumber = require('gulp-plumber');
const fileInclude = require('gulp-file-include');
const htmlMin = require('gulp-htmlmin');
const sourceMaps = require('gulp-sourcemaps');
const less = require('gulp-less');
const autoprefixer = require('gulp-autoprefixer');
const nano = require('gulp-cssnano');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');

const {html,style,javascript,AUTOPREFIXER_BROWSERS} = config;

//TODO 加上hash
function dev() {

  /**
   * html
   */
  gulp.task('html:dev', () => {
    gulp.src(html.from)
      .pipe(plumber())
      .pipe(fileInclude({
        prefix: '@@',
        basepath: '@file'
      }))
      .pipe(htmlMin({collapseWhitespace: true}))
      .pipe(gulp.dest(config.html.to))
      .pipe(browserSync.stream())
  })

  /**
   * style
   */
  gulp.task('style:dev', () => {
    return gulp.src(style.from)
      .pipe(plumber())
      .pipe(sourceMaps.init())
      .pipe(less())
      .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
      .pipe(nano())
      .pipe(sourceMaps.write('./'))
      .pipe(gulp.dest(style.to))
      .pipe(browserSync.stream())
  })

  /**
   * javascript
   */
  gulp.task('javascript:dev', () => {
    return gulp.src(javascript.from)
      .pipe(plumber())
      .pipe(sourceMaps.init())
      .pipe(uglify())
      .pipe(sourceMaps.write('.'))
      .pipe(gulp.dest(javascript.to))
      .pipe(browserSync.stream())
  })

  /**
   * plugins
   */
  gulp.task('plugins:dev',()=>{
    return gulp.src([javascript.tools,javascript.plugins])
      .pipe(plumber())
      .pipe(sourceMaps.init())
      .pipe(concat('plugins.min.js'))
      .pipe(uglify())
      .pipe(sourceMaps.write('.'))
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

    gulp.watch(style.watch, ['style:dev']);
    gulp.watch(html.watch,['html:dev']);
    gulp.watch([javascript.tools,javascript.plugins],['plugins:dev']);
    gulp.watch(javascript.watch,['javascript:dev']);
  })
}

module.exports = dev;
