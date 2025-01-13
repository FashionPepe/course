document.addEventListener('DOMContentLoaded', () => {
    const burgerButton = document.querySelector('.burger-button');
    const closeButton = document.querySelector('.close-button');
    const burgerOverlay = document.querySelector('.burger-overlay');

    // Функция для переключения бургер-меню
    const toggleMenu = () => {
        burgerOverlay.classList.toggle('active');
    };

    // Открыть бургер-меню
    burgerButton.addEventListener('click', toggleMenu);

    // Закрыть бургер-меню
    closeButton.addEventListener('click', toggleMenu);

    // Закрыть бургер-меню при клике на ссылку
    document.querySelectorAll('.link-burger').forEach(link => {
        link.addEventListener('click', toggleMenu);
    });
});
let currentSlide = 0;

function moveSlide(direction) {
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;

    // Обновляем индекс текущего слайда
    currentSlide += direction;

    // Если currentSlide выходит за пределы, сбрасываем его
    if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    } else if (currentSlide >= totalSlides) {
        currentSlide = 0;
    }

    // Перелистываем слайды
    const slider = document.querySelector('.slider');
    const offset = -currentSlide * 100; // Сдвигаем на 100% влево для текущего слайда
    slider.style.transform = `translateX(${offset}%)`;
}
