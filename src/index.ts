import fs from 'fs'
import path from 'path'
import config from './config.js'

import blog from './blog.js'
import user from './user.js'

const build_path = path.join(process.cwd(), config.build_path)
if (!fs.existsSync(build_path)) {
	fs.mkdirSync(build_path)
}

const static_path = path.join(process.cwd(), 'static')
if (!fs.existsSync(static_path)) {
	fs.mkdirSync(static_path)
}

fs.rmSync(build_path, { recursive: true })
if (!fs.existsSync(build_path)) {
	fs.mkdirSync(build_path)
}

fs.readdirSync(static_path).forEach((file) => {
	fs.copyFileSync(path.join(static_path, file), path.join(build_path, file))
})

user.build()
blog.build()
