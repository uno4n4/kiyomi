<?php
$input = json_decode(file_get_contents("php://input"), true); //php://input est un flux en lecture seule qui permet de lire les données brutes d'une requête HTTP POST
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../users/Manager/userManager.php';
$pdo = getPDO();

if($_SERVER["REQUEST_METHOD"] === "POST"){
    if (isset($input['recherche'])) {
        try {
            // Recherche en bdd des boxes correspondant à la recherche b-> fa-> fi-> fo (le nom de la boxe, l'id de la boxe, les flavors, les foods)
            $sqlBox = $pdo->prepare("SELECT 
                                        b.name,
                                        fa.box_id,
                                        fa.flavor_name,
                                        fa.food_name
                                    FROM boxes AS b
                                    JOIN (
                                        SELECT 
                                            fi.box_id,
                                            fi.flavor_name,
                                            fo.food_name
                                        FROM (
                                            SELECT 
                                                bfl.box_id,
                                                fl.name AS flavor_name
                                            FROM box_flavors bfl
                                            JOIN flavors fl ON bfl.flavor_id = fl.id
                                        ) AS fi
                                        JOIN (
                                            SELECT 
                                                bf.box_id,
                                                f.name AS food_name
                                            FROM box_foods bf
                                            JOIN foods f ON bf.food_id = f.id
                                        ) AS fo
                                        ON fi.box_id = fo.box_id
                                    ) AS fa
                                    ON b.id = fa.box_id 
                                   WHERE b.name LIKE CONCAT('%', :recherche, '%')
                                   OR fa.flavor_name LIKE CONCAT('%', :recherche, '%')
                                   OR fa.food_name LIKE CONCAT('%', :recherche, '%') 
                                   GROUP BY fa.box_id;");
                                   //concat sert à ce que le like % marche avec la variable
                                   //group by pour avoir un seul résultat par box

            $sqlBox->execute(['recherche' => $input['recherche']]);
            $matchBox = $sqlBox->fetchAll(PDO::FETCH_ASSOC);

            if (!$matchBox) {
                http_response_code(400);
                header('Content-Type: application/json');
                echo json_encode(["error" => "Aucun résultat à la recherche n'a été trouvé."]);
                exit;
            }

            //resultat de la recherche
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'match' => $matchBox
            ]);
        } catch (\Throwable $th) {
            http_response_code(500);
            echo json_encode([
                "error" => "La recherche n'a pas abouti",
                "message" => $th->getMessage()
            ]);
        }
    }
}
?>