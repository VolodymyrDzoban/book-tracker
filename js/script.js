console.log("script.js підключено");    // Повідомлення в консоль для перевірки підключення скрипта

const myList = [{title: "Book 1", pages: 100, finished: true},
                {title: "Book 2", pages: 221, finished: false},
                {title: "Book 3", pages: 307, finished: true},
                {title: "Book 4", pages: 438, finished: false},
                {title: "Book 5", pages: 618, finished: true}]; // масив об'єктів, що представляють книги з їхніми властивостями

// Функція для обчислення загальної кількості сторінок прочитаних книг
function totalReadPages(books) {
    let total = 0;

    for (const book of books) {
        if (book.finished) {
            total += book.pages;    // Додаємо кількість сторінок до загальної суми, якщо книга прочитана
        } else {
            console.log(`Book "${book.title}" is not finished yet. Pages: ${book.pages}`);  // Виводимо повідомлення про непрочитані книги
        }
    }

    return total;
}

const pagesPerDay = (pages, days) => Math.round(pages / days);  // Функція для обчислення кількості сторінок на день, округлюючи результат до найближчого цілого числа

const total = totalReadPages(myList);   // Виклик функції для обчислення загальної кількості сторінок прочитаних книг

console.log(`Total pages of finished books: ${total}`); // Виводимо загальну кількість сторінок прочитаних книг у консоль

const days = 10;    // Встановлюємо кількість днів для обчислення кількості сторінок на день
const pagesPerDayResult = pagesPerDay(total, days); // Виклик функції для обчислення кількості сторінок на день

console.log(`Pages to read per day over ${days} days: ${pagesPerDayResult}`);   // Виводимо кількість сторінок, які потрібно прочитати щодня протягом заданої кількості днів