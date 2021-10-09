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


