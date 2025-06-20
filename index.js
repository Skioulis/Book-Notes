import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import {ensureTablesExists} from "./js/db.js";


const app = express();
const port = 3000;



await ensureTablesExists();


const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "book-notes",
    password: "123456",
    port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function getBooks () {
    try {
        let books = [];
        const query = 'SELECT * FROM books';
        const result = await db.query(query);
        result.rows.forEach(row => {
            books.push(row);
        })

        console.log(books);
        return books;


    } catch (err) {
        console.error('Error ensuring table exists:', err);
    }
}


app.get('/', async (req, res) => {
    const books = await getBooks();

    // res.json(books);
    res.render("index.ejs");
})

app.listen(port, () => {
    console.log(`Server running @ http://localhost:${port}`);
});