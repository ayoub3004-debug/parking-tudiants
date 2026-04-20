<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
  $parking_id = intval($_GET['parking_id'] ?? 0);
  if (!$parking_id) {
    http_response_code(400);
    echo json_encode(['error' => 'parking_id requis']);
    exit;
  }
  $pdo = getDB();
  $stmt = $pdo->prepare("SELECT * FROM commentaires WHERE parking_id = :id ORDER BY date_commentaire DESC");
  $stmt->execute([':id' => $parking_id]);
  echo json_encode($stmt->fetchAll());

} elseif ($method === 'POST') {
  $data = json_decode(file_get_contents('php://input'), true);

  if (empty($data['parking_id']) || empty($data['message'])) {
    http_response_code(400);
    echo json_encode(['error' => 'parking_id et message requis']);
    exit;
  }

  if (strlen(trim($data['message'])) < 5) {
    http_response_code(400);
    echo json_encode(['error' => 'Message trop court']);
    exit;
  }

  $note = null;
  if (isset($data['note'])) {
    $note = intval($data['note']);
    if ($note < 1 || $note > 5) $note = null;
  }

  $pdo = getDB();
  $stmt = $pdo->prepare("INSERT INTO commentaires (parking_id, auteur, message, note) VALUES (:pid, :auteur, :message, :note)");
  $stmt->execute([
    ':pid' => intval($data['parking_id']),
    ':auteur' => htmlspecialchars(trim($data['auteur'] ?? 'Anonyme'), ENT_QUOTES),
    ':message' => htmlspecialchars(trim($data['message']), ENT_QUOTES),
    ':note' => $note
  ]);

  echo json_encode(['success' => true, 'message' => 'Commentaire ajouté !']);
}
