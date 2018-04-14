'use strict';

var gulp          						= require('gulp'),

		browserSync								= require('browser-sync'),
		sourcemaps								= require('gulp-sourcemaps'),					// в случае ошибки, показывет строчку кода с ней в файле-исходнике

		sass          						= require('gulp-sass'),
		sassGlob									= require('gulp-sass-glob'),					// позволяет подтягивать scss файлы автоматически, не нужно делать include каждого БЕМ-блока (!нужно использовать только в style.scss)
		rename										= require('gulp-rename'), 						// плагин для переименования файлов
		postcss										= require('gulp-postcss'), 						// postcss, что бы использовать от него autoprefixer, css-mqpacker
		autoprefixer							= require('autoprefixer'),
		mqpacker									= require('css-mqpacker'),						// группирует медиазапросы и помещает их в конец css документа
		cssnano										= require('gulp-cssnano'), 						// пакет для минификации css
		plumber			  						= require('gulp-plumber'),						// ловит ошибки и наглядно их выводит в консоль

		concat										= require('gulp-concat'),
		uglify										= require('gulp-uglifyjs'), 					// сжатие js

		imagemin									= require('gulp-imagemin'),						// сжатие изображений
		tinypng										= require('gulp-tinypng-nokey'),			// сжатие изображений, используя API tinypng.com (без ключа) 
		pngquant									= require('imagemin-pngquant'),				// сжатие png

		del												= require('del'),											// плагин для удаления файлов и папок
		run												= require('run-sequence'),						// плагин который позволяет собирать таск с вложениями последовательно 
		cache											= require('gulp-cache');							// плагин кеширования

gulp.task('browser-sync', function() { 
	browserSync({ 
		server: {														// определяем параметры сервера
			baseDir: 'src' 										// директория для сервера - app
		},
		notify: false 											// отключаем уведомления

		// open: false,	// отключаем автоматическое открытие в новой вкладке браузера
		// tunnel: true,	// просмотр проекта глобоально в интернете по ссылке (правда работает она не долго)
		// tunnel: "projectname", // demonstration page: http://projectname.localtunnel.me
	});
});

gulp.task('style', function(){											// создаем таск sass
	var mainMinCss = gulp.src('src/sass/style.scss')	// берем источник
		.pipe(plumber())
		.pipe(sassGlob())																// подтягивает scss файлы автоматически, не нужно делать include каждого БЕМ-блока
		.pipe(sass()) 																	// преобразуем sass в css посредством gulp-sass
		.pipe(postcss([	
			autoprefixer({browsers: ['last 10 versions']}),
			mqpacker({
				sort: true
			})
		]))
		.pipe(cssnano()) 
		.pipe(rename({suffix: '.min'}))									// добавляем суффикс .min
		.pipe(gulp.dest('src/css')) 
		.pipe(browserSync.reload({stream: true})); 			// обновляем css на странице при изменении, stream: true - обновится на том же месте, а не перекинет на начало страницы

	
	// В качестве примера (в task-е несколько задач)
	var normalizeMinCss = gulp.src('src/css/normalize.css')
		.pipe(cssnano())
	 	.pipe(rename({suffix: '.min'}))
	 	.pipe(gulp.dest('src/css')); 
});

gulp.task('style:dev', function(){											// создаем таск sass
	var mainMinCss = gulp.src('src/sass/style.scss')	// берем источник
		.pipe(sourcemaps.init())
		.pipe(plumber())
		.pipe(sassGlob())																// подтягивает scss файлы автоматически, не нужно делать include каждого БЕМ-блока
		.pipe(sass()) 																	// преобразуем sass в css посредством gulp-sass
		.pipe(postcss([	
			autoprefixer({browsers: ['last 10 versions']}),
			mqpacker({
				sort: true
			})
		]))
		.pipe(cssnano()) 
		.pipe(rename({suffix: '.min'}))									// добавляем суффикс .min
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('src/css')) 
		.pipe(browserSync.reload({stream: true})); 			// обновляем css на странице при изменении, stream: true - обновится на том же месте, а не перекинет на начало страницы


	var normalizeMinCss = gulp.src('src/css/normalize.css')
		.pipe(cssnano())
	 	.pipe(rename({suffix: '.min'}))
	 	.pipe(gulp.dest('src/css')); 
});

