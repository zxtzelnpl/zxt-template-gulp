const gulp = require('gulp');
const plumber = require('gulp-plumber')
const browserSync = require('browser-sync').create();
const less = require('gulp-less');
const LessAutoprefix = require('less-plugin-autoprefix');
const autoprefix = new LessAutoprefix({browsers: ['IOS>7','last 4 ChromeAndroid versions']})
const sourcemaps = require('gulp-sourcemaps');

const config = require('./gulp.config.js');



function pro () {
  /**
   * less
   */
  gulp.task('less:pro', function () {
    return gulp.src(config.less)
        .pipe(plumber())
        .pipe(less({
          plugins: [autoprefix]
        }))
        .pipe(gulp.dest(config.cssMin))
  })
}

module.exports = pro;
