import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import config from './config.js'

import { marked } from 'marked'
import { mangle } from 'marked-mangle'

marked.use(mangle())

const static_directory = path.join(process.cwd(), config.build_path)

export default function build() {
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

	const index = {
		posts: [],
		tags: [],
	}

	const tags = {}
	const posts = []

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

		posts.push(post)

		index.posts.push({
			slug: post.slug,
			title: post.title,
			date: post.date,
			author: post.author,
			featured_image: post.featured_image,
		})

		for (const tag of post.tags) {
			const tag_slug = tag.toLowerCase().replace(/[^a-z0-9]+/g, '-')

			if (!index.tags.find((t) => t.slug === tag_slug)) {
				index.tags.push({
					slug: tag_slug,
					name: tag,
				})
			}

			if (!tags[tag_slug]) {
				tags[tag_slug] = []
			}

			tags[tag_slug].push({
				slug: post.slug,
				title: post.title,
				date: post.date,
				author: post.author,
				featured_image: post.featured_image,
			})
		}

		fs.writeFileSync(
			path.join(post_static_directory, `${post.slug}.json`),
			JSON.stringify(post, null, 4)
		)
	}

	if (!fs.existsSync(tags_static_directory)) {
		fs.mkdirSync(tags_static_directory, { recursive: true })
	}

	for (const tag of Object.keys(tags)) {
		fs.writeFileSync(
			path.join(tags_static_directory, `${tag}.json`),
			JSON.stringify(tags[tag], null, 4)
		)
	}

	fs.writeFileSync(
		path.join(static_directory, 'posts.json'),
		JSON.stringify(index.posts, null, 4)
	)

	fs.writeFileSync(
		path.join(static_directory, 'tags.json'),
		JSON.stringify(index.tags, null, 4)
	)
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
