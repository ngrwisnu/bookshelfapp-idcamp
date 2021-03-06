const books = [];
const RENDER_BOOK = "render-book";
const BOOKS_SAVED = "books-saved";
const STORAGE_KEY = "BOOKSHELF";
const RENDER_MODAL = "render-modal";

const formInput = document.getElementById("form");
const addBtn = document.getElementById("add");
const clearButton = document.getElementById("delete");
const mainContainer = document.getElementById("main-container");
const modalBlur = document.getElementById("modal-bg");
const searchInput = document.getElementById("search");

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

const removeModal = () => {
  const modalHead = document.createElement("span");
  modalHead.innerText = "Hapus semua buku";

  const modalBody = document.createElement("span");
  modalBody.innerText =
    "Apakah anda yakin ingin menghapus semua buku dari rak?";

  const modalHeader = document.createElement("div");
  modalHeader.classList.add("modal-body");
  modalHeader.append(modalHead, modalBody);

  const cancelModal = document.createElement("button");
  cancelModal.innerText = "Nanti dulu";
  cancelModal.setAttribute("id", "modal-cancel");

  const deleteModal = document.createElement("button");
  deleteModal.innerText = "Ya, hapus";
  deleteModal.setAttribute("id", "modal-delete");

  const modalFooter = document.createElement("div");
  modalFooter.classList.add("modal-buttons");
  modalFooter.append(cancelModal, deleteModal);

  const modalContainer = document.createElement("div");
  modalContainer.classList.add("delete-modal");
  modalContainer.setAttribute("id", "modal-container");
  modalContainer.append(modalHeader, modalFooter);

  const modalBackground = document.createElement("div");
  modalBackground.classList.add("bg-blur");
  modalBackground.append(modalContainer);

  return modalBackground;
};

// Empty Shelf Modal
const emptyShelfModal = () => {
  const imgIcon = document.createElement("img");
  imgIcon.setAttribute("src", "images/exclamation-circle.svg");
  imgIcon.setAttribute("alt", "exclamation-icon");
  imgIcon.setAttribute("width", "50");

  const textBody = document.createElement("span");
  textBody.innerText = "Lemari anda sedang kosong sekarang";

  const emptyModalBody = document.createElement("div");
  emptyModalBody.classList.add("modal-body");
  emptyModalBody.append(imgIcon, textBody);

  const button = document.createElement("button");
  button.innerText = "Tambahkan buku baru";
  button.setAttribute("id", "modal-cancel");

  const emptyModalFooter = document.createElement("div");
  emptyModalFooter.classList.add("modal-buttons");
  emptyModalFooter.append(button);

  const emptyModalContainer = document.createElement("div");
  emptyModalContainer.setAttribute("id", "es-container");
  emptyModalContainer.classList.add("delete-modal");
  emptyModalContainer.append(emptyModalBody, emptyModalFooter);

  const emptyModalBg = document.createElement("div");
  emptyModalBg.setAttribute("id", "empty-shelf-bg");
  emptyModalBg.classList.add("bg-blur");
  emptyModalBg.append(emptyModalContainer);

  return emptyModalBg;
};
// ----------------------------------

// Clear the storage
clearButton.addEventListener("click", () => {
  const bookListFromStorage = localStorage.getItem(STORAGE_KEY);
  const bookList = JSON.parse(bookListFromStorage);

  if (bookList.length == 0) {
    const showModal = emptyShelfModal();
    mainContainer.append(showModal);

    const modalCancelBtn = document.getElementById("modal-cancel");

    modalCancelBtn.addEventListener("click", () => {
      removeChildren(showModal);
    });
  } else {
    const showModal = removeModal();
    mainContainer.append(showModal);

    const modalDeleteBtn = document.getElementById("modal-delete");
    const modalCancelBtn = document.getElementById("modal-cancel");

    modalCancelBtn.addEventListener("click", () => {
      removeChildren(showModal);
    });

    modalDeleteBtn.addEventListener("click", () => {
      books.splice(0, books.length);
      removeChildren(showModal);

      document.dispatchEvent(new Event(RENDER_BOOK));
      saveBook();
    });
  }
});

function removeChildren(showModal) {
  return mainContainer.removeChild(showModal);
}

// Handling Search Input
searchInput.addEventListener("input", (e) => {
  const inputValue = e.target.value.toLowerCase();

  books.forEach((book) => {
    const searchBook =
      book.title.toLowerCase().includes(inputValue) ||
      book.author.toLowerCase().includes(inputValue) ||
      book.year.includes(inputValue);

    const item = document.getElementById(`${book.bookID}`);
    item.classList.toggle("hide", !searchBook);
  });
});
// ----------------------------------
