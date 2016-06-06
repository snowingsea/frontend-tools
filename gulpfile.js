var gulp = require('gulp');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var watchPath = require('gulp-watch-path');
var combiner = require('stream-combiner2');
var sourcemaps = require('gulp-sourcemaps');
var cleancss = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var less = require('gulp-less');
var sass = require('gulp-ruby-sass');
var imagemin = require('gulp-imagemin');

var src = 'src/';
var dist = 'dist/';

/**
 * 处理错误
 * @param  {err} err 错误信息
 */
var handleError = function(err) {
  var colors = gutil.colors;
  console.log('\n');
  gutil.log(colors.red('Error!'));
  gutil.log('fileName: ' + colors.red(err.fileName));
  gutil.log('lineNumber: ' + colors.red(err.lineNumber));
  gutil.log('message: ' + err.message);
  gutil.log('plugin: ' + colors.yellow(err.plugin));
};

/**
 * 压缩js文件
 * @param  {string} srcPath 源代码路径
 * @param  {string} distDir 目标代码文件夹
 */
var uglifyjs = function(srcPath, distDir) {
  var combined = combiner.obj([
    gulp.src(srcPath),
    sourcemaps.init(),
    uglify(),
    sourcemaps.write('./'),
    gulp.dest(distDir)
  ]);
  combined.on('error', handleError);
};

/**
 * 压缩css文件
 * @param  {string} srcPath 源代码路径
 * @param  {string} distDir 目标代码文件夹
 */
var minifycss = function(srcPath, distDir) {
  gulp.src(srcPath)
      .pipe(sourcemaps.init())
      .pipe(autoprefixer({
        browsers: 'last 2 versions'
      }))
      .pipe(cleancss())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(distDir));
};

/**
 * 编译压缩less文件
 * @param  {string} srcPath 源代码路径
 * @param  {string} distDir 目标代码文件夹
 */
var lesscss = function(srcPath, distDir) {
  var combined = combiner.obj([
    gulp.src(srcPath),
    sourcemaps.init(),
    autoprefixer({
      browsers: 'last 2 versions'
    }),
    less(),
    cleancss(),
    sourcemaps.write('./'),
    gulp.dest(distDir)
  ]);
  combined.on('error', handleError);
};

/**
 * 编译压缩sass文件
 * @param  {string} srcPath 源代码路径
 * @param  {string} distDir 目标代码文件夹
 */
var sasscss = function(srcPath, distDir) {
  gulp.src(srcPath)
      .pipe(sass().on('error', handleError))
      .pipe(sourcemaps.init())
      .pipe(cleancss())
      .pipe(autoprefixer({
        browsers: 'last 2 versions'
      }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(distDir));
};

/**
 * 压缩图片
 * @param  {string} srcPath 源代码路径
 * @param  {string} distDir 目标代码文件夹
 */
var minifyimage = function(srcPath, distDir) {
  gulp.src(srcPath)
      .pipe(imagemin({
        progressive: true
      }))
      .pipe(gulp.dest(distDir));
};

/**
 * copy文件
 * @param  {string} srcPath 源代码路径
 * @param  {string} distDir 目标代码文件夹
 */
var copy = function(srcPath, distDir) {
  gulp.src(srcPath)
      .pipe(gulp.dest(distDir));
};


// ----------------------------- Task -----------------------------

// JS文件压缩任务
gulp.task('uglifyjs', function() {
  uglifyjs(src + '/js/**/*.js', dist + '/js/');
});

// 监控JS文件变化
gulp.task('watchjs', function() {
  gulp.watch(src + 'js/**/*.js', function(event) {
    var paths = watchPath(event, src, dist);
    gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
    gutil.log('Dist ' + paths.distPath);
    uglifyjs(paths.srcPath, paths.distDir);
  });
});


// CSS文件压缩任务
gulp.task('minifycss', function() {
  minifycss(src + 'css/**/*.css', dist + 'css/');
});

// 监控CSS文件变化
gulp.task('watchcss', function() {
  gulp.watch(src + 'css/**/*.css', function(event) {
    var paths = watchPath(event, src, dist);
    gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
    gutil.log('Dist ' + paths.distPath);
    minifycss(paths.srcPath, paths.distDir);
  });
});


// LESS文件编译压缩任务
gulp.task('lesscss', function() {
  lesscss(src + 'less/**/*.less', dist + 'css/');
});

// 监控LESS文件
gulp.task('watchless', function() {
  gulp.watch(src + 'less/**/*.less', function(event) {
    var paths = watchPath(event, src + 'less/', dist + 'css/');
    gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
    gutil.log('Dist ' + paths.distPath);
    lesscss(paths.srcPath, paths.distDir);
  });
});


// SASS文件编译压缩任务
gulp.task('sasscss', function() {
  lesscss(src + 'sass/**/*.scss', dist + 'css/');
});

// 监控SASS文件变化
gulp.task('watchsass', function() {
  gulp.watch(src + 'sass/**/*.scss', function(event) {
    var paths = watchPath(event, src + 'sass/', dist + 'css/');
    gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
    gutil.log('Dist ' + paths.distPath);
    lesscss(paths.srcPath, paths.distDir);
  });
});


// 图片压缩任务
gulp.task('image', function() {
  minifyimage(src + 'images/**/*', dist + 'images');
});

// 监控图片变化
gulp.task('watchimage', function() {
  gulp.watch(src + 'images/**/*', function(event) {
    var paths = watchPath(event, src, dist);
    gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
    gutil.log('Dist ' + paths.distPath);
    minifyimage(paths.srcPath, paths.distDir);
  });
});


// copy字体文件任务
gulp.task('font', function() {
  copy(src + 'fonts/**/*', dist + 'fonts');
});

// 监控字体文件变化
gulp.task('watchfont', function() {
  gulp.watch(src + 'fonts/**/*', function(event) {
    var paths = watchPath(event, src, dist);
    gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
    gutil.log('Dist ' + paths.distPath);
    minifyimage(paths.srcPath, paths.distDir);
  });
});


// 复制html文件任务
gulp.task('html', function() {
  copy(src + 'html/**/*', dist + 'html');
});

// 监控html文件变化
gulp.task('watchhtml', function() {
  gulp.watch(src + 'html/**/*', function(event) {
    var paths = watchPath(event, src, dist);
    gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
    gutil.log('Dist ' + paths.distPath);
    minifyimage(paths.srcPath, paths.distDir);
  });
});



gulp.task('build', ['uglifyjs', 'minifycss', 'lesscss', 'sasscss', 'image', 'font', 'html']);
gulp.task('watch', ['watchjs', 'watchcss', 'watchless', 'watchsass', 'watchimage', 'watchfont', 'watchhtml']);
gulp.task('default', ['build',  'watch']);
