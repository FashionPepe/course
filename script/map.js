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
window.createMarker =  async function (coordinates, data, id) {
    // Дождемся полной загрузки API Yandex Maps 3
    await ymaps3.ready;

    const { YMapMarker } = ymaps3;

    // Создаем элемент для маркера
    const markerElement = document.createElement('div');
    markerElement.className = 'marker';
   
    markerElement.addEventListener('click', function() {
        initActButtons(localStorage.getItem('id_user'), id)
        let info = document.getElementById('sign-info')
        
        let infoText = document.getElementById('inner-text')
        infoText.innerHTML = data
        info.setAttribute('id_sign', id)
        
        info.style.display = 'flex'
        


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
    markers.push(marker)
}

// Инициализируем карту и маркер
initMap()

