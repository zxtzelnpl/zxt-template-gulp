const paths={
  root:'./',
  javascript:{
    from:'src/javascript/**/*.js',
    to:'dist/javascript',
    watch:'src/javascript/**/*.js',
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
  }
};

module.exports=paths;