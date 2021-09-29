//For authentication we use a separate server
require('dotenv').config()

const express = require('express')
const jwt = require('jsonwebtoken')
const authenticateToken = require('./#middleware/authenticationTokenMiddleware')

const app = express()

app.use(express.json())

let refreshTokens = []


//refresh token logic
app.post('/token', (req, res, next) => {
    const refreshToken = req.body.token

    if (refreshToken === null) return res.sendStatus(401)
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        const accessToken = generateAccessToken({name: user.name})
        res.json({accessToken})
    })
})

//login logic
app.post('/login', (req, res, next) => {
    //Authenticate user. Another video: https://www.youtube.com/watch?v=Ud5xKCYQTjM
    //Next code
    const username = req.body.username
    const user = {name: username}

    const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken)
    res.json({accessToken, refreshToken})
})

//logout logic
app.delete('/logout', (req, res, next) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204)
})

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1m'})
}

app.listen(8000, () => console.log('App runs on port 8000'))