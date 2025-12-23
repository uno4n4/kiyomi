<?php
// -------- FIX CORS --------
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=utf-8");

// Gestion du preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../users/Manager/userManager.php';

$pdo = getPDO();
$input = json_decode(file_get_contents("php://input"), true);

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    if (empty($input['email'])) {
        http_response_code(400);
        echo json_encode(["error" => "Email manquant"]);
        exit;
    }

    try {
        $sql = $pdo->prepare("UPDATE users SET newsletter = 1 WHERE email = :email");
        $sql->execute(['email' => $input['email']]);

        $message = $sql->rowCount() > 0
            ? "Inscription à la newsletter confirmée"
            : "Déjà inscrit à la newsletter";

        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => $message
        ]);
        exit;

    } catch (Throwable $th) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "error" => "La requête a échoué",
            "message" => $th->getMessage()
        ]);
        exit;
    }
}
?>