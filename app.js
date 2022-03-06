//  Create a book constructor
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI CONSTRUCTOR
class UI {

  addBookToList(book) {
    const list = document.querySelector('#book-list');

    const row = document.createElement('tr');

    row.innerHTML = `
   <td>${book.title}</td>
   <td>${book.author}</td>
   <td>${book.isbn}</td>
   <td><a href="#" class="delete" >X</td>`

    list.appendChild(row);
  }

  // * Clears the fields after adding the book so that new book can be entered
  clearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#isbn').value = '';
  }

  // Show alert
  showError(message, className) {
    // Create a div
    const div = document.createElement('div');

    // Adding the class Name
    div.className = `alert ${className}`;

    // Adding text node to the div
    // div.appendChild(document.createTextNode(message));
    div.innerHTML = `${message}`;

    // Get a parent so that we can insert it into the dom
    const container = document.querySelector('.container');

    const form = document.querySelector('#book-form');

    // Insert alert
    container.insertBefore(div, form);

    // Timeout after 3 seconds
    setTimeout(() => {
      document.querySelector('.alert').remove();
    }, 3000);
  }

  deleteBook = (target) => {
    if (target.className === 'delete') {
      target.parentElement.parentElement.remove();
    }
  }
}

// Local Storage Class
class Store {
  static getBooks = () => {
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }

  static displayBooks = () => {
    const books = Store.getBooks();

    books.forEach((book) => {
      const ui = new UI;

      ui.addBookToList(book);
    })
  }

  static addBook = (book) => {
    const books = Store.getBooks();

    books.push(book);

    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook = (isbn) => {
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }
}

// DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayBooks())


// Event Listener
document.querySelector("#book-form").addEventListener("submit", (e) => {
  // Accessing the form values
  const title = document.querySelector("#title").value,
    author = document.querySelector("#author").value,
    isbn = document.querySelector("#isbn").value;

  // Instantiating/Crearing the book Object
  const book = new Book(title, author, isbn);

  // Instantiating the UI Object
  const ui = new UI();

  if (title === '' || author === '' || isbn === '') {
    ui.showError('Please enter all fields', 'error');
  } else {

    // * Adding book to the list
    ui.addBookToList(book);

    // Add to local storage
    Store.addBook(book);

    // Show the success message
    ui.showError('Book Added Successfully', 'success');

    // ClearFields
    ui.clearFields();
  }

  e.preventDefault();
});

// Event Listener for delete

// Event delegation will be used
document.querySelector('#book-list').addEventListener('click', (e) => {

  const ui = new UI();

  ui.deleteBook(e.target);

  // Remove from local Storage
  Store.removeBook(e.target.parentElement.previousElementSibling.innerText);

  // Show message
  ui.showError('Book Removed', 'success');
  e.preventDefault();
})





