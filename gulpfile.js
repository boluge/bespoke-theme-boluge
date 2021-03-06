var gulp = require('gulp'),
  gutil = require('gulp-util'),
  clean = require('gulp-clean'),
  header = require('gulp-header'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify'),
  stylus = require('gulp-stylus'),
  autoprefixer = require('gulp-autoprefixer'),
  csso = require('gulp-csso'),
  jade = require('gulp-jade'),
  connect = require('gulp-connect'),
  plumber = require('gulp-plumber'),
  opn = require('opn'),
  pkg = require('./package.json'),
  browserify = require('gulp-browserify'),
  through = require('through'),
  path = require('path'),
  ghpages = require('gh-pages'),
  template = require('lodash').template,
  isDemo = process.argv.indexOf('demo') > 0;

gulp.task('default', ['clean', 'compile']);
gulp.task('demo', ['compile', 'watch', 'connect']);
gulp.task('compile', ['fonts', 'images' ,'compile:lib', 'compile:demo']);
gulp.task('compile:lib', ['images' ,'stylus', 'browserify:lib']);
gulp.task('compile:demo', ['images' ,'jade', 'browserify:demo']);

gulp.task('watch', function() {
  gulp.watch('lib/*', ['compile:lib', 'browserify:demo']);
  gulp.watch('demo/src/*.jade', ['jade']);
  gulp.watch('demo/src/**/*.js', ['browserify:demo']);
});

gulp.task('clean', ['clean:browserify', 'clean:stylus', 'clean:jade']);
gulp.task('clean:browserify', ['clean:browserify:lib', 'clean:browserify:demo']);

gulp.task('clean:browserify:lib', function() {
  return gulp.src(['dist'], { read: false })
    .pipe(clean());
});

gulp.task('clean:browserify:demo', function() {
  return gulp.src(['demo/dist/build'], { read: false })
    .pipe(clean());
});

gulp.task('clean:stylus', function() {
  return gulp.src(['lib/tmp'], { read: false })
    .pipe(clean());
});

gulp.task('clean:jade', function() {
  return gulp.src(['demo/dist/index.html'], { read: false })
    .pipe(clean());
});

gulp.task('stylus', ['clean:stylus'], function() {
  return gulp.src('lib/theme.styl')
    .pipe(isDemo ? plumber() : through())
    .pipe(stylus({
      'include css': true,
      'paths': ['./node_modules']
    }))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(csso())
    .pipe(gulp.dest('lib/tmp'));
});

gulp.task('browserify', ['browserify:lib', 'browserify:demo']);

gulp.task('browserify:lib', ['clean:browserify:lib', 'stylus'], function() {
  return gulp.src('lib/bespoke-theme-boluge.js')
    .pipe(isDemo ? plumber() : through())
    .pipe(browserify({ transform: ['brfs'], standalone: 'bespoke.themes.boluge' }))
    .pipe(header(template([
      '/*!',
      ' * <%= name %> v<%= version %>',
      ' *',
      ' * Copyright <%= new Date().getFullYear() %>, <%= author.name %>',
      ' * This content is released under the <%= licenses[0].type %> license',
      ' * <%= licenses[0].url %>',
      ' */\n\n'
    ].join('\n'), pkg)))
    .pipe(gulp.dest('dist'))
    .pipe(rename('bespoke-theme-boluge.min.js'))
    .pipe(uglify())
    .pipe(header(template([
      '/*! <%= name %> v<%= version %> ',
      '© <%= new Date().getFullYear() %> <%= author.name %>, ',
      '<%= licenses[0].type %> License */\n'
    ].join(''), pkg)))
    .pipe(gulp.dest('dist'));
});

gulp.task('browserify:demo', ['clean:browserify:demo'], function() {
  return gulp.src('demo/src/scripts/main.js')
    .pipe(isDemo ? plumber() : through())
    .pipe(browserify({ transform: ['brfs'] }))
    .pipe(rename('build.js'))
    .pipe(gulp.dest('demo/dist/build'))
    .pipe(connect.reload());
});

gulp.task('jade', ['clean:jade'], function() {
  return gulp.src('demo/src/index.jade')
    .pipe(isDemo ? plumber() : through())
    .pipe(jade({ pretty: true }))
    .pipe(gulp.dest('demo/dist'))
    .pipe(connect.reload());
});

gulp.task('images', function() {
  return gulp.src('demo/src/images/**/*')
    .pipe(gulp.dest('demo/dist/images'))
    .pipe(connect.reload());
});

gulp.task('fonts', function() {
  return gulp.src('demo/src/fonts/**/*')
    .pipe(gulp.dest('demo/dist/fonts'))
    .pipe(connect.reload());
});

gulp.task('connect', ['compile'], function(done) {
  connect.server({
    root: 'demo/dist',
    livereload: true
  });

  opn('http://localhost:8080', done);
});

gulp.task('deploy', ['compile:demo'], function(done) {
  ghpages.publish(path.join(__dirname, 'demo/dist'), { logger: gutil.log }, done);
});
