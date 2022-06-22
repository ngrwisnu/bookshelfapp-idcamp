const data = [];
const RENDER_BOOK = "render-book";

const formInput = document.getElementById("form");
const addBtn = document.getElementById("add");

// Getting value of the input
formInput.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const year = document.getElementById("year").value;

  const checkBox = document.getElementById("checkbox").checked;

  const bookID = +new Date();

  const dataObject = {
    title,
    author,
    year,
    bookID,
    checkBox,
  };

  data.push(dataObject);
  console.log(data);

  data.forEach((val) => {
    console.log(val);
  });

  document.dispatchEvent(new Event(RENDER_BOOK));
});

document.addEventListener(RENDER_BOOK, () => {
  console.log("Data berhasil di render");
});
