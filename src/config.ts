import fs from 'fs'
import path from 'path'

const config_path = path.join(process.cwd(), 'build.json')
if (!fs.existsSync(config_path)) {
	console.error('No build config found')
	process.exit(1)
}

const config = JSON.parse(fs.readFileSync(config_path, 'utf8'))
export default config
