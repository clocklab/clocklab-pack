'use strict';

var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')({
        pattern: '*'
    });

var source = 'source',
    build = 'build',
    config = {
        port: 9000,
        tunnel: true,
        notify: false,
        host: 'localhost',
        logPrefix: 'Gontarenko',
        server: { baseDir: build }
    },
    path = {
        build: {
            html: build,
            fonts: build + '/fonts',
            videos: build + '/videos',
            images: build + '/images',
            styles: build + '/styles',
            scripts: build + '/scripts',
            projects: build + '/projects'
        },
        source: {
            html: source + '/*.html',
            fonts: source + '/fonts/*.*',
            videos: source + '/videos/*.*',
            images: source + '/images/*.*',
            styles: source + '/styles/*.*',
            scripts: source + '/scripts/*.*',
            projects: source + '/projects/**/*'
        },
        watch: {
            html: source + '/**/*.html',
            fonts: source + '/fonts/*.*',
            videos: source + '/videos/*.*',
            images: source + '/images/*.*',
            styles: source + '/styles/**/*.*',
            scripts: source + '/scripts/**/*.*',
            projects: source + '/projects/**/*'
        },
        clean: 'build'
    };

gulp.task('default', ['build', 'server', 'watch']);

gulp.task('build', ['html', 'fonts', 'videos', 'images', 'compass', 'libs', 'scripts', 'projects']);

gulp.task('html', function() {
    gulp.src(path.source.html)
        .pipe(plugins.plumber())
        .pipe(plugins.rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(plugins.browserSync.reload({
            stream: true
        }));
});

gulp.task('fonts', function() {
    gulp.src(path.source.fonts)
        .pipe(gulp.dest(path.build.fonts));
});

gulp.task('videos', function() {
    gulp.src(path.source.videos)
        .pipe(gulp.dest(path.build.videos));
});

gulp.task('images', function() {
    gulp.src(path.source.images)
        .pipe(plugins.imagemin({
            progressive: true,
            use: [plugins.imageminPngquant()]
        }))
        .pipe(gulp.dest(path.build.images))
        .pipe(plugins.browserSync.reload({
            stream: true
        }));
});

gulp.task('compass', function() {
    gulp.src(path.source.styles)
        .pipe(plugins.plumber())
        .pipe(plugins.compass({
            config_file: 'config.rb',
            image: source + '/images',
            sass: source + '/styles',
            css: path.build.styles
        }))
        .pipe(plugins.autoprefixer())
        .pipe(gulp.dest(path.build.styles))
        .pipe(plugins.browserSync.reload({
            stream: true
        }));
});

gulp.task('libs', function() {
    gulp.src('./bower.json')
        .pipe(plugins.mainBowerFiles('**/*.css'))
        .pipe(plugins.concatCss('libs.min.css'))
        .pipe(plugins.cleanCss({
            keepSpecialComments: 0
        }))
        .pipe(gulp.dest(path.build.styles));
});

gulp.task('scripts', function() {
    gulp.src(path.source.scripts)
        .pipe(plugins.plumber())
        .pipe(plugins.rigger())
        .pipe(plugins.uglify())
        .pipe(plugins.rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(path.build.scripts))
        .pipe(plugins.browserSync.reload({
            stream: true
        }));
});

gulp.task('projects', function() {
    gulp.src(path.source.projects)
        .pipe(gulp.dest(path.build.projects));
});

gulp.task('server', function() {
    plugins.browserSync(config);
});

gulp.task('clean', function(cb) {
    plugins.rimraf(path.clean, cb);
});

gulp.task('watch', function() {
    plugins.watch([path.watch.html], function(event, cb) {
        gulp.start('html');
    });
    plugins.watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts');
    });
    plugins.watch([path.watch.images], function(event, cb) {
        gulp.start('images');
    });
    plugins.watch([path.watch.videos], function(event, cb) {
        gulp.start('videos');
    });
    plugins.watch([path.watch.scripts], function(event, cb) {
        gulp.start('scripts');
    });
    plugins.watch([path.watch.styles], function(event, cb) {
        gulp.start('compass');
    });
    plugins.watch([path.watch.projects], function(event, cb) {
        gulp.start('projects');
    });
});