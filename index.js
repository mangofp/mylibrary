const express = require('express')
require('dotenv').config()
const cors = require('cors')

const { 
    addBook, 
    getBooks, 
    getOneBook,
    updateBook 
} = require('./controllers')

const app = express()
app.use(express.json())
app.use(cors())

const PORT = process.env.PORT || 8080

app.post("/book", async (req, res) => {
    const newBook = req.body
    const result = await addBook(newBook)
    res.status(201).send(result)
})

app.get("/book", async (req, res) => {
    try {
        const result = await getBooks()
    } catch (err) {
        return res.status(400).send({error: err.message})
    }

    res.status(201).send(result)
})

app.get("/book/:id",  async (req, res) => {
    const result = await getOneBook(req.params.id)
    res.status(201).send(result)
})

app.patch("/book/:id",  async (req, res) => {
    const result = await updateBook(req.params.id, req.body)
    res.status(201).send(result)
})


app.listen(PORT, () => {
    console.log("Book api running on " + PORT)
})


