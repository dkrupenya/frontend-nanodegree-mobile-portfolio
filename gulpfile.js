'use strict';
// http://habrahabr.ru/post/250569/

var gulp = require('gulp'),
    watch = require('gulp-watch'),
//    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
//    sass = require('gulp-sass'),
//    sourcemaps = require('gulp-sourcemaps'),
    less = require('gulp-less'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
//    imagemin = require('gulp-imagemin'),
//    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    browserSync = require('browser-sync'),
    fileinclude = require('gulp-file-include'),
    reload = browserSync.reload;

// модули для обработки css
var uncss = require('gulp-uncss');
var csscomb = require('gulp-csscomb');
//var postcss = require('gulp-postcss');
var autoprefixer = require('gulp-autoprefixer');
var nano = require('gulp-cssnano');

//подключаем gilp-grunt
//require('gulp-grunt')(gulp);

//создадим js объект в который пропишем все нужные нам пути, чтобы при необходимости легко в одном месте их редактировать:

var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'build/',
        js: 'build/',
        css: 'build/',
        img: 'build/',
        fonts: 'build/'
    },
    src: { //Пути откуда брать исходники
        html: '*.html', //Синтаксис src//*.html говорит gulp что мы хотим взять все файлы с расширением .html
        //js: 'js/main.js', //В стилях и скриптах нам понадобятся только main файлы
        js: 'js/**/*.*', //Пока копируем всё
        style: 'css/*.*',
        img: 'img/**/*.*', //Синтаксис img//**//*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'fonts/**/*.*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: '**/*.html',
        js: 'js/**/*.js',
        style: 'css/**/*.less',
        img: 'img/**/*.*',
        fonts: 'fonts/**/*.*'
    },
    clean: './build/*'
};     

var path_views = { // TODO REally bad style. Try to use webpack instead
    src: { //Пути откуда брать исходники
        html: 'views/*.html', //Синтаксис src//*.html говорит gulp что мы хотим взять все файлы с расширением .html
        //js: 'js/main.js', //В стилях и скриптах нам понадобятся только main файлы
        js: 'views/js/**/*.*', //Пока копируем всё
        style: 'views/css/*.*',
        img: 'views/images/**/*.*', //Синтаксис img//**//*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'views/fonts/**/*.*'
    }
};

//Создадим переменную с настройками нашего dev сервера для BrowserSync:

var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "Frontend_Devil",
    browser: "Google Chrome",
    files: "build/css/*.css",
    open: false
};


var fileIncludeConfig = {
    prefix: '@@',
    basepath: '@file'
};

//таск для сборки html:

gulp.task('html:build', function () {
    return gulp.src(
        [path.src.html, path_views.src.html],
        {"base" : "./"} // создавать в dest структуру поддиректорий начиная с корня
    ) //Выберем файлы по нужному пути
        .pipe(fileinclude(fileIncludeConfig)) // используем fileInclude вместо rigger
//        .pipe(rigger()) //Прогоним через rigger
        .pipe(gulp.dest(path.build.html)) //Выплюнем их в папку build
        .pipe(reload({stream: true})); // И перезагрузим наш сервер для обновлений
});


//таск для сборки js:

gulp.task('js:build', function () {
    gulp.src(
            [path.src.js, path_views.src.js],
            {"base" : "./"})
        .pipe(rigger()) //Прогоним через rigger
//        .pipe(sourcemaps.init()) //Инициализируем sourcemap
        .pipe(uglify()) //Сожмем наш js
//        .pipe(sourcemaps.write()) //Пропишем карты
        .pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
        .pipe(reload({stream: true})); //И перезагрузим сервер
});

//таск для сборки css:

gulp.task('style:build', function () {
    return gulp.src(
            [path.src.style, path_views.src.style],
            {"base" : "./"}) //Выберем наш main.scss
//        .pipe(sourcemaps.init()) //То же самое что и с js
        .pipe(less()) //Скомпилируем
//        .pipe(prefixer()) //Добавим вендорные префиксы
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cssmin()) //Сожмем
//        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css)) //И в build
        .pipe(reload({stream: true}));
});

//таск для сборки картинок:

gulp.task('image:build', function () {
    return gulp.src(
            [path.src.img, path_views.src.img],
            {"base" : "./"}) //Выберем наши картинки
//        .pipe(imagemin({ //Сожмем их
//            progressive: true,
//            svgoPlugins: [{removeViewBox: false}],
//            use: [pngquant()],
//            interlaced: true
//        }))
        .pipe(gulp.dest(path.build.img)) //И бросим в build
        .pipe(reload({stream: true}));
});

//таск для сборки шрифтов:

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

//  попросим gulp каждый раз при изменении какого то файла запускать нужную задачу.

gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});

// определим таск с именем «build», который будет запускать все что мы с вами тут накодили

gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build'
]);

// Что бы насладиться чудом livereload — нам необходимо создать себе локальный веб-сервер. Для этого напишем следующий простой таск

gulp.task('webserver', function () {
    browserSync(config);
});

//Если вы добавите какую-нибудь картинку, потом запустите задачу image:build 
//и потом картинку удалите — она останется в папке build. Так что было бы удобно периодически подчищать ее.

gulp.task('clean', function (cb) {
   rimraf(path.clean, cb);
});

//Последним делом — мы определим дефолтный таск, который будет запускать всю нашу сборку.
//Теперь выполним в консоли gulp И вуаля

//gulp.task('default', ['build', 'webserver', 'watch']);
gulp.task('default', ['build', 'webserver', 'watch']);

//минификация и обработка финального css */

gulp.task('minify-css', function() {
    gulp.src('build/css/style.css')
    .pipe(uncss({
        html: [
            'build/catalog-list.html',
            'build/catalog-plates.html',
            'build/index.html',
            'build/list.html',
            'build/news-all.html',
            'build/news.html',
            'build/poisk.html',
            'build/tovar-modal.html',
            'build/tovar.html'
        ]
    }))
    .pipe(csscomb())
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(nano())
    .pipe(gulp.dest('./out'));

    gulp.src('build/css/m-style.css')
        .pipe(uncss({
            html: [
                'build/m-catalog-list.html',
                'build/m-index.html',
                'build/m-list.html',
                'build/m-news-all.html',
                'build/m-news.html',
                'build/m-poisk.html',
                'build/m-tovar.html'
            ]
        }))
        .pipe(csscomb())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(nano())
        .pipe(gulp.dest('./out'));
});
