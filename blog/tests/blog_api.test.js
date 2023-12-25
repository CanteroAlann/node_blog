const mongoose = require('mongoose')
const Blog = require('../models/blog')
const { blogs } = require('./dummy_data')
const helper = require('./test_helper')
const { request } = require('./set_header')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)


beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(blogs)
})

test('blogs are returned as json', async () => {
    request.get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
}, 10000)


test('all blogs are returned', async () => {
    request.get('/api/blogs')
        .expect(resp =>
            expect(resp.body).toHaveLength(blogs.length))
}, 10000)

test('id is defined', async () => {
    request.get('/api/blogs')
        .expect(resp =>
            expect(resp.body[0].id).toBeDefined()
        )
}
)

test('a valid blog can be added', async () => {
    await Blog.deleteMany({})
    let user = {
        username: '',
        name: '',
    }
    const newBlog = await helper.createBlog(user)
    request.post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
        .expect(res => {
            expect(res.body.title).toBe(newBlog.title)
            expect(res.body.author).toBe(newBlog.author)
            expect(res.body.url).toBe(newBlog.url)
            expect(res.body.likes).toBe(newBlog.likes)
            expect(res.body.user).toBeDefined()
        })
    request.get('/api/blogs')
        .expect(res => {
            expect(res.body).toHaveLength(1)
            expect(res.body[0].user.username).toBe(user.username)
            expect(res.body[0].user.name).toBe(user.name)
        })

}
)

test('likes defaults to 0', async () => {
    await Blog.deleteMany({})
    const newBlog = {
        title: 'test title',
        author: 'test author',
        url: 'test url'
    }
    request.post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
        .expect(res => {
            expect(res.body.likes).toBe(0)
        })
}
)

test('title is required', async () => {
    await Blog.deleteMany({})
    const newBlog = {
        author: 'test author',
        url: 'test url',
        likes: 1
    }
    request.post('/api/blogs')
        .send(newBlog)
        .expect(400)
}
)

test('delete a blog returns 204', async () => {
    const blogs = await Blog.find({})
    const blogToDelete = blogs[0]
    request.delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)
    request.get('/api/blogs')
        .expect(res => {
            expect(res.body).toHaveLength(blogs.length - 1)
        })
}
)

test('delete a blog that does not exist returns 400', async () => {
    request.delete(`/api/blogs/123456789`)
        .expect(400)
}
)

test('update a blog', async () => {
    const blogs = await Blog.find({})
    const blogToUpdate = blogs[0]
    const updatedBlog = {
        title: 'updated title',
        author: 'updated author',
        url: 'updated url',
        likes: 1
    }
    request.put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)
        .expect(res => {
            expect(res.body.title).toBe(updatedBlog.title)
            expect(res.body.author).toBe(updatedBlog.author)
            expect(res.body.url).toBe(updatedBlog.url)
            expect(res.body.likes).toBe(updatedBlog.likes)
        })
}
)


afterAll(() => {
    mongoose.connection.close()
})

