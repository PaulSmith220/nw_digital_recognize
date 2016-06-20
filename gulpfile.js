'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    connect = require('gulp-connect'),
    opn = require('opn');



var path = {
    // Путь для файлов, прошедших сборку
    build: {
        css: 'frontend/styles/css/'
    },
    // Откуда брать исходные файлы
    src: {
        css: 'frontend/styles/scss/*.*'
    },
    // Назначаем пересборку при изменении указанных файлов
    watch: {
        css: 'frontend/styles/scss/*.*'
    }
};
/////////////////////////////////////////////////////////////////////////////


gulp.task('css', function () {
    gulp.src(path.src.css)
        .pipe(sass())
        .pipe(prefixer())
        .pipe(gulp.dest(path.build.css))
        .pipe(connect.reload());
});


gulp.task('server', function() {
    connect.server({
        host: 'localhost',
        port: 5000,
        livereload: false,
    });
});

gulp.task('browser', function() {
    opn( 'http://localhost:5000/frontend/' );
});





/////////////////////////////////////////////////////////////////////////////
gulp.task('build', [
    'css'
]);

gulp.task('watch', function() {
    watch([path.watch.css], function(event, cb) {
        gulp.start('css');
    });
});

gulp.task('default', ['build', 'server', 'watch', 'browser']);