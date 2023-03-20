const { nanoid } = require('nanoid');
const data = require('./models');

const insertBook = (req, res) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = req.payload;

    if (name === undefined) {
        const response = res.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = res.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const books = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
    };

    data.push(books);

    const isSuccess = data.filter((dt) => dt.id === id);

    if (isSuccess) {
        const response = res.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }

    const response = res.response({
        status: 'fail',
        message: 'Gagal menambahkan buku.',
    });
    response.code(500);
    return response;
};

const getAllBook = (req, res) => {
    const dataRaw = data.map((book) => {
        const { id, name, publisher } = book;
        return { id, name, publisher };
    });

    const queryData = () => {
        const { name, reading, finished } = req.query;
        let query = null;
        if (name !== undefined) {
            const filter = data.filter((book) => (
                book.name.toLowerCase().includes(name.toLowerCase())
            ));
            query = filter;
        }
        if (reading !== undefined) {
            if (reading === '1') {
                const filter = data.filter((book) => book.readPage > 0);
                query = filter;
            } else if (reading === '0') {
                const filter = data.filter((book) => book.readPage === 0);
                query = filter;
            }
        }
        if (finished !== undefined) {
            if (finished === '1') {
                const filter = data.filter((book) => book.finished === true);
                query = filter;
            } else if (finished === '0') {
                const filter = data.filter((book) => book.finished === false);
                query = filter;
            }
        }

        return query;
    };

    const query = queryData();

    if (query !== null) {
        const booksData = query.map((book) => {
            const { id, name, publisher } = book;
            return { id, name, publisher };
        });
        const response = res.response({
            status: 'success',
            data: {
                books: booksData,
            },
        });
        response.code(200);
        return response;
    }

    const response = res.response({
        status: 'success',
        data: {
            books: dataRaw,
        },
    });
    response.code(200);
    return response;
};

const getSelectedBook = (req, res) => {
    const { bookid } = req.params;

    const book = data.filter((dt) => dt.id === bookid)[0];
    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                book,
            },
        };
    }
    const response = res.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};

const editBook = (req, res) => {
    const { bookid } = req.params;

    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = req.payload;

    if (name === undefined) {
        const response = res.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = res.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    const index = data.findIndex((book) => book.id === bookid);

    if (index !== -1) {
        data[index] = {
            ...data[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
        };

        return {
            status: 'success',
            message: 'Buku berhasil diperbarui',
        };
    }

    const response = res.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

const deleteBook = (req, res) => {
    const { bookid } = req.params;

    const index = data.findIndex((book) => book.id === bookid);

    if (index !== -1) {
        data.splice(index, 1);
        return {
            status: 'success',
            message: 'Buku berhasil dihapus',
        };
    }

    const response = res.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

module.exports = {
    insertBook,
    getAllBook,
    getSelectedBook,
    editBook,
    deleteBook,
};
