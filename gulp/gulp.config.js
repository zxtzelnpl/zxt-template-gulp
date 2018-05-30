const config={
  root:'./',
  javascript:{
    from:'src/javascript/*.js',
    to:'dist/javascript',
    watch:'src/javascript/*.js',
    plugins:'src/javascript/plugins/*.js',
    tools:'src/javascript/tools/*.js',
    exclude:''
  },
  style:{
    from:'src/less/*.less',
    to:'dist/css',
    watch:'src/less/**/*.less',
    exclude:''
  },
  html:{
    from:'src/*.html',
    to:'dist',
    watch:'src/**/*.html',
    exclude:'src/template/*.html'
  },
  AUTOPREFIXER_BROWSERS:[
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ],
  UGLIFY_OPTION:{
    compress:{
      drop_console:true
    }
  }
};

module.exports=config;