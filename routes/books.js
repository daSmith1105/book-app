const { Book } = require('../models/booksModel.js');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

app.use(express.json());

// Create a new book
app.post('/', (req, res) => {
    const requiredFields = ['title', 'author', 'image'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }

    Book
        .create({
            title: req.body.title,
            author: req.body.author,
            image: req.body.image
        })
        .then(book => res.status(201).json(book.serialize()))
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Ooops, something went wrong!' });
        });

});

//Get all books
app.get('/', (req, res) => {
    Book
        .find()
        .then(books => {
            res.json(books.map(book => book.serialize()));
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Ooops, something went wrong!' });
        });
});

//Get a book by id
app.get('/:id', (req, res) => {
    Book
        .findById(req.params.id)
        .then(book => res.json(book.serialize()))
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Ooops, something went wrong!' });
        });
});

//Edit a book
app.put('/:id', (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        res.status(400).json({
            error: 'Request path id and request body id values must match'
        });
    }

    const updated = {};
    const updateableFields = ['title', 'author', 'image'];
    updateableFields.forEach(field => {
        if (field in req.body) {
            updated[field] = req.body[field];
        }
    });

    Book
        .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
        .then(updatedPost => res.status(204).end())
        .catch(err => res.status(500).json({ message: 'Ooops, something went wrong!' }));
});

//Delete a book
app.delete('/:id', (req, res) => {
    Book
        .findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).json({ message: 'success' });
            console.log(`Deleted wishlist book with id \`${req.params.id}\``);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Ooops, something went wrong!' });
        });
});

module.exports = app;