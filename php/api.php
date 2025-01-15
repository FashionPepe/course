<?php
$config = parse_ini_file('config.ini', true);

$host = $config['database']['DB_HOST'];
$username = $config['database']['DB_USERNAME']; // Ваш пользователь MySQL
$password = $config['database']['DB_PASSWORD'];     // Ваш пароль MySQL
$database = $config['database']['DB_DATABASE'];


$conn = new mysqli($host, $username, $password, $database);
if ($conn->connect_error) {
    die(json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]));
}

// Определяем тип запроса
$type = isset($_GET['type']) ? $_GET['type'] : null;

if ($type === 'districts') {
    // Получить административные округа
    $query = "SELECT id, name FROM administrative_districts";
} elseif ($type === 'areas') {
    // Получить районы по административному округу
    $adminId = intval($_GET['admin_id']);
    $query = "SELECT id, name FROM areas WHERE id_admin_district = $adminId";
} elseif ($type === 'streets') {
    // Получить улицы по району
    $areaId = intval($_GET['area_id']);
    $query = "SELECT id, name FROM streets WHERE id_area = $areaId";
} elseif ($type === 'types') {
    // Получить типы знаков
    $query = "SELECT id, name FROM types";
} elseif ($type === 'search') {
    // Поиск знаков
    $streetId = intval($_GET['street_id']);
    $typeId = intval($_GET['type_id']);
    $query = "
        SELECT s.id, c.latitude, c.longitude, t.name AS type_name
        FROM signs s
        JOIN coordinates c ON s.id_coordinate = c.id
        JOIN types t ON s.id_type = t.id
        JOIN coordinates_streets cs ON c.id = cs.id_coordinate
        WHERE cs.id_street = $streetId AND s.id_type = $typeId
    ";
} else {
    die(json_encode(['error' => 'Invalid request']));
}

$result = $conn->query($query);

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

header('Content-Type: application/json');
echo json_encode($data);

$conn->close();
?>
