
const pgp = require('pg-promise')()
let db

if (process.env.DATABASE_URL) {
    db = pgp({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    })
} else {
    //const username = process.env.DB_USER
    //const password = process.env.DB_PASS
    //const host = process.env.DB_HOST
    //const port = process.env.DB_PORT
//
    //let uri = `postgres://${username}:${password}@${host}:${port}/library2`
    //db = pgp(uri)
    const cn = {
        database: "d3etg4uerniqdl",
        host: "ec2-34-199-15-136.compute-1.amazonaws.com",
        port: "5432",
        user: "bvlhcayvqnzhcf",
        password: "81d4c1f7a3013e4a31b101a0b245c3caa812093b4fc3cb960fbef07d282987bb",
        ssl: { rejectUnauthorized: false },
        sslmode: "require"
    }
    
    db = pgp(cn);    
}

async function addBook(book) {
    const newBook = {
        title:  book.title,
        description: book.description,
        author_id: book.authorId 
    }

    const result = await db.one('INSERT INTO books(${this:name}) VALUES(${this:csv}) RETURNING id', newBook)
    console.log(result.id)
    return getOneBook(result.id);
}

async function updateBook(id, update) {
    await db.query("UPDATE books SET description = '${description:value}' WHERE id = ${id}", {
        id: id,
        description: update.description
    }
    )
    return getOneBook(id);
}

async function deleteBook(id) {
    await db.query("DELETE FROM books WHERE id = ${id}", {
        id: id
    })
    return true;
}

async function getBooks() {
    const books = await db.query(`
        select a.name author, b.title, b.description descr, b.id book_id
        from books AS b
        left join author AS a
        on a.id = b.author_id;
    `);

    return books
}

//TODO dölaksdöflkasdöflk 
async function getOneBook(id) {
    return await db.one('SELECT ${columns:name} FROM ${table:name} WHERE id = ${bookid}', {
        columns: ['id', 'title', 'description', 'author_id'],
        table: 'books',
        bookid: id
    });
}

module.exports = {
    addBook,
    getOneBook,
    getBooks,
    updateBook,
    deleteBook
}