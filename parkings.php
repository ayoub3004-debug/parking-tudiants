<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
  $pdo = getDB();
  $where = ['p.valide = 1'];
  $params = [];

  if (!empty($_GET['pmr'])) {
    $where[] = 'p.accessible_pmr = 1';
  }
  if (!empty($_GET['fac'])) {
    $where[] = 'p.proche_fac = 1';
  }
  if (!empty($_GET['search'])) {
    $where[] = '(p.nom LIKE :search OR p.adresse LIKE :search)';
    $params[':search'] = '%' . $_GET['search'] . '%';
  }

  $whereStr = implode(' AND ', $where);

  $sql = "
    SELECT p.*,
      (SELECT s.statut FROM signalements s WHERE s.parking_id = p.id ORDER BY s.date_signalement DESC LIMIT 1) AS dernier_statut,
      (SELECT COUNT(*) FROM commentaires c WHERE c.parking_id = p.id) AS nb_commentaires,
      (SELECT ROUND(AVG(c.note), 1) FROM commentaires c WHERE c.parking_id = p.id AND c.note IS NOT NULL) AS note_moyenne
    FROM parkings p
    WHERE $whereStr
    ORDER BY p.date_ajout DESC
  ";

  $stmt = $pdo->prepare($sql);
  $stmt->execute($params);
  echo json_encode($stmt->fetchAll());

} elseif ($method === 'POST') {
  $data = json_decode(file_get_contents('php://input'), true);

  $required = ['nom', 'adresse', 'latitude', 'longitude'];
  foreach ($required as $field) {
    if (empty($data[$field])) {
      http_response_code(400);
      echo json_encode(['error' => "Champ manquant: $field"]);
      exit;
    }
  }

  $nom = htmlspecialchars(trim($data['nom']), ENT_QUOTES);
  $adresse = htmlspecialchars(trim($data['adresse']), ENT_QUOTES);
  $lat = floatval($data['latitude']);
  $lng = floatval($data['longitude']);
  $nb = intval($data['nb_places'] ?? 0);
  $pmr = intval($data['accessible_pmr'] ?? 0);
  $fac = intval($data['proche_fac'] ?? 0);
  $desc = htmlspecialchars(trim($data['description'] ?? ''), ENT_QUOTES);
  $auteur = htmlspecialchars(trim($data['ajoute_par'] ?? 'Anonyme'), ENT_QUOTES);

  if ($lat < 47.7 || $lat > 48.1 || $lng < 1.7 || $lng > 2.2) {
    http_response_code(400);
    echo json_encode(['error' => 'Coordonnées hors de la zone Orléans']);
    exit;
  }

  $pdo = getDB();
  $stmt = $pdo->prepare("
    INSERT INTO parkings (nom, adresse, latitude, longitude, nb_places, accessible_pmr, proche_fac, description, ajoute_par, valide)
    VALUES (:nom, :adresse, :lat, :lng, :nb, :pmr, :fac, :desc, :auteur, 0)
  ");
  $stmt->execute([
    ':nom' => $nom, ':adresse' => $adresse, ':lat' => $lat,
    ':lng' => $lng, ':nb' => $nb, ':pmr' => $pmr,
    ':fac' => $fac, ':desc' => $desc, ':auteur' => $auteur
  ]);

  echo json_encode(['success' => true, 'message' => 'Parking soumis, en attente de validation. Merci !']);
}
