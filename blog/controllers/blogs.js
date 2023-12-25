const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')
const User = require('../models/user')



blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
}
)

blogsRouter.post('/', async (request, response) => {
    const user = await User.findById(request.user.id)
    const blog = { ...request.body, user: user._id }
    const newBlog = new Blog(blog)

    const result = await newBlog.save()
    user.blogs = user.blogs.concat(result._id)
    await user.save()
    response.status(201).json(result)


}
)

blogsRouter.delete('/:id', async (request, response) => {
    const blogToBeDeleted = await Blog.findById(request.params.id)
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (blogToBeDeleted.user.toString() !== request.user.id.toString()) {
        return response.status(401).json({ error: 'token invalid' })
    }

    const res = await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()

}
)

blogsRouter.put('/:id', async (request, response) => {
    const res = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true })
    response.json(res)
}
)

module.exports = blogsRouter