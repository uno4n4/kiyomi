<?php
// // -------- FIX CORS OBLIGATOIRE --------
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Credentials: true");
// header("Access-Control-Allow-Headers: Content-Type, Authorization");
// header("Access-Control-Allow-Methods: POST, OPTIONS");
// header("Content-Type: application/json; charset=utf-8");

// // Réponse au preflight (OPTIONS)
// if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
//     http_response_code(200);
//     exit;
// }
// // -------- FIN FIX CORS --------

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/Manager/userManager.php';

session_start();

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    if (!isset($data['email'], $data['password'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Champs manquants : email, password'
        ]);
        exit;
    }

    $email = trim($data['email']);
    $password = $data['password'];

    try {
        $pdo = getPDO();
        $um = new UserManager($pdo);

        $user = $um->findUserByEmail($email);

        if (!$user || !password_verify($password, $user['password'])) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'Identifiants incorrects.'
            ]);
            exit;
        }

        $token = bin2hex(random_bytes(32));
        $um->updateToken((int)$user['id'], $token);

        $_SESSION["utilisateur"] = $user;

        echo json_encode([
            'success' => true,
            'message' => 'Authentification réussie.',
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'prenom' => $user['firstname'],
                'nom' => $user['lastname'],
                'email' => $user['email'],
                'status' => $user['status']
            ]
        ]);
        exit;

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Erreur serveur.',
            'error' => $e->getMessage()
        ]);
    }
}
