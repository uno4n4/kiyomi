<?php

if(!isset($data['firstname'], $data['lastname'], $data['email'], $data['password'])){
    header('Content-Type: application/json');
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

?>