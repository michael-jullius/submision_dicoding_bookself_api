const {
    insertBook,
    getAllBook,
    getSelectedBook,
    editBook,
    deleteBook,
} = require('./handler');

const routers = [
    {
        method: 'POST',
        path: '/books',
        handler: insertBook,
    },
    {
        method: 'GET',
        path: '/books',
        handler: getAllBook,
    },
    {
        method: 'GET',
        path: '/books/{bookid}',
        handler: getSelectedBook,
    },
    {
        method: 'PUT',
        path: '/books/{bookid}',
        handler: editBook,
    },
    {
        method: 'DELETE',
        path: '/books/{bookid}',
        handler: deleteBook,
    },
];

module.exports = routers;
