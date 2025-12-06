<?php
// users/add_user.php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=utf-8");

// Réponse au preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/Manager/userManager.php';

$pdo = getPDO();
$um = new UserManager($pdo);

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

// Validation
if (!isset($data['firstname'], $data['lastname'], $data['email'], $data['password'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Champs manquants']);
    exit;
}

$firstname = trim($data['firstname']);
$lastname  = trim($data['lastname']);
$email     = trim($data['email']);
$password  = $data['password'];

// Vérifier si l'email existe déjà
if ($um->findUserByEmail($email)) {
    http_response_code(409);
    echo json_encode(['success' => false, 'message' => 'Email déjà utilisé']);
    exit;
}

// Hachage du mot de passe
$password_hash = password_hash($password, PASSWORD_DEFAULT);

// Création de l'utilisateur
$newUserId = $um->createUser([
    'firstname' => $firstname,
    'lastname'  => $lastname,
    'email'     => $email,
    'password_hash' => $password_hash
]);

// Récupérer l'utilisateur créé via findUserByEmail
$newUser = $um->findUserByEmail($email);

// Générer un token (comme login)
$token = bin2hex(random_bytes(32));
$um->updateToken((int)$newUser['id'], $token);

// Réponse JSON compatible Angular
http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Utilisateur créé et connecté',
    'user' => [
        'id' => $newUser['id'],
        'prenom' => $newUser['firstname'],
        'nom' => $newUser['lastname'],
        'email' => $newUser['email']
    ],
    'token' => $token
]);
