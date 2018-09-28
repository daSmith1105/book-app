'use strict';

const mongoose = require('mongoose');

const BookSchema = mongoose.Schema({
    title: { type: String, required: true, max: 60 },
    author: { type: String, required: true, max: 40},
    image: { type: String, default: 'https://www.google.com/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwjHpZy38dHdAhVh0oMKHQDWBscQjRx6BAgBEAU&url=http%3A%2F%2Fselo.l-ink.co%2Fgeneric-book%2F&psig=AOvVaw1sGE8EgjcLJ-l6RYCZzk7z&ust=1537818189179876' },
    created: { type: Date, default: Date.now }
});


// BookSchema.virtual('authorName').get(function() {
//     return `${this.author.firstName} ${this.author.lastName}`.trim();
// });

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