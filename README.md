# gulp-starter
Стартовый шаблон, который включает в себя автоматизацию задач во frontend-разработке.

## Как использовать

1. ```clone this repo```
2. ```cd path/to/...```
3. ```npm i```
4. ```gulp build```  сборка проекта
5. ```gulp watch```	 разработка проекта

## Что включает в себя стартовый шаблон

* [browser-sync](https://browsersync.io/docs/gulp) — автоматическая перезагрузка веб-страницы при внесении изменений в файлы вашего проекта.
* [gulp-sourcemaps](https://www.npmjs.com/package/gulp-sourcemaps) — в случае ошибки, показывет строчку кода с ней в файле-исходнике
* [gulp-sass](https://www.npmjs.com/package/gulp-sass) — компиляция из SASS/SCSS в CSS.
* [gulp-sass-glob](https://www.npmjs.com/package/gulp-sass-glob) — позволяет подтягивать несколько scss файлов из папки автоматически (не нужно делать include каждого БЕМ-блока)
* [gulp-rename](https://www.npmjs.com/package/gulp-rename) — переименование файлов, добавление суффиксов и префиксов (например добавление суффикса .min к минифицированныи файлам).
* [gulp-postcss](https://www.npmjs.com/package/gulp-postcss) — плагин для передачи через него плагинов от Postcss (например autoprefixer, mqpacker).
* [gulp-autoprefixer](https://www.npmjs.com/package/gulp-autoprefixer) — расставляет вендорные префиксы в CSS в соответствии с сервисом [Can I Use](https://caniuse.com/).
* [css-mqpacker](https://www.npmjs.com/package/css-mqpacker) — группирует медиазапросы и помещает их в конец CSS документа.
* [gulp-cssnano](https://www.npmjs.com/package/gulp-cssnano) — минификация CSS-файлов.
* [gulp-plumber](https://www.npmjs.com/package/gulp-plumber) — ловит ошибки и наглядно их выводит в консоль.
* [gulp-concat](https://www.npmjs.com/package/gulp-concat) — соединяет несколько файлов в один.
* [gulp-uglify](https://www.npmjs.com/package/gulp-uglify) — минификация JS-файлов.
* [gulp-imagemin](https://www.npmjs.com/package/gulp-imagemin) — сжатие изображений.
* [gulp-tinypng-nokey](https://www.npmjs.com/package/gulp-tinypng-nokey) — сжатие изображений, используя API [tinypng](https://tinypng.com) (без ключа).
* [imagemin-pngquant](https://www.npmjs.com/package/imagemin-pngquant) — дополнение к gulp-imagemin для работы с PNG-изображениями.
* [run-sequence](https://www.npmjs.com/package/run-sequence) —  позволяет собирать task с вложениями последовательно.
* [gulp-cache](https://www.npmjs.com/package/gulp-cache) — плагин для кеширования (например можно поместить в кеш изображения,что бы не сжимать из несколько раз)