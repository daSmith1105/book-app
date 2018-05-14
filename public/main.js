'use strict'

const LOCAL_API_URL = 'http://localhost:8080/books';
const LOCAL_API_URL_2 = 'http://localhost:8080/books/';
const WEB_API_URL = 'https://wishful-reading.herokuapp.com/books';

//CRUD operations
function getAllBooks() {
    $.getJSON(LOCAL_API_URL, function(data) {
        for (let index in data) {
            $('.book-list').append(
                `<div class="book" id=${data[index].id}>
            <div class="edit-btn"><button type="button"></button></div>
            <div class="del-btn"><button type="button"></button></div>
            <div class="book-img"><img src=${data[index].image}></div>
            <div class="book-info">
                <p class="book-title">${data[index].title}</p>
                <p class="author">${data[index].author}</p>
            </div>
        </div>`);
        };
    });
}

function addButtonHandler() {
    $('.js-add').on('click', function() {
        $('.data-input-modal').removeClass('hide');
    });
    $('.close-btn').on('click', function() {
        $('.data-input-modal').addClass('hide');
    });
}

function editButtonHandler() {
    $(document).on('click', '.edit-btn', function() {
        $('.data-modify-modal').removeClass('hide');
    });
    $('.close-mod-btn').on('click', function() {
        $('.data-modify-modal').addClass('hide');
    });
}

function handleEditBook() {
    $('.js-edit-form').on('submit', function(event) {
        event.preventDefault();
        alert('book modified');
        $('.data-modify-modal').addClass('hide');
    });

}

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
        let image = imageInput.val();
        titleInput.val('');
        fNameInput.val('');
        lNameInput.val('');
        imageInput.val('');

        let bookObj = {
            "title": `${title}`,
            "image": `${image}`,
            "author": {
                "firstName": `${fName}`,
                "lastName": `${lName}`
            }
        };

        $.ajax({
            url: LOCAL_API_URL,
            type: "POST",
            data: JSON.stringify(bookObj),
            contentType: "application/json",
            complete: $('.book-list').append(
                `<div class="book">
                        <div class="edit-btn"><button type="button"></button></div>
                        <div class="del-btn"><button type="button"></button></div>
                        <div class="book-img"><img src=${image}></div>
                        <div class="book-info">
                            <p class="book-title">${title}</p>
                            <p class="author">${fName} ${lName}</p>
                        </div>
                    </div>`)
        });
        $('.data-input-modal').addClass('hide');
    })
}

$(".closethis").click(function() {
    var $this = $(this).parent().parent();
    if ($this.attr("id") == "mainArea") {
        $("#myTbl").removeClass("myClass");
    }
});

function deletButtonHandler() {
    $(document).on('click', '.del-btn', function(event) {
        const $this = $(this).parent();
        const targetId = $this.attr("id");
        console.log(targetId);
        $.ajax({
            url: LOCAL_API_URL + '/' + targetId,
            type: 'DELETE',
            data: targetId,
            complete: this.closest('.book').remove()
        });
    })
    $('.cancel-btn').on('click', function() {
        $('.data-change-modal').addClass('hide');
    });
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