// Библиотеки подключаются в файле libs.scss через @import. Пример: @import "scr/libs/bootstrap/css/bootstrap-grid.min" 
gulp.task('css-libs', function() {
	return gulp.src('src/css/libs.css') 							// выбираем файл для минификации
		.pipe(rename({suffix: '.min'})) 								// добавляем суффикс .min в конец имени файла (libs.min.css)
		.pipe(cssnano()) 																// сжимаем
		.pipe(gulp.dest('src/css')); 										// выгружаем в папку src/css
});

gulp.task('js', function() {
	var commonMinJs = gulp.src('src/js/common.js')
	.pipe(uglify())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('src/js'));
	// .pipe(browsersync.reload({ stream: true }))

	/* в качестве примера (в task-е несколько задач)
	var fancyboxMinJs = gulp.src('src/js/fancybox.js')
	.pipe(uglify())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('src/js')); */
});

gulp.task('js-libs', function() {
	return gulp.src([ 																// берем все необходимые библиотеки
		// 'src/libs/jquery/dist/jquery.min.js', // к примеру ,берем jquery
		// 'src/libs/magnific-popup//dist/jquery.magnific-popup.min.js'// берем magnific-popup
		//'src/libs/animate/animate-css.js'
		])
		.pipe(concat('libs.min.js')) 										// cобираем их в кучу в новом файле libs.min.js
		.pipe(uglify()) 																// cжимаем js файл
		.pipe(gulp.dest('src/js')); 										// выгружаем в папку src/js
});

gulp.task('img', function() {
	return gulp.src('src/img/**/*') 
		.pipe(cache(imagemin([													// сжимаем их с наилучшими настройками с учетом кеширования
			imagemin.gifsicle({interlaced: true}),
			imagemin.jpegtran({progressive: true}),
			imagemin.svgo(),
			imagemin.optipng({optimizationLevel: 3}),
			pngquant({quality: '65-70', speed: 5})
		],{
			verbose: true																	// показывает в командной строке, какая картинка на сколько оптимизирована
		})))
		.pipe(tinypng())																// tinypng
		.pipe(gulp.dest('build/img')); 
});

gulp.task('clean', function() {
	return del.sync('build'); 
});

gulp.task('copy', function() {

	var buildHtml = gulp.src('src/*.html') 
	.pipe(gulp.dest('build'));

	var buildFonts = gulp.src('src/fonts/**/*') 
	.pipe(gulp.dest('build/fonts'));

	var buildCss = gulp.src('src/css/*.min.css')
	.pipe(gulp.dest('build/css'));

	var buildJs = gulp.src('src/js/*.min.js') 
	.pipe(gulp.dest('build/js'));

	var buildFavicon = gulp.src([ 
		'src/android-icon.png',
		'src/apple-icon.png',
		'src/favicon.png'
		])
	.pipe(gulp.dest('build'));

});

gulp.task('watch', ['browser-sync', 'style:dev', 'js', 'css-libs', 'js-libs'], function() {
	gulp.watch('src/**/*.html', browserSync.reload);						// наблюдение за HTML файлами в корне проекта
	gulp.watch('src/sass/**/*.scss', ['style:dev']);						// наблюдение за sass файлами в папке sass
	gulp.watch('src/js/**/*.js', ['js']);
	//gulp.watch(['src/libs/**/*.js', 'src/js/common.js'], ['js']);
});

gulp.task('build', function(fn) {
	run(
		'clean',
		'css-libs',
		'js-libs',
		'style',
		'js',
		'img',
		'copy',
		fn
	);
});

gulp.task('clear', function (callback) {
	return cache.clearAll();
})