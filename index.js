import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import * as db from "./js/db.js";


const app = express();
const port = 3000;



await db.ensureTablesExists();


// const db = new pg.Client({
//     user: "postgres",
//     host: "localhost",
//     database: "book-notes",
//     password: "123456",
//     port: 5432,
// });
// db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// async function getBooks () {
//     try {
//         let books = [];
//         const query = 'SELECT * FROM books';
//         const result = await db.query(query);
//         result.rows.forEach(row => {
//             books.push(row);
//         })
//
//         console.log(books);
//         return books;
//
//
//     } catch (err) {
//         console.error('Error ensuring table exists:', err);
//     }
// }


app.get('/', async (req, res) => {
    const books = await db.getBooks();

    books.forEach(book => {
        if (book.bookimg === undefined || book.bookimg === null || book.bookimg === '') {
            book = db.getImages(book);
        }

    })
    console.log(books);
    // res.json(books);
    // res.render("index.ejs", );
    res.render("index.ejs", {books: books});
})

app.listen(port, () => {
    console.log(`Server running @ http://localhost:${port}`);
});