import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Search for a book in the OpenLibrary API.
 * 
 * @param {string} title - The title of the book
 * @param {string} author - The author of the book
 * @return {Promise<Object|null>} A promise that resolves to the book data or null if not found
 */
export async function searchBook(title, author) {
    try {
        // Construct the search query
        const query = `title:${encodeURIComponent(title)}+author:${encodeURIComponent(author)}`;
        const url = `https://openlibrary.org/search.json?q=${query}`;
        
        // Fetch the search results
        const response = await fetch(url);
        const data = await response.json();
        
        // Return the first result if available
        if (data.docs && data.docs.length > 0) {
            return data.docs[0];
        }
        
        return null;
    } catch (error) {
        console.error('Error searching for book:', error);
        return null;
    }
}

/**
 * Get the cover image for a book and save it to the public/images directory.
 * 
 * @param {string} title - The title of the book
 * @param {string} author - The author of the book
 * @param {string} identifier - The OLID or ISBN of the book
 * @param {string} identifierType - The type of identifier ('olid' or 'isbn')
 * @return {Promise<string|null>} A promise that resolves to the path of the saved image or null if failed
 */
export async function getAndSaveCoverImage(title, author, identifier, identifierType) {
    try {
        // Sanitize title and author for filename
        const sanitizedTitle = title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        const sanitizedAuthor = author.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        const filename = `${sanitizedTitle}_${sanitizedAuthor}.jpg`;
        
        // Create the full path for the image
        const imagesDir = path.join(__dirname, '..', 'public', 'images');
        const imagePath = path.join(imagesDir, filename);
        
        // Ensure the images directory exists
        if (!fs.existsSync(imagesDir)) {
            fs.mkdirSync(imagesDir, { recursive: true });
        }
        
        // Construct the URL for the cover image
        const coverUrl = `https://covers.openlibrary.org/b/${identifierType}/${identifier}-M.jpg`;
        
        // Fetch the cover image
        const response = await fetch(coverUrl);
        
        // Check if the image was found
        if (!response.ok) {
            console.error(`Failed to fetch cover image: ${response.status} ${response.statusText}`);
            return null;
        }
        
        // Save the image to the file system
        const buffer = await response.buffer();
        fs.writeFileSync(imagePath, buffer);
        
        // Return the relative path to the image (for storing in the database)
        return `/images/${filename}`;
    } catch (error) {
        console.error('Error getting and saving cover image:', error);
        return null;
    }
}

/**
 * Search for a book and get its cover image in one operation.
 * 
 * @param {string} title - The title of the book
 * @param {string} author - The author of the book
 * @return {Promise<Object>} A promise that resolves to an object with book data and image path
 */
export async function searchBookAndGetCover(title, author) {
    try {
        // Search for the book
        const bookData = await searchBook(title, author);
        
        if (!bookData) {
            return { success: false, message: 'Book not found' };
        }
        
        // Determine the identifier to use for the cover image
        let identifier;
        let identifierType;
        
        if (bookData.cover_i) {
            // If we have a cover ID, use that
            identifier = bookData.cover_i;
            identifierType = 'id';
        } else if (bookData.isbn && bookData.isbn.length > 0) {
            // If we have an ISBN, use that
            identifier = bookData.isbn[0];
            identifierType = 'isbn';
        } else if (bookData.key) {
            // If we have an OLID (in the key), use that
            identifier = bookData.key.replace('/works/', '');
            identifierType = 'olid';
        } else {
            return { 
                success: false, 
                message: 'No identifier found for cover image',
                bookData 
            };
        }
        
        // Get and save the cover image
        const imagePath = await getAndSaveCoverImage(title, author, identifier, identifierType);
        
        return {
            success: true,
            bookData,
            imagePath
        };
    } catch (error) {
        console.error('Error in searchBookAndGetCover:', error);
        return { success: false, message: error.message };
    }
}