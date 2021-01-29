const fs = require('fs')

let data = fs.readFileSync('public/sw.js', 'utf-8')
if (data.startsWith('const CACHE_ID = ')) data = data.substr(27)

const random = Math.floor(Math.random() * (999999999 - 100000000 + 1)) + 100000000
data = `const CACHE_ID = ${random}\n` + data
fs.writeFileSync('public/sw.js', data)