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
  $stmt = $pdo->prepare("SELECT * FROM signalements WHERE parking_id = :id ORDER BY date_signalement DESC LIMIT 10");
  $stmt->execute([':id' => $parking_id]);
  echo json_encode($stmt->fetchAll());

} elseif ($method === 'POST') {
  $data = json_decode(file_get_contents('php://input'), true);

  if (empty($data['parking_id']) || empty($data['statut'])) {
    http_response_code(400);
    echo json_encode(['error' => 'parking_id et statut requis']);
    exit;
  }

  $statuts_valides = ['disponible', 'occupe', 'ferme'];
  if (!in_array($data['statut'], $statuts_valides)) {
    http_response_code(400);
    echo json_encode(['error' => 'Statut invalide']);
    exit;
  }

  $pdo = getDB();
  $stmt = $pdo->prepare("INSERT INTO signalements (parking_id, statut, commentaire) VALUES (:pid, :statut, :comment)");
  $stmt->execute([
    ':pid' => intval($data['parking_id']),
    ':statut' => $data['statut'],
    ':comment' => htmlspecialchars(trim($data['commentaire'] ?? ''), ENT_QUOTES)
  ]);

  echo json_encode(['success' => true, 'message' => 'Signalement enregistré, merci !']);
}
