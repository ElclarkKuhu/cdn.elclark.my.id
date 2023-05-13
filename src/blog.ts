import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import config from './config.js'

import { marked } from 'marked'
import { mangle } from 'marked-mangle'

marked.use(mangle())

const static_directory = path.join(process.cwd(), config.build_path)

export function build() {
	const posts_directory = path.join(process.cwd(), config.posts_path)
	const post_static_directory = path.join(
		process.cwd(),
		config.build_path,
		'post'
	)
	const tags_static_directory = path.join(
		process.cwd(),
		config.build_path,
		'tag'
	)
	const authors_static_directory = path.join(
		process.cwd(),
		config.build_path,
		'user',
		'posts'
	)

	const index = {
		posts: [],
		tags: [],
	}

	const tags = {}
	const posts = []
	const authors = {}

	console.log('Building posts...')

	const post_list = fs.readdirSync(posts_directory)

	if (!fs.existsSync(post_static_directory)) {
		fs.mkdirSync(post_static_directory, { recursive: true })
	}

	for (const item of post_list) {
		if (!item.endsWith('.md')) {
			console.warn(`Skipping non-markdown file: ${item}`)
			continue
		}

		const current_path = path.join(posts_directory, item)
		const post = compilePost(current_path)

		console.log(`${post.slug} (${post.title})`)

		posts.push(post)
		index.posts.push({
			slug: post.slug,
			title: post.title,
			date: post.date,
			author: post.author,
			featured_image: post.featured_image,
		})

		for (const tag of post.tags) {
			if (!tags[tag]) {
				tags[tag] = []
			}

			tags[tag].push({
				slug: post.slug,
				title: post.title,
				date: post.date,
				author: post.author,
				featured_image: post.featured_image,
			})
		}

		if (!authors[post.author]) {
			authors[post.author] = []
		}

		authors[post.author].push({
			slug: post.slug,
			title: post.title,
			date: post.date,
			featured_image: post.featured_image,
		})

		fs.writeFileSync(
			path.join(post_static_directory, `${post.slug}.json`),
			JSON.stringify(post, null, 4)
		)

		console.log()
	}

	if (!fs.existsSync(tags_static_directory)) {
		fs.mkdirSync(tags_static_directory, { recursive: true })
	}

	console.log('Building tags...')
	for (const tag of Object.keys(tags)) {
		const tag_slug = tag.toLowerCase().replace(/[^a-z0-9]+/g, '-')

		console.log(`${tag} (${tag_slug})`)

		index.tags.push({
			slug: tag_slug,
			title: tag,
		})

		fs.writeFileSync(
			path.join(tags_static_directory, `${tag_slug}.json`),
			JSON.stringify(tags[tag], null, 4)
		)
	}
	console.log()

	if (!fs.existsSync(authors_static_directory)) {
		fs.mkdirSync(authors_static_directory, { recursive: true })
	}

	console.log('Building User Posts...')
	for (const author of Object.keys(authors)) {
		console.log(`@${author}`)

		fs.writeFileSync(
			path.join(authors_static_directory, `${author}.json`),
			JSON.stringify(authors[author], null, 4)
		)
	}
	console.log()

	console.log('Writing Post Index...')
	fs.writeFileSync(
		path.join(static_directory, 'posts.json'),
		JSON.stringify(index.posts, null, 4)
	)
	console.log()

	console.log('Writing Tag Index...')
	fs.writeFileSync(
		path.join(static_directory, 'tags.json'),
		JSON.stringify(index.tags, null, 4)
	)
	console.log()
}

function getReadingTime(content: string) {
	const plain_text = content.replace(/<[^>]*>?/gm, '')

	const reading_time = Math.ceil(
		plain_text.split(' ').length / config.words_per_minute
	)

	return reading_time
}

function compilePost(post_path: string) {
	const file_contents = fs.readFileSync(post_path, 'utf8')
	const { data, content } = matter(file_contents)

	const html = marked(content, { headerIds: false })
	const reading_time = getReadingTime(html)
	const slug = path.basename(post_path, '.md')

	return {
		slug,
		title: data.title,
		date: data.date,
		updated: data.updated,
		author: data.author,
		tags: data.tags,
		featured_image: data.featured_image,
		reading_time,
		content: html,
	}
}

export default {
	build,
}
