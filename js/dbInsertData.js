import pg from 'pg';

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "book-notes",
    password: "123456",
    port: 5432,
});
db.connect();

async function dbQuery (query) {
    try {
        await db.query(query);
        console.log('Table checked (created if not exists).');
    } catch (err) {
        console.error('Error ensuring table exists:', err);
    }
}


const booksQuery = `
  INSERT INTO books (id, booktitle, summary, dateread, rating, author) VALUES 
  (5, '1984', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam vitae lacus nec urna facilisis euismod id sit.', '2025-06-03', 5, 'George Orwell'),
  (7, 'Great Expectations', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam vitae lacus nec urna facilisis euismod id sit.', '2025-06-19', 7, 'Charles Dickens'),
  (4, 'To Kill a Mockingbird', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam vitae lacus nec urna facilisis euismod id sit.', '2025-06-25', 4, 'Harper Lee'),
  (3, 'The Great Gatsby', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam vitae lacus nec urna facilisis euismod id sit.', '2025-06-02', 1, 'F. Scott Fitzgerald'),
  (6, 'The Catcher in the Rye', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam vitae lacus nec urna facilisis euismod id sit.', '2025-06-05', 8, 'J. D. Salinger')
`;

dbQuery(booksQuery);

const notesQuery = `
  INSERT INTO notes (id, content, bookid) VALUES 
  (22, 'Lorem ipsum dolor sit amet', 3),
  (23, 'Lorem ipsum dolor sit amet', 3), 
  (24, 'Lorem ipsum dolor sit amet', 3),
  (25, 'Lorem ipsum dolor sit amet', 4),
  (26, 'Lorem ipsum dolor sit amet', 4),
  (27, 'Lorem ipsum dolor sit amet', 4),
  (28, 'Lorem ipsum dolor sit amet', 5),
  (29, 'Lorem ipsum dolor sit amet', 5),
  (30, 'Lorem ipsum dolor sit amet', 5),
  (31, 'Lorem ipsum dolor sit amet', 6),
  (32, 'Lorem ipsum dolor sit amet', 6),
  (33, 'Lorem ipsum dolor sit amet', 6),
  (34, 'Lorem ipsum dolor sit amet', 7),
  (35, 'Lorem ipsum dolor sit amet', 7),
  (36, 'Lorem ipsum dolor sit amet', 7)
`;


// await dbQuery(booksQuery);
await dbQuery(notesQuery);

db.close();
