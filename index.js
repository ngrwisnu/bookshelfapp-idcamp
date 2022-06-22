const books = [];
const RENDER_BOOK = "render-book";
const BOOKS_SAVED = "books-saved";
const STORAGE_KEY = "BOOKSHELF";

const formInput = document.getElementById("form");
const addBtn = document.getElementById("add");
const clearButton = document.getElementById("delete");

// Check Storage status
function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser anda tidak mendukung local storage");
    return false;
  } else {
    return true;
  }
}

// Getting value of the input
document.addEventListener("DOMContentLoaded", () => {
  formInput.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const year = document.getElementById("year").value;

    const isRead = document.getElementById("checkbox").checked;

    const bookID = +new Date();

    const dataObject = {
      title,
      author,
      year,
      bookID,
      isRead,
    };

    books.push(dataObject);

    document.dispatchEvent(new Event(RENDER_BOOK));
    saveBook();
  });

  if (isStorageExist()) {
    getBooksFromStorage();
  }
});

// BOOK CARD
const bookCard = (bookObject) => {
  const bookAuthor = document.createElement("span");
  bookAuthor.innerText = bookObject.author;
  bookAuthor.classList.add("card-author");

  const bookYear = document.createElement("span");
  bookYear.innerText = bookObject.year;
  bookYear.classList.add("card-year");

  const bookTitle = document.createElement("p");
  bookTitle.innerText = bookObject.title;
  bookTitle.classList.add("card-title");

  const cardText = document.createElement("div");
  cardText.classList.add("card-text");
  cardText.append(bookAuthor, bookYear, bookTitle);

  const cardContainer = document.createElement("div");
  cardContainer.classList.add("card");
  cardContainer.setAttribute("id", `${bookObject.bookID}`);
  cardContainer.append(cardText);

  // card buttons setting
  if (bookObject.isRead) {
    const undoButton = undoButtonComponent();

    undoButton.addEventListener("click", () => {
      undoButtonHandler(bookObject.bookID);
    });

    const deleteButton = deleteButtonComponent();

    deleteButton.addEventListener("click", () => {
      deleteButtonHandler(bookObject.bookID);
    });

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("card-buttons");
    buttonContainer.append(undoButton, deleteButton);

    cardContainer.append(buttonContainer);
  } else {
    const doneButton = doneButtonComponent();

    doneButton.addEventListener("click", () => {
      doneButtonHandler(bookObject.bookID);
    });

    const deleteButton = deleteButtonComponent();

    deleteButton.addEventListener("click", () => {
      deleteButtonHandler(bookObject.bookID);
    });

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("card-buttons");
    buttonContainer.append(doneButton, deleteButton);

    cardContainer.append(buttonContainer);
  }

  return cardContainer;
};

// Button Component Handler
function doneButtonHandler(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) {
    return;
  } else {
    bookTarget.isRead = true;
  }

  document.dispatchEvent(new Event(RENDER_BOOK));
  saveBook();
}

function undoButtonHandler(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) {
    return;
  } else {
    bookTarget.isRead = false;
  }

  document.dispatchEvent(new Event(RENDER_BOOK));
  saveBook();
}

function deleteButtonHandler(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === null) {
    return;
  } else {
    books.splice(bookTarget, 1);
  }

  document.dispatchEvent(new Event(RENDER_BOOK));
  saveBook();
}
// ----------------------------------

function findBook(bookId) {
  for (const book of books) {
    if (book.bookID === bookId) {
      return book;
    }
  }

  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].bookID === bookId) {
      return index;
    }
  }

  return null;
}

// Buttons Component
function undoButtonComponent() {
  const undoButton = document.createElement("button");
  undoButton.innerText = "Baca lagi";
  undoButton.classList.add("card-btn-undo");

  return undoButton;
}

function doneButtonComponent() {
  const doneButton = document.createElement("button");
  doneButton.innerText = "Selesai";
  doneButton.classList.add("card-btn-selesai");

  return doneButton;
}

function deleteButtonComponent() {
  const deleteButton = document.createElement("button");
  deleteButton.innerText = "Hapus";
  deleteButton.classList.add("card-btn-hapus");

  return deleteButton;
}
// ----------------------------------

function saveBook() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(BOOKS_SAVED));
  }
}

function getBooksFromStorage() {
  const getBooks = localStorage.getItem(STORAGE_KEY);
  let bookData = JSON.parse(getBooks);

  console.log(bookData);
  if (bookData !== null) {
    for (const book of bookData) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_BOOK));
}

// RENDER BOOK CARD
document.addEventListener(RENDER_BOOK, () => {
  const unreadBook = document.getElementById("unread");
  unreadBook.innerHTML = "";

  const readBook = document.getElementById("read");
  readBook.innerHTML = "";

  for (const book of books) {
    const bookElement = bookCard(book);

    if (!book.isRead) {
      unreadBook.append(bookElement);
    } else {
      readBook.append(bookElement);
    }
  }
});
// ----------------------------------

// Clear the storage
clearButton.addEventListener("click", () => {
  books.splice(0, books.length);

  document.dispatchEvent(new Event(RENDER_BOOK));
  saveBook();
});
