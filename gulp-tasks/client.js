'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var stylish = require('gulp-jscs-stylish');
var inject = require('gulp-inject');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var templateCache = require('gulp-angular-templatecache');
var angularFilesort = require('gulp-angular-filesort');
var ngAnnotate = require('gulp-ng-annotate');
var filter = require('gulp-filter');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var browserSync = require('browser-sync');
var proxy = require('http-proxy-middleware');

gulp.task('client:lint', function() {
  return gulp.src(['client/app/**/*.js'])
    .pipe(jshint()) // jshint
    .pipe(jscs()) // enforce style guide
    .pipe(stylish.combineWithHintResults())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('client:lint-dev', function() {
  return gulp.src(['client/app/**/*.js'])
    .pipe(jshint()) // jshint
    .pipe(jscs()) // enforce style guide
    .pipe(stylish.combineWithHintResults())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('client:template', function() {
  return gulp.src(['client/app/**/*.html'])
    .pipe(templateCache('app.tpl.js', {
      root: 'app',
      module: 'appTemplates',
      standalone: true
    }))
    .pipe(gulp.dest('.tmp/'));
});

gulp.task('client:inject', function() {
  return gulp.src('client/index.html')
    .pipe(inject(gulp.src(['client/**/*.js', '.tmp/*.tpl.js']).pipe(angularFilesort()), {
      ignorePath: ['client', '.tmp'],
      addRootSlash: false
    }))
    .pipe(gulp.dest('.tmp/'));
});

gulp.task('client:copy-angular-i18n', function() {
  return gulp.src('bower_components/angular-i18n/*.js')
    .pipe(gulp.dest('.tmp/i18n/angular'));
});

gulp.task('client:copy-angular-i18n-dist', function() {
  return gulp.src('bower_components/angular-i18n/*.js')
    .pipe(gulp.dest('dist/public/i18n/angular'));
});

gulp.task('client:serve', function(cb) {

  // Proxy Middleware to Express app
  var proxyServer = proxy('/api', {
    target: 'http://localhost:3002'
  });

  browserSync.instance = browserSync.init({
    startPath: '/',
    server: {
      baseDir: ['.tmp/', 'client'],
      middleware: [proxyServer],
      routes: {
        '/bower_components': 'bower_components'
      }
    },
    //browser: ['google chrome', 'firefox', 'internet explorer'],
    browser: ['google chrome']
  }, cb);
});

gulp.task('client:watch', function() {
  gulp.watch('client/*.html', gulp.series(['client:inject'], browserSync.reload));
  gulp.watch('client/app/**/*.html', gulp.series(['client:template', 'client:inject'], browserSync.reload));
  gulp.watch('client/app/**/*.js', gulp.series(['client:lint', 'client:inject'], browserSync.reload));
  gulp.watch('client/**/*.css', browserSync.reload);
});

gulp.task('client:build', function() {
  var assets = useref.assets();
  var jsFilter = filter('**/*.js', {
    restore: true
  });
  var cssFilter = filter('**/*.css', {
    restore: true
  });
  return gulp.src('.tmp/index.html')
    .pipe(assets)
    .pipe(rev())
    .pipe(jsFilter)
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe(minifyCss())
    .pipe(cssFilter.restore)
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(revReplace())
    .pipe(gulp.dest('dist/public'));
});

/* Main Tasks for client */
gulp.task('client:default', gulp.series(['client:lint-dev', 'client:template', 'client:inject', 'client:copy-angular-i18n', 'client:serve', 'client:watch']));
gulp.task('client:dist', gulp.series(['client:lint', 'client:template', 'client:inject', 'client:copy-angular-i18n-dist', 'client:build']));