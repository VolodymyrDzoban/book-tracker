console.log("script.js підключено"); // Повідомлення в консоль для перевірки підключення скрипта

// Крок 2: Програмне видалення статичного прикладу картки-заглушки з HTML
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

// Крок 3: Вибір контейнера для списку книг у DOM одразу після оголошення даних
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

// Допоміжна функція для отримання текстового статусу книги
function getStatusText(book) {
    if (book.finished || book.status === 'finished') return 'Прочитано';
    if (book.status === 'not-reading') return 'Не почато';
    return 'Читається';
}

// Кроки 4-7: Функція рендеру списку книг у DOM-дерево
function renderBooks(books) {
    listContainer.innerHTML = ''; // Очищуємо контейнер перед рендером

    books.forEach(book => {
        // Крок 5: Створення елемента article та вкладених h3 (title) і p (author, pages, status)
        const card = document.createElement('article');
        card.classList.add('book-card');

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
        const statusLabel = document.createElement('strong');
        statusLabel.textContent = 'Статус: ';
        const statusText = document.createElement('span');
        statusText.textContent = getStatusText(book);
        statusEl.append(statusLabel, statusText);

        // Кольоровий індикатор статусу
        const indicator = document.createElement('div');
        const statusClass = book.finished ? 'finished' : (book.status || 'reading');
        indicator.classList.add('status-indicator', statusClass);

        // Крок 6: Додавання атрибута data-pages та умовного класу unread, якщо !book.finished
        card.dataset.pages = book.pages;
        if (!book.finished) {
            card.classList.add('unread');
        }

        // Приєднуємо дочірні елементи до картки
        card.append(titleEl, authorEl, pagesEl, statusEl, indicator);

        // Крок 7: Додаємо картку в контейнер списку
        listContainer.append(card);
    });
}

// Крок 8: Виклик функції рендеру з реальним масивом даних
renderBooks(myList);

// Крок 9: Оновлення підсумкового елемента p#books-count та блоку статистики
const booksCountEl = document.querySelector('#books-count');
if (booksCountEl) {
    booksCountEl.textContent = `Усього книг: ${myList.length}`;
}

const finishedCount = myList.filter(b => b.finished).length;
const readingCount = myList.filter(b => !b.finished && b.status === 'reading').length;
const notReadingCount = myList.filter(b => !b.finished && b.status === 'not-reading').length;

const finishedEl = document.querySelector('#finished-count');
const readingEl = document.querySelector('#reading-count');
const notReadingEl = document.querySelector('#not-reading-count');

if (finishedEl) finishedEl.textContent = `Прочитано: ${finishedCount}`;
if (readingEl) readingEl.textContent = `Читається: ${readingCount}`;
if (notReadingEl) notReadingEl.textContent = `Не почато: ${notReadingCount}`;