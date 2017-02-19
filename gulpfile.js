var gulp = require('gulp');
var sass = require('gulp-sass');
var babelify = require('babelify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var imagemin = require('gulp-imagemin');

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

gulp.task('image', function () {
   gulp.src('./public/src/images/**/*.png')
      .pipe(imagemin())
      .pipe(gulp.dest('./public/images'));
    gulp.src('./public/src/images/**/*.jpg')
        .pipe(imagemin())
        .pipe(gulp.dest('./public/images'));
});

gulp.task('watch', function () {
   gulp.watch('./public/src/jsx/*', ['jsx']);
});

gulp.task('compile', ['sass', 'jsx', 'image'])
gulp.task('default', ['sass', 'jsx', 'image', 'watch']);
