'use strict';

const gulp = require('gulp');
const config = require('./gulp.config.js');

const fileInclude = require('gulp-file-include');
const htmlMin = require('gulp-htmlmin');
const less = require('gulp-less');
const autoprefixer = require('gulp-autoprefixer');
const nano = require('gulp-cssnano');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');

const {html,style,javascript,AUTOPREFIXER_BROWSERS} = config;
const UGLIFY_OPTION = {compress:{drop_console:true}}
function pro () {
  /**
   * html
   */
  gulp.task('html:pro', () => {
    gulp.src(html.from)
      .pipe(fileInclude({
        prefix: '@@',
        basepath: '@file'
      }))
      .pipe(htmlMin({collapseWhitespace: true}))
      .pipe(gulp.dest(config.html.to))
  })

  /**
   * style
   */
  gulp.task('style:pro', () => {
    return gulp.src(style.from)
      .pipe(less())
      .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
      .pipe(nano())
      .pipe(gulp.dest(style.to))
  })

  /**
   * javascript
   */
  gulp.task('javascript:pro', () => {
    return gulp.src(javascript.from)
      .pipe(uglify(UGLIFY_OPTION))
      .pipe(gulp.dest(javascript.to))
  })

  /**
   * plugins
   */
  gulp.task('plugins:pro',()=>{
    return gulp.src([javascript.tools,javascript.plugins])
      .pipe(concat('plugins.min.js'))
      .pipe(uglify(UGLIFY_OPTION))
      .pipe(gulp.dest(javascript.to))
  })

  gulp.task('produce',['html:pro','style:pro','javascript:pro','plugins:pro'],()=>{
    console.log('now every things is fine');
  })
}

module.exports = pro;
