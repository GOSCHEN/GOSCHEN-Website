'use strict';

var gulp = require('gulp'),
    inject = require('gulp-inject'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    es = require('event-stream'),
    minifier = require('gulp-uglify/minifier'),
    pump = require('pump'),
    browsersync = require('browser-sync').create(),
    reload = browsersync.reload;

var TARGET = './dist/';
var vendorStream = gulp.src(['./src/js/vendors/*.js'])
    .pipe(concat('vendors.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'));

var sassStream = gulp.src('./src/scss/index.scss')
    .pipe(sass())
    .pipe(gulp.dest(TARGET + 'css/'))
    .pipe(browsersync.stream());

/*  GULP TASKS  */

gulp.task('cleaner', function(){

});

gulp.task('default', ['serve']);

gulp.task('compress', function (cb) {
   pump([
       gulp.src('./src/js/*.js'),
       uglify(),
       gulp.dest(TARGET)
   ], cb);
});

gulp.task('index',['sass','js'], function () {
    //var sources = gulp.src(['./dist/css/*.min.css', './dist/js/*.js'], {read: false, ignorePath: 'dist'});

    gulp.src('./src/index.html')
        .pipe(inject(gulp.src('./dist/js/vendors.js', {read: false}), {name: 'head', ignorePath:'dist'}))
        .pipe(inject(gulp.src(['./dist/css/*.min.css','./dist/js/*.js', '!./dist/vendors.js'], {read: false}), {ignorePath: 'dist'}))
        .pipe(gulp.dest(TARGET));
});


gulp.task('sass', function () {
    return sassStream;
});

gulp.task('vendors', function () {
    return vendorStream;
});

gulp.task('js',['vendors'], function(cb){
    return gulp.src(['./src/js/*.js'])
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('serve', ['js','index'], function () {
        browsersync.init({
        server: {
            baseDir: TARGET
        }
    });
    gulp.watch("./src/scss/index.scss", ['sass']);
    gulp.watch("./src/*.html").on('change', browsersync.reload);
});
