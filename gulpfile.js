var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var htmlmin = require('gulp-htmlmin');
var path = require('path');
var pathExists = require('path-exists');
var del = require('del');
var bower = require('bower');

var paths = {
    index: 'app/index.html',
    scripts: ['app/js/app.js', 'app/js/**/*.js'],
    partials: 'app/partials/**/*.*',
    destPartials: './www/partials/'
};

function MinifyPartials(path, destPath) {
    return gulp.src(path)
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(destPath || paths.destPartials));
}

gulp.task('scripts', function() {
    return gulp.src(paths.scripts)
        .pipe(sourcemaps.init())
        .pipe(concat("app.js"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("./www/build/"))
        .pipe(rename('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest("./www/build/"));
});

gulp.task('clean-partials', function() {
    return del(paths.destPartials);
});

gulp.task('partials', ['clean-partials'], function() {
    return MinifyPartials(paths.partials);
});

gulp.task('index', function() {
    return gulp.src(paths.index)
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest("./www/"));
});

gulp.task('init', function() {
    return pathExists('www/libs/angular/angular.js').then(exists => {
    	if (!exists) {
            bower.commands.install();
    	}
    });
});

gulp.task('default', ['init','scripts','partials','index']);

gulp.task('watch', function() {
    gulp.watch(paths.index, ['index']);
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.partials, function(event){
        var destPathFile = path.join('./www', path.relative(path.join(__dirname, './app'), event.path));
        if(event.type === "deleted"){
            del(destPathFile);
        }else{
            var pathFile = path.relative(__dirname, event.path);
            var destPath = path.dirname(destPathFile);
            MinifyPartials(pathFile, destPath);
        }
    });
});