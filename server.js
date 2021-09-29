require('dotenv').config()

const express = require('express')
const jwt = require('jsonwebtoken')
const authenticateToken = require('./#middleware/authenticationTokenMiddleware')

const app = express()

app.use(express.json())

const posts = [
    {
        username: 'Batman',
        title: 'Robin'
    },
    {
        username: 'Robin',
        title: 'Hood'
    },
]

app.get('/posts', authenticateToken, (req, res, next) => {
    res.json(posts.filter(post => post.username === req.user.name))
})

app.post('/login', (req, res, next) => {
    //Authenticate user. Another video: https://www.youtube.com/watch?v=Ud5xKCYQTjM
    //Next code
    const username = req.body.username
    const user = {name: username}
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.json({accessToken})


})

app.listen(5000, () => console.log('App runs on port 5000'))