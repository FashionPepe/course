<?php
// Подключение к базе данных
include './connection.php';

// Выполнение SQL-запроса с подготовленными выражениями
function executeQuery($conn, $query, $params = []) {
    $stmt = $conn->prepare($query);
    if ($params) {
        $types = str_repeat('s', count($params)); // Все параметры - строки
        $stmt->bind_param($types, ...$params);
    }
    $stmt->execute();
    $result = $stmt->get_result();
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    $stmt->close();
    return $data;
}


// Определяем тип запроса
$type = isset($_GET['type']) ? $_GET['type'] : null;

if ($type === 'districts') {
    // Получить административные округа
    $query = "SELECT id, name FROM administrative_districts";
    $data = executeQuery($conn, $query);
} elseif ($type === 'areas') {
    // Получить районы по административному округу
    $adminId = isset($_GET['admin_id']) ? intval($_GET['admin_id']) : null;
    if ($adminId) {
        $query = "SELECT id, name FROM areas WHERE id_admin_district = ?";
        $data = executeQuery($conn, $query, [$adminId]);
    } else {
        $data = ['error' => 'Missing admin_id'];
    }
} elseif ($type === 'streets') {
    // Получить улицы по району
    $areaId = isset($_GET['area_id']) ? intval($_GET['area_id']) : null;
    if ($areaId) {
        $query = "SELECT id, name FROM streets WHERE id_area = ?";
        $data = executeQuery($conn, $query, [$areaId]);
    } else {
        $data = ['error' => 'Missing area_id'];
    }
} elseif ($type === 'types') {
    // Получить типы знаков
    $query = "SELECT id, name FROM types";
    $data = executeQuery($conn, $query);
} elseif ($type === 'search') {
    // Поиск знаков
    $streetId = isset($_GET['street_id']) ? intval($_GET['street_id']) : null;
    $typeId = isset($_GET['type_id']) ? intval($_GET['type_id']) : null;
    $date = isset($_GET['date']) ? $_GET['date'] : null;

    if ($streetId && $typeId && $date) {
        $query = "
            SELECT s.id, c.latitude, c.longitude, t.name AS type_name
            FROM signs s
            JOIN coordinates c ON s.id_coordinate = c.id
            JOIN types t ON s.id_type = t.id
            JOIN coordinates_streets cs ON c.id = cs.id_coordinate
            JOIN statuses st ON st.id_sign = s.id
            WHERE cs.id_street = ? AND s.id_type = ? AND st.date = GetNearestDate(?)";
        $data = executeQuery($conn, $query, [$streetId, $typeId, $date]);
    } else {
        $data = ['error' => 'Missing parameters for search'];
    }
} else {
    $data = ['error' => 'Invalid request'];
}

// Вывод данных в формате JSON
header('Content-Type: application/json');
echo json_encode($data);

// Закрываем соединение с базой данных
$conn->close();
?>
