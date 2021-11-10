const express = require('express')
require('dotenv').config()
const cors = require('cors')
const jwt = require('jsonwebtoken');
const JWT_SECRET = "some-secret34334,"

const { 
    addBook, 
    getBooks, 
    getOneBook,
    updateBook,
    deleteBook,
    addUser,
    authenticateUser 
} = require('./controllers')

function logReqQuery(req, res, next) {
    console.log("Request with parameters:")
    console.log(req.method)
    console.log(req.query)
    next()
}

let allowedTokens = [
    {token: '100', user: 'john@doe.rr'},
    {token: '101', user: 'jane@doe.rr'}
]

let activeSessions = []

function getEmailByToken(token) {
    return allowedTokens.find( e => e.token === token)
}

function checkUser(req, res, next) {
    if (!req.query.token) {
        return res.status(400).send({error: 'No token'})
    }
    
    let decoded = false
    try {
        decoded = jwt.verify(req.query.token, JWT_SECRET)
        console.log(decoded)
    } catch (err) {
        console.log("Token verification failed: " + err.message)
    }
    
    if (!decoded || !decoded.account) {
        return res.status(400). send({error: 'Token not valid or exipred'})
    }

    req.account = decoded.account
    console.log("Action by user " + req.account)
    next()
}

const app = express()
app.use(express.json())
app.use(cors())
app.use('/book', checkUser)

const PORT = process.env.PORT || 8080

app.post("/book", async (req, res) => {
    const newBook = req.body
    const result = await addBook(newBook)
    res.status(201).send(result)
})

app.post("/user", async (req, res) => {
    const newUser = await addUser(req.body.account, req.body.password)
    if (!newUser) {
        return res.status(403).send("Account exists")
    }
    res.status(201).send(newUser)
})

app.post("/login", async (req, res) => {
    const result = await authenticateUser(req.body.account, req.body.password)
    if (!result) {
        return res.status(403)
    }
    const token = jwt.sign(
        {account: req.body.account}, 
        JWT_SECRET, 
        { expiresIn: '1h' }
    )
    res.status(201).send({token})
})

app.get("/book", async (req, res) => {
    try {
       const result = await getBooks()
       res.status(200).send(result)
    } catch (err) {
        return res.status(400).send({error: err.message})
    }
})

app.get("/book/:id",  async (req, res) => {
    const result = await getOneBook(req.params.id)
    res.status(200).send(result)
})

app.patch("/book/:id",  async (req, res) => {
    const result = await updateBook(req.params.id, req.body)
    res.status(200).send(result)
})

app.delete("/book/:id",  async (req, res) => {
    const result = await deleteBook(req.params.id)
    res.status(200).send(result)
})

app.listen(PORT, () => {
    console.log("Book api running on " + PORT)
})


