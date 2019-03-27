"use strict";
var gulp = require("gulp"),
  uglify = require("gulp-uglify"),
  sass = require('gulp-sass'),
  rename = require('gulp-rename'),
  connect = require('gulp-connect'),
  watch = require('gulp-watch'),
  rjs = require("requirejs"),
  jshint = require('gulp-jshint'),
  autoprefixer = require('gulp-autoprefixer'),
  concat = require('gulp-concat'),
  usemin = require('gulp-usemin'),
  minifyCss = require('gulp-minify-css'),
  minifyHTML = require('gulp-minify-html'),
  imagemin = require('gulp-imagemin'),
  pngquant = require('imagemin-pngquant'),
  cssmin = require('gulp-cssmin'),
  openpage = require('gulp-open'),
  modRewrite = require('connect-modrewrite'),
  makeCssUrlVer = require('gulp-make-css-url-version'),
  reveasy = require("gulp-rev-easy"),
  sftp = require("gulp-sftp"),
  promp = require("gulp-prompt"),
  del = require("del"),
  tmodjs = require("gulp-tmod");

var pkg = require("./package.json"),
  ver = pkg.version,
  dirs = pkg.dirs;

var om = require('./' + dirs.src + '/helpers/optimizeModules.json');

gulp.task('lint', function() {
  return gulp.src(['./' + dirs.src + '/js/common/modules/**/*.js', './' + dirs.src + '/js/mod/**/*.js', './' + dirs.src + '/js/page/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

/**
 * 预编译sass
 * */
gulp.task('sass:common', function() {
  gulp.src('./' + dirs.src + '/sass/common/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(rename({
      extname: ".css"
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'ie 8', 'ie 9'],
      cascade: true,
      remove: true
    }))
    .pipe(makeCssUrlVer())
    .pipe(gulp.dest('./' + dirs.src + '/css/common'));
});
gulp.task('sass:page', function() {
  gulp.src('./' + dirs.src + '/sass/pagecss/**/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(rename({
      extname: ".css"
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'ie 8', 'ie 9'],
      cascade: true,
      remove: true
    }))
    .pipe(makeCssUrlVer())
    .pipe(gulp.dest('./' + dirs.src + '/css/pagecss'));
});


gulp.task('sass', ['sass:common', 'sass:page', 'sass:watch']);

gulp.task('sass:watch', function() {
  gulp.watch(['./' + dirs.src + '/sass/pagecss/**/*.scss', './' + dirs.src + '/sass/common/*.scss'], ['sass:page', 'sass:common']);
});



/**
 * gulp-artModules 预编译artTemplate模板文件，输出AMD规范js文件
 * require加载到页面主js，传入json数据生产html字符串,使用$object.html(html)方式嵌入到页面中。
 * gulp启动的时候相关文件夹已经建立完毕才会监听
 * 不知道什么鬼，tomodjs无法预编译t开头的文件夹
 * */
var src = './' + dirs.src + '/artModules/****/*.html',
  base = './' + dirs.src + '/artModules',
  helpers = './' + dirs.src + '/helpers/helpersArtTemplate.js',
  outputSrc = './' + dirs.src + '/js/templates',
  outputDist = './' + dirs.dist + '/js/templates';

gulp.task("artToHtmlSrc", function() {
  console.log('src:', src, outputSrc)
  gulp.src(src)
    .pipe(tmodjs({
      base: base,
      type: 'amd',
      combo: true,
      cache: false,
      compress: true,
      helpers: helpers,
      watch: true,
      output: outputSrc,
      verbose: true
    }));
});

gulp.task("artToHtmlDist", function() {
  gulp.src(src)
    .pipe(tmodjs({
      base: base,
      type: 'amd',
      combo: true,
      compress: true,
      helpers: helpers,
      output: outputDist
    }));
});
gulp.task('watchArtTemplate', function() {
  gulp.watch(src, ['artToHtmlSrc']);
});

/**
 * web server ,提供一个本地web server 用以测试及浏览器自动加载
 * */
