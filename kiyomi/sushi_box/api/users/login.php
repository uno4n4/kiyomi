<?php
// users/login.php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/Manager/userManager.php';

header('Content-Type: application/json');

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!isset($data['email'], $data['password'])) {
    http_response_code(400);
    echo json_encode(['message' => 'Champs manquants : email, password']);
    exit;
}
$email = trim($data['email']);
$password = $data['password'];

try {
    $pdo = getPDO();
    $um = new UserManager($pdo);

    $user = $um->findUserByEmail($email);
    if (!$user) {
        http_response_code(401);
        echo json_encode(['message' => 'Identifiants incorrects.']);
        exit;
    }

    if (!password_verify($password, $user['password'])) {
        http_response_code(401);
        echo json_encode(['message' => 'Identifiants incorrects.']);
        exit;
    }

    // Générer token
    $token = bin2hex(random_bytes(32)); // token 64 bytes hex

    // Enregistrer le token en base
    $um->updateToken((int)$user['id'], $token);

    echo json_encode([
        'message' => 'Authentification réussie.',
        'token' => $token,
        'user' => [
            'id' => $user['id'],
            'firstname' => $user['firstname'],
            'lastname' => $user['lastname'],
            'email' => $user['email']
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Erreur serveur.', 'error' => $e->getMessage()]);
}

?>