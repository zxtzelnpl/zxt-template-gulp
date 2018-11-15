'use strict';

const {readFile}  = require('./plugins/tools')

const gulp = require('gulp');
const config = require('./gulp.config.js');

const fileInclude = require('gulp-file-include');
const htmlMin = require('gulp-htmlmin');
const less = require('gulp-less');
const autoprefixer = require('gulp-autoprefixer');
const nano = require('gulp-cssnano');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const del = require('del');
const rev = require('gulp-rev');
const revCollector = require('gulp-rev-collector')
const Handlebars = require('handlebars')
const through2 = require('through2');
const ListStream = require('list-stream')
const gutil = require('gulp-util');


const {dist, html, style, javascript, AUTOPREFIXER_BROWSERS} = config;
const UGLIFY_OPTION = {compress: {drop_console: true}}

const fs = require('fs');
const path = require('path');


//TODO 加上hash
function pro() {
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
      .pipe(rev())
      .pipe(less())
      .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
      .pipe(nano())
      .pipe(gulp.dest(style.to))
      .pipe(rev.manifest())
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
  gulp.task('plugins:pro', () => {
    return gulp.src([javascript.tools, javascript.plugins])
      .pipe(concat('plugins.min.js'))
      .pipe(rev())
      .pipe(uglify(UGLIFY_OPTION))
      .pipe(gulp.dest(javascript.to))
      .pipe(rev.manifest())
      .pipe(gulp.dest(javascript.to))
  })

  /**
   * Clean output directory
   */
  gulp.task('clean', () => {
    del([dist]).then(paths => {
      if (paths.length !== 0) {
        console.log('Deleted files and folders:\n', paths.join('\n'));
      }
      else {
        console.log('The dir does not exists');
      }

    })
  })


  /**
   * handlebars get templates;
   */

  gulp.task('get-html-templates', () => {
    const template = {};

    return gulp.src([html.template])
      .pipe(through2.obj(function (file, enc, callback) {
        console.log(file.path)
        const key = file.path.split('\\').pop().split('\.').shift();
        const content = file.contents.toString();
        template[key] =  content;
        let _file = new gutil.File({
          base: path.join(__dirname, '../dist/'),
          cwd: __dirname,
          path: path.join(__dirname, '../dist/template.json'),
          contents: new Buffer(JSON.stringify(template))
        })
        callback(null, _file)
      }))
      .pipe(gulp.dest(config.html.to))
  })

  /**
   *handlebars
   */
  gulp.task('handlebars', () => {

    const readFileTemplate = readFile(path.join(__dirname,'../dist/template.json'));
    const readFileStyle = readFile(path.join(__dirname,'../dist/css/rev-manifest.json'));

    return Promise.all([readFileTemplate,readFileStyle])
      .then(([template,style])=>{
        return gulp.src([html.hbs])
          .pipe(through2.obj(function (file, enc, callback) {
            let content = file.contents.toString();
            let myTemplate = Handlebars.compile(content);
            let source = Object.assign({},JSON.parse(template.toString()),JSON.parse(style.toString()))
            console.log(source)
            let html = myTemplate(source)


            let _file = new gutil.File({
              base: path.join(__dirname, '../dist/'),
              cwd: __dirname,
              path:  path.join(__dirname, '../dist/index.html'),
              contents: new Buffer(html)
            })

            callback(null, _file)
          }))
          .pipe(gulp.dest(config.html.to))
      })




    return fs.readFile(path.join(__dirname,'../dist/template.json'),(err,template)=>{
      const json = JSON.parse(template.toString())
      console.log(json);
      return gulp.src([html.hbs])
        .pipe(through2.obj(function (file, enc, callback) {
          let _path = file.path.slice(0,-3)+'html';
          console.log(_path)
          let content = file.contents.toString();
          let myTemplate = Handlebars.compile(content);
          let html = myTemplate(json)


          let _file = new gutil.File({
            base: path.join(__dirname, '../dist/'),
            cwd: __dirname,
            path:  path.join(__dirname, '../dist/index.html'),
            contents: new Buffer(html)
          })

          callback(null, _file)
        }))
        .pipe(gulp.dest(config.html.to))
    })
  })

  /**
   * finally produce the files
   */
  gulp.task('produce', ['html:pro', 'style:pro', 'javascript:pro', 'plugins:pro'], () => {
    console.log('now every things is fine');
  })

  /**
   * finally produce the files by default
   */
  gulp.task('default', ['produce'], () => {
    console.log('Default produce is start');
  });
}

module.exports = pro;
