CREATE DATABASE IF NOT EXISTS parketudiant CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE parketudiant;

CREATE TABLE parkings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  adresse VARCHAR(200) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  nb_places INT DEFAULT 0,
  gratuit TINYINT(1) DEFAULT 1,
  accessible_pmr TINYINT(1) DEFAULT 0,
  proche_fac TINYINT(1) DEFAULT 0,
  description TEXT,
  ajoute_par VARCHAR(100) DEFAULT 'Anonyme',
  date_ajout DATETIME DEFAULT CURRENT_TIMESTAMP,
  valide TINYINT(1) DEFAULT 0
);

CREATE TABLE signalements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  parking_id INT NOT NULL,
  statut ENUM('disponible', 'occupe', 'ferme') NOT NULL,
  commentaire TEXT,
  date_signalement DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parking_id) REFERENCES parkings(id) ON DELETE CASCADE
);

CREATE TABLE commentaires (
  id INT AUTO_INCREMENT PRIMARY KEY,
  parking_id INT NOT NULL,
  auteur VARCHAR(100) DEFAULT 'Anonyme',
  message TEXT NOT NULL,
  note TINYINT DEFAULT NULL,
  date_commentaire DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parking_id) REFERENCES parkings(id) ON DELETE CASCADE
);

INSERT INTO parkings (nom, adresse, latitude, longitude, nb_places, gratuit, accessible_pmr, proche_fac, description, valide) VALUES
('Parking Université La Source', 'Rue de Chartres, 45100 Orléans', 47.8284, 1.9127, 200, 1, 1, 1, 'Grand parking gratuit à proximité directe de l''université d''Orléans La Source.', 1),
('Parking Place du Martroi', 'Place du Martroi, 45000 Orléans', 47.9027, 1.9097, 80, 1, 1, 0, 'Parking gratuit en centre-ville, idéal pour les étudiants en stage.', 1),
('Parking Gare d''Orléans', 'Place Albert 1er, 45000 Orléans', 47.9008, 1.9041, 150, 1, 1, 0, 'Proche de la gare, pratique pour les étudiants qui prennent le train.', 1),
('Parking IUT Orléans', 'Allée du Titane, 45100 Orléans', 47.8201, 1.9089, 100, 1, 0, 1, 'Parking réservé aux étudiants de l''IUT, gratuit avec carte étudiante.', 1),
('Parking Stade de la Source', 'Avenue du Parc Floral, 45100 Orléans', 47.8312, 1.9198, 300, 1, 1, 1, 'Grand parking gratuit à côté du parc floral, à 10 min de la fac à pied.', 1);
