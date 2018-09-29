'use strict';

const mongoose = require('mongoose');

const BookSchema = mongoose.Schema({
    title: { type: String, required: true, max: 60 },
    author: { type: String, required: true, max: 60},
    image: { type: String, required: true },
    created: { type: Date, default: Date.now }
});

BookSchema.methods.serialize = function() {
    return {
        id: this._id,
        title: this.title,
        author: this.author, 
        image: this.image,
        created: this.created
    };
};

const Book = mongoose.model('Book', BookSchema);

module.exports = { Book };