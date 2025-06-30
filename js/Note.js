export class Note {
    constructor(id, content, bookid) {
        this.id = id;
        this.content = content;
        this.bookid = bookid;
    }

    static fromObject(data) {
        return new Note(
            data.id,
            data.content,
            data.bookid
        );
    }

    toString() {
        return `${this.content}`;
    }
    toObject() {
        return {
            id: this.id,
            content: this.content,
            bookid: this.bookid
        }
    }
}