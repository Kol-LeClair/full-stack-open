const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

/*
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}
*/

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({}).populate('user')
    response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
        response.json(blog)
    } else {
        response.status(404).end()
    }
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body
    const user = request.user

    if (!user) {
        return response.status(400).json({ error: 'userId missing or not valid' })
    }

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
    const user = request.user

    const blog = await Blog.findById(request.params.id)

    if (blog.user.toString() === user.id.toString()) {
        await Blog.findByIdAndDelete(request.params.id)
        response.status(204).end()
    } else {
        return response.status(401).json({ error: 'incorrect user' })
    }
})

blogsRouter.put('/:id', async (request, response) => {
    const { title, author, url, likes, user } = request.body

    const blog = await Blog.findById(request.params.id)

    if (!blog) {
        return response.status(404).end()
    } else {
        blog.title = title
        blog.author = author
        blog.url = url
        blog.likes = likes
        blog.user = user.id

        const updatedBlog = await blog.save()
        response.json(updatedBlog)
    }
})

module.exports = blogsRouter