const gulp = require('gulp');
const newer = require('gulp-newer');
const browserSync = require('browser-sync').create();
const csso = require('gulp-csso');
const imagemin = require('gulp-imagemin');
const plumber = require('gulp-plumber');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const clean = require('gulp-clean');
const minifyHTML = require('gulp-htmlmin');
const babel = require('gulp-babel');
const removeEmptyLines = require('gulp-remove-empty-lines');
const postcss = require('gulp-postcss');
const uncss = require('postcss-uncss');
const svgo = require('gulp-svgo');


// FUNCTIONS


function watch() {
  gulp.watch('src/**/*.css', styles).on('change', browserSync.reload);
  gulp.watch('src/assets/*.*', assets).on('change', browserSync.reload);
  gulp.watch('src/**/*.js', javaScript).on('change', browserSync.reload);
  gulp.watch('src/**/*.html', html).on('change', browserSync.reload);
}

gulp.task('styles', () => {
  const plugins = [
    uncss({
      html: ['src/index.html'],
    }),
  ];

  gulp
    .src(['./src/bootstrap.css'])
    .pipe(plumber())
    .pipe(postcss(plugins))
    .pipe(csso())
    .pipe(gulp.dest('build'));

  return gulp
    .src(['!./src/bootstrap.css', './src/**/*.css'])
    .pipe(plumber())
    .pipe(csso())
    .pipe(gulp.dest('build'));
});

gulp.task('assets', () => gulp
  .src(['src/assets/**'])
  .pipe(plumber())
  .pipe(imagemin())
  .pipe(svgo())
  .pipe(gulp.dest('build/assets')));

gulp.task('javaScript', () => gulp
  .src(['src/**/*.js'])
  .pipe(plumber())
  .pipe(babel({
    presets: ['@babel/env'],
  }))
  .pipe(uglify())
  .pipe(gulp.dest('build')));

const minifyHTMLOptions = {
  custom: [],
  mergeScripts: true,
  mergeStyles: true,
  minifyCss: {
    preset: 'default',
  },
  minifyJs: {},
  minifyJson: {},
  minifySvg: {},
  removeEmptyAttributes: true,
  removeRedundantAttributes: false,
  collapseWhitespace: true,
  removeComments: 'all',
};

gulp.task('html', () => gulp
  .src(['src/*.html'])
  .pipe(plumber())
  .pipe(minifyHTML(minifyHTMLOptions))
  .pipe(gulp.dest('build')));

gulp.task('move', () => {
  gulp.src(['!./src/**/*.css', '!src/assets/**', '!src/**/*.js', '!src/*.html', 'src/**/*.*'])
    .pipe(gulp.dest('build/'));
});

gulp.task('clear', () => gulp.src(['build'], { read: false, allowEmpty: true })
  .pipe(clean({ force: true })));

gulp.task('build', ['styles', 'move', 'assets', 'javaScript', 'html']);

