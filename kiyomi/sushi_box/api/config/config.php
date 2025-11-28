<?php
// api/config/config.php

function getPDO(): PDO {
    $host = "localhost";
    $user = "root";
    $pass = "";
    $db   = "sushi_box";

    $dsn = "mysql:host=$host;dbname=$db;charset=utf8mb4";

    try {
        $pdo = new PDO(
            $dsn,
            $user,
            $pass,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]
        );
        return $pdo; // on retourne le PDO
    } catch (PDOException $e) {
        die("Échec de la connexion : " . $e->getMessage());
    }
}

?>