const {
  src,
  dest,
  parallel,
  series,
  watch
} = require('gulp');
const del = require('del');
const less = require('gulp-less');
const fileinclude = require('gulp-file-include');
const pug = require('gulp-pug');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();


// =============================================================================
// C ФРЕЙМВОРКОМ UIKIT настроить шаги:
// =============================================================================
function uikitStyles() {
  return src('node_modules/uikit/src/less/components/**')
    .pipe(dest('_src/less/components'));
}

// =============================================================================
// УДАЛЯЕТ ПАПКУ BUILD
// =============================================================================
function clean() {
  return del(['build']);
}

// =============================================================================
// HTML таск (gulp-file-include)
// =============================================================================
function html() {
  return src('_src/html/index.html')
    .pipe(fileinclude({
      prefix: '<!-- @@',
      suffix: ' -->',
      basepath: '_src/html/inc'
    }))
    .pipe(dest('build'))
    .pipe(browserSync.stream());
}

// =============================================================================
// PUG
// =============================================================================
function pugWay() {
  return src(['_src/pug/**/*.pug', '!_src/pug/includes/**', '!_src/pug/templates/**'])
    .pipe(pug({
      pretty: true
    })) // чтобы не сжимался на выходе
    .pipe(dest('build'))
    .pipe(browserSync.stream());
}

// =============================================================================
//  СКРИПТЫ
// =============================================================================
function scripts() {
  return src(['node_modules/uikit/dist/js/uikit-icons.min.js', 'node_modules/uikit/dist/js/uikit.min.js', '_src/js/custom.js'])
    .pipe(concat('scripts.js'))
    .pipe(uglify())
    .pipe(dest('build/js'))
    .pipe(browserSync.stream());
}

// =============================================================================
// СТИЛИ
// =============================================================================
function styles() {
  return src('_src/less/uikit.theme.less')
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 5 versions'],
      cascade: false
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(dest('build/css'))
    .pipe(browserSync.stream());
}

// =============================================================================
// КОПИРУЕТ ФАЙЛЫ И ПАПКИ ИЗ SRC В BUILD
// =============================================================================
function copyFiles() {
  return src(['_src/img/**', '_src/fonts/**', '_src/*.ico', '_src/robots.txt'], {
      'base': '_src'
    }) // base треб. для коректного переноса файлов и папок (для fonts)
    .pipe(dest('build'));
}

// =============================================================================
// СЛЕДИТ ЗА ИЗМЕНЕНИЯМИ В ФАЙЛАХ И ПАПКАХ И РЕФРЕШИТ БРАУЗЕР
// =============================================================================
function watching() {
  browserSync.init({
    server: {
      baseDir: './build' // сервер запускается в этой директории
    },
    // browser: ["chrome"]
  });
  watch('_src/js/**/*.js', scripts); // следит за скриптами в _src и запускает задачу scripts
  watch(['_src/less/**/*.less', /*'!_src/less/components/**'*/], styles); // следит за стилями
  watch('_src/html/**/*.html', html); // следит за html
  // watch('_src/pug/**/*.pug', pugWay); // следит за pug
  watch(['_src/img/**', '_src/fonts/**', '_src/*.ico', '_src/robots.txt'], copyFiles); // следит за файлами
  watch('build/*.html').on('change', browserSync.reload); // перегружает браузер, если файлы html в build изменились
}

// =============================================================================
// ЗАПУСК ТАСКОВ
// =============================================================================
exports.clean = clean;
exports.uikit = parallel(uikitStyles);
exports.default = series(clean, parallel(html, styles, scripts, copyFiles), watching);
