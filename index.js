import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import * as db from "./js/db.js";
import * as openLibraryApi from "./js/openLibraryApi.js";
import ejs from 'ejs';
import {getBookById} from "./js/db.js";

const app = express();
const port = 3000;
app.set('view engine', 'ejs');
app.set('views', './views');




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
    const body = await ejs.renderFile('views/pages/index.ejs', {books: books});
    res.render("layout.ejs", {body: body});
    // res.render("index.ejs", {books: books});
})

app.get('/add', async (req, res) => {
    const body = await ejs.renderFile('./views/pages/add.ejs');
    res.render("layout.ejs", {body: body});
})

app.get('/book/:id', async (req, res) => {
        const book = await db.getBookById(req.params.id);
        const notes = await db.getNotesByBookId(req.params.id)

        const body = await ejs.renderFile('./views/pages/book.ejs', {book: book , notes: notes});
        res.render("layout.ejs", {body: body});
    }
)

app.post('/add', async (req, res) => {
    try {
        const { title, author, summary, dateread, rating } = req.body;

        // Search for the book and get its cover image
        const result = await openLibraryApi.searchBookAndGetCover(title, author);

        // Prepare the book data
        const bookData = {
            title,
            author,
            summary,
            dateread,
            rating,
            bookimg: result.success ? result.imagePath : null
        };

        // Add the book to the database
        const newBook = await db.addBook(bookData);

        // Redirect to the home page
        res.redirect('/');
    } catch (error) {
        console.error('Error adding book:', error);
        res.status(500).send('An error occurred while adding the book');
    }
})

app.delete('/book/:id/delete', async (req, res) => {
    await db.deleteBook(req.params.id);
    res.redirect('/');
})

app.post('/book/:id/delete', async (req, res) => {
    try {
        await db.deleteBook(req.params.id);
        res.redirect('/');
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).send('An error occurred while deleting the book');
    }
});

app.get('/book/:id/edit', async (req, res) => {
    const book = await db.getBookById(req.params.id);

    console.log(notes);
    const body = await ejs.renderFile('./views/pages/edit.ejs', {
        book: book

    });
    res.render("layout.ejs", {body: body});
})


app.listen(port, () => {
    console.log(`Server running @ http://localhost:${port}`);
});
