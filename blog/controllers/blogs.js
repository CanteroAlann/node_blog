const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
}
)

blogsRouter.post('/', async (request, response) => {
    try {
        const blog = new Blog(request.body)
        const result = await blog.save()
        response.status(201).json(result)
    }
    catch (e) {
        response.status(400).end()
    }
}
)

blogsRouter.delete('/:id', async (request, response) => {
    try {
        const res = await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
    }
    catch (e) {
        response.status(404).end()
    }

}
)

blogsRouter.put('/:id', async (request, response) => {
    try {
        const res = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true })
        response.json(res)
    }
    catch (e) {
        response.status(404).end()
    }
}
)

module.exports = blogsRouter