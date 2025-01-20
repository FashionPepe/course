let map; // Переменная для карты

async function initMap() {
    // Дождемся полной загрузки API Yandex Maps 3
    await ymaps3.ready;

    const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker } = ymaps3;

    // Создаем карту
    map = new YMap(
        document.getElementById('map'),
        {
            location: {
                center: [37.588144, 55.733842],
                zoom: 10
            }
        }
    );

    // Добавляем слой с картой по умолчанию
    map.addChild(new YMapDefaultSchemeLayer());

    // Добавляем слой объектов по умолчанию
    map.addChild(new YMapDefaultFeaturesLayer());
}

// Функция для создания маркера
window.createMarker =  async function (coordinates) {
    // Дождемся полной загрузки API Yandex Maps 3
    await ymaps3.ready;

    const { YMapMarker } = ymaps3;

    // Создаем элемент для маркера
    const markerElement = document.createElement('div');
    markerElement.className = 'marker-class';
    markerElement.innerText = "I'm a marker!";
    markerElement.addEventListener('click', function() {
        alert("Маркер");
    });

    // Создаем маркер
    const marker = new YMapMarker(
        {
            coordinates: coordinates
        },
        markerElement
    );

    // Добавляем маркер на карту
    if (map) {
        map.addChild(marker);
        map.update();
    } else {
        console.error('Карта не инициализирована');
    }
    console.error('создан знак');
}

// Инициализируем карту и маркер
initMap()

