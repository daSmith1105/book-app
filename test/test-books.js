'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();

const { Book } = require('../models/booksModel');
const { closeServer, runServer, app } = require('../app');
const { TEST_DATABASE_URL } = require('../config');

chai.use(chaiHttp);

function tearDownDb() {
    return new Promise((resolve, reject) => {
        console.warn('Deleting database');
        mongoose.connection.dropDatabase()
            .then(result => resolve(result))
            .catch(err => reject(err));
    });
}

function seedBlogPostData() {
    console.info('seeding book data');
    const seedData = [];
    for (let i = 1; i <= 10; i++) {
        seedData.push({
            title: faker.lorem.sentence(),
            author: {
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName()
            },
            image: faker.lorem.sentence()
        });
    }

    return Book.insertMany(seedData);
}


describe('books API resource', function() {

    before(function() {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function() {
        return seedBlogPostData();
    });

    afterEach(function() {
        return tearDownDb();
    });

    after(function() {
        return closeServer();
    });

    describe('GET books API endpoint', function() {

        it('should return all existing books in database', function() {

            let res;
            return chai.request(app)
                .get('/books')
                .then(_res => {
                    res = _res;
                    res.should.have.status(200);
                    res.body.should.have.lengthOf.at.least(1);
                    return Book.count();
                })
                .then(count => {
                    res.body.should.have.lengthOf(count);
                });
        });

        it('should return books with right fields', function() {

            let resBook;
            return chai.request(app)
                .get('/books')
                .then(function(res) {

                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('array');
                    res.body.should.have.lengthOf.at.least(1);

                    res.body.forEach(function(book) {
                        book.should.be.a('object');
                        book.should.include.keys('id', 'title', 'author', 'image', 'created');
                    });
                    // check a single post to verify its values match with those in db
                    resBook = res.body[0];
                    return Book.findById(resBook.id);
                })
                .then(book => {
                    resBook.title.should.equal(book.title);
                    resBook.author.should.equal(book.authorName);
                    resBook.image.should.equal(book.image);
                });
        });
    });

    describe('POST to books API endpoint', function() {

        it('should add a new book', function() {

            const newBook = {
                title: faker.lorem.sentence(),
                author: {
                    firstName: faker.name.firstName(),
                    lastName: faker.name.lastName(),
                },
                image: faker.lorem.sentence()
            };

            return chai.request(app)
                .post('/books')
                .send(newBook)
                .then(function(res) {
                    res.should.have.status(201);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.include.keys(
                        'id', 'title', 'author', 'image', 'created');
                    res.body.title.should.equal(newBook.title);

                    res.body.id.should.not.be.null;
                    res.body.author.should.equal(
                        `${newBook.author.firstName} ${newBook.author.lastName}`);
                    res.body.image.should.equal(newBook.image);
                    return Book.findById(res.body.id);
                })
                .then(function(book) {
                    book.title.should.equal(newBook.title);
                    book.author.firstName.should.equal(newBook.author.firstName);
                    book.author.lastName.should.equal(newBook.author.lastName);
                    book.image.should.equal(newBook.image);
                });
        });
    });

    describe('PUT to books API endpoint', function() {

        it('should update fields sent over', function() {
            const updateData = {
                title: 'A Christmas Carol',
                author: {
                    firstName: 'Charles',
                    lastName: 'Dickens'
                },
                image: 'book cover image url',
            };

            return Book
                .findOne()
                .then(book => {
                    updateData.id = book.id;

                    return chai.request(app)
                        .put(`/books/${book.id}`)
                        .send(updateData);
                })
                .then(res => {
                    res.should.have.status(204);
                    return Book.findById(updateData.id);
                })
                .then(book => {
                    book.title.should.equal(updateData.title);
                    book.author.firstName.should.equal(updateData.author.firstName);
                    book.author.lastName.should.equal(updateData.author.lastName);
                    book.image.should.equal(updateData.image);
                });
        });
    });

    describe('DELETE a book from books API endpoint', function() {

        it('should delete a post by id', function() {

            let book;

            return Book
                .findOne()
                .then(_book => {
                    book = _book;
                    return chai.request(app).delete(`/books/${book.id}`);
                })
                .then(res => {
                    res.should.have.status(204);
                    return Book.findById(book.id);
                })
                .then(_book => {
                    should.not.exist(_book);
                });
        });
    });
});