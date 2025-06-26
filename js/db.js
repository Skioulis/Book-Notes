import { Pool } from 'pg';
import pg from 'pg';

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'book-notes',
    password: '123456',
    port: 5432,
});

/**
 * Ensures that the required database tables `books` and `notes` exist.
 * If the tables do not exist, they are created with the specified schema.
 *
 * @return {Promise<void>} A promise that resolves when the operation is complete.
 */
export async function ensureTablesExists() {
    const createBookTableQuery = `
    CREATE TABLE IF NOT EXISTS books (
        id serial primary key, 
        booktitle text not null, 
        summary text not null,
        dateread date not null,
        rating integer not null,
        bookimg text,
        author text not null
    );
  `;
   const createNoteTableQuery = `
    CREATE TABLE IF NOT EXISTS notes (
    id serial constraint notes_pk primary key,
    content text not null,
    bookid  integer not null
    constraint notes_books_id_fk
    references books(id)
    on delete cascade
    );
    `;

    await poolQuery(createBookTableQuery);
    await poolQuery(createNoteTableQuery);

    await pool.end()
}

async function poolQuery (query) {
    try {
        await pool.query(query);
        console.log('Table checked (created if not exists).');
    } catch (err) {
        console.error('Error ensuring table exists:', err);
    }
}

export async function getBooks () {
    const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "book-notes",
    password: "123456",
    port: 5432,
});
db.connect();
    try {
        let books = [];
        const query = 'SELECT * FROM books';
        const result = await db.query(query);
        result.rows.forEach(row => {
            books.push(row);
        })

        // console.log(books);
        return books;



    } catch (err) {
        console.error('Error ensuring table exists:', err);
    }
    finally {
        db.end();
    }
}

export async function getImages (book) {
    console.log(book);
    book.bookimg = "1";
    return book;
}