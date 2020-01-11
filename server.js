require('dotenv').config()
const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const port = process.env.NODE_ENV || 5000
const posts = require('./mocks')

app.use(express.json())

app.get('/posts', authenticateToken, (req, res) => {
    const post = posts.filter(post => post.username === req.user.name)
    res.status(200).json(post)
})

function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if(!token) return res.status(401).json({msg: 'You have not sent a token'})
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})