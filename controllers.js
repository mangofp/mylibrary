
const pgp = require('pg-promise')()

const username = process.env.DB_USER
const password = process.env.DB_PASS
const host = process.env.DB_HOST
const port = process.env.DB_PORT

//let uri = `postgres://${username}:${password}@${host}:${port}/library2`
//if (process.env.DATABASE_URL) {
//    uri = process.env.DATABASE_URL + "?ssl=true"
//    pgp.pg.defaults.ssl = true
//}
//
//console.log(uri)
//const db = pgp(uri)

const cn = {
    database: "d3etg4uerniqdl",
    host: "ec2-34-199-15-136.compute-1.amazonaws.com",
    port: "5432",
    user: "bvlhcayvqnzhcf",
    password: "81d4c1f7a3013e4a31b101a0b245c3caa812093b4fc3cb960fbef07d282987bb",
    ssl: { rejectUnauthorized: false },
    sslmode: "require"
}

const db = pgp(cn);

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
        columns: ['id', 'title'],
        table: 'books'
    });

    return books
}

async function getOneBook(id) {
    const book = await db.query('SELECT ${columns:name} FROM ${table:name} WHERE id = ${bookid:name}', {
        columns: ['id', 'title'],
        table: 'books',
        bookid: id

    });

}

module.exports = {
    addBook,
    getOneBook,
    getBooks
}