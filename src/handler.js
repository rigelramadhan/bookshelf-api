const books = require('./books');
const {nanoid} = require('nanoid');

const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  const book = {
    id, name, year, author, summary, publisher, pageCount,
    readPage, reading, insertedAt, updatedAt, finished,
  };

  if (name === undefined || name.length < 1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });

    response.code(400);

    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. ' +
        'readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);

    return response;
  }

  books.push(book);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });

    response.code(201);

    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });

  response.code(500);

  return response;
};

const getAllBooksHandler = (request, h) => {
  const {name, reading, finished} = request.query;

  let filteredBooks = books;

  if (name !== undefined) {
    filteredBooks = filteredBooks.filter(
        (book) => book.name.toLowerCase() === name.toLowerCase(),
    );
  }

  if (reading !== undefined) {
    filteredBooks = filteredBooks.filter(
        (book) => book.reading == reading,
    );
  }

  if (finished !== undefined) {
    filteredBooks = filteredBooks.filter(
        (book) => book.finished == finished,
    );
  }

  const response = h.response({
    status: 'success',
    data: {
      books: filteredBooks.map(({id, name, publisher}) =>
        ({id, name, publisher}),
      ),
    },
  });

  return response;
};

const getBookByIdHandler = (request, h) => {
  const {id} = request.params;

  const book = books.filter((book) => book.id === id);

  if (book.length > 0) {
    return ({
      status: 'success',
      data: {
        book: book[0],
      },
    });
  } else {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });

    response.code(404);

    return response;
  }
};

const editBookByIdHandler = (request, h) => {
  const {id} = request.params;

  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const updatedAt = new Date().toISOString();
  const finished = pageCount === readPage;

  const index = books.findIndex((note) => note.id === id);

  if (name === undefined || name.length < 1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });

    response.code(400);

    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. ' +
        'readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);

    return response;
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
      finished,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });

    response.code(200);

    return response;
  } else {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });

    response.code(404);

    return response;
  }
};

const deleteBookByIdHandler = (request, h) => {
  const {id} = request.params;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });

    response.code(200);

    return response;
  } else {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });

    response.code(404);

    return response;
  }
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
