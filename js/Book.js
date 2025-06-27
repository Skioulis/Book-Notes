/**
 * Represents a book in the Book-Notes application.
 */
export class Book {
    /**
     * Creates a new Book instance.
     * 
     * @param {number} id - The unique identifier for the book
     * @param {string} booktitle - The title of the book
     * @param {string} summary - A summary or description of the book
     * @param {Date} dateread - The date when the book was read
     * @param {number} rating - The rating given to the book (1-10)
     * @param {string|null} bookimg - URL or path to the book's image, can be null
     * @param {string} author - The author of the book
     */
    constructor(id, booktitle, summary, dateread, rating, bookimg, author) {
        this.id = id;
        this.booktitle = booktitle;
        this.summary = summary;
        this.dateread = dateread;
        this.rating = rating;
        this.bookimg = bookimg;
        this.author = author;
    }

    /**
     * Creates a Book instance from a database row or object.
     * 
     * @param {Object} data - The data object containing book properties
     * @returns {Book} A new Book instance
     */
    static fromObject(data) {
        return new Book(
            data.id,
            data.booktitle,
            data.summary,
            data.dateread instanceof Date ? data.dateread : new Date(data.dateread),
            data.rating,
            data.bookimg,
            data.author
        );
    }

    /**
     * Returns a string representation of the book.
     * 
     * @returns {string} A string representation of the book
     */
    toString() {
        return `${this.booktitle} by ${this.author} (Rating: ${this.rating}/10)`;
    }

    /**
     * Converts the Book instance to a plain object suitable for JSON serialization.
     * 
     * @returns {Object} A plain object representation of the book
     */
    toObject() {
        return {
            id: this.id,
            booktitle: this.booktitle,
            summary: this.summary,
            dateread: this.dateread,
            rating: this.rating,
            bookimg: this.bookimg,
            author: this.author
        };
    }
}