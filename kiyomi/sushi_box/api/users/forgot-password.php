<?php
// header("Content-Type: application/json");
// header("Access-Control-Allow-Origin: *"); 
// header("Access-Control-Allow-Headers: Content-Type");
// header("Access-Control-Allow-Methods: POST");

require_once __DIR__ . '/../config/config.php';  
require __DIR__ . "/PHPMailer-master/src/PHPMailer.php";
require __DIR__ . "/PHPMailer-master/src/SMTP.php";
require __DIR__ . "/PHPMailer-master/src/Exception.php";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$pdo = getPDO();

// Récupération JSON depuis Angular
$data = json_decode(file_get_contents("php://input"), true);
$email = $data["email"] ?? "";

// Vérification email fourni
if (!$email) {
    echo json_encode(["success" => false, "message" => "Email manquant"]);
    exit;
}

// Vérifier que l'utilisateur existe
$stmt = $pdo->prepare("SELECT firstname FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user) {
    echo json_encode(["success" => false, "message" => "Aucun compte avec cet email"]);
    exit;
}

// Générer un mot de passe temporaire
$tempPassword = bin2hex(random_bytes(4)); // 8 caractères
$password = password_hash($tempPassword, PASSWORD_DEFAULT);

// Mettre à jour le mot de passe en base
$stmt = $pdo->prepare("UPDATE users SET password=? WHERE email=?");
$stmt->execute([$password, $email]);

// Envoyer l’email
$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host = "smtp.gmail.com";
    $mail->SMTPAuth = true;
    $mail->Username = "kiyomirestaurantsushi@gmail.com";
    $mail->Password = "mhdi pdws hiqm rcfo"; 
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = 465;

    $mail->setFrom("kiyomirestaurantsushi@gmail.com", "Restaurant Kiyomi");
    $mail->addAddress($email);

    $mail->Subject = "Votre nouveau mot de passe temporaire";
    $mail->Body = "Bonjour,\n\nVoici votre mot de passe temporaire : $tempPassword\n\nVeuillez le changer dès votre prochaine connexion.\n\nCordialement,\nRestaurant Kiyomi";

    $mail->send();

    echo json_encode(["success" => true, "message" => "Un email avec un mot de passe temporaire vous a été envoyé."]);
} 
catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Erreur lors de l'envoi de l'email : " . $e->getMessage()]);
}

?>