const gulp = require('gulp');
const cache = require('gulp-cached');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const nodemon = require('gulp-nodemon');
const eslint = require('gulp-eslint');

// gulp.task('sass', (cb) => {
//   gulp.src('./sass/**/*.scss')
//     .pipe(sass().on('error', sass.logError))
//     .pipe(gulp.dest('./hosted/'));
//   cb();
// });
// 
// // babel
// gulp.task('js', (cb) => {
//   gulp.src('./client/*.js')
//     .pipe(babel({
//       presets: ['env', 'react']
//     }))
//     .pipe(gulp.dest('./hosted'))
//   cb();
// });
// 
// // return so the program stops if there's an error
// gulp.task('lint', (cb) => {
//   return gulp.src(['./server/*.js'])
//     .pipe(eslint())
//     .pipe(eslint.format())
//     .pipe(eslint.failAfterError());
//   cb();
// });
// 
// gulp.task('watch', (cb) => {
//   gulp.watch('./sass/**/*.scss', gulp.series('sass'));
//   gulp.watch('./client/*.js', gulp.series('js'));
//   
//   nodemon({ script: './server/app.js'
//           , ext: 'js'
//           , tasks: ['lint'] })
//   
//   cb();
// });
// 
// gulp.task('build', gulp.parallel('sass', 'js', 'lint'));

const sassTask = (done) => {
  gulp.src('./sass/**/*.scss')
  .pipe(cache('sass'))
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest('./hosted/'));
  
  done();
};

const jsTask = (done) => {
  gulp.src(['./client/*.js', './client/*.jsx'])
  .pipe(cache('babel'))
  .pipe(babel({
    presets: ['@babel/preset-env', '@babel/preset-react']
  }))
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

module.exports.build = gulp.parallel(sassTask, jsTask, lintTask);

const watch = () => {
  gulp.watch('./sass/**/*.scss', sassTask);
  gulp.watch(['./client/*.js', './client/*.jsx'], jsTask);
  
  nodemon({
    script: './server/app.js',
    ignore: ['client/', 'scss/', 'node_modules/'],
    ext: 'js html css'
  });
};

module.exports.watch = watch;