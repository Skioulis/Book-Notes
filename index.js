import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import * as db from "./js/db.js";
import ejs from 'ejs';

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

    // I will add it later
    // books.forEach(book => {
    //     if (book.bookimg === undefined || book.bookimg === null || book.bookimg === '') {
    //         book = db.getImages(book);
    //     }
    //
    // })
    const body = await ejs.renderFile('./views/index.ejs', {books: books});
    res.render("layout.ejs", {body: body});
    // res.render("index.ejs", {books: books});
})

app.get('/add', (req, res) => {
    res.render("add.ejs");
})

app.listen(port, () => {
    console.log(`Server running @ http://localhost:${port}`);
});