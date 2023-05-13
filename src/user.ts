import fs from 'fs'
import path from 'path'
import config from './config.js'

const static_directory = path.join(process.cwd(), config.build_path)

export function build() {
	const users_directory = path.join(process.cwd(), config.users_path)
	const user_static_directory = path.join(
		process.cwd(),
		config.build_path,
		'user'
	)

	const index = []
	const users = []
	const user_list = fs.readdirSync(users_directory)

	console.log('Building users...')

	if (!fs.existsSync(user_static_directory)) {
		fs.mkdirSync(user_static_directory, { recursive: true })
	}

	for (const item of user_list) {
		if (!item.endsWith('.json')) {
			console.warn(`Skipping non-json file: ${item}`)
			continue
		}

		const current_path = path.join(users_directory, item)
		const user = JSON.parse(fs.readFileSync(current_path, 'utf8'))

		console.log(`${user.name} (${user.username})`)

		users.push(user)
		index.push({
			username: user.username,
			name: user.name,
			email: user.email,
		})

		fs.writeFileSync(
			path.join(user_static_directory, `${user.username}.json`),
			JSON.stringify(user, null, 4)
		)

		console.log()
	}

	console.log('Writing User Index...')
	fs.writeFileSync(
		path.join(static_directory, 'users.json'),
		JSON.stringify(index, null, 4)
	)
	console.log()
}

export default {
	build,
}
