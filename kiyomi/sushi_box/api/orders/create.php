<?php
// -------- FIX CORS OBLIGATOIRE --------
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$input = json_decode(file_get_contents("php://input"), true);

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../users/Manager/userManager.php';
$pdo = getPDO();

try {
    if (!isset($input['user_id']) || !isset($input['items']) || !is_array($input['items'])) {
        http_response_code(400);
        echo json_encode(["error" => "Données incomplètes pour créer la commande."]);
        exit;
    }

    $user_id = $input['user_id'];

    // Vérifier si l'utilisateur a déjà une commande "pending"
    $sqlPending = $pdo->prepare("SELECT id, total_price FROM orders WHERE user_id = :user_id AND status = 'pending'");
    $sqlPending->execute(['user_id' => $user_id]);
    $order = $sqlPending->fetch();

    if ($order) {
        $orderId = $order['id'];
        $total = (float)$order['total_price'];
        $nbboxes = 0;

        // Compter les boxes déjà présentes dans la commande
        $sqlCount = $pdo->prepare("SELECT SUM(quantity) as total_boxes FROM order_items WHERE order_id = :order_id");
        $sqlCount->execute(['order_id' => $orderId]);
        $countResult = $sqlCount->fetch();
        $nbboxes = (int)$countResult['total_boxes'];
    } else {
        // Créer une nouvelle commande
        $pdo->beginTransaction();
        $sqlOrder = $pdo->prepare("INSERT INTO orders (user_id, total_price, status, created_at) 
                                   VALUES (:user_id, 0, 'pending', NOW())");
        $sqlOrder->execute(['user_id' => $user_id]);
        $orderId = $pdo->lastInsertId();
        $total = 0;
        $nbboxes = 0;
    }

    $sqlItem = "INSERT INTO order_items (order_id, box_id, quantity, unit_price) 
                VALUES (:order_id, :box_id, :quantity, :unit_price)";
    $stmtItem = $pdo->prepare($sqlItem);

    // Récupération status utilisateur
    $sqlStatus = $pdo->prepare("SELECT status FROM users WHERE id = :id OR email = :id");
    $sqlStatus->execute(['id' => $user_id, 'email' => $user_id]);
    $statusUser = $sqlStatus->fetch()['status'];

    foreach ($input['items'] as $item) {
        if (!isset($item['box_id'], $item['quantity'])) continue;

        $quantityToAdd = (int)$item['quantity'];

        if ($nbboxes + $quantityToAdd > 10) {
            http_response_code(409);
            echo json_encode(["error" => "Nombre maximum de box par commande atteint (10)."]);
            if (!$order) $pdo->rollBack();
            exit;
        }

        // Récupérer le prix de la box
        $sqlPrice = $pdo->prepare("SELECT price FROM boxes WHERE id = :id");
        $sqlPrice->execute(['id' => $item['box_id']]);
        $boxData = $sqlPrice->fetch();

        if (!$boxData) {
            http_response_code(400);
            echo json_encode(["error" => "La box avec l'id {$item['box_id']} n'existe pas."]);
            if (!$order) $pdo->rollBack();
            exit;
        }

        $price = (float)$boxData['price'];

        // Insérer l'item
        $stmtItem->execute([
            'order_id' => $orderId,
            'box_id' => $item['box_id'],
            'quantity' => $quantityToAdd,
            'unit_price' => $price
        ]);

        // Calcul total
        $lineTotal = $price * $quantityToAdd;
        if ($statusUser === 'student') $lineTotal *= 0.9;
        $total += $lineTotal;

        if ($total > 139.99) $total *= 0.985;

        $nbboxes += $quantityToAdd;
    }

    // Mise à jour du total
    $sqlUpdateTotal = $pdo->prepare("UPDATE orders SET total_price = :total_price WHERE id = :order_id");
    $sqlUpdateTotal->execute([
        'total_price' => $total,
        'order_id' => $orderId
    ]);

    if (!$order) $pdo->commit();

    http_response_code(201);
    echo json_encode([
        'success' => true,
        'order_id' => $orderId
    ]);
} catch (\Throwable $th) {
    if (!$order) $pdo->rollBack();
    http_response_code(500);
    echo json_encode([
        "error" => "Impossible de créer la commande.",
        "message" => $th->getMessage()
    ]);
}
?>