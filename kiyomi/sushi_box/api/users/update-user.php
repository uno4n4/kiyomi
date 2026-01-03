<?php
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Methods: POST, OPTIONS");
// header("Access-Control-Allow-Headers: Content-Type, Authorization");
// header("Content-Type: application/json; charset=utf-8");

// // Gestion de la requête préflight
// if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
//     http_response_code(200);
//     exit;
// }

require_once __DIR__ . '/../config/config.php';
$pdo = getPDO();

$data = json_decode(file_get_contents('php://input'), true);

$id = $data['id'] ?? null;
$email = $data['email'] ?? null;
$password = $data['password'] ?? null;

if (!$id || !$email) {
    echo json_encode(['success' => false, 'message' => 'Données manquantes']);
    exit;
}

try {
    if (!empty($password)) {
        // Mettre à jour email + mot de passe en une seule requête
        $hashed = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("UPDATE users SET email=?, password=? WHERE id=?");
        $stmt->execute([$email, $hashed, $id]);
    } else {
        // Mettre à jour seulement l'email
        $stmt = $pdo->prepare("UPDATE users SET email=? WHERE id=?");
        $stmt->execute([$email, $id]);
    }

    echo json_encode(['success' => true, 'message' => 'Compte mis à jour']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Erreur serveur: ' . $e->getMessage()]);
}

?>