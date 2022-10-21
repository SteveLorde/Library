const book = {
    title: "The Hobbit",
    author: "JR Tolkien",
    pages: 35,
    info: function () {
        console.log(this.title)
        console.log(this.author)
        console.log(this.pages)
    }
}

book.title