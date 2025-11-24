<?php
$pdo = new PDO('mysql:host=localhost;dbname=sushi_box', 'root', '');
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
require "../../Manager/userManager.php";

$content = file_get_contents('php://input');
$data = json_decode($content, true);

$passwordHash = password_hash($data['password'], PASSWORD_DEFAULT);

$sql = "INSERT INTO users (firstname, lastname, email, password)
        VALUES (:firstname, :lastname, :email, :password_hash)";

$query = $pdo->prepare($sql);

$query->execute([
    ':firstname' => $data['firstname'],
    ':lastname' => $data['lastname'],
    ':email' => $data['email'],
    ':password_hash' => $passwordHash
]);


?>