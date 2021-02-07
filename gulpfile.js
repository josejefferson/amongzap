const path = require('path')
const fs = require('fs')
const gulp = require('gulp')
const clean = require('gulp-clean')
const uglify = require('gulp-uglify-es').default
const htmlmin = require('gulp-htmlmin')
const jsonminify = require('gulp-jsonminify')

gulp.task('clean', () => {
	return gulp.src('dist', { read: false, allowEmpty: true })
		.pipe(clean())
})

gulp.task('copy', () => {
	return gulp.src('src/**/*', { allowEmpty: true })
		.pipe(gulp.dest('dist'))
})

gulp.task('cleanSCSS', () => {
	return gulp.src('dist/scss', { read: false, allowEmpty: true })
		.pipe(clean())
})

gulp.task('uglify', () => {
	return gulp.src('dist/js/**/*.js', { allowEmpty: true })
		.pipe(uglify({
			compress: { drop_console: true }
		}))
		.pipe(gulp.dest('dist/js'))
})

gulp.task('minifyHTML', () => {
	return gulp.src('dist/templates/**/*.html', { allowEmpty: true })
		.pipe(htmlmin({ collapseWhitespace: true, }))
		.pipe(gulp.dest('dist/templates'))
})

gulp.task('minifyManifest', () => {
	return gulp.src('dist/manifest.json', { allowEmpty: true })
		.pipe(jsonminify())
		.pipe(gulp.dest('dist'))
})

gulp.task('createSW', callback => {
	const random = Math.floor(Math.random() * (999999999 - 100000000 + 1)) + 100000000
	function getAllFiles(dir, filelist = [
		'/', '/chat', '/401', '/404', '/banned', '/socket.io/socket.io.min.js']) {
		fs.readdirSync(dir).forEach(file => {
			filelist = fs.statSync(path.join(dir, file)).isDirectory()
				? getAllFiles(path.join(dir, file), filelist)
				: filelist.concat(path.join(dir, file))
		})
		return filelist
	}

	const files = getAllFiles('dist').map(i => i
		.replace(/\\/g, '/')
		.replace(/dist\//g, '')
	).filter(i =>
		i !== 'sw.js' &&
		i !== 'sw.model.js' &&
		!i.endsWith('.map') &&
		!i.endsWith('.scss') &&
		!i.includes('admin/') &&
		!i.startsWith('OneSignalSDK')
	)

	const swModel = `const BUILD_ID = ${random}
const filesToCache = ${JSON.stringify(files, null, '\t')}
`
	const data = swModel + fs.readFileSync('dist/sw.model.js', 'utf-8')
	fs.writeFileSync('dist/sw.js', data)
	callback()
})

gulp.task('uglifySW', () => {
	return gulp.src('dist/sw.js', { allowEmpty: true })
		.pipe(uglify())
		.pipe(gulp.dest('dist'))
})

gulp.task('removeSWModel', () => {
	return gulp.src('dist/sw.model.js', { allowEmpty: false })
		.pipe(clean())
})

gulp.task('default', gulp.series(
	'clean',
	'copy',
	gulp.parallel(
		'cleanSCSS',
		'uglify',
		'minifyHTML',
		'minifyManifest'
	),
	'createSW',
	'uglifySW',
	'removeSWModel'
))