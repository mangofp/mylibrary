const express = require('express')
require('dotenv').config()
const cors = require('cors')

const { 
    addBook, 
    getBooks, 
    getOneBook,
    updateBook,
    deleteBook 
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

function getEmailByToken(token) {
    return allowedTokens.find( e => e.token === token)
}

function checkUser(req, res, next) {
    if (!req.query.token) {
        return res.status(400).send({error: 'No token'})
    }
    
    const userEmail = getEmailByToken(req.query.token)
    if (!userEmail) {
        return res.status(400). send({error: 'Token not valid'})
    }

    console.log("Action by user " + userEmail.user)
    next()
}

const app = express()
app.use(express.json())
app.use(cors())
app.use(checkUser)

const PORT = process.env.PORT || 8080

app.post("/book", async (req, res) => {
    const newBook = req.body
    const result = await addBook(newBook)
    res.status(201).send(result)
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


