import psycopg2
from datetime import datetime
import json

# Подключаемся к базе данных
def connect_db():
    try:
        conn = psycopg2.connect(
            dbname="your_dbname", 
            user="your_dbuser", 
            password="your_dbpassword", 
            host="your_dbhost", 
            port="your_dbport"
        )
        return conn
    except Exception as e:
        print(f"Error connecting to database: {e}")
        return None

# Функция для обновления или добавления в таблицу "statuses"
def update_statuses(data_json):
    # Подключаемся к базе данных
    conn = connect_db()
    if conn is None:
        return

    cursor = conn.cursor()

    # Проходим по данным из JSON
    for sign_id, sign_value in data_json.items():
        # Получаем текущую дату
        current_date = datetime.now().strftime('%Y-%m-%d')

        # Проверяем, существует ли ID в базе данных
        cursor.execute("SELECT EXISTS(SELECT 1 FROM your_table WHERE id = %s)", (sign_id,))
        exists = cursor.fetchone()[0]

        if exists:
            # Если знак существует, проверяем его статус
            cursor.execute("SELECT * FROM statuses WHERE sign_id = %s", (sign_id,))
            row = cursor.fetchone()

            if row:
                # Если статус найден, обновляем его
                cursor.execute("""
                    UPDATE statuses
                    SET date = %s, status = 1
                    WHERE sign_id = %s
                """, (current_date, sign_id))
            else:
                # Если статуса нет, добавляем его
                cursor.execute("""
                    INSERT INTO statuses (sign_id, date, status)
                    VALUES (%s, %s, 1)
                """, (sign_id, current_date))
        else:
            # Если ID нет в базе данных, добавляем его в базу
            cursor.execute("""
                INSERT INTO your_table (id)
                VALUES (%s)
            """, (sign_id,))
            cursor.execute("""
                INSERT INTO statuses (sign_id, date, status)
                VALUES (%s, %s, 1)
            """, (sign_id, current_date))

    # Обрабатываем знаки, которых нет в JSON (т.е. они уже в базе, но в JSON их нет)
    cursor.execute("SELECT sign_id FROM statuses WHERE sign_id NOT IN %s", (tuple(data_json.keys()),))
    signs_to_update = cursor.fetchall()

    for sign_id in signs_to_update:
        # Обновляем статус знаков, которых нет в JSON, на 0
        cursor.execute("""
            UPDATE statuses
            SET status = 0
            WHERE sign_id = %s
        """, (sign_id[0],))

    # Подтверждаем изменения и закрываем соединение
    conn.commit()
    cursor.close()
    conn.close()

# Пример JSON данных
data_json = {
    "1": "some_value_1",
    "2": "some_value_2"
}

# Запуск функции
update_statuses(data_json)
