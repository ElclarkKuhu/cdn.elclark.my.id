import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

import config from './config.js'

const supported_extensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']
const convertable_extensions = ['.png', '.jpg', '.jpeg', '.gif']

const build_directory = path.join(process.cwd(), config.build_path)

export function build() {
	const images_directory = path.join(process.cwd(), config.images_path)
	const image_build_directory = path.join(process.cwd(), config.build_path, 'image')

	const image_list = fs.readdirSync(images_directory)

	if (!fs.existsSync(image_build_directory)) {
		fs.mkdirSync(image_build_directory, { recursive: true })
	}

	for (const item of image_list) {
		if (!supported_extensions.includes(path.extname(item))) {
			console.warn(`Skipping unsupported file: ${item}`)
			continue
		}

		const convertable = convertable_extensions.includes(path.extname(item))

		if (convertable) {
			const current_path = path.join(images_directory, item)
			const image = sharp(current_path)
			const webp_path = path.join(image_build_directory, `${item}.webp`)

			console.log(`${item} -> ${webp_path}`)

			image
				.webp()
				.toFile(webp_path)
				.catch((err) => {
					console.error(err)
				})
		} else {
			const current_path = path.join(images_directory, item)
			const image_path = path.join(image_build_directory, item)

			console.log(`${item} -> ${image_path}`)

			fs.copyFileSync(current_path, image_path)
		}
	}
}

export default {
	build
}
