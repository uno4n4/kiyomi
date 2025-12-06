<?php
$input = json_decode(file_get_contents("php://input"), true); //php://input est un flux en lecture seule qui permet de lire les données brutes d'une requête HTTP POST
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../users/Manager/userManager.php';

try {
    if (isset($input['box_id']) && isset($input['quantity']) && isset($input['user_id']) && isset($input['items'])) {

        // Vérification que la box existe
        $sqlBox = $pdo->prepare("SELECT id FROM boxes WHERE id = :id");
        $sqlBox->execute(['id' => $input['box_id']]);
        $box = $sqlBox->fetch();

        if (!$box) {
            http_response_code(400);
            header('Content-Type: application/json');
            echo json_encode(["error" => "La box avec l'id spécifié n'existe pas."]);
            exit;
        }

        // Début transaction
        $pdo->beginTransaction();

        // Création de la commande
        $sqlOrder = $pdo->prepare("INSERT INTO orders (user_id, total_price, status, created_at) 
                                   VALUES (:user_id, 0, :status, NOW())");
        $sqlOrder->execute([
            'user_id' => $input['user_id'],
            'status' => "pending"
        ]);

        $orderId = $pdo->lastInsertId();

        // Préparation insertion d’items
        $sqlItem = "INSERT INTO order_items (order_id, box_id, quantity, unit_price) 
                    VALUES (:order_id, :box_id, :quantity, :unit_price)";
        $stmtItem = $pdo->prepare($sqlItem);

        $total = 0;
        $nbboxes = 0;

        // Récupération status utilisateur
        $sqlStatus = $pdo->prepare("SELECT status FROM users WHERE id = :id");
        $sqlStatus->execute(['id' => $input['user_id']]);
        $statusFetch = $sqlStatus->fetch();
        $statusUser = $statusFetch['status'];

        foreach ($input['items'] as $item) {

            while ($nbboxes <= 10) {

                $nbboxes += $item['quantity'];

                // Prix de la box
                $sqlPrice = $pdo->prepare("SELECT price FROM boxes WHERE id = :id");
                $sqlPrice->execute(['id' => $item['box_id']]);
                $box = $sqlPrice->fetch();

                // Insertion item
                $stmtItem->execute([
                    'order_id' => $orderId,
                    'box_id' => $item['box_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $box['price']
                ]);

                // Calcul du total
                $lineTotal = $box['price'] * $item['quantity'];
                if ($statusUser === 'student') {
                    $lineTotal *= 0.9; // 10% de réduction pour les utilisateurs etudiants
                }
                $total += $lineTotal;
                if($total > 139.99){
                    $total *= 0.985; // pour les commandes supérieures à 139.99€ on applique une réduction de 1.5%
                }
            }
            if ($nbboxes > 10) {
                http_response_code(409);
                echo json_encode(["error" => "Nombre maximum de box par commande atteint (10)."]);
                $pdo->rollBack();
                exit;
            }
        }

        // Mise à jour du total de la commande
        $sqlUpdateTotal = $pdo->prepare("UPDATE orders SET total_price = :total_price WHERE id = :order_id");
        $sqlUpdateTotal->execute([
            'total_price' => $total,
            'order_id' => $orderId
        ]);

        // Validation transaction
        $pdo->commit();

        //resultat de la création de la commande (donnees json)
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'order_id' => $orderId
        ]);
    } else { //si les données requises ne sont pas présentes (isset())
        http_response_code(400);
        echo json_encode([
            "error" => "Données incomplètes pour créer la commande."
        ]);
    }
} catch (\Throwable $th) { //si une erreur survient dans le bloc try
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode([
        "error" => "Impossible de créer la commande.",
        "message" => $th->getMessage()
    ]);
}
