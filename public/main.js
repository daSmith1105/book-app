'use strict'

// testing data only

var MOCK_BOOK_LIST = {
    "books": [{
            "id": "1111111",
            "title": "Going Broke",
            "author": {
                "firstName": "Author",
                "lastName": "Name"
            },
            "image": "http://www.creativindiecovers.com/wp-content/uploads/2013/08/8finance.jpg",
            "created": 1470016976609
        },
        {
            "id": "1111112",
            "title": "Animal Farm",
            "author": {
                "firstName": "George",
                "lastName": "Orwell"
            },
            "image": "https://battleroyalewithcheese.com/wp-content/uploads/2016/05/9780143416319.jpg",
            "created": 1570016976609
        },
        {
            "id": "1111113",
            "title": "To Kill a Mockingbird",
            "author": {
                "firstName": "Harper",
                "lastName": "Lee"
            },
            "image": "https://media.glamour.com/photos/56e1f3c462b398fa64cbd304/master/w_1280,c_limit/entertainment-2016-02-18-main.jpg",
            "created": 1670016976609
        },
        {
            "id": "1111114",
            "title": "This Way Up",
            "author": {
                "firstName": "Paige",
                "lastName": "Nick"
            },
            "image": "http://3.bp.blogspot.com/-KMV1i4g_Cj4/TrOA9YrTLgI/AAAAAAAAAo8/X6yyVhkM5K0/s1600/9780143527558.jpg",
            "created": 1770016976609
        },
        {
            "id": "1111113",
            "title": "To Kill a Mockingbird",
            "author": {
                "firstName": "Harper",
                "lastName": "Lee"
            },
            "image": "https://media.glamour.com/photos/56e1f3c462b398fa64cbd304/master/w_1280,c_limit/entertainment-2016-02-18-main.jpg",
            "created": 1670016976609
        },
        {
            "id": "1111114",
            "title": "This Way Up",
            "author": {
                "firstName": "Paige",
                "lastName": "Nick"
            },
            "image": "http://3.bp.blogspot.com/-KMV1i4g_Cj4/TrOA9YrTLgI/AAAAAAAAAo8/X6yyVhkM5K0/s1600/9780143527558.jpg",
            "created": 1770016976609
        },
        {
            "id": "1111112",
            "title": "Animal Farm",
            "author": {
                "firstName": "George",
                "lastName": "Orwell"
            },
            "image": "https://battleroyalewithcheese.com/wp-content/uploads/2016/05/9780143416319.jpg",
            "created": 1570016976609
        },
        {
            "id": "1111111",
            "title": "Going Broke",
            "author": {
                "firstName": "Author",
                "lastName": "Name"
            },
            "image": "http://www.creativindiecovers.com/wp-content/uploads/2013/08/8finance.jpg",
            "created": 1470016976609
        }
    ]
};

function getBooks(callbackFn) {
    setTimeout(function() { callbackFn(MOCK_BOOK_LIST) }, 1000);
}

// this function stays the same when we connect
// to real API later
function displayBookList(data) {
    for (let index in data.books) {
        $('.book-list').append(
            `<div class="book">
            <div class="edit-btn"><button type="button"></button></div>
            <div class="del-btn"><button type="button"></button></div>
            <div class="book-img"><img src=${data.books[index].image}></div>
            <div class="book-info">
                <p class="book-title">${data.books[index].title}</p>
                <p class="author">${data.books[index].author.firstName} ${data.books[index].author.lastName}</p>
            </div>
        </div>`);
    }
}

// this function can stay the same even when we
// are connecting to real API
function getAndDisplayBooks() {
    getBooks(displayBookList);
}

$(function() {
    getAndDisplayBooks();
})

//end test data



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
        alert('book submitted');
        $('.data-input-modal').addClass('hide');
    });
}


function deletButtonHandler() {
    $(document).on('click', '.del-btn', function() {
        this.closest('.book').remove();
    });
    $('.cancel-btn').on('click', function() {
        $('.data-change-modal').addClass('hide');
    });
}

function appLoad() {
    $(addButtonHandler);
    $(editButtonHandler);
    $(deletButtonHandler);
    $(handleNewBook);
    $(handleEditBook);
}
$(appLoad);