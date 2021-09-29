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

app.listen(5000, () => console.log('App runs on port 5000'))