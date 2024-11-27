import requests
import json
import re

# Ваш API-ключ
api_key = "78183bb9-c954-499c-8c6f-72a64f1eb62d"
url = f"https://apidata.mos.ru/v1/datasets/62681/rows?api_key={api_key}"

# Списки для хранения данных
list_adm = []
list_areas = []
list_streets = []
list_cords = []
list_names = []
list_signs = []
cords_to_streets = []  # Новый список для связи координат и улиц

# Регулярное выражение для поиска названий улиц
words = [
    'улица', 'ул', 'переулок', 'шоссе', 'проспект', 'площадь', 'проезд',
    'село', 'аллея', 'бульвар', 'набережная', 'тупик', 'линия'
]
str_pat = r".*,\s*\b([^,]*?(?:{})\b[^,]*)[,$]+".format("|".join(words))

# Функция для добавления элемента в список, если он отсутствует, и возвращения его индекса
def add_to_list(item, target_list):
    if item not in target_list:
        target_list.append(item)
    return target_list.index(item) + 1

try:
    # Выполняем запрос к API
    response = requests.get(url)
    response.raise_for_status()  # Проверяем статус ответа
    signs = response.json()  # Парсим ответ в JSON

    for item in signs:
        cells = item.get('Cells', {})

        # 1. Административный округ
        adm = cells.get('AdmArea', '').strip()
        adm_idx = add_to_list(adm, list_adm) if adm else None

        # 2. Район и его принадлежность к округу
        area = cells.get('District', '').strip()
        area_idx = None
        if area and adm_idx:
            area_idx = add_to_list([area, adm_idx], list_areas)

        # 3. Улицы и их принадлежность к району
        location = cells.get('Location', '').strip()
        street_idx = None
        if location:
            match = re.search(str_pat, location, flags=re.I)
            if match:
                street = match.group(1).strip()
                if street and area_idx:
                    street_idx = add_to_list([street, area_idx], list_streets)

        # 4. Координаты
        coordinates = cells.get('geoData', {}).get('coordinates', [])
        cord_idx = None
        if coordinates:
            cord_idx = add_to_list(coordinates, list_cords)

        # 5. Связь координат и улиц
        if cord_idx and street_idx:
            connection = [cord_idx, street_idx]
            if connection not in cords_to_streets:
                cords_to_streets.append(connection)

        # 6. Названия объектов
        name = cells.get('SignType', 'Без названия').strip()
        name_idx = add_to_list(name, list_names)

        # 7. Знаки (ID, индекс названия, индекс координат)
        sign_id = cells.get('ID', None)
        if sign_id:
            list_signs.append([sign_id, name_idx, cord_idx])

    # Выводим результат
    print("Округа:", list_adm)
    print("Районы:", list_areas)
    print("Улицы:", list_streets)
    print("Координаты:", list_cords)
    print("Наименования:", list_names)
    print("Знаки:", list_signs)
    print("Связь координат и улиц:", cords_to_streets)

except requests.exceptions.RequestException as e:
    print(f"Ошибка при выполнении запроса: {e}")
except json.JSONDecodeError as e:
    print(f"Ошибка декодирования JSON: {e}")
