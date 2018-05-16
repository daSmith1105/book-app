'use strict'

const LOCAL_API_URL = 'http://localhost:8080/books';
const WEB_API_URL = 'https://wishful-reading.herokuapp.com/books';

//CRUD operations
//Get all books on app start
function getAllBooks() {
    $.getJSON(WEB_API_URL, function(data) {
        for (let index in data) {
            $('.book-list').prepend(
                `<div class="book" id=${data[index].id}>
            <div class="edit-btn"></div>
            <div class="del-btn"></div>
            <div class="book-img"><img src=${data[index].image}></div>
            <div class="book-info">
                <p class="book-title">${data[index].title}</p>
                <p class="author">${data[index].author}</p>
            </div>
        </div>`);
        };
    });
}

//Show modal to create a new book
function addButtonHandler() {
    $('.js-add').on('click', function() {
        $('.data-input-modal').removeClass('hide');
    });
    $('.close-btn').on('click', function() {
        $('.data-input-modal').addClass('hide');
    });
}

//Create a new book
function handleNewBook() {
    $('.js-input-form').on('submit', function(event) {
        event.preventDefault();
        const titleInput = $(event.currentTarget).find('.js-title-input');
        const fNameInput = $(event.currentTarget).find('.js-fName-input');
        const lNameInput = $(event.currentTarget).find('.js-lName-input');
        const imageInput = $(event.currentTarget).find('.js-image-input');
        let title = titleInput.val();
        let fName = fNameInput.val();
        let lName = lNameInput.val();
        let uImage = imageInput.val();
        titleInput.val('');
        fNameInput.val('');
        lNameInput.val('');
        imageInput.val('');

        let bookObj = {
            "title": title,
            "image": uImage.toString('base64'),
            "author": {
                "firstName": fName,
                "lastName": lName
            }
        };

        console.log(bookObj);


        $.ajax({
            url: WEB_API_URL,
            type: "POST",
            data: JSON.stringify(bookObj),
            contentType: "application/json",
            complete: $('.book-list').prepend(
                `<div class="book">
                        <div class="edit-btn"><button type="button"></button></div>
                        <div class="del-btn"><button type="button"></button></div>
                        <div class="book-img"><img src=${uImage}></div>
                        <div class="book-info">
                            <p class="book-title">${title}</p>
                            <p class="author">${fName} ${lName}</p>
                        </div>
                    </div>`)
        });
        $('.data-input-modal').addClass('hide');
        //add modal to confirm new book added - title and author
        //add close button that performs getAllBooks()
    })
}

//Show modal to update a book
let editId;

function editButtonHandler() {
    $(document).on('click', '.edit-btn', function() {
        $('.data-modify-modal').removeClass('hide');
        const $this = $(this).parent();
        const targetEditId = $this.attr("id");
        editId = targetEditId;
        console.log(editId);
    });
    $('.close-mod-btn').on('click', function() {
        $('.data-modify-modal').addClass('hide');
    });
}

//Update and existing book
function handleEditBook() {
    $('.js-edit-form').on('submit', function(event) {
        event.preventDefault();
        console.log(editId);
        const titleInput = $(event.currentTarget).find('.js-title-edit');
        const fNameInput = $(event.currentTarget).find('.js-fName-edit');
        const lNameInput = $(event.currentTarget).find('.js-lName-edit');
        const imageInput = $(event.currentTarget).find('.js-image-edit');
        let title = titleInput.val();
        let fName = fNameInput.val();
        let lName = lNameInput.val();
        let image = imageInput.val();
        titleInput.val('');
        fNameInput.val('');
        lNameInput.val('');
        imageInput.val('');

        let updateObj = {
            "id": `${editId}`,
            "title": `${title}`,
            "image": `${image}`,
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
            complete: $('.book-list').prepend(
                `<div class="book">
                        <div class="edit-btn"><button type="button"></button></div>
                        <div class="del-btn"><button type="button"></button></div>
                        <div class="book-img"><img src=${image}></div>
                        <div class="book-info">
                            <p class="book-title">${title}</p>
                            <p class="author">${fName} ${lName}</p>
                        </div>
                    </div>`)
        })
        $('.data-modify-modal').addClass('hide');
        $('.grid-books').html('');
        getAllBooks();
    })
}

//Delete a current book
function deletButtonHandler() {
    $(document).on('click', '.del-btn', function(event) {
        const $this = $(this).parent();
        const targetId = $this.attr("id");
        const targetAuthorFname = $this.text();

        $('.delete-confirm-modal').find('.bookData').text(targetAuthorFname);
        $('.delete-confirm-modal').removeClass('hide');

        $('.delete-confirm-modal').on('click', '.del-deny-btn', function() {
            $('.delete-confirm-modal').addClass('hide');
        })

        $('.delete-confirm-modal').on('click', '.del-confirm-btn', function() {

            $.ajax({
                url: WEB_API_URL + '/' + targetId,
                type: 'DELETE',
                data: targetId,
                complete: $this.closest('.book').remove()
            });
            $('.delete-confirm-modal').addClass('hide');
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
}
$(appLoad);
