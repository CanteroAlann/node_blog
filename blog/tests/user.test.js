
const mongoose = require('mongoose')
const supertest = require('supertest')
const User = require('../models/user')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)


describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', name: 'juan', passwordHash })

        await user.save()
    })

    test('users are returned as json', async () => {
        await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    }
    )

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    afterAll(() => {
        mongoose.connection.close()
    })
})

test('creation fails whit a username invalid', async () => {
    const newUser = {
        username: 'ml',
        name: 'Matti Luukka',
        password: 'salainen',
    }
    await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
})

test('creation fails whit a password invalid', async () => {
    const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukka',
        password: 'sa',
    }
    await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect(res =>
            expect(res.body.error).toContain('password must be at least 3 characters long')
        )
})

