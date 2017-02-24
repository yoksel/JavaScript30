var gulp        = require('gulp');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;

gulp.task('default', function () {

    browserSync({server: '.'});

    gulp.watch(['*.js', '*.html'], reload);
});
