const gulp = require('gulp');
const browserify = require('browserify');
const tsify = require('tsify');
const babelify = require('babelify');

const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

const rename = require('gulp-rename');
const terser = require('gulp-terser');

const sourcemaps = require('gulp-sourcemaps');

const electron = require('electron-connect').server.create({
	useGlobalElectron: false,
	logLevel: 0
});


const path = require('path');
const projectPath = path.join('.', 'bundle');

const compileTS = () => {
	const bundle = browserify(path.join('.', 'app', 'renderer.ts'), {
			debug: true,
		})
		.plugin(tsify)
		.transform(babelify, {
			presets: ["@babel/preset-env", "@babel/preset-react"]
		})
		.bundle()
		.pipe(source('renderer.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(path.join(projectPath)))
		.on('end', () => console.log(`[${new Date().toLocaleTimeString()}] -> js non-minified complete...`));

	// also make a minified version.
	return bundle
		.pipe(buffer())
		.pipe(sourcemaps.init({
			loadMaps: true
		}))
		.pipe(terser())
		.pipe(rename({
			extname: '.min.js'
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(path.join(projectPath)))
		.on('end', () => {
			console.log(`[${new Date().toLocaleTimeString()}] -> js bundling complete...`);
			electron.restart();
		});
};

gulp.task('ts', gulp.series(compileTS));

gulp.task('watch', () => {
	const paths = [
		`./app/*.ts`,
		`./app/**/*.ts`
	];
	gulp.watch(paths, gulp.series('ts'));
	gulp.watch(['./main.js'], () => {
		console.log('main.js changed - restarting');
		electron.restart();
	});
});

gulp.task('serve', () => {
	electron.start(['.', '--debug-brk=51934', '--disable-d3d11']);
});

gulp.task('default', gulp.parallel(['ts', 'watch', 'serve']));