gulp.task('serverSrc', function() {
  connect.server({
    root: [dirs.src],
    port: 9000,
    /*https:true,*/
    livereload: true,
    middleware: function() {
      return [
        modRewrite([
          '^/(.*)devData=([^&]*)(.*)$ http://localhost:9000/js/tempData/$2 [P]'
        ])
      ];
    }
  });
});

gulp.task('openSrc', function() {
  gulp.src('')
    .pipe(openpage({
      app: 'chrome',
      uri: 'http://localhost:9000'
    }));
});

gulp.task('html', function() {
  gulp.src(['./' + dirs.src + '/**/*.html',
      './' + dirs.src + '/**/*.js',
      './' + dirs.src + '/**/*.css',
      './' + dirs.src + '/**/*.json'
    ])
    .pipe(connect.reload());
});


//watch html and css and js files then run html task
gulp.task('watchHtmlCssJs', function() {
  gulp.watch(['./' + dirs.src + '/**/*.html', './' + dirs.src + '/**/*.js', './' + dirs.src + '/**/*.css'], ['html']);
});

/**
 * 线上版本的压缩合并
 * */

/**
 * 合拼压缩 require js modules to a js file when build
 * */

gulp.task("combineRequireMol", function() {
  rjs.optimize({
    //appDir: 'src',
    mainConfigFile: 'src/js/common/boot.js',
    baseUrl: 'src/js',
    dir: dirs.dist + '/js', //输出目录
    optimize: "uglify2",
    skipDirOptimize: true,
    removeCombined: true,
    preserveLicenseComments: false,
    modules: om.modules
  });
});

//把css文件压缩后复制到dist发布目录
gulp.task("minCss", function() {
  return gulp.src('./' + dirs.src + '/css/**/*.css')
    .pipe(minifyCss({
      compatibility: 'ie8'
    }))
    .pipe(gulp.dest(dirs.dist + '/css'));
});

/**
 * 复制文件到发布版本目录
 * */
gulp.task('copy', [
  'copy:img', 'copy:plugins', 'copy:cssplugins', 'copy:jquery', 'copy:bootstrap', 'copy:fonts', 'copy:template.js', 'copy:patterns'
]);
gulp.task('copy:plugins', function() {
  return gulp.src('./' + dirs.src + '/js/plugins/**')
    .pipe(gulp.dest(dirs.dist + '/js/plugins'));
});


gulp.task('copy:cssplugins', function() {
  return gulp.src('./' + dirs.src + '/css/plugins/**')
    .pipe(gulp.dest(dirs.dist + '/css/plugins'));
});
gulp.task('copy:img', function() {
  return gulp.src('./' + dirs.src + '/img/*')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false
      }],
      use: [pngquant()]
    }))
    .pipe(gulp.dest(dirs.dist + '/img'));
});

gulp.task('copy:jquery', function() {
  return gulp.src('./' + dirs.src + '/js/jquery.min.js')
    .pipe(gulp.dest(dirs.dist + '/js'));
});

gulp.task('copy:bootstrap', function() {
  return gulp.src('./' + dirs.src + '/js/bootstrap.min.js')
    .pipe(gulp.dest(dirs.dist + '/js'));
});

gulp.task('copy:template.js', function() {
  return gulp.src('./' + dirs.src + '/js/templates/template.js')
    .pipe(gulp.dest(dirs.dist + '/js/templates'));
});



gulp.task('copy:patterns', function() {
  return gulp.src('./' + dirs.src + '/css/patterns/*')
    .pipe(gulp.dest(dirs.dist + '/css/patterns'));
});



gulp.task('copy:fonts', function() {
  return gulp.src('./' + dirs.src + '/css/fonts/*')
    .pipe(gulp.dest(dirs.dist + '/css/fonts'));
});



