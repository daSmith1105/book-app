'use strict'

const LOCAL_API_URL = 'http://localhost:8080/books';
const WEB_API_URL = 'https://wishful-reading.herokuapp.com/books';

function scrollUp() {
    $(document).find('.scrollUp').on('click touch', function() {
        $("html, body").animate({
            scrollTop: $(".book-display").offset().top
        }, 1000);
    })
}

function scrollDown() {
    $(document).find('.scrollDown').on('click touch', function() {
        $("html, body").animate({
            scrollTop: $("body").offset().top
        }, 1000);
    })
}

function getAllBooks() {
    $.getJSON(WEB_API_URL, function(data) {
        for (let index in data) {
            $('.book-list').prepend(
                `<div class="book" id=${data[index].id} aria-live="assertive">
            <button class="edit-btn" title="Edit this book"></button>
            <button class="del-btn" title="Delete this book"></button>
            <div class="book-img"><img src="http://freestock.ca/vintage_ornamental_book_cover__sepia_nostalgia_sjpg4647.jpg"></div>
            <div class="book-info">
                <p class="book-title" id=${data[index].title}>${data[index].title}</p>
                <p class="author">${data[index].author}</p>
            </div>
        </div>`);
        };
    });
}

function addButtonHandler() {
    $('.js-add').on('click touch', function() {
        $('.data-input-modal').removeClass('hide');
        $('.edit-btn').addClass('hide');
        $('.del-btn').addClass('hide');

    });

    $('.close-btn').on('click', function() {
        $('.data-input-modal').addClass('hide');
        $('.edit-btn').removeClass('hide');
        $('.del-btn').removeClass('hide');
    });
}

function handleNewBook() {
    $('.js-input-form').on('submit', function(event) {
        event.preventDefault();
        $('.edit-btn').removeClass('hide');
        $('.del-btn').removeClass('hide');
        const titleInput = $(event.currentTarget).find('.js-title-input');
        const fNameInput = $(event.currentTarget).find('.js-fName-input');
        const lNameInput = $(event.currentTarget).find('.js-lName-input');
        let title = titleInput.val();
        let fName = fNameInput.val();
        let lName = lNameInput.val();
        titleInput.val('');
        fNameInput.val('');
        lNameInput.val('');

        let bookObj = {
            "title": title,
            "author": {
                "firstName": fName,
                "lastName": lName
            }
        };

        $.ajax({
            url: WEB_API_URL,
            type: "POST",
            data: JSON.stringify(bookObj),
            contentType: "application/json",
            complete: $('.book-list').prepend(
                `<div class="book" aria-live="assertive">
                        <button class="edit-btn" title="Edit this book"></button>
                        <button class="del-btn" title="Delete this book"></button>
                        <div class="book-img"><img src="http://freestock.ca/vintage_ornamental_book_cover__sepia_nostalgia_sjpg4647.jpg"></div>
                        <div class="book-info">
                            <p class="book-title" id=${title}>${title}</p>
                            <p class="author" id=${fName} ${lName}>${fName} ${lName}</p>
                        </div>
                    </div>`)
        });

        $('.data-input-modal').addClass('hide');
        $("html, body").animate({
            scrollTop: $(".book-display").offset().top
        }, 1000);
    })
}

let editId;
let $toDelete;

function editButtonHandler() {
    $(document).on('click touch', '.edit-btn', function() {
        $("html, body").animate({
            scrollTop: $("body").offset().top
        }, 1000);
        $('.data-modify-modal').removeClass('hide');
        const $this = $(this).parent();
        $toDelete = $(this).parent();
        const targetEditId = $this.attr("id");
        const targetEditTitle = $this.find('.book-title').text();
        const targetEditAuthor = $this.find('.author').text();
        editId = targetEditId;
        let editTitle = targetEditTitle
        let editAuthor = targetEditAuthor;

        $('.js-edit-form').find('.book-to-edit').text(editTitle + " - " + editAuthor);
        $('.edit-btn').addClass('hide');
        $('.del-btn').addClass('hide');
    });

    $('.close-mod-btn').on('click', function() {
        $('.data-modify-modal').addClass('hide');
        $('.edit-btn').removeClass('hide');
        $('.del-btn').removeClass('hide');
    });
}

function handleEditBook() {
    $('.js-edit-form').on('submit', function(event) {
        event.preventDefault();
        const titleInput = $(event.currentTarget).find('.js-title-edit');
        const fNameInput = $(event.currentTarget).find('.js-fName-edit');
        const lNameInput = $(event.currentTarget).find('.js-lName-edit');
        let title = titleInput.val();
        let fName = fNameInput.val();
        let lName = lNameInput.val();
        titleInput.val('');
        fNameInput.val('');
        lNameInput.val('');

        let updateObj = {
            "id": `${editId}`,
            "title": `${title}`,
            "author": {
                "firstName": `${fName}`,
                "lastName": `${lName}`
            }
        };

        $.ajax({
            url: WEB_API_URL + '/' + editId,
            type: 'PUT',
            data: JSON.stringify(updateObj),
            contentType: "application/json",
            complete: function() {
                ($toDelete).remove();
                $('.book-list').prepend(
                    `<div class="book" aria-live="assertive">
                        <button class="edit-btn" title="Edit this book"></button>
                        <button class="del-btn" title="Delete this book"></button>
                        <div class="book-img"><img src="http://freestock.ca/vintage_ornamental_book_cover__sepia_nostalgia_sjpg4647.jpg"></div>
                        <div class="book-info">
                            <p class="book-title">${title}</p>
                            <p class="author">${fName} ${lName}</p>
                        </div>
                    </div>`)
            }
        });
        $('.data-modify-modal').addClass('hide');
        $("html, body").animate({
            scrollTop: $(".book-display").offset().top
        }, 1000);
        $('.edit-btn').removeClass('hide');
        $('.del-btn').removeClass('hide');
    })
}

function deletButtonHandler() {
    $(document).on('click touch', '.del-btn', function(event) {
        const $this = $(this).parent();
        const targetId = $this.attr("id");
        const targetEditTitle = $this.find('.book-title').text();
        const targetEditAuthor = $this.find('.author').text();

        $('.delete-confirm-modal').find('.bookData').text(targetEditTitle + " - " + targetEditAuthor);

        $("html, body").animate({
            scrollTop: $("body").offset().top
        }, 1000);

        $('.edit-btn').css('display', 'none');
        $('.del-btn').addClass('hide');
        $('.delete-confirm-modal').removeClass('hide');

        $('.delete-confirm-modal').on('click', '.del-deny-btn', function() {
            $('.delete-confirm-modal').addClass('hide');
            $('.edit-btn').css('display', 'block');
            $('.del-btn').removeClass('hide');
        })

        $('.delete-confirm-modal').on('click', '.del-confirm-btn', function() {

            $.ajax({
                url: WEB_API_URL + '/' + targetId,
                type: 'DELETE',
                data: targetId,
                complete: $this.closest('.book').remove()
            });
            $('.delete-confirm-modal').addClass('hide');
            $('.edit-btn').css('display', 'block');
            $('.del-btn').removeClass('hide');
        })
    })
}


function appLoad() {
    $(getAllBooks);
    $(addButtonHandler);
    $(editButtonHandler);
    $(deletButtonHandler);
    $(handleNewBook);
    $(handleEditBook);
    $(scrollUp);
    $(scrollDown);
}

$(appLoad);