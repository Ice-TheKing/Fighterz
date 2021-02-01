const gulp = require('gulp');
const cache = require('gulp-cached');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const nodemon = require('gulp-nodemon');
const eslint = require('gulp-eslint');
const concat = require('gulp-concat');


const sassTask = (done) => {
  gulp.src('./sass/**/*.scss')
  .pipe(cache('sass'))
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest('./hosted/'));
  
  done();
};

const bundleTask = (done) => {
  // gulp.src(['./client/app/maker.js', './client/helper/helper.js'])
  gulp.src(['./client/app/*.js', './client/helper/helper.js', ])
  .pipe(babel({
    presets: ['@babel/preset-env', '@babel/preset-react']
  }))
  .pipe(concat('bundle.js'))
  .pipe(gulp.dest('./hosted/'));
  
  done();
};

const loginBundleTask = (done) => {
  gulp.src(['./client/login/client.js', './client/helper/helper.js'])
  .pipe(babel({
    presets: ['@babel/preset-env', '@babel/preset-react']
  }))
  .pipe(concat('loginBundle.js'))
  .pipe(gulp.dest('./hosted/'));
  
  done();
};

const lintTask = (done) => {
  gulp.src(['./server/*.js'])
  .pipe(eslint({fix: true}))
  .pipe(eslint.format())
  .pipe(eslint.failAfterError())
  
  done();
};

module.exports.build = gulp.parallel(sassTask, bundleTask, loginBundleTask, lintTask);

const watch = () => {
  gulp.watch('./sass/**/*.scss', sassTask);
  gulp.watch(['./client/app/maker.js', './client/helper/helper.js'], bundleTask);
  gulp.watch(['./client/login/client.js', './client/helper/helper.js'], loginBundleTask);
  
  nodemon({
    script: './server/app.js',
    ignore: ['client/', 'scss/', 'node_modules/'],
    ext: 'js html css'
  });
};

module.exports.watch = watch;