//打死也不要使用通配符压缩，js加载有顺序的
gulp.task("hplus_parent", function() {
  gulp.src([
    './src/js/hplus/parent/jquery.min.js',
    './src/js/hplus/parent/bootstrap.min.js',
    './src/js/hplus/parent/jquery.metisMenu.js',
    './src/js/hplus/parent/jquery.slimscroll.min.js',
    './src/js/hplus/parent/layer.min.js',
    './src/js/hplus/parent/hplus.min.js', './src/js/hplus/parent/contabs.min.js', './src/js/hplus/parent/pace.min.js'
  ]).pipe(concat('hplus.parent.js')).pipe(gulp.dest('./src/js/hplus'));
});



//打死也不要使用通配符压缩，js加载有顺序的
gulp.task("hplus_child", function() {
  gulp.src([
    './src/js/hplus/child/bootstrap.min.js',
    './src/js/hplus/child/jquery.dataTables.js', './src/js/hplus/child/DT_bootstrap.js'
  ]).pipe(concat('hplus.child.js')).pipe(gulp.dest('./src/js'));
});



/**
 * 压缩html
 * */
gulp.task('miniHtml', function() {
  var opts = {
    conditionals: true,
    spare: true,
    empty: true, //标示允许空的属性
    collapseWhitespace: true
  };
  return gulp.src(['./' + dirs.src + '/**/*.html', '!' + dirs.src + '/artModules/**'])
    .pipe(minifyHTML(opts))
    .pipe(reveasy({
      base: 'src'
    }))
    .pipe(gulp.dest(dirs.dist));
});



gulp.task('serverDist', function() {
  connect.server({
    root: [dirs.dist],
    port: 9003,
    /*https:true,*/
    livereload: false,
    middleware: function() {
      return [
        modRewrite([
          '^/(.*)devData=([^&]*)(.*)$ http://localhost:8003/js/tempData/$2 [P]'
        ])
      ];
    }
  });
});

gulp.task('openDist', function() {
  gulp.src('')
    .pipe(openpage({
      app: 'chrome',
      uri: 'http://localhost:9003'
    }));
});

gulp.task('concatbootcss', function() {
  return gulp.src([
    './src/css/bootstrap.min.css',
    './src/css/fontcss/font-awesome.min93e3.css',
    './src/css/fontawesome/font-awesome.min.css',
    './src/css/animate.min.css',
    './src/css/plugins/dataTables/dataTables.bootstrap.css',
    './src/css/style.min.css',
    './src/css/plugins/select2.css',
    './src/css/main.css',
    './src/css/plugins/sweetalert/sweetalert2.css',
    './src/js/plugins/layer/laydate/skins/default/laydate.css',
    './src/js/plugins/dataTables/extensions/Buttons/css/buttons.dataTables.min.css',
    './src/js/plugins/layer/skin/layer.css',
    './src/js/plugins/slideBox/css/jquery.slideBox.css',


  ]).pipe(concat('boot.css')).pipe(gulp.dest('./src/css')).pipe(minifyCss()).pipe(gulp.dest('./src/css')); //执行压缩
});

gulp.task('concat_css', function() {
  gulp.watch(['./' + dirs.src + '/css/main.css'], ['concatbootcss', 'concat_hplus_parent_css']);
});

gulp.task('concat_hplus_parent_css', function() {
  return gulp.src([
    './src/css/bootstrap.min14ed.css',
    './src/css/fontcss/font-awesome.min93e3.css',
    './src/css/animate.min.css',
    './src/css/style.min862f.css',
    './src/css/fontawesome/font-awesome.min.css',
  ]).pipe(concat('hplus.parent.css')).pipe(gulp.dest('./src/css')).pipe(minifyCss()).pipe(gulp.dest('./src/css')); //执行压缩
});



gulp.task("dev", [
  "artToHtmlSrc",
  "watchArtTemplate",
  "concat_css"
]);
gulp.task('build', [
  'clean',
  'artToHtmlDist',
  'combineRequireMol',
  'concatbootcss',
  'concat_hplus_parent_css',
  'minCss',
  'miniHtml',
  'copy'
]);
gulp.task("default", ["dev"]);

gulp.task('clean', function() {
  del.sync('dist/', {
    force: true
  });
});