<?php
// Supprime tout header potentiellement envoyé par Apache ou PHP
header_remove('Access-Control-Allow-Origin');

// Headers CORS pour toutes les requêtes
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json; charset=utf-8");

// Répondre immédiatement à la requête préflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}


