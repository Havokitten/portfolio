gsap.to(".brand", {
    color: "#198754",
    duration: 2,
    ease: "power1.inOut",
    repeat: -1,
    yoyo: true,
}); // tweaked gsap demo to make the text pulse. technically i could do this with css (i think ?) but i really dont wanna figure out how keyframes work at 5 am on a sunday.....

const bookGrid = document.getElementById("bookGrid"),
    sortBtn = document.getElementById("sortBooks"),
    searchInput = document.getElementById("searchInput"),
    searchForm = document.getElementById("searchForm"),
    sortType = document.getElementById("sortType"),

    books = [
        {
            title: "The Last Wish",
            author: "Andrzej Sapkowski",
            image: "./images/the-last-wish.png", // there's honestly no elegant way to make book covers look good with this layout. i tried to look for book jackets instaed of just covers but that's not always available so it's either make them fit and have parts of the cover cut out, make them stretch, or contained within the card but with a lot of negative space
            description: "Geralt is a witcher, a man whose magic powers, enhanced by long training and a mysterious elixir, have made him a brilliant fighter and a merciless assassin.",
            rating: 0,
        },
        {
            title: "Lynch on Lynch",
            author: "David Lynch, Chris Rodley (Editor)",
            image: "./images/lynch-on-lynch.jpg",
            description: "In this volume, Lynch speaks openly about his films as well as about his lifelong commitment to painting, his work in photography, his television projects.",
            rating: 0,
        },
        {
            title: "I'm Glad my Mom Died",
            author: "Jeanette McCurdy",
            image: "./images/im-glad-my-mom-died.webp",
            description: "A heartbreaking and hilarious memoir by iCarly and Sam & Cat star Jennette McCurdy about her struggles as a former child actor.",
            rating: 0,
        },
        {
            title: "The Picture of Dorian Gray",
            author: "Oscar Wilde, Susan Beattie (Editor)",
            image: "./images/the-picture-of-dorian-gray.png",
            description: "Enthralled by his own exquisite portrait, Dorian Gray exchanges his soul for eternal youth and beauty.",
            rating: 0,
        },
        {
            title: "Persepolis: The Story of a Childhood",
            author: "Marjane Satrapi",
            image: "./images/persepolis.jpg",
            description: "Wise, funny, and heartbreaking, Persepolis is Marjane Satrapi's memoir of growing up in Iran during the Islamic Revolution.",
            rating: 0,
        },
        {
            title: "Eragon: Book I", // had to add at least one terrible book to seed low ratings!!
            author: "Christopher Paolini",
            image: "./images/eragon.jpg",
            description: "Fifteen-year-old Eragon becomes a Dragon Rider bonded with Saphira. With an ancient sword and a mentor's guidance, his choices could save or destroy the Empire.",
            rating: 0,
        },
    ];

const changeBG = (rating) => rating <= 3 ? "bg-danger" : rating <= 7 ? "bg-warning text-dark" : "bg-success"; // using ternary operators is probably less readable than the full if else format but god i love shortcuts too much im sorry

const displayBooks = (bookList) => {
    bookGrid.innerHTML = "";

    bookList.forEach((book, index) => { // doing things this way is so so so much more comprehensible to my brain  + less tedious than like, direct line by line DOM manipulation so i'll be using it from now on. also forEach yippiee yayyy more shortcuts (sorta. what's more preferable, forEach or for of?). also also i hope im using bootstrap ratios correctly. had to use em to make the cards sizing more uniform but ive never even opened the helpers documentation section before.... also also also hiding the emojis on smaller devices is probably overkill but it kept bugging me how they messed with the layout so
        bookGrid.innerHTML += ` 
        <div class="col">
            <div class="card h-100 shadow-sm border border-dark-subtle">
                <div class="ratio ratio-4x3">
                    <img src="${book.image}" class="card-img-top" alt="${book.title}'s Cover">
                </div>

                <div class="card-body d-flex flex-column">
                    <h5 class="card-title fw-bold">${book.title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${book.author}</h6>
                    <p class="card-text text-body-secondary small">${book.description}</p>
        
                        <div class="d-flex justify-content-between align-items-center mt-auto">
                                <span class="badge ${changeBG(book.rating)} fs-6">${book.rating}/10</span>
                                    <div class="d-flex align-items-center gap-1 ms-2">
                                        <span class="text-muted fw-semibold">Rate:</span>
                                        <button class="btn btn-danger dislike-btn btn-sm fw-bold" data-index="${index}">-1<span class="d-none d-sm-inline">👎</span></button>
                                        <button class="btn btn-success like-btn btn-sm fw-bold" data-index="${index}">+1<span class="d-none d-sm-inline">👍</span></button>
                                    </div>
                        </div>
                </div>
            </div>
        </div>`;
    });
    addBtnEvents();
};

const addBtnEvents = () => { // figuring out how to add listeners and attach the appropriate events to buttons that technically dont even exist yet this way hurt my brain so much more actually LOL i somewhat regret my earlier decision to use innerhtml. once again tho godbless the mdn documentation page for simplifying things
    const likeBtns = document.querySelectorAll(".like-btn"),
        dislikeBtns = document.querySelectorAll(".dislike-btn");

    likeBtns.forEach((button) => {
        button.addEventListener("click", () => {
            const thisBook = books[button.dataset.index];
            thisBook.rating < 10 ? thisBook.rating++ : Swal.fire({ icon: "warning", title: "Maximum Reached", text: "Ratings can't go above 10.", });
            displayBooks(books); // keep forgetting i need to call this to actually refresh the ratings. wonder if there's a simpler way to do this whole process
        });
    });

    dislikeBtns.forEach((button) => {
        button.addEventListener("click", () => {
            const thisBook = books[button.dataset.index];
            thisBook.rating > 0 ? thisBook.rating-- : Swal.fire({ icon: "warning", title: "Minimum Reached", text: "Ratings can't go below 0.", });
            displayBooks(books);
        });
    });
};

sortBtn.addEventListener("click", () => {
    const noRating = books.every( (book) => book.rating === books[0].rating ); // at first i was comparing every rating to 0 but it makes more sense to compare them to each other cuz if theyre all the same then there's nothing to sort
    noRating ? Swal.fire({ icon: "info", title: "Nothing to Sort", text: "All books currently have the same rating.", }) : 
    sortType.value === "asc" ? books.sort((a, b) => a.rating - b.rating) : 
    books.sort((a, b) => b.rating - a.rating);
    /* books.sort((a, b) => b.rating - a.rating); // descending makes more sense to me OOO wait i should give the option to reverse it */
    displayBooks(books);
});

searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const searchTerm = searchInput.value;
    window.find(searchTerm);
});
displayBooks(books);
