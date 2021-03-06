'use strict'

const LOCAL_API_URL = 'http://localhost:8080/books';
const WEB_API_URL = 'https://wishfulreading.herokuapp.com/books';


const GOOGLE_BOOK_URL = "https://www.googleapis.com/books/v1/volumes?q=";
const GOOGLE_API_KEY = "&key=AIzaSyBrBiWNa5_vKVtvNdgKjB-Ff4xg3eZMFdk";
const MAX_RESULTS = "&maxResults=8";
const MEDIA_TYPE = "&printType=books";



function getAllBooks() {
    $.getJSON(WEB_API_URL, function(data) {
        for (let index in data) {
            $('.book-list').prepend(
                `<div class="book" id=${data[index].id} aria-live="assertive">
            <button class="edit-btn" title="Edit this book"></button>
            <button class="del-btn" title="Delete this book"></button>
            <div class="book-img"><img src=${data[index].image}></div>
            <div class="book-info">
                <p class="book-title" id=${data[index].title}>${data[index].title}</p>
                <p class="author">${data[index].author}</p>
            </div>
        </div>`);
        };
    });
}

function addButtonHandler() {
    $('.js-add').on('click', function() {
        $('.data-input-modal').removeClass('hide');
        $('.edit-btn').prop('disabled', true);
        $('.del-btn').prop('disabled', true);

    });

    $('.close-btn').on('click', function() {
        $('.data-input-modal').addClass('hide');
        $('.edit-btn').prop('disabled', false);
        $('.edit-btn').prop('disabled', false);
        const titleInput = $(document).find('.js-title-input');
        const fNameInput = $(document).find('.js-fName-input');
        const lNameInput = $(document).find('.js-lName-input');
        titleInput.val('');
        fNameInput.val('');
        lNameInput.val('');
    });
}

function handleBookSearch() {
    $('.js-input-form').on('submit', function(event) {
        event.preventDefault();

        let google_data = {};
        let SEARCH_QUERY;

        const titleInput = $(event.currentTarget).find('.js-title-input');
        const fNameInput = $(event.currentTarget).find('.js-fName-input');
        const lNameInput = $(event.currentTarget).find('.js-lName-input');

        let title = titleInput.val().trim();
        let fName = fNameInput.val().trim();
        let lName = lNameInput.val().trim();
        let fullName = fName + '%20' + lName;

        if( title.length > 0 && fName.length > 0 && lName.length > 0 ) {
            SEARCH_QUERY = `intitle:${title}+inauthor:${fullName}`;
        } else if ( title.length > 0 && fName.length > 0 && lName.length === 0 ) {
            SEARCH_QUERY = `intitle:${title}+inauthor:${fName}`;
        } else if ( title.length > 0 && fName.length === 0 && lName.length > 0 ) {
            SEARCH_QUERY = `intitle:${title}+inauthor:${lName}`;
        } else if ( title.length > 0 && fName.length === 0 && lName.length === 0 ){
            SEARCH_QUERY = `intitle:${title}`;
        } else if ( title.length === 0 && fName.length > 0 && lName.length === 0 ){
            SEARCH_QUERY = `inauthor:${fName}`;
        } else if ( title.length === 0 && fName.length === 0 && lName.length > 0 ){
            SEARCH_QUERY = `inauthor:${lName}`;
        } else if ( title.length === 0 && fName.length > 0 && lName.length > 0 ){
            SEARCH_QUERY = `inauthor:${fullName}`;
        } else {
            alert("must enter title or author");
        };

        // get 4 books matching search criteria and set google_data to the result
        $.getJSON(`${GOOGLE_BOOK_URL}${SEARCH_QUERY}${MAX_RESULTS}${MEDIA_TYPE}${GOOGLE_API_KEY}`, function(data) {

            $('.cancel-select').on('click', function() {
                $('.cover-select-modal').addClass('hide');
                $('.data-input-modal').removeClass('hide');
                const titleInput = $(document).find('.js-title-input');
                const fNameInput = $(document).find('.js-fName-input');
                const lNameInput = $(document).find('.js-lName-input');
                titleInput.val('');
                fNameInput.val('');
                lNameInput.val('');
            });

            if (data.totalItems < 1) {
                $('.cover-select-modal').removeClass('hide');
                $('.data-input-modal').addClass('hide');

                $('.cover-select-content').html( `<div class="no-cover">
                                                    <p>No cover image found. Please try again or select continue to save your book with a generic cover image.</p>
                                                    <img src="http://freestock.ca/vintage_ornamental_book_cover__sepia_nostalgia_sjpg4647.jpg" />
                                                    <p class="no-cover-title">${title}</p>
                                                    <p>${fullName.split('%20').join(' ')}</p>
                                                  </div>`);
                $('.back').on('click', function() {
                    $('.cover-select-modal').addClass('hide');
                    $('.data-input-modal').removeClass('hide');
                })
            } else {

                google_data = data.items;

                $('.cover-select-modal').removeClass('hide');
                $('.data-input-modal').addClass('hide');
                $('.cover-select-content').empty();
           
                Object.keys(google_data).map((index) => {
                    if(!google_data[index].volumeInfo.imageLinks) {
                        let currentAuthor = '';
                        if(!google_data[index].volumeInfo.authors) {
                            currentAuthor = 'Author not available';
                        } else {
                            currentAuthor = google_data[index].volumeInfo.authors[0];
                        }
                        $('.cover-select-content').append( `<div class="book-cover" key=${google_data[index].id}>

                        <img src='https://www.wonderslate.com/assets/booksmojo/img_cover_placeholder.png' alt="book cover" />
                        <p>${google_data[index].volumeInfo.title}</p>
                        <p>${currentAuthor}</p>
                    </div>`);
                    } else {
                        let currentAuthor = '';
                        if(!google_data[index].volumeInfo.authors) {
                            currentAuthor = 'Author not available';
                        } else {
                            currentAuthor = google_data[index].volumeInfo.authors[0];
                        }
                    $('.cover-select-content').append( `<div class="book-cover" key=${google_data[index].id}>
                                                

                                                    <img class="book-image" src=${google_data[index].volumeInfo.imageLinks.thumbnail} alt="book cover" />
                                                    <p class="book-title">${google_data[index].volumeInfo.title}</p>
                                                    <p class="book-author">${currentAuthor}</p>
                                                </div>`);
                        }
                    }); 
                    
                    // $('.cover-select-content').append( `<div class="book-cover" key=${google_data[index].id}>
                                                

                    //                                 <img class="book-image" src=${google_data[index].volumeInfo.imageLinks.thumbnail} alt="book cover" />
                    //                                 <p class="book-title">${google_data[index].volumeInfo.title}</p>
                    //                                 <p class="book-author">${currentAuthor}</p>
                    //                             </div>`);
                    //     }

                };
            });
    });
}

