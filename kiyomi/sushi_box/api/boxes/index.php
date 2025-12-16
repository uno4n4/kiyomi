<?php 

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

// 4. Gérer la requête de pré-vérification du navigateur (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$pdo = new PDO('mysql:host=localhost;dbname=sushi_box', 'root', '');
$boxes = $pdo->query('SELECT * FROM boxes')->fetchAll(PDO::FETCH_ASSOC);
require "../users/Manager/boxManager.php";

if (isset($_GET['id'])){
    $boxManager = new BoxManager();
    $boxes = $boxManager->findAllById($_GET['id']);
} else {
    $boxManager = new BoxManager();
    $boxes = $boxManager->findAll();
}

header('Content-Type: application/json; charset=utf-8');
echo json_encode($boxes);
?>
