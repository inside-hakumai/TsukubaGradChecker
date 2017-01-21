var gulp = require('gulp');
var sass = require('gulp-sass');
var babelify = require('babelify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

// Sass compile
gulp.task('sass', function () {
   gulp.src('./public/src/sass/*.scss')
      .pipe(sass({
         outputStyle: 'expanded'
      }))
      .pipe(gulp.dest('./public/stylesheets'));
});

gulp.task('jsx', function () {
   browserify(['./public/src/jsx/verification.jsx', './public/src/jsx/script.jsx'])
      .transform(babelify)
      .bundle()
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('./public/javascripts'));
});

gulp.task('watch', function () {
   gulp.watch('./public/src/jsx/*', ['jsx']);
});

gulp.task('default', ['sass', 'jsx', 'watch']);