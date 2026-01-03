
<?php
// api/config/config.php
header("Access-Control-Allow-Origin: *"); // autorise toutes les origines
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // préflight CORS
    http_response_code(200);
    exit;
}

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