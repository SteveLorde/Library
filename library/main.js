const books = document.querySelector('.books');
const addBook = document.querySelector('.add-book')
const modal = document.querySelector('#modal')
const span = document.querySelector('.close')

window.addEventListener('click', (e) => {
    if (e.target == modal) {
        modal.style.display = 'none'
    }
})
span.addEventListener('click', () => {
    modal.style.display = 'none'
})

addBook.addEventListener('click', () => {
    modal.style.display = 'block'
    document.querySelector('.form-title').textContent = 'Add Book'
    document.querySelector('.form-add-button').textContent = 'Add'
})

function Book(title,author,pages,read){
    this.author = author
    this.title = title
    this.pages = pages
    this.read = read
    this.id = Math.floor(Math.random() * 1000000);
}

function addBookToLibrary(title, author,    pages, read) {
    myLibrary.push(new Book(title, author, pages, read));
    saveAndRenderBooks();
  }

const addBookForm = document.querySelector('.add-book-form')
addBookForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const data = new FormData(e.target)
    let newBook = {}
    for (let [name, value] of data) {
        if (name === 'book-read') {
            newBook['book-read'] = true
        } else {
            newBook[name] = value || ''
        }
    }
    if (!newBook['book-read']){
        newBook['book-read'] = false
    }
    if (document.querySelector('.form-title').textContent === 'Edit Book'){
        let id = e.target.id
        let editBook = myLibrary.filter((book) => book.id == id)[0]
        editBook.title = newBook["book-title"]
        editBook.author = newBook['book-author']
        editBook.pages = newBook['book-pages']
        editBook.read = newBook['book-read']
        saveAndRenderBooks()
    } else {
        addBookToLibrary(
            newBook['book-title'],
            newBook['book-author'],
            newBook['book-pages'],
            newBook['book-read']
            )
    }
        addBookForm.reset()
        modal.style.display = 'none'
    })

let myLibrary = []

function addLocalStorage() {
    /*localStorage.setItem('library', JSON.stringify([ { 
        title: 'Book1',
        author: 'me',
        pages: 500,
        read: true,
    },{
        title: 'Book2',
        author: 'you',
        pages: 5000,
        read: false,
    }]))*/
    myLibrary = JSON.parse(localStorage.getItem('library')) || []
    saveAndRenderBooks()
}

function createBookElement(el, content, className) {
    const element = document.createElement(el);
    element.textContent = content
    element.setAttribute('class', className)
    return element;
}

function createReadElement(bookItem,book) {
    const read = document.createElement('div')
    read.setAttribute('class', 'book-read')
    read.appendChild(createBookElement('h1','Read?', 'book-read-title'))
    const input = document.createElement('input')
    input.type = 'checkbox'
    input.addEventListener('click', (e) => {
        if (e.target.checked) {
            bookItem.setAttribute('class', ' card book read-checked')
            book.read = true
            saveAndRenderBooks()
        } else {
            bookItem.setAttribute('class', 'card book read-unchecked')
            book.read = false
            saveAndRenderBooks()
        }

    })
    if (book.read) {
        input.checked = true
        bookItem.setAttribute('class', ' card book read-checked')
    }
    read.appendChild(input)
    return read;
}

function fillOutEditForm(book) {
    modal.style.display = 'block'
    document.querySelector('.form-title').textContent = 'Edit Book'
    document.querySelector('.form-add-button').textContent = 'Edit'
    document.querySelector('.add-book-form').setAttribute('id', book.id)
    document.querySelector('#book-title').value = book.title || ''
    document.querySelector('#book-author').value = book.author || ''
    document.querySelector('#book-pages').value = book.pages || ''
    document.querySelector('#book-read').value = book.read || ''
}

function createEditIcon(book) {
    const editIcon = document.createElement('img')
    editIcon.src = '../assets/pencil.svg'
    editIcon.setAttribute('class', 'edit-icon')
    editIcon.setAttribute('width', '30px')
    editIcon.addEventListener('click', () => {
        fillOutEditForm(book)
    })
    return editIcon
}

function createIcons() {
    const div = createBookElement('div', '', 'icons')
    const icon1 = document.createElement('img')
    icon1.src = '../assets/star-plus-outline.svg'
    const icon2 = document.createElement('img')
    icon2.src = '../assets/eye-plus-outline.svg'
    const icon3 = document.createElement('img')
    icon3.src = '../assets/source-branch-plus.svg'
    icon1.setAttribute('Width', '30px')
    icon2.setAttribute('Width', '30px')
    icon3.setAttribute('Width', '30px')

    div.appendChild(icon1)
    div.appendChild(icon2)
    div.appendChild(icon3)
    return div
}

function deleteBook(index) {
    myLibrary.splice(index, 1)
    saveAndRenderBooks()
}

function createBookItem(book,index) {
    const bookItem = document.createElement('div')
    bookItem.setAttribute('id',index)
    bookItem.setAttribute('key',index)
    bookItem.setAttribute('class', 'card book')
    bookItem.appendChild(
        createBookElement('h1', `Title: ${book.title}`, 'book-title'))
    bookItem.appendChild(
        createBookElement('h1', `Author: ${book.author}`, 'book-author'))
    bookItem.appendChild(
        createBookElement('h1', `Pages: ${book.pages}`, 'book-pages'))

    bookItem.appendChild(createReadElement(bookItem,book))
    bookItem.appendChild(createBookElement('button', 'x', 'delete' ))
    bookItem.appendChild(createIcons())
    bookItem.appendChild(createEditIcon(book))

    bookItem.querySelector('.delete').addEventListener('click', () => {
        deleteBook(index)
    })


    books.insertAdjacentElement('afterbegin', bookItem)
}

function renderBooks() {
    books.textContent = ''
    myLibrary.map((book,index) => {
        createBookItem(book,index)
    })
}

function saveAndRenderBooks() {
    localStorage.setItem('library', JSON.stringify(myLibrary))
    renderBooks()
}

addLocalStorage()
