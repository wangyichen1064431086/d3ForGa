const nunjucks = require('nunjucks');
const gulp = require('gulp');
const fs = require('fs-jetpack');
const browserSync = require('browser-sync').create();
const $ = require('gulp-load-plugins')();
const rollup = require('rollup').rollup;
const babel = require('rollup-plugin-babel');
const nodeResolve = require('rollup-plugin-node-resolve');

var cache;
const env = new nunjucks.Environment(
  new nunjucks.FileSystemLoader(['views'],{
    watch:false,//MARK:如果为true，则会导致html任务挂在那儿
    noCache:true
  }),
  {
    autoescape:false
  }
);

function render(template, context) {
  return new Promise(function(resolve, reject) {
      env.render(template,context,function(err,res) {
        if(err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
  });
}

gulp.task('html',async function() {
  const destDir = '.tmp';
  const dataForRender = await fs.readAsync('data/dataForRender/data.json','json');//await 可以获取promise中resolve的值
  const renderResult = await render('index.html',dataForRender);
  await fs.writeAsync(`${destDir}/index.html`,renderResult);
  browserSync.reload('*.html');
});
gulp.task('helloGa',() => {
  const destDir = '.tmp/ga';
  return gulp.src('gaRelated/HelloAnalytics.html')
    .pipe(gulp.dest(destDir))
    .pipe(browserSync.stream({once:true}));
});
gulp.task('style',() => {
  const destDir = '.tmp/styles';
  return gulp.src('client/styles/main.scss')
    .pipe($.changed(destDir))
    .pipe($.plumber())
    .pipe($.sourcemaps.init({loadMaps:true}))
    .pipe($.sass({
      includePaths:[],
      outputStyle:'expanded',
      precision:10
    }).on('error',$.sass.logError))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(destDir))
    .pipe(browserSync.stream({once:true}));
});

gulp.task('script',() => {
  // TODO:关于rollup需要再认真学习一下
   return rollup({
     entry:'client/js/main.js',
     cache: cache,
     //external:[d3],
     plugins:[
       babel({//这里需要配置文件.babelrc
         exclude:'node_modules/**'
       }),
       nodeResolve({
         jsnext:true,
       })
     ]

   }).then(function(bundle) {
     cache = bundle;//Cache for later use
     return bundle.write({//返回promise，以便下一步then()
       dest: '.tmp/scripts/main.js',
       format: 'iife',
       sourceMap: true
     });
   }).then(() => {
     browserSync.reload();
   }).catch(err => {
     console.log(err);
   });
});


gulp.task('serve',gulp.parallel('html','style','script','helloGa',function() {
  browserSync.init({
    server:{
      baseDir: ['.tmp', 'data'],
      directory:true,
      routes: {
        '/node_modules':'node_modules'
      }
    },
    port:8080//一定要和“创建凭据”的“已获授权的 JavaScript 来源”设置的端口一致
  });
  gulp.watch('client/styles/*.scss',gulp.parallel('style'));
  gulp.watch('client/js/*.js',gulp.parallel('script'));
  gulp.watch(['views/*.html','data/dataForRender/*.json'],gulp.parallel('html'));
}))