function getCoverAndData() {
    $(document).on('click', '.book-cover', function() {
            $('.book-cover').removeClass('border');
            $(this).addClass('border');
            $('.add-error').removeClass('highlight');
            $('.add-error').text('');
            activeTitle=$(this).find('.book-title').text();
            activeAuthor=$(this).find('.book-author').text();
            let rawImage=$(this).find('.book-image').attr('src');
            let processedImage=rawImage.slice(4, rawImage.length);
            activeImage=`https${processedImage}`

            return(activeTitle, activeAuthor, activeImage);
            
    });
}

let activeTitle = '';
let activeAuthor = '';
let activeImage = '';


function saveBook() {
    $(document).on('click', '.cover-continue-btn', function(e) {
        e.preventDefault();
        if(activeTitle === ''){
           $('.add-error').addClass('highlight');
           $('.add-error').text('No book selected. Please select a book to continue.')
        } else {
        let bookObj = {
            "title": activeTitle,
            "author": activeAuthor,
            "image": activeImage
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
                                                            <div class="book-img"><img src=${activeImage} alt=${activeTitle}></div>
                                                            <div class="book-info">
                                                                <p class="book-title">${activeTitle}</p>
                                                                <p class="author">${activeAuthor}</p>
                                                            </div>
                                                        </div>`)
                });

        const titleInput = $(document).find('.js-title-input');
        const fNameInput = $(document).find('.js-fName-input');
        const lNameInput = $(document).find('.js-lName-input');
        titleInput.val('');
        fNameInput.val('');
        lNameInput.val('');

        $('.data-input-modal').addClass('hide');
        $('.cover-select-modal').addClass('hide');

        activeTitle = '';
        activeAuthor = '';
        activeImage = '';
    }
})}


let editId;
let $toDelete;
let editImage;

function editButtonHandler() {
    $(document).on('click', '.edit-btn', function(event) {
        event.preventDefault();
        $("html, body").animate({
            scrollTop: $("body").offset().top
        }, 1000);
        $('.data-modify-modal').removeClass('hide');
        const $this = $(this).parent();
        $toDelete = $(this).parent();
        const targetEditId = $this.attr("id");
        const targetEditTitle = $this.find('.book-title').text();
        const targetEditAuthor = $this.find('.author').text();
        editImage = $this.find('.book-img img').attr('src');
        console.log(editImage);
        editId = targetEditId;
        let editTitle = targetEditTitle
        let editAuthor = targetEditAuthor;

        $('.js-edit-form').find('.book-to-edit').text(editTitle + " - " + editAuthor);
        $('.js-title-edit').val(`${editTitle}`)
        $('.js-fName-edit').val(`${editAuthor}`)
        $('.edit-btn').prop('disabled', true);
        $('.del-btn').prop('disabled', true);
    });

    $('.close-mod-btn').on('click', function() {
        $('.data-modify-modal').addClass('hide');
        $('.edit-btn').prop('disabled', false);
        $('.del-btn').prop('disabled', false);
        $("html, body").animate({
            scrollTop: $("body").offset().top
        }, 1000);
    });
}

function handleEditBook() {
    $('.js-edit-form').on('submit', function(event) {
        event.preventDefault();
        const titleInput = $(event.currentTarget).find('.js-title-edit');
        const fNameInput = $(event.currentTarget).find('.js-fName-edit');
        const lNameInput = $(event.currentTarget).find('.js-lName-edit');
        const image = $(event.currentTarget).find('.book-img img').attr('src');
        console.log(image);

        let title = titleInput.val();
        let fName = fNameInput.val();
        let lName = lNameInput.val();
        titleInput.val('');
        fNameInput.val('');
        lNameInput.val('');
      
        let updateObj = {
            "id": `${editId}`,
            "title": `${title}`,
            "author": `${fName}`,
            "image": `${editImage}`
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
                        <div class="book-img"><img src=${editImage}></div>
                        <div class="book-info">
                            <p class="book-title">${title}</p>
                            <p class="author">${fName}</p>
                        </div>
                    </div>`)
            }
        });
        $('.data-modify-modal').addClass('hide');
        $("html, body").animate({
            scrollTop: $(".book-display").offset().top
        }, 1000);
        $('.edit-btn').prop('disabled', false);
        $('.del-btn').prop('disabled', false);
    })
}

