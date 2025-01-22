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
async function registerUser(name, email, password) {
    const response = await fetch('../php/register.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `name=${name}&email=${email}&password=${password}`
    });

    const data = await response.json();

    if (data.success) {
        alert('Регистрация успешна!');
        window.location.href = './login.php'; // Перенаправляем на страницу входа
    } else {
        alert(data.error);
    }
}
async function loginUser(email, password) {
    const response = await fetch('../php/login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `email=${email}&password=${password}`
    });

    const data = await response.json();

    if (data.success) {
        // Сохраняем информацию о пользователе в localStorage или sessionStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('id_user', JSON.stringify(data.user.id));
        console.log(localStorage.getItem('user'))
        window.location.href = './index.html'; // Перенаправляем на личную страницу
    } else {
        alert(data.error);
    }
}
function logoutUser() {
    // Удаляем данные о пользователе из localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('id_user');
    window.location.href = '#'; // Перенаправляем на страницу входа
}
function initButtons(){
    // Получаем данные о пользователе из localStorage
    const user = JSON.parse(localStorage.getItem('user'));

    // Получаем ссылки на кнопки
    const loginBtn = document.getElementById('login');
    const logoutBtn = document.getElementById('logout');
    const RegistrationBtn = document.getElementById('register');
    const loginBtnb = document.getElementById('login-b');
    const logoutBtnb = document.getElementById('logout-b');
    const RegistrationBtnb = document.getElementById('register-b');
    const fav = document.getElementById('fav');
    const favb = document.getElementById('fav-b');
    

    // Если пользователь залогинен
    if (user) {
        
        logoutBtn.style.display = 'block';
        logoutBtnb.style.display = 'block';
        fav.style.display = 'block';
        favb.style.display = 'block';


        
        loginBtn.style.display = 'none';
        RegistrationBtn.style.display = 'none'
        loginBtnb.style.display = 'none';
        RegistrationBtnb.style.display = 'none'
    } else {
        logoutBtn.style.display = 'none';
        logoutBtnb.style.display = 'none';
        fav.style.display = 'none';
        favb.style.display = 'none';

        
        loginBtn.style.display = 'block';
        RegistrationBtn.style.display = 'block'
        loginBtnb.style.display = 'block';
        RegistrationBtnb.style.display = 'block'
    }
}
window.onload = initButtons;

