<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/config/config.php';

try {
    $pdo = getPDO();

    // Total commandes
    $stmt = $pdo->query("SELECT COUNT(*) AS c FROM orders");
    $totalOrders = (int)($stmt->fetch(PDO::FETCH_ASSOC)['c'] ?? 0);

    // Répartition par status (confirmed/pending/...)
    $stmt = $pdo->query("
        SELECT status, COUNT(*) AS c
        FROM orders
        GROUP BY status
    ");
    $statusRows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $confirmed = 0;
    $pending = 0;
    foreach ($statusRows as $r) {
        if ($r['status'] === 'confirmed') $confirmed = (int)$r['c'];
        if ($r['status'] === 'pending') $pending = (int)$r['c'];
    }

    // Ta DB ne stocke pas delivery/takeaway/onSite.
    // On fait une répartition basée sur ce qu'on a:
    // - onSite = confirmed
    // - takeaway = pending
    // - delivery = le reste
    $onSite = $totalOrders > 0 ? round(($confirmed / $totalOrders) * 100, 1) : 0;
    $takeaway = $totalOrders > 0 ? round(($pending / $totalOrders) * 100, 1) : 0;
    $delivery = max(0, round(100 - $onSite - $takeaway, 1));

    // Commandes par jour sur les 7 derniers jours (format label/value)
    $stmt = $pdo->query("
        SELECT DATE(created_at) AS day,
               COUNT(*) AS orders
        FROM orders
        WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
        GROUP BY DATE(created_at)
        ORDER BY day ASC
    ");
    $weeklyRows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $weeklyOrders = array_map(function ($r) {
        return [
            "label" => $r["day"],           // ex: 2025-12-24
            "value" => (int)$r["orders"]
        ];
    }, $weeklyRows);

    // Commandes par ville (format label/value)
    $stmt = $pdo->query("
        SELECT
            COALESCE(u.city, 'Inconnu') AS city,
            COUNT(o.id) AS orders
        FROM orders o
        JOIN users u ON u.id = o.user_id
        GROUP BY city
        ORDER BY orders DESC
    ");
    $ordersByCityRows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $ordersByCity = array_map(function ($r) {
        return [
            "label" => $r["city"],
            "value" => (int)$r["orders"]
        ];
    }, $ordersByCityRows);

    // Satisfaction : pas de table reviews/ratings => placeholder
    $satisfaction = [
        ["label" => "Positive", "value" => 0],
        ["label" => "Neutral", "value" => 0],
        ["label" => "Negative", "value" => 0],
    ];

    echo json_encode([
        "percentages" => [
            "takeaway" => $takeaway,
            "delivery" => $delivery,
            "onSite" => $onSite
        ],
        "charts" => [
            "weeklyOrders" => $weeklyOrders,
            "satisfaction" => $satisfaction,
            "ordersByCity" => $ordersByCity
        ]
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "error" => "Server error",
        "details" => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
