import re
import requests
import pandas as pd
from sqlalchemy import create_engine

# Подключение к базе данных
engine = create_engine('mysql+pymysql://root@localhost/signs')

# Алгоритм для извлечения улиц
def extract_streets(address):
    words = ['улица', 'ул', 'переулок', 'шоссе', 'проспект', 'площадь', 'проезд',
             'село', 'аллея', 'бульвар', 'набережная', 'тупик', 'линия']
    
    str_pat = r"\b([^,]*?(?:{})\b[^,]*)".format("|".join(words))
    matches = re.findall(str_pat, address, flags=re.I)
    
    return [match.strip() for match in matches] if matches else []

# Очищаем таблицы и сбрасываем автоинкремент
def clear_database():
    engine.execute("SET FOREIGN_KEY_CHECKS = 0;")
    engine.execute("TRUNCATE TABLE signs;")
    engine.execute("TRUNCATE TABLE types;")
    engine.execute("TRUNCATE TABLE coordinates;")
    engine.execute("TRUNCATE TABLE streets;")
    engine.execute("TRUNCATE TABLE areas;")
    engine.execute("TRUNCATE TABLE administrative_districts;")
    engine.execute("TRUNCATE TABLE coordinates_streets;")
    engine.execute("SET FOREIGN_KEY_CHECKS = 1;")

# Добавление района и округа
def add_district_and_area(row):
    district_name = row['Cells.District']
    area_name = row['Cells.AdmArea']
    # Добавляем административный округ в таблицу administrative_districts
    district_id = engine.execute(f"SELECT id FROM administrative_districts WHERE name = '{area_name}'").fetchone()
    if not district_id:
        engine.execute(f"INSERT INTO administrative_districts (name) VALUES ('{area_name}')")
        district_id = engine.execute(f"SELECT id FROM administrative_districts WHERE name = '{area_name}'").fetchone()
    # Добавляем район в таблицу areas
    area_id = engine.execute(f"SELECT id FROM areas WHERE name = '{district_name}'").fetchone()
    if not area_id:
        engine.execute(f"INSERT INTO areas (name, id_admin_district) VALUES ('{district_name}', '{district_id[0]}')")
        area_id = engine.execute(f"SELECT id FROM areas WHERE name = '{district_name}'").fetchone()
    
    return area_id[0], district_id[0]

# Вставка типа знака
def insert_sign_type(sign_type):
    sign_type_id = engine.execute(f"SELECT id FROM types WHERE name = '{sign_type}'").fetchone()
    if not sign_type_id:
        engine.execute(f"INSERT INTO types (name) VALUES ('{sign_type}')")
        sign_type_id = engine.execute(f"SELECT id FROM types WHERE name = '{sign_type}'").fetchone()
    return sign_type_id[0]

# Вставка координат
def insert_coordinates(latitude, longitude):
    coordinate_id = engine.execute(f"SELECT id FROM coordinates WHERE latitude = {latitude} AND longitude = {longitude}").fetchone()
    if not coordinate_id:
        engine.execute(f"INSERT INTO coordinates (latitude, longitude) VALUES ({latitude}, {longitude})")
        coordinate_id = engine.execute(f"SELECT id FROM coordinates WHERE latitude = {latitude} AND longitude = {longitude}").fetchone()
    return coordinate_id[0]

# Вставка улицы
def insert_street(street_name, id_area):
    street_id = engine.execute(f"SELECT id FROM streets WHERE name = '{street_name}'").fetchone()
    if not street_id:
        engine.execute(f"INSERT INTO streets (name, id_area) VALUES ('{street_name}', '{id_area}')")
        street_id = engine.execute(f"SELECT id FROM streets WHERE name = '{street_name}'").fetchone()
    return street_id[0]

# Загрузка и обработка данных
def process_and_insert_data(api_url):
    response = requests.get(api_url)
    data = response.json()
    
    df = pd.json_normalize(data)
    
    for _, row in df.iterrows():
        # Добавление района и округа
        area_id, district_id = add_district_and_area(row)
        
        # Извлечение данных знаков и координат
        sign_id = row['Cells.ID']
        sign_type = row['Cells.SignType']
        latitude = row['Cells.Latitude_WGS84']
        longitude = row['Cells.Longitude_WGS84']
        location = row['Cells.Location']
        
        # Извлечение всех улиц
        street_names = extract_streets(location)

        # Вставка типа знака и координат
        sign_type_id = insert_sign_type(sign_type)
        coordinate_id = insert_coordinates(latitude, longitude)

        # Вставка знака
        engine.execute(f"INSERT INTO signs (id, id_type, id_coordinate) VALUES ({sign_id}, {sign_type_id}, {coordinate_id})")
        
        # Вставка всех улиц, если они найдены
        for street_name in street_names:
            street_id = insert_street(street_name, area_id)
            # Проверка наличия записи в coordinates_streets
            check = engine.execute(f"""
                SELECT * FROM coordinates_streets 
                WHERE id_coordinate = {coordinate_id} AND id_street = {street_id}
            """).fetchone()
            if not check:
                engine.execute(f"INSERT INTO coordinates_streets (id_coordinate, id_street) VALUES ({coordinate_id}, {street_id})")

# Основная логика
def main():
    # Очищаем таблицы
    clear_database()
    skip = 0
    while skip < 566464:
        
        api_url = f"https://apidata.mos.ru/v1/datasets/62681/rows?api_key=78183bb9-c954-499c-8c6f-72a64f1eb62d&$skip={skip}&$top=1000"
        process_and_insert_data(api_url)
        skip += 1000
        print(f"Processing batch starting at {skip}")

main()
