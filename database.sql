CREATE DATABASE IF NOT EXISTS parketudiant CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE parketudiant;

CREATE TABLE IF NOT EXISTS parkings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  adresse VARCHAR(200) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  nb_places INT DEFAULT 0,
  gratuit TINYINT(1) DEFAULT 1,
  tarif VARCHAR(100) DEFAULT NULL,
  accessible_pmr TINYINT(1) DEFAULT 0,
  proche_fac TINYINT(1) DEFAULT 0,
  description TEXT,
  ajoute_par VARCHAR(100) DEFAULT 'Anonyme',
  date_ajout DATETIME DEFAULT CURRENT_TIMESTAMP,
  valide TINYINT(1) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS signalements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  parking_id INT NOT NULL,
  statut ENUM('disponible', 'occupe', 'ferme') NOT NULL,
  commentaire TEXT,
  date_signalement DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parking_id) REFERENCES parkings(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS commentaires (
  id INT AUTO_INCREMENT PRIMARY KEY,
  parking_id INT NOT NULL,
  auteur VARCHAR(100) DEFAULT 'Anonyme',
  message TEXT NOT NULL,
  note TINYINT DEFAULT NULL,
  date_commentaire DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parking_id) REFERENCES parkings(id) ON DELETE CASCADE
);

INSERT INTO parkings (nom, adresse, latitude, longitude, nb_places, gratuit, tarif, accessible_pmr, proche_fac, description, ajoute_par, valide) VALUES

('Parking Université La Source', 'Rue de Chartres, 45100 Orléans', 47.82840, 1.91270, 200, 1, 'Gratuit', 1, 1, 'Grand parking gratuit à proximité directe de l''université d''Orléans La Source. Accessible PMR, idéal pour les étudiants de la fac.', 'Admin', 1),

('Parking Stade de la Source', 'Avenue du Parc Floral, 45100 Orléans', 47.83120, 1.91980, 300, 1, 'Gratuit', 1, 1, 'Très grand parking gratuit à côté du parc floral et du stade. À environ 10 min à pied de l''université. Souvent plein en semaine le matin.', 'Admin', 1),

('Parking IUT Orléans', 'Allée du Titane, 45100 Orléans', 47.82010, 1.90890, 120, 1, 'Gratuit avec carte étudiante', 0, 1, 'Parking réservé aux étudiants de l''IUT d''Orléans. Gratuit avec la carte étudiante. Accès direct au bâtiment.', 'Admin', 1),

('Parc Relais Tram La Source', 'Avenue du Parc Floral, 45100 Orléans', 47.83500, 1.92100, 400, 1, 'Gratuit (P+R)', 1, 1, 'Parc relais gratuit au terminus du tram ligne B. Garez-vous gratuitement et prenez le tram jusqu''au centre-ville. Idéal pour les étudiants en stage en centre-ville.', 'Admin', 1),

('Parc Relais Tram Hôpital Source', 'Rue du Champ de l''Oie, 45100 Orléans', 47.85200, 1.92800, 200, 1, 'Gratuit (P+R)', 1, 0, 'Parking relais gratuit avec accès direct au tram ligne B. Pratique pour rejoindre l''université ou le centre-ville sans payer de stationnement.', 'Admin', 1),

('Parc Relais Tram Bourgogne', 'Route de Bourgogne, 45100 Orléans', 47.85800, 1.93200, 150, 1, 'Gratuit (P+R)', 1, 0, 'Parc relais gratuit sur la ligne B du tram, côté est d''Orléans. Parking sécurisé, surveillé et accessible PMR.', 'Admin', 1),

('Parc Relais Tram Aubrais', 'Rue des Deux Lions, 45400 Fleury-les-Aubrais', 47.93200, 1.90800, 250, 1, 'Gratuit (P+R)', 1, 0, 'Parc relais gratuit proche de la gare des Aubrais. Idéal pour les étudiants habitant en périphérie et prenant le train ou le tram.', 'Admin', 1),

('Parking Voirie Centre-Ville (soir)', 'Centre-ville, 45000 Orléans', 47.90270, 1.90970, 0, 1, 'Gratuit de 18h à 9h (lun-sam) + dimanche', 0, 0, 'Le stationnement sur voirie en centre-ville est gratuit tous les soirs de 18h à 9h du matin du lundi au samedi, et toute la journée le dimanche. Pratique pour les étudiants en soirée.', 'Admin', 1),

('Parking Voirie Zone Boulevard (week-end)', 'Boulevards Alexandre-Martin, Jean-Jaurès, Aristide-Briand, 45000 Orléans', 47.90500, 1.91200, 0, 1, 'Gratuit sam 11h30 → lun 9h', 0, 0, 'Stationnement gratuit dans les zones boulevard du samedi 11h30 au lundi matin 9h. Zones : Alexandre-Martin, Pierre-Ségelle, Aristide-Briand, Jean-Jaurès, Rocheplatte.', 'Admin', 1),

('Parking POLYTECH Orléans', 'Rue d''Issoudun, 45100 Orléans', 47.82600, 1.91500, 80, 1, 'Gratuit', 0, 1, 'Parking gratuit devant POLYTECH Orléans. Quelques places disponibles pour les étudiants de l''école d''ingénieurs.', 'Admin', 1),

('Parking Carmes (soirée 3€)', 'Place des Carmes, 45000 Orléans', 47.90150, 1.90800, 350, 0, '3€ de 18h à 5h / 10€ forfait journée', 1, 0, 'Parking en ouvrage en plein centre-ville. Tarif soirée très avantageux à 3€ de 18h à 5h du matin. Idéal pour les étudiants qui sortent le soir.', 'Admin', 1),

('Parking Cathédrale (soirée 3€)', 'Place Sainte-Croix, 45000 Orléans', 47.90230, 1.91050, 280, 0, '3€ de 18h à 5h / 10€ forfait journée', 1, 0, 'Parking souterrain sous la place de la cathédrale. Tarif soirée à 3€. Très bien situé pour les étudiants en stage ou en cours en centre-ville.', 'Admin', 1),

('Parking Hôtel de Ville (soirée 3€)', 'Place de l''Étape, 45000 Orléans', 47.90350, 1.90600, 320, 0, '3€ de 18h à 5h / 10€ forfait journée', 1, 0, 'Grand parking en ouvrage en centre-ville. Tarif soirée à 3€. Abonnement étudiant disponible à -40% du tarif normal.', 'Admin', 1),

('Parking Les Halles Châtelet (soirée 3€)', 'Place du Châtelet, 45000 Orléans', 47.90100, 1.90700, 400, 0, '3€ de 18h à 5h / 10€ forfait journée', 1, 0, 'Grand parking sous les Halles Châtelet. Tarif soirée avantageux à 3€. Abonnements étudiants disponibles avec -40% sur le tarif tout public.', 'Admin', 1),

('Parking Danton (soirée 3€)', 'Rue Danton, 45000 Orléans', 47.90450, 1.90400, 200, 0, '3€ de 18h à 5h / 10€ forfait journée', 1, 0, 'Parking en ouvrage proche du centre-ville. Tarif soirée à 3€ de 18h à 5h. Abonnement étudiant possible via Orléans Gestion.', 'Admin', 1),

('Parking Médiathèque (soirée 3€)', 'Place Gambetta, 45000 Orléans', 47.90600, 1.90900, 180, 0, '3€ de 18h à 5h / 10€ forfait journée', 1, 0, 'Parking souterrain proche de la médiathèque. Tarif soirée à 3€. Abonnement étudiant disponible avec réduction de 40%.', 'Admin', 1);