function deletButtonHandler() {
    $(document).on('click', '.del-btn', function(event) {
        event.preventDefault();
        const $this = $(this).parent();
        const targetId = $this.attr("id");
        const targetEditTitle = $this.find('.book-title').text();
        const targetEditAuthor = $this.find('.author').text();

        $('.delete-confirm-modal').find('.bookData').text(targetEditTitle + " - " + targetEditAuthor);

        $("html, body").animate({
            scrollTop: $("body").offset().top
        }, 1000);

        $('.edit-btn').prop('disabled', true);
        $('.del-btn').prop('disabled', true);
        $('.delete-confirm-modal').removeClass('hide');

        $('.delete-confirm-modal').on('click', '.del-deny-btn', function() {
            $('.delete-confirm-modal').addClass('hide');
            $('.edit-btn').prop('disabled', false);
            $('.del-btn').prop('disabled', false);
        })

        $('.delete-confirm-modal').on('click', '.del-confirm-btn', function() {

            $.ajax({
                url: WEB_API_URL + '/' + targetId,
                type: 'DELETE',
                data: targetId,
                complete: $this.closest('.book').remove()
            });
            $('.delete-confirm-modal').addClass('hide');
            $('.edit-btn').prop('disabled', false);
            $('.del-btn').prop('disabled', false);
            $("html, body").animate({
                scrollTop: $("body").offset().top
            }, 1000);
        })
    })
}

function login() {
    $('.login-submit').on('click', function(e) {
        e.preventDefault();

        if($('#user').val().trim() === '' || $('#pass').val().trim() === '' ) {
            $('.login-error').text('Username or Password MISSING. Please try again.');
        } else if ($('#user').val().trim() !== 'demo' || $('#pass').val().trim() !== 'demo') {
            $('.login-error').text('Username or Password INCORRECT. Please try again.');
        } else {
            $('.login-page').addClass('hide');
            $('.landing').removeClass('hide');
            $("html, body").animate({
                scrollTop: $("body").offset().top
            }, 1000);
        }
    });
}

function appLoad() {
    $(login);
    $(getAllBooks);
    $(addButtonHandler);
    $(handleBookSearch);
    $(getCoverAndData);
    $(saveBook);
    $(editButtonHandler);
    $(handleEditBook);
    $(deletButtonHandler);
}

$(appLoad);