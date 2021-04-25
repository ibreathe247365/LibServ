const Book = require('../models/book');

module.exports.index = async (req, res) => {
    const books = await Book.find({});
    res.render('books/index', { books })
}

module.exports.renderNewForm = (req, res) => {
    res.render('books/new');
}

module.exports.createBook = async (req, res, next) => {
    const book = new Book(req.body.book);
    book.author = req.user._id;
    await book.save();
    req.flash('success', 'Successfully made a new book entry!');
    res.redirect(`/books/${book._id}`)
}

module.exports.showBook = async (req, res,) => {
    const book = await Book.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!book) {
        req.flash('error', 'Cannot find that entry!');
        return res.redirect('/books');
    }
    res.render('books/show', { book });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const book = await Book.findById(id)
    if (!book) {
        req.flash('error', 'Cannot find that entry!');
        return res.redirect('/books');
    }
    res.render('books/edit', { book });
}

module.exports.updateBook = async (req, res) => {
    const { id } = req.params;
    const book = await Book.findByIdAndUpdate(id, { ...req.body.book });
    req.flash('success', 'Successfully updated entry!');
    res.redirect(`/books/${book._id}`)
}

module.exports.deleteBook = async (req, res) => {
    const { id } = req.params;
    await Book.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted entry!')
    res.redirect('/books');
}