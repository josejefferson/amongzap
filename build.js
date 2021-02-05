const path = require('path')
const fs = require('fs')

const random = Math.floor(Math.random() * (999999999 - 100000000 + 1)) + 100000000
function getAllFiles(dir, filelist = [
	'/',
	'/chat',
	'/401',
	'/404',
	'/banned',
	'/socket.io/socket.io.min.js'
]) {
	fs.readdirSync(dir).forEach(file => {
		filelist = fs.statSync(path.join(dir, file)).isDirectory()
			? getAllFiles(path.join(dir, file), filelist)
			: filelist.concat(path.join(dir, file))
	})
	return filelist
}

const files = getAllFiles('./public').map(i => i
	.replace(/\\/g, '/')
	.replace(/public\//g, '')
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

const data = swModel + fs.readFileSync('public/sw.model.js', 'utf-8')
fs.writeFileSync('public/sw.js', data)