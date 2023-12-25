const User = require('../models/user')


const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}



const createBlog = async (userSelected) => {
    const user = await User.findOne({})
    userSelected.username = user.username
    userSelected.name = user.name
    const newBlog = {
        title: 'test title',
        author: 'test author',
        url: 'test url',
        likes: 1,
        user: user._id,
    }
    return newBlog
}

module.exports = {
    usersInDb,
    createBlog
}