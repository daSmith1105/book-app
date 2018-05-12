'use strict';

const mongoose = require('mongoose');

const BookSchema = mongoose.Schema({
    title: { type: String, required: true, max: 100 },
    author: {
        firstName: { type: String, required: true, max: 20 },
        lastName: { type: String, required: true, max: 20 }
    },
    image: { data: Buffer, type: String },
    created: { type: Date, default: Date.now }
});


BookSchema.virtual('authorName').get(function() {
    return `${this.author.firstName} ${this.author.lastName}`.trim();
});

BookSchema.methods.serialize = function() {
    return {
        id: this._id,
        title: this.title,
        author: this.authorName,
        image: this.image,
        created: this.created
    };
};

const Book = mongoose.model('Book', BookSchema);

module.exports = { Book };