// Базова адреса Open Library Search API.
const OPEN_LIBRARY_SEARCH_URL = 'https://openlibrary.org/search.json';

console.log("script.js підключено"); // Повідомлення в консоль для перевірки підключення скрипта

// Програмне видалення статичного прикладу картки-заглушки з HTML
const placeholderCard = document.querySelector('#books-list .book-card');
if (placeholderCard) {
    placeholderCard.remove();
}

// Масив об'єктів книг згідно з варіантом 9 (доповнено полями author та status)
const myList = [
    { title: "Book 1", author: "Іван Франко", pages: 100, finished: true, status: "finished" },
    { title: "Book 2", author: "Іван Багряний", pages: 221, finished: false, status: "reading" },
    { title: "Book 3", author: "Тарас Шевченко", pages: 307, finished: true, status: "finished" },
    { title: "Book 4", author: "Валер'ян Підмогильний", pages: 438, finished: false, status: "not-reading" },
    { title: "Book 5", author: "Михайло Коцюбинський", pages: 618, finished: true, status: "finished" }
];

// Вибір контейнера для списку книг у DOM одразу після оголошення даних
const listContainer = document.querySelector('#books-list');

// Функція для обчислення загальної кількості сторінок прочитаних книг (з КП №6)
function totalReadPages(books) {
    let total = 0;

    for (const book of books) {
        if (book.finished) {
            total += book.pages; // Додаємо кількість сторінок до загальної суми, якщо книга прочитана
        } else {
            console.log(`Book "${book.title}" is not finished yet. Pages: ${book.pages}`); // Виводимо повідомлення про непрочитані книги
        }
    }

    return total;
}

const pagesPerDay = (pages, days) => Math.round(pages / days); // Функція для обчислення кількості сторінок на день

const total = totalReadPages(myList);
console.log(`Total pages of finished books: ${total}`);

const days = 10;
const pagesPerDayResult = pagesPerDay(total, days);
console.log(`Pages to read per day over ${days} days: ${pagesPerDayResult}`);

// Функція рендеру списку книг у DOM-дерево
function renderBooks(books) {
    listContainer.innerHTML = ''; // Очищуємо контейнер перед рендером

    books.forEach((book, index) => {
        // Створення елемента article та вкладених h3 (title) і p (author, pages, status)
        const card = document.createElement('article');
        card.classList.add('book-card');
        card.dataset.bookIndex = index;

        // Заголовок h3 (title)
        const titleEl = document.createElement('h3');
        titleEl.textContent = book.title;

        // Абзац p (author)
        const authorEl = document.createElement('p');
        const authorLabel = document.createElement('strong');
        authorLabel.textContent = 'Автор: ';
        const authorText = document.createElement('span');
        authorText.textContent = book.author;
        authorEl.append(authorLabel, authorText);

        // Абзац p (pages)
        const pagesEl = document.createElement('p');
        const pagesLabel = document.createElement('strong');
        pagesLabel.textContent = 'Сторінок: ';
        const pagesText = document.createElement('span');
        pagesText.textContent = book.pages;
        pagesEl.append(pagesLabel, pagesText);

        // Абзац p (status)
        const statusEl = document.createElement('p');
        statusEl.classList.add('book-status-row');
        const statusLabel = document.createElement('strong');
        statusLabel.textContent = 'Статус: ';
        const statusSelect = document.createElement('select');
        statusSelect.classList.add('book-status');
        statusSelect.dataset.bookStatus = '';
        statusSelect.setAttribute('aria-label', `Статус книги ${book.title}`);

        [
            { value: 'not-reading', text: 'Не почато' },
            { value: 'reading', text: 'Читається' },
            { value: 'finished', text: 'Прочитано' }
        ].forEach(status => {
            const option = document.createElement('option');
            option.value = status.value;
            option.textContent = status.text;
            statusSelect.append(option);
        });
        statusSelect.value = book.status;
        statusEl.append(statusLabel, statusSelect);

        // Кольоровий індикатор статусу
        const indicator = document.createElement('div');
        indicator.classList.add('status-indicator', book.status);

        // Додавання атрибута data-pages та умовного класу unread, якщо !book.finished
        card.dataset.pages = book.pages;
        if (!book.finished) {
            card.classList.add('unread');
        }

        // Приєднуємо дочірні елементи до картки
        card.append(titleEl, authorEl, pagesEl, statusEl, indicator);

        // Додаємо картку в контейнер списку
        listContainer.append(card);
    });
}

// Виклик функції рендеру з реальним масивом даних
renderBooks(myList);

// Делегований обробник оновлює статус книги та статистику.
listContainer.addEventListener('change', event => {
    if (!(event.target instanceof HTMLSelectElement) || !event.target.matches('[data-book-status]')) {
        return;
    }

    const card = event.target.closest('.book-card');
    const book = card && myList[Number(card.dataset.bookIndex)];
    if (!book) return;

    book.status = event.target.value;
    book.finished = book.status === 'finished';
    card.classList.toggle('unread', !book.finished);

    const indicator = card.querySelector('.status-indicator');
    indicator.classList.remove('not-reading', 'reading', 'finished');
    indicator.classList.add(book.status);

    updateReadingStats();
});

const form = document.querySelector('#add-book form');
const titleInput = form.elements['title'];
const authorInput = form.elements['author'];
const pagesInput = form.elements['pages'];

// Перевіряє, що назва книги не порожня.
function validateTitle() {
    titleInput.setCustomValidity(
        titleInput.value.trim() ? '' : 'Будь ласка, введіть назву книги.'
    );
}

// Перевіряє ім’я автора та забороняє цифри.
function validateAuthor() {
    const author = authorInput.value.trim();

    if (!author) {
        authorInput.setCustomValidity('Будь ласка, введіть ім’я автора.');
    } else if (/\d/.test(author)) {
        authorInput.setCustomValidity('Ім’я автора не повинно містити цифр.');
    } else {
        authorInput.setCustomValidity('');
    }
}

// Перевіряє, що кількість сторінок — ціле число від 1 до 10000.
function validatePages() {
    const pages = Number(pagesInput.value);

    if (!pagesInput.value) {
        pagesInput.setCustomValidity('Будь ласка, введіть кількість сторінок.');
    } else if (!/^[0-9]+$/.test(pagesInput.value) || !Number.isSafeInteger(pages)) {
        pagesInput.setCustomValidity('Введіть цілу кількість сторінок цифрами, без експоненційного запису.');
    } else if (pages <= 0 || pages > 10000) {
        pagesInput.setCustomValidity('Кількість сторінок повинна бути числом від 1 до 10000.');
    } else {
        pagesInput.setCustomValidity('');
    }
}

// Повторно перевіряють поля під час введення.
titleInput.addEventListener('input', validateTitle);
authorInput.addEventListener('input', validateAuthor);
pagesInput.addEventListener('input', validatePages);
// Блокує символи, що дозволяють експоненційний або від’ємний запис.
pagesInput.addEventListener('keydown', event => {
    if (['e', 'E', '+', '-'].includes(event.key)) {
        event.preventDefault();
    }
});

validateTitle();
validateAuthor();
validatePages();

// Додає книгу, перемальовує список і оновлює статистику.
form.addEventListener('submit', event => {
    event.preventDefault(); // Запобігаємо стандартній поведінці форми (перезавантаження сторінки)

    // Отримуємо значення з полів форми
    const title = form.elements['title'].value.trim();
    const author = form.elements['author'].value.trim();
    const pages = Number(form.elements['pages'].value);
    const status = form.elements['status'].value;

    // Додаємо нову книгу до масиву myList
    const newBook = {
        title,
        author,
        pages,
        finished: status === 'finished',
        status
    };
    myList.push(newBook);

    // Виклик функції рендеру з реальним масивом даних
    renderBooks(myList);
    updateReadingStats();

    form.reset(); // Очищуємо форму після додавання книги
    validateTitle();
    validateAuthor();
    validatePages();
});

const booksCountEl = document.querySelector('#books-count');
const finishedEl = document.querySelector('#finished-count');
const readingEl = document.querySelector('#reading-count');
const notReadingEl = document.querySelector('#not-reading-count');

// Перераховує кількість книг за кожним статусом і оновлює лічильники.
function updateReadingStats() {
    const finishedCount = myList.filter(book => book.finished).length;
    const readingCount = myList.filter(book => !book.finished && book.status === 'reading').length;
    const notReadingCount = myList.filter(book => !book.finished && book.status === 'not-reading').length;

    if (booksCountEl) booksCountEl.textContent = `Усього книг: ${myList.length}`;
    if (finishedEl) finishedEl.textContent = `Прочитано: ${finishedCount}`;
    if (readingEl) readingEl.textContent = `Читається: ${readingCount}`;
    if (notReadingEl) notReadingEl.textContent = `Не почато: ${notReadingCount}`;
}

updateReadingStats();

const searchForm = document.querySelector('#book-search-form');
const searchInput = document.querySelector('#book-search-title');
const searchStatus = document.querySelector('#book-search-status');
const searchError = document.querySelector('#book-search-error');
const searchResults = document.querySelector('#book-search-results');
const retrySearchButton = document.querySelector('#book-search-retry');
let lastSearchQuery = '';

// Відображає не більше 12 книг із відповіді API.
function renderSearchResults(books) {
    searchResults.replaceChildren();

    books.slice(0, 12).forEach(book => {
        const result = document.createElement('article');
        result.classList.add('search-result');

        const title = document.createElement('h3');
        title.textContent = book.title || 'Назва невідома';

        const author = document.createElement('p');
        author.textContent = `Автор: ${book.author_name?.join(', ') || 'Не вказаний'}`;

        const year = document.createElement('p');
        year.textContent = `Перший рік видання: ${book.first_publish_year || 'Невідомий'}`;

        result.append(title, author, year);
        searchResults.append(result);
    });
}

// Шукає книги та показує результати або повідомлення про помилку.
async function searchBooks(query) {
    lastSearchQuery = query;
    searchStatus.textContent = 'Шукаємо книги…';
    searchError.hidden = true;
    searchResults.replaceChildren();
    searchForm.querySelector('button[type="submit"]').disabled = true;
    retrySearchButton.disabled = true;

    try {
        const params = new URLSearchParams({ q: query, limit: '12' });
        const response = await fetch(`${OPEN_LIBRARY_SEARCH_URL}?${params}`);
        if (!response.ok) {
            throw new Error(`Open Library returned ${response.status}`);
        }
        const data = await response.json();

        if (!Array.isArray(data.docs)) {
            throw new Error('Open Library response does not contain a docs array');
        }

        if (data.docs.length === 0) {
            searchStatus.textContent = 'За цим запитом книг не знайдено.';
            return;
        }
        console.log(data);

        renderSearchResults(data.docs);
        searchStatus.textContent = 'Перші 12 результатів.';
    } catch (error) {
        console.error('Помилка пошуку книг:', error);
        searchStatus.textContent = '';
        searchError.hidden = false;
    } finally {
        searchForm.querySelector('button[type="submit"]').disabled = false;
        retrySearchButton.disabled = false;
    }
}

// Запускає пошук за введеною назвою книги.
searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const query = searchInput.value.trim();

    if (!query) {
        searchStatus.textContent = 'Введіть назву книги для пошуку.';
        searchInput.focus();
        return;
    }

    searchBooks(query);
});

// Повторює останній пошуковий запит після помилки.
retrySearchButton.addEventListener('click', () => {
    if (lastSearchQuery) {
        searchBooks(lastSearchQuery);
    }
});