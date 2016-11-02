var gulp = require('gulp'),
  stylus = require('gulp-stylus'),
  plumber = require('gulp-plumber'),
  livereload = require('gulp-livereload'),
  nodemon = require('gulp-nodemon');

var paths = {
  stylusSrc : 'resources/css/',
  cssSrc : 'public/css/',
  viewSrc : 'views/'
};

gulp.task('stylus', function() {
  gulp.src('resources/css/css.styl')
    .pipe(plumber())
    .pipe(stylus())
    .pipe(gulp.dest('public/css'))
    .pipe(livereload());
});

gulp.task('serve', function () {
  livereload.listen();
  nodemon({
    script: 'app.js',
    ext: 'js hbs styl',
    tasks: ['stylus']
  })
  .on('restart', function() {
    gulp.src('app.js')
      .pipe(livereload());
  });
  console.log('Server restarted!')
});

gulp.task('default', ['stylus', 'serve']);
gulp.task('production', ['serve']);
