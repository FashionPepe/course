<?php
    $config = parse_ini_file('config.ini', true);

    $host = $config['database']['DB_HOST'];
    $username = $config['database']['DB_USERNAME'];
    $password = $config['database']['DB_PASSWORD'];
    $database = $config['database']['DB_DATABASE'];

    $conn = new mysqli($host, $username, $password, $database);
    if ($conn->connect_error) {
        die(json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]));
    }
?>