import { Pool } from 'pg';
import pg from 'pg';
import { Book } from './Book.js';
import {Note} from "./Note.js";

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

    // Don't end the pool here as it will be used by other functions
    // await pool.end()
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
        const query = 'SELECT * FROM books order by dateread asc';
        const result = await db.query(query);
        result.rows.forEach(row => {
            books.push(Book.fromObject(row));
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
    // If book is not already a Book instance, convert it
    if (!(book instanceof Book)) {
        book = Book.fromObject(book);
    }
    // book.bookimg = "1";
    return book;
}

/**
 * Adds a new book to the database.
 * 
 * @param {Object} bookData - The book data to add
 * @return {Promise<Book>} A promise that resolves to the newly added Book
 */
export async function addBook(bookData) {
    const db = new pg.Client({
        user: "postgres",
        host: "localhost",
        database: "book-notes",
        password: "123456",
        port: 5432,
    });

    try {
        await db.connect();

        const query = `
            INSERT INTO books (booktitle, summary, dateread, rating, bookimg, author)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;

        const values = [
            bookData.title,
            bookData.summary,
            bookData.dateread,
            bookData.rating,
            bookData.bookimg || null,
            bookData.author
        ];

        const result = await db.query(query, values);
        return Book.fromObject(result.rows[0]);
    } catch (err) {
        console.error('Error adding book:', err);
        throw err;
    } finally {
        await db.end();
    }
}

export async function getBookById(id) {
    const db = new pg.Client({
        user: "postgres",
        host: "localhost",
        database: "book-notes",
        password: "123456",
        port: 5432,
    });

    try {
        await db.connect();
        const query = `
            SELECT * FROM books WHERE id = $1
        `;
        const result = await db.query(query, [id]);
        return Book.fromObject(result.rows[0]);
    }catch (err){
        console.error('Error connecting to database:', err);
        throw err;
    } finally {
        await db.end();
    }
}

export async function deleteBook(id) {
    const db = new pg.Client({
        user: "postgres",
        host: "localhost",
        database: "book-notes",
        password: "123456",
        port: 5432,
    });
    db.connect();
    try {
        const query = `
            DELETE FROM books WHERE id = $1
        `;
        await db.query(query, [id]);

    } catch (err) {
        console.error('Error deleting book:', err);
        throw err;
    } finally {
        await db.end();
    }
}

export async function getNotesByBookId(id) {
    const db = new pg.Client({
        user: "postgres",
        host: "localhost",
        database: "book-notes",
        password: "123456",
        port: 5432,
    });
    db.connect();

    try {
        let notes = [];
        const query = `
            SELECT * FROM notes WHERE bookid = $1
        `;
        const result = await db.query(query, [id]);

        result.rows.forEach(row => {
        notes.push(Note.fromObject(row));
    })

        return notes;
    }catch (err) {
        console.error('Error ensuring table exists:', err);
    }
    finally {
        db.end();

    }
}

/**
 * Updates an existing book in the database.
 * 
 * @param {number} id - The ID of the book to update
 * @param {Object} bookData - The updated book data
 * @return {Promise<Book>} A promise that resolves to the updated Book
 */
export async function updateBook(id, bookData) {
    const db = new pg.Client({
        user: "postgres",
        host: "localhost",
        database: "book-notes",
        password: "123456",
        port: 5432,
    });

    try {
        await db.connect();

        const query = `
            UPDATE books 
            SET booktitle = $1, summary = $2, dateread = $3, rating = $4, bookimg = $5, author = $6
            WHERE id = $7
            RETURNING *
        `;

        const values = [
            bookData.booktitle,
            bookData.summary,
            bookData.dateread,
            bookData.rating,
            bookData.bookimg || null,
            bookData.author,
            id
        ];

        const result = await db.query(query, values);
        return Book.fromObject(result.rows[0]);
    } catch (err) {
        console.error('Error updating book:', err);
        // throw err;
    } finally {
        await db.end();
    }
}

/**
 * Updates a note in the database.
 * 
 * @param {number} id - The ID of the note to update
 * @param {string} content - The updated content of the note
 * @return {Promise<Note>} A promise that resolves to the updated Note
 */
export async function updateNote(id, content) {
    const db = new pg.Client({
        user: "postgres",
        host: "localhost",
        database: "book-notes",
        password: "123456",
        port: 5432,
    });

    try {
        await db.connect();

        const query = `
            UPDATE notes 
            SET content = $1
            WHERE id = $2
            RETURNING *
        `;

        const result = await db.query(query, [content, id]);
        return Note.fromObject(result.rows[0]);
    } catch (err) {
        console.error('Error updating note:', err);
        throw err;
    } finally {
        await db.end();
    }
}
