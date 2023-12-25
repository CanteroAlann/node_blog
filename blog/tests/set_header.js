const supertest = require('supertest')
require('dotenv').config()
const api = supertest(`${process.env.BASE_URL}`)
const token = process.env.TEST_TOKEN


const hook = (method = post) => (args) => {
    return (
        api[method](...args)
            .set('Authorization', `bearer ${token}`)
    )

}


const request = {
    post: hook('post'),
    get: hook('get'),
    put: hook('put'),
    delete: hook('delete'),
}

module.exports = {
    request
}