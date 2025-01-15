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
const apiUrl = '../php/api.php'; // URL PHP API
    let districts = [], areas = [], streets = [], types = [];

    // Загрузка данных для административных округов
    async function loadDistricts() {
      if (districts.length === 0) {
        const response = await fetch(`${apiUrl}?type=districts`);
        districts = await response.json();
      }
      populateDatalist('districts-list', districts);
      document.getElementById('areas').disabled = false;  // Активируем поле для выбора района
    }

    // Загрузка районов
    async function loadAreas() {
      const districtName = document.getElementById('districts').value;
      const district = districts.find(d => d.name === districtName);
      if (!district) return;

      // Если районы еще не загружены для выбранного округа
      if (!areas[district.id]) {
        const response = await fetch(`${apiUrl}?type=areas&admin_id=${district.id}`);
        areas[district.id] = await response.json();
      }
      populateDatalist('areas-list', areas[district.id]);
      document.getElementById('streets').disabled = false; // Активируем поле для выбора улицы
    }

    // Загрузка улиц
    async function loadStreets() {
      const areaName = document.getElementById('areas').value;
      const districtName = document.getElementById('districts').value;
      const district = districts.find(d => d.name === districtName);
      const area = areas[district.id]?.find(a => a.name === areaName);

      if (!area) return;

      // Если улицы еще не загружены для выбранного района
      if (!streets[area.id]) {
        const response = await fetch(`${apiUrl}?type=streets&area_id=${area.id}`);
        streets[area.id] = await response.json();
      }
      populateDatalist('streets-list', streets[area.id]);
      document.getElementById('types').disabled = false; // Активируем поле для выбора типа знака
    }

    // Загрузка типов знаков
    async function loadTypes() {
      if (types.length === 0) {
        const response = await fetch(`${apiUrl}?type=types`);
        types = await response.json();
      }
      populateDatalist('types-list', types);
    }

    // Функция для заполнения datalist
    function populateDatalist(datalistId, data) {
      const datalist = document.getElementById(datalistId);
      datalist.innerHTML = ''; // Очистка предыдущих данных
      data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.name;  // Заполняем значением имени
        datalist.appendChild(option);
      });
    }

    // Поиск знаков
    async function searchSigns() {
      const streetName = document.getElementById('streets').value;
      const typeName = document.getElementById('types').value;

      if (!streetName || !typeName) {
        alert('Выберите улицу и тип знака');
        return;
      }

      // Найдем id улицы и типа знака по их имени
      const street = streets.flat().find(st => st.name === streetName);
      const type = types.find(t => t.name === typeName);

      if (!street || !type) {
        alert('Неверные данные для поиска.');
        return;
      }

      // Отправляем запрос с id улицы и типа знака
      const response = await fetch(`${apiUrl}?type=search&street_id=${street.id}&type_id=${type.id}`);
      const signs = await response.json();

      const results = document.getElementById('results');
      results.innerHTML = ''; // Очистить предыдущие результаты

      if (signs.length === 0) {
        results.textContent = 'Знаки не найдены.';
        return;
      }

      signs.forEach(sign => {
        const div = document.createElement('div');
        div.textContent = `ID: ${sign.id}, Координаты: (${sign.latitude}, ${sign.longitude}), Тип: ${sign.type_name}`;
        results.appendChild(div);
      });
    }

    // Инициализация
    loadDistricts();