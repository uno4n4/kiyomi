<?php

class UserManager {
    private PDO $pdo;

    public function __construct(PDO $pdo) {
        $this->pdo = $pdo;
    }

    public function createUser(array $data): int {
        $sql = "INSERT INTO users (firstname, lastname, email, password, status) VALUES (:firstname, :lastname, :email, :password, :status)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':firstname' => $data['firstname'],
            ':lastname'  => $data['lastname'],
            ':email'     => $data['email'],
            ':password'  => $data['password_hash'],
            ':status' => $data['status']
        ]);
        return (int)$this->pdo->lastInsertId();
    }

    public function findUserByEmail(string $email): ?array {
        $sql = "SELECT * FROM users WHERE email = :email LIMIT 1";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':email' => $email]);
        $user = $stmt->fetch();
        return $user ?: null;
    }

    public function updateToken(int $userId, string $token): bool {
        $sql = "UPDATE users SET api_token = :token WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([':token' => $token, ':id' => $userId]);
    }

    public function findByToken(string $token): ?array {
        $sql = "SELECT * FROM users WHERE api_token = :token LIMIT 1";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':token' => $token]);
        $user = $stmt->fetch();
        return $user ?: null;
    }
}

?>