var gulp   = require('gulp');
var ts     = require('gulp-typescript');
var shell  = require('gulp-shell');
var runseq = require('run-sequence');
var tslint = require('gulp-tslint');
var nodemon = require('gulp-nodemon');

var paths = {
  tscripts : {
    src : ['server/**/*.ts'],
    dest : 'dist' 
  }
};

var tsProject = ts.createProject('tsconfig.json');

gulp.task('default', ['lint', 'buildrun']);

// ** Watching ** //
gulp.task('watchrun', function () {
  nodemon({
    script: 'cli.js',
    ext: 'js ts',
    ignore: 'dist/',
    env: { 'NODE_ENV': 'development' },
    tasks: 'compile:typescript'
  })
});

// ** Compilation ** //

gulp.task('build', ['compile:typescript']);
gulp.task('compile:typescript', function () {
  return gulp
  .src(paths.tscripts.src)
  .pipe(ts(tsProject))
  .pipe(gulp.dest(paths.tscripts.dest));
});

// ** Linting ** //

gulp.task('lint', ['lint:default']);
gulp.task('lint:default', function(){
  return gulp.src(paths.tscripts.src)
    .pipe(tslint())
    .pipe(tslint.report('prose', {
      emitError: false
    }));
});

// --------------
// Postinstall.
gulp.task('npm', function() {
   shell.task(['npm prune']);
});

gulp.task('tsd', function() {
  shell.task(['tsd reinstall --clean', 'tsd link', 'tsd rebundle']);
});

gulp.task('postinstall', function(done) {
  runseq('clean', 'npm', done);
});