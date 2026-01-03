<?php
session_start();
// // Gestion du preflight CORS
// if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
//    header("Access-Control-Allow-Origin: *");
//    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
//    header("Access-Control-Allow-Headers: Content-Type, Authorization");
//    http_response_code(204);
//    exit;
// }


// header("Access-Control-Allow-Origin: http://localhost:4200");
// header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
// header("Access-Control-Allow-Headers: Content-Type, Authorization");
require_once __DIR__ . '/../config/config.php';

try {
    $pdo = getPDO();

    // recuperation id user
    $userId = isset($_GET['userid']) ? (int)$_GET['userid'] : null;

    if (!$userId) {
        http_response_code(400);
        echo json_encode([
            'error' => 'Utilisateur non spécifié'
        ]);
        exit;
    }

    $stmt = $pdo->prepare("SELECT 
            o.id AS order_id,
            o.created_at,
            o.total_price,
            o.status,
            oi.box_id,
            oi.quantity,
            oi.unit_price
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        WHERE o.user_id = :user AND o.status != 'pending'
        ORDER BY o.id DESC");
        //il faut regrouper les éléments de la commande

    $stmt->execute(['user' => $userId]);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $orders = [];

    foreach ($rows as $row) {
        $orderId = $row['order_id'];

        if (!isset($orders[$orderId])) {
            $orders[$orderId] = [
                'id' => $orderId,
                'created_at' => $row['created_at'],
                'total_price' => $row['total_price'],
                'items' => []
            ];
        }

        $orders[$orderId]['items'][] = [
            'box_id' => $row['box_id'],
            'quantity' => $row['quantity'],
            'unit_price' => $row['unit_price']
        ];
    }


    $orders = array_values($orders);

    echo json_encode([
        'success' => true,
        'anciensPaniers' => $orders
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Erreur serveur',
        'message' => $e->getMessage()
    ]);
}
