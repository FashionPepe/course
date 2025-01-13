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
