require('dotenv').config()
const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const port = process.env.NODE_ENV || 5001

let refreshTokens = [] // Refresh Tokens are stored in cache or database

app.use(express.json())

app.post('/token', (req, res) => {
    console.log('token endpoint')
    const refreshToken = req.body.token
    console.log(refreshTokens)
    if (!refreshToken) return res.sendStatus(401)
    if (!refreshTokens.includes(refreshToken)) return res.status(403)

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        const accessToken = generateAccessToken({ name: user.name })
        res.status(200).json({ accessToken })
    })
})

app.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204)
})

app.post('/login', (req, res) => {
    // Authenticate User

    const username = req.body.username
    const user = {
        name: username
    }

    const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken)
    res.status(200).json({ accessToken, refreshToken })
})

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' })
}


app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})