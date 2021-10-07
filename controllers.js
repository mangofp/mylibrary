
const pgp = require('pg-promise')()

const username = process.env.DB_USER
const password = process.env.DB_PASS
const host = process.env.DB_HOST
const port = process.env.DB_PORT

const uri = `postgres://${username}:${password}@${host}:${port}/library2`

console.log(uri)
const db = pgp(uri)

async function addBook(book) {
    const newBook = {
        title:  book.title,
        description: book.description,
        author_id: book.authorId 
    }

    const result = await db.query('INSERT INTO books(${this:name}) VALUES(${this:csv})', newBook)
    return newBook;
}

async function getBooks() {
    const books = await db.query('SELECT ${columns:name} FROM ${table:name}', {
        columns: ['column1', 'column2'],
        table: 'table'
    });

    return books
}

module.exports = {
    addBook
}