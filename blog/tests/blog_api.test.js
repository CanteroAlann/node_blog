const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const { blogs } = require('./dummy_data')


beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(blogs)
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
}, 10000)


test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(blogs.length)
}, 10000)

test('id is defined', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
}
)

test('a valid blog can be added', async () => {
    await Blog.deleteMany({})
    const newBlog = {
        title: 'test title',
        author: 'test author',
        url: 'test url',
        likes: 1
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
        .expect(res => {
            expect(res.body.title).toBe(newBlog.title)
            expect(res.body.author).toBe(newBlog.author)
            expect(res.body.url).toBe(newBlog.url)
            expect(res.body.likes).toBe(newBlog.likes)
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
    await api
        .post('/api/blogs')
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
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
}
)

test('delete a blog returns 204', async () => {
    const blogs = await Blog.find({})
    const blogToDelete = blogs[0]
    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)
    await api
        .get('/api/blogs')
        .expect(res => {
            expect(res.body).toHaveLength(blogs.length - 1)
        })
}
)

test('delete a blog that does not exist returns 404', async () => {
    await api
        .delete('/api/blogs/1234567890')
        .expect(404)
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
    await api
        .put(`/api/blogs/${blogToUpdate.id}`)
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

