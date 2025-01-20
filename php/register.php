<?php
include './connection.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Получаем данные из POST-запроса
    $name = $_POST['name'];
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Проверяем, существует ли уже пользователь с таким email
    $sql = "SELECT * FROM users WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode(["error" => "User with this email already exists."]);
    } else {
        // Хешируем пароль
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        // Вставляем нового пользователя в базу данных
        $sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sss", $name, $email, $hashed_password);

        if ($stmt->execute()) {
            echo json_encode(["success" => "Registration successful!"]);
        } else {
            echo json_encode(["error" => "Error: " . $stmt->error]);
        }
    }
}

$conn->close();
?>
