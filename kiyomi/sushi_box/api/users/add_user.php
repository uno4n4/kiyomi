<?php
// users/add_user.php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/Manager/userManager.php';

$pdo = getPDO();
$um = new userManager($pdo);
header('Content-Type: application/json');

// Get raw JSON body
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

// Basic validation
if (!isset($data['firstname'], $data['lastname'], $data['email'], $data['password'])) {
    http_response_code(400);
    echo json_encode(['message' => 'Champs manquants : firstname, lastname, email, password']);
    exit;
}
$firstname = trim($data['firstname']);
$lastname  = trim($data['lastname']);
$email     = trim($data['email']);
$password  = $data['password'];

if ($firstname === '' || $lastname === '' || $email === '' || $password === '') {
    http_response_code(400);
    echo json_encode(['message' => 'Les champs ne doivent pas être vides.']);
    exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['message' => 'Adresse email invalide.']);
    exit;
}

try {
    $pdo = getPDO();
    $um = new UserManager($pdo);

    // Vérifier si email existe déjà
    if ($um->findUserByEmail($email)) {
        http_response_code(409); // Conflict
        echo json_encode(['message' => 'Un utilisateur avec cet email existe déjà.']);
        exit;
    }

    // Hachage du mot de passe
    $password_hash = password_hash($password, PASSWORD_DEFAULT);

    $newUserId = $um->createUser([
        'firstname' => $firstname,
        'lastname'  => $lastname,
        'email'     => $email,
        'password_hash' => $password_hash
    ]);

    http_response_code(201); // Created
    echo json_encode(['message' => 'Utilisateur créé.', 'id' => $newUserId]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Erreur serveur.', 'error' => $e->getMessage()]);
}

?>