# Sophie Bluel

> Projet 3 - OpenClassrooms - Développeur Web

## 🌐 Présentation

Ce projet consiste à développer le frontend et le backend pour une société d'architecture, dans le cadre du projet Sophie Bluel.  
Je travaille en tant que développeur front-end pour créer une interface utilisateur moderne, responsive et dynamique, en consommant une API backend sécurisée.

L’objectif principal est de permettre l’affichage et la gestion d’une galerie d’œuvres, avec un système de connexion permettant d’ajouter, modifier ou supprimer des travaux.

---

## ⚙️ Architecture du projet

Le projet est divisé en deux parties principales :

- **Backend API** : un serveur Node.js avec Express qui gère les données (projets, catégories), l’authentification via JWT, et expose des routes REST pour les opérations CRUD.
- **Frontend** : une interface web dynamique (HTML, CSS, JavaScript) qui interagit avec le backend via des appels API pour afficher la galerie, filtrer les projets, gérer la connexion utilisateur et l’ajout de travaux.

---

## 🛠️ Fonctionnalités principales

### Galerie dynamique

- Récupération des projets et catégories via l’API (`GET /works`, `GET /categories`).
- Affichage des projets dans une galerie avec images et titres.
- Filtrage dynamique des projets par catégories sans rechargement de page.
- Mise à jour instantanée de l’affichage lors de la sélection d’un filtre.

### Système de connexion

- Formulaire de login sécurisé qui communique avec l’API (`POST /users/login`).
- Stockage du token JWT dans le `localStorage` pour maintenir la session.
- Interface adaptative affichant des options d’édition (ajout, suppression) uniquement pour un utilisateur connecté.

### Gestion des projets (CRUD)

- Ajout de nouveaux projets via un formulaire avec upload d’image, titre et catégorie.
- Envoi des données via `FormData` à l’API (`POST /works`) avec authentification.
- Suppression de projets avec confirmation, en envoyant une requête DELETE authentifiée (`DELETE /works/:id`).
- Mise à jour en temps réel de la galerie après ajout ou suppression.

---

## 🚀 Lancer le projet

### Backend

1. Cloner le dépôt backend :
   ```bash
   git clone https://github.com/hNnicolas/P3_Sophie_Bluel
   ```

## Lancement du backend

Après avoir récupéré le REPO executez la commande `npm install` pour installer les dépendances du projet

Une fois les dépendances installées lancez le projet avec la commande `npm start`

Compte de test pour Sophie Bluel

```
email: sophie.bluel@test.tld

password:  S0phie
```

Lien pour voir la
[documentation Swagger](http://localhost:5678/api-docs/)

Pour lire la documentation, utiliser Chrome ou Firefox
