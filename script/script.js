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
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.slider');
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');
    const items = document.querySelectorAll('.slider-item');
    let currentIndex = 0;

    function moveSlider() {
        slider.style.transform = `translateX(-${currentIndex * (items[0].offsetWidth + 20)}px)`;
    }

    nextButton.addEventListener('click', function() {
        currentIndex = (currentIndex + 1) % items.length;
        moveSlider();
    });

    prevButton.addEventListener('click', function() {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        moveSlider();
    });

    // Автоматическое переключение слайдов
    setInterval(function() {
        currentIndex = (currentIndex + 1) % items.length;
        moveSlider();
    }, 5000);
});
