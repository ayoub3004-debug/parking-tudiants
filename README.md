# 🅿️ ParkEtudiant Orléans

Application web permettant aux étudiants d'Orléans de trouver des places de parking gratuites ou peu chere, de signaler leur disponibilité et de laisser des avis.

## Fonctionnalités

- 🗺️ Carte interactive (OpenStreetMap + Leaflet.js)
- 🔍 Recherche et filtres (PMR, proche fac)
- 📍 Ajout de nouveaux parkings par les utilisateurs
- 🚦 Signalement en temps réel (disponible / occupé / fermé)
- ⭐ Commentaires et notes
- 📱 Responsive mobile

## Stack technique

- **Frontend** : HTML, CSS, JavaScript, Leaflet.js
- **Backend** : PHP
- **Base de données** : MySQL

## Installation

### 1. Prérequis
- PHP 7.4+
- MySQL 5.7+
- Serveur web (Apache / XAMPP / WAMP)

### 2. Base de données
```sql
-- Importer le fichier database.sql dans phpMyAdmin ou via terminal :
mysql -u root -p < database.sql
```

### 3. Configuration
Modifier `api/config.php` avec vos identifiants MySQL :
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'parketudiant');
define('DB_USER', 'root');
define('DB_PASS', '');
```

### 4. Lancer le projet
Placer le dossier dans `htdocs` (XAMPP) ou `www` (WAMP) et ouvrir :
```
http://localhost/parketudiant/
```

## Structure du projet

```
parketudiant/
├── index.html          # Page principale
├── database.sql        # Schéma + données de départ
├── css/
│   └── style.css       # Styles
├── js/
│   └── app.js          # Logique frontend
└── api/
    ├── config.php      # Connexion BDD
    ├── parkings.php    # CRUD parkings
    ├── signalements.php # Signalements statut
    └── commentaires.php # Commentaires & notes
```

## Auteur

**Ayoub NADER** — Développeur Fullstack junior
- GitHub : [ayoub3004-debug](https://github.com/ayoub3004-debug)
- LinkedIn : [ayoub-nader](https://www.linkedin.com/in/ayoub-nader-a20242394/)
