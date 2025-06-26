# Book Notes

A web application for managing and organizing your book reading notes. Keep track of books you've read, rate them, and store your thoughts and notes about each book.

## Features

- 📚 Display a list of books you've read
- ⭐ Rate books on a scale of 1-10
- 📝 Store detailed notes for each book
- 📅 Track when you read each book
- 🖼️ Optional book cover images
- 📊 Book summaries and author information

## Technology Stack

- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL
- **Frontend**: EJS templating engine with Bootstrap
- **Styling**: Bootstrap 5.3.7

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (version 14 or higher)
- PostgreSQL database server
- npm (Node Package Manager)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Skioulis/Book-Notes.git
   cd Book-Notes
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up PostgreSQL database:
   - Create a database named `book-notes`
   - Update database credentials in `index.js` and `js/db.js` if needed:
     - Username: `postgres`
     - Password: `123456`
     - Host: `localhost`
     - Port: `5432`

4. The application will automatically create the required tables (`books` and `notes`) when you first run it.

## Usage

1. Start the application:
   ```bash
   node index.js
   ```

2. Open your web browser and navigate to:
   ```
   http://localhost:3000
   ```

3. The application will display your book list. Initially, it will be empty unless you populate it with sample data.

## Database Schema

### Books Table
- `id` (Primary Key): Unique identifier
- `booktitle`: Title of the book
- `summary`: Book summary/description
- `dateread`: Date when the book was read
- `rating`: Rating from 1-10
- `bookimg`: Optional book cover image URL
- `author`: Book author

### Notes Table
- `id` (Primary Key): Unique identifier
- `content`: Note content
- `bookid` (Foreign Key): References the book this note belongs to

## Sample Data

To populate the database with sample data for testing:

1. Run the data insertion script:
   ```bash
   node js/dbInsertData.js
   ```

This will add sample books including classics like "1984", "The Great Gatsby", "To Kill a Mockingbird", etc., along with associated notes.

## Project Structure

```
Book-Notes/
├── index.js              # Main application server
├── package.json          # Project dependencies and metadata
├── js/
│   ├── db.js             # Database connection and table creation
│   └── dbInsertData.js   # Sample data insertion script
├── views/
│   ├── index.ejs         # Main page template
│   └── partials/         # EJS partial templates
├── public/               # Static files (CSS, JS, images)
├── test data/            # CSV files with test data
└── node_modules/         # Node.js dependencies
```

## Development

The application uses ES modules (`"type": "module"` in package.json), so make sure to use `import/export` syntax instead of `require/module.exports`.

### Key Files:
- `index.js`: Main Express server with routes and database queries
- `js/db.js`: Database connection pooling and table creation
- `views/index.ejs`: Frontend template for displaying books
- `js/dbInsertData.js`: Utility for inserting sample data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Author

**Skioulis** - [GitHub Profile](https://github.com/Skioulis)

## Issues and Support

If you encounter any issues or have questions, please visit the [Issues page](https://github.com/Skioulis/Book-Notes/issues) on GitHub.