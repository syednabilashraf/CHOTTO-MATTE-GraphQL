const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    name: String,
    genre: String,
    authorId : mongoose.Types.ObjectId
})

module.exports = mongoose.model('Book', bookSchema);