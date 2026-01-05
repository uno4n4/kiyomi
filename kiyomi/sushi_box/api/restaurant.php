<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/config/config.php';

try {
    $pdo = getPDO();

    // Pourcentage d'users par statut

    $stmt = $pdo->query("SELECT
            CASE
                WHEN status = 'Etudiant' THEN 'Etudiant'
                WHEN status = 'Professionnel' THEN 'Professionnel'
                ELSE 'Autre'
            END AS user_status,
            COUNT(*) AS total
        FROM users
        GROUP BY user_status
    ");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $totalUsers = array_sum(array_column($rows, 'total'));

    $usersStatus = array_map(function ($r) use ($totalUsers) {
        return [
            "label" => $r["user_status"],
            "value" => $totalUsers > 0
                ? round(($r["total"] / $totalUsers) * 100, 1)
                : 0
        ];
    }, $rows);

    // CA par mois

    $stmt = $pdo->query("SELECT
            DATE_FORMAT(created_at, '%Y-%m') AS mois,
            SUM(total_price) AS ca
        FROM orders
        WHERE status = 'confirmed'
        GROUP BY mois
        ORDER BY mois ASC
    ");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $chiffreAffaire = array_map(function ($r) {
        return [
            "label" => $r["mois"],
            "value" => (float)$r["ca"]
        ];
    }, $rows);

    // panier moyen par satut

    $stmt = $pdo->query("SELECT
            CASE
                WHEN u.status = 'Etudiant' THEN 'Etudiant'
                WHEN u.status = 'Professionnel' THEN 'Professionnel'
                ELSE 'Autre'
            END AS user_status,
            AVG(o.total_price) AS paniermoyen
        FROM orders o
        JOIN users u ON u.id = o.user_id
        WHERE o.status = 'confirmed'
        GROUP BY user_status
    ");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $panierMoy = array_map(function ($r) {
        return [
            "label" => $r["user_status"],
            "value" => round((float)$r["paniermoyen"], 2)
        ];
    }, $rows);

    echo json_encode([
        "usersStatus" => $usersStatus,
        "chiffreAffaire" => $chiffreAffaire,
        "panierMoy" => $panierMoy
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "error" => "Server error",
        "details" => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
