<?php 
class BoxManager {
    private $pdo;
    //pour l'utiliser il faudra ecrire this->pdo car cette variable est privée

    public function __construct(){
        $this->pdo = new PDO('mysql:host=localhost;dbname=sushi_box', 'root', '');
    }

    public function findAll(){
    $boxes = $this->pdo->query("SELECT * FROM boxes")->fetchAll(PDO::FETCH_ASSOC);

        foreach ($boxes as &$box) {
            // Conversion du prix en float "24.50" en 24.50
            $box['price'] = round($box['price'], 2);


            // Étape 2 : foods
            $stmt = $this->pdo->prepare("
                SELECT f.name, CAST(bf.quantity AS UNSIGNED) AS quantity
                FROM box_foods bf
                JOIN foods f ON bf.food_id = f.id
                WHERE bf.box_id = :id
            ");
            $stmt->execute(['id' => $box['id']]);
            $box['foods'] = $stmt->fetchAll(PDO::FETCH_ASSOC);


            // Étape 3 : flavors
            $stmt = $this->pdo->prepare("
                SELECT fl.name
                FROM box_flavors bf
                JOIN flavors fl ON bf.flavor_id = fl.id
                WHERE bf.box_id = :id
            ");
            $stmt->execute(['id' => $box['id']]);
            $box['flavors'] = array_column($stmt->fetchAll(), 'name');
        }
        return $boxes;
    }
    public function findAllById($id){
        // $query =$this->pdo->prepare("SELECT * FROM boxes WHERE id = ?");
        // $query->execute([$id]);
        // $boxe = $query->fetchAll();
        // return $boxe;

        // récupèration de la box
        $stmt = $this->pdo->prepare("SELECT * FROM boxes WHERE id = :id");
        $stmt->execute(['id' => $_GET['id']]);
        // fetch retourne un seul résultat (une box)
        $box = $stmt->fetch(PDO::FETCH_ASSOC);

        // ses ingrédients
        $stmt = $this->pdo->prepare("
                SELECT f.name, CAST(bf.quantity AS UNSIGNED) AS quantity
                FROM box_foods bf
                JOIN foods f ON bf.food_id = f.id
                WHERE bf.box_id = :id
            ");
        $stmt->execute(['id' => $box['id']]);
        $box['foods'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // ses goûts/arômes
        $stmt = $this->pdo->prepare("
            SELECT fl.name
            FROM box_flavors bf
            JOIN flavors fl ON bf.flavor_id = fl.id
            WHERE bf.box_id = :id
        ");
        $stmt->execute(['id' => $box['id']]);
        $box['flavors'] = array_column($stmt->fetchAll(), 'name');

        return $box;
    }
}

?>