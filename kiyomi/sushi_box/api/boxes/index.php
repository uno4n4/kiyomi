<?php 

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
