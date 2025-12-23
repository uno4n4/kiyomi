<?php
// api/orders/index.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=utf-8");
require __DIR__ . '/../config/config.php';
require __DIR__ . '/../users/Manager/userManager.php';
$pdo = getPDO();

header('Content-Type: application/json');

// Récupérer l'en-tête Authorization
$headers = getallheaders();

if (!isset($headers['Authorization']) && !isset($headers['authorization'])) {
    http_response_code(401);
    echo json_encode(['message' => 'Autorisation manquante.']);
    exit;
}
$auth = $headers['Authorization'] ?? $headers['authorization'];
// Expect "Bearer token..."
if (stripos($auth, 'Bearer ') === 0) {
    $token = trim(substr($auth, 7));
} else {
    http_response_code(401);
    echo json_encode(['message' => 'Format Authorization invalide.']);
    exit;
}

try {
    $pdo = getPDO();
    $um = new UserManager($pdo);

    $user = $um->findByToken($token);
    if (!$user) {
        http_response_code(401);
        echo json_encode(['message' => 'Token invalide.']);
        exit;
    }

    // Accès autorisé — pour l'exemple on retourne un message simple
    echo json_encode(['message' => "Accès autorisé. (La gestion des commandes arrive dans le prochain TD.)", 'user' => ['id' => $user['id'], 'email' => $user['email']]]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Erreur serveur.', 'error' => $e->getMessage()]);
}

?>