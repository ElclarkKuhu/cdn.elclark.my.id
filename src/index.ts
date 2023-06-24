import fs from 'fs'
import path from 'path'
import config from './config.js'

import blog from './blog.js'
import user from './user.js'
import image from './image.js'

console.log('Building CDN...')
const build_path = path.join(process.cwd(), config.build_path)
if (fs.existsSync(build_path)) {
	console.log('Cleaning build directory...')
	fs.rmSync(build_path, { recursive: true })
	fs.mkdirSync(build_path)
} else {
	fs.mkdirSync(build_path)
}
console.log()

const static_path = path.join(process.cwd(), 'static')
if (fs.existsSync(static_path)) {
	console.log('Copying static files...')
	fs.readdirSync(static_path).forEach((file) => {
		fs.copyFileSync(path.join(static_path, file), path.join(build_path, file))
	})
	console.log()
}

user.build()
blog.build()
image.build()
