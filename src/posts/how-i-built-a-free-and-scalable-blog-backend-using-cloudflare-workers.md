---
title: How I Used Cloudflare Workers to Build a Free and Scalable Blog Backend
featured_image: https://img.elclark.my.id/blog/how-i-built-a-free-and-scalable-blog-backend-using-cloudflare-workers.png
author: elclark_kuhu
date: 2023-03-28T10:24:34.785Z
tags: ['Cloudflare Workers', 'SvelteKit', 'Blog', 'Backend']
---

**UPDATE**: This post is now outdated. I've since use the good old Markdown file to store my blog post. New post will be coming soon.

## Introduction

Over the last couple of weeks, I've been busy building my website using SvelteKit and hosting it on Cloudflare Pages. It's been a fun ride so far, but I've hit a bit of a roadblock when it comes to setting up the blog section of my site.

## Finding the right balance

I'm looking for a solution that strikes a balance between being easy to use and scalable while also being as cost-effective as possible. I've tried out a bunch of different options, but I just can't seem to find the right fit. I don't want to manually commit markdown files to my repo every time I publish a blog post, and I also don't want to pay for an expensive backend hosting solution.

It's been a frustrating search, but I think I may have finally stumbled upon a solution. I've been considering using Cloudflare Workers to handle the backend, but I've been putting it off because I wasn't too keen on having to write the whole backend from scratch. But I've decided to bite the bullet and give it a try.

## Getting Started with Cloudflare Workers for Authentication

After much consideration, I decided to use Cloudflare Workers to handle the backend of my blog. But before I could get started with building out the blog section, I needed to address the issue of authentication. I knew I wanted to integrate authentication directly into my website, but I also wanted to make sure it was prerenderable and could be run locally while testing. Unfortunately, SvelteKit can't run locally if I use Cloudflare Workers' platform-specific API. To work around this, I created a separate SvelteKit project just for the authentication on the auth subdomain.

To address this, I created a separate SvelteKit project just for authentication on the auth subdomain (auth.elclark.my.id). However, I quickly realized I needed to learn how OAuth 2.0 works to make this work. In the meantime, I came up with a temporary solution where the server sets a cookie with the session ID that can be accessed by all of my subdomains. While not the best solution, it's currently the best I can do.

## Building the blog backend

With authentication out of the way, I could now focus on building the backend for my blog using Cloudflare Workers.  I started by creating a new worker to handle requests to my API.

To keep things simple, I decided to use the KV storage provided by Cloudflare Workers to store my blog posts. KV storage is a key-value store that can be used to store and retrieve data. It's a great option for small to medium-sized applications because it's fast, scalable, and affordable.

With KV storage, I was able to store each blog post as a JSON object with the following fields:

- `title` - the title of the post
- `content` - the content of the post
- `date` - the date the post was published
- `slug `- the slug of the post
- `updated` - the date The post was last updated on
- `visibility` - the visibility of the post
- `author` - the author of the post

I then created endpoints to handle the following operations:

- `GET /v1/blog` - returns a list of all blog posts.
- `GET /v1/blog/:slug` - returns a single blog post.
- `POST /v1/blog/:slug` - creates a new blog post.
- `PUT /v1/blog/:slug` - updates an existing blog post.
- `DELETE /v1/blog/:slug` - deletes an existing blog post.
- `GET /v1/editor` - This command returns a list of all blog posts written by the current user.

I also added some validation to make sure that the required fields were present when creating or updating a post.

## Connecting the backend to the frontend

With the backend API in place, I now needed to connect it to the frontend of my website. I decided to use the built-in fetch API in JavaScript to make requests to the API.

While you think everything is working, you'll notice that the API is returning a 401 Unauthorized error. This is because the API expects a session ID to be included in the Authorization header of the request. To fix this, I added middleware to my SvelteKit project that checks if the user is logged in and adds the session ID to the Authorization header of the request.

Why not just use the cookie? Well, I can't use set fetch credentials to include because of CORS. If I set the CORS header to allow all origins, then I can't include credentials. so I have to use the authorization header instead. I can set the CORS header to allow specific origins, but I want the API to be accessible from any origin. so I have to use the authorization header instead.

Why not just make the client send the session ID? I like it this way because it's more secure. If I send the session ID from the client, then it's possible for someone to steal the session ID using XSS attacks and use it to access the API. But if I send the session ID from the backend, then it's not possible for someone to steal the session ID because it's only accessible from the backend.

## Finding the Right WYSIWYG Editor

I've been looking for a good WYSIWYG editor for a while now, but I haven't been able to find one that I like. I've tried out a bunch of different options, but I just can't seem to find the right fit. I want to use a WYSIWYG editor that's easy to use and easy to integrate with my website. I tried QuillJS, but I had a hard time using it, especially because I didn't use their Delta API, so for now I will stick with an external editor.

## Conclusion

I'm really happy with how my blog backend turned out. It's easy to use, scalable, and cost-effective. I'm also really glad that I decided to use Cloudflare Workers to handle the backend. It was a great learning experience, and I'm looking forward to using it for more projects in the future.

## Furure Plan

I plan to add more features to my blog backend in the future. I want to add support for comments, tags, and categories. I also want to add a search feature so that users can easily find the posts they're looking for. I'm also planning to add a content management system for images and videos.

Finally, I'm planning to add support for analytics so that I can track how many people are visiting my blog and which posts are the most popular. This will help me better understand my audience and tailor my content accordingly.
