<?php
// CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=utf-8");

// ⚠️ DONNÉES FAKE (stats de démonstration)
$response = [
    "percentages" => [
        "takeaway" => 28,
        "delivery" => 57,
        "onSite" => 15
    ],
    "charts" => [
        "weeklyOrders" => [
            ["label" => "Lun", "value" => 12],
            ["label" => "Mar", "value" => 28],
            ["label" => "Mer", "value" => 22],
            ["label" => "Jeu", "value" => 31],
            ["label" => "Ven", "value" => 26],
            ["label" => "Sam", "value" => 38],
            ["label" => "Dim", "value" => 20]
        ],
        "satisfaction" => [
            ["label" => "Service", "value" => 78],
            ["label" => "Qualité", "value" => 85],
            ["label" => "Rapport Q/P", "value" => 72],
            ["label" => "Livraison", "value" => 65]
        ]
    ]
];

echo json_encode($response);
?>