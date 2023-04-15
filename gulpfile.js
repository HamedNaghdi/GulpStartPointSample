const gulp = require('gulp');
const { series, parallel } = require('gulp');
const { src, dest } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
require('dotenv').config();
const gulpIf = require('gulp-if');
var ifEnv = require('gulp-if-env');
const uglify = require('gulp-uglify');

var browserSync = require('browser-sync').create();
function browserSyncTask() {
  browserSync.init({
    server: {
      baseDir: './',
      directory: true,
    },
  });
}

function buildSass() {
  //console.log(process.env.NODE_ENV);
  //const isProduction = process.env.NODE_ENV === 'production';
  return (
    src(['./src/sass/**/*.scss'])
      .pipe(sourcemaps.init())
      //.pipe(sass.sync().on("error", sass.logError))
      .pipe(sass.sync({ outputStyle: 'compressed' }).on('error', sass.logError))
      .pipe(sourcemaps.write())
      //.pipe(gulpIf('*.js', uglify()))
      //.pipe(ifEnv('production', myProductionTask()))
      //.pipe(ifEnv.not('development', nonDevelopmentTask()))
      //.pipe(concat("all.css"))
      .pipe(dest('./dist/css'))
      .pipe(
        browserSync.reload({
          stream: true,
        })
      )
  );
}
function watchTask() {
  gulp.watch('./src/sass/**/*.scss', series([buildSass]));
  gulp.watch('./src/*.html').on('change', browserSync.reload);
  gulp.watch('./src/js/**/*.js').on('change', browserSync.reload);
}

exports.default = parallel(browserSyncTask, buildSass, watchTask);
