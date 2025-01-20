<?php

include 'connection.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Получаем данные из POST-запроса
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Получаем информацию о пользователе по email
    $sql = "SELECT * FROM users WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 0) {
        echo json_encode(["error" => "No user found with this email."]);
    } else {
        // Получаем пользователя из результата запроса
        $user = $result->fetch_assoc();

        // Проверяем, совпадает ли введенный пароль с хешированным в базе
        if (password_verify($password, $user['password'])) {
            // Отправляем информацию о пользователе обратно
            echo json_encode([
                "success" => "Login successful!",
                "user" => [
                    "id" => $user['id'],
                    "name" => $user['name'],
                    "email" => $user['email']
                ]
            ]);
        } else {
            echo json_encode(["error" => "Incorrect password."]);
        }
    }
}

$conn->close();
?>