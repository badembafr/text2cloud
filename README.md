# P8 Text 2 Cloud

Application web de génération de nuages de mots-clés à partir de textes bruts.

## Démo en ligne

[https://bademba.fr/text2cloud](https://bademba.fr/text2cloud)
[https://github.com/badembafr/text2cloud](https://github.com/badembafr/text2cloud)

## Description

P8 Text 2 Cloud permet de visualiser rapidement les mots les plus fréquents d'un texte sous forme de nuage interactif et coloré. L'interface simple et intuitive facilite l'analyse textuelle en quelques clics.

## Fonctionnalités

- Import de fichiers texte (.txt) ou saisie directe
- Traitement automatique : nettoyage, tokenisation, comptage
- Génération d'un nuage de mots dynamique
- Statistiques détaillées (mots total, uniques, gain)
- Export du nuage en PNG ou JPEG
- Export des occurrences en CSV
- Interface responsive (PC, tablette, mobile)

## Technologies utilisées

### Front-end
- HTML
- CSS
- JavaScript
- WordCloud2.js

### Back-end
- PHP
- JSON

## Architecture

Architecture client-serveur :
- Le client (JavaScript) gère l'interface et envoie le texte au serveur
- Le serveur (PHP) effectue le traitement (tokenisation, nettoyage, comptage)
- Les données sont échangées au format JSON
- Le nuage est généré côté client avec WordCloud2.js

## Installation locale

1. Cloner le dépôt :
```bash
git clone https://github.com/badembafr/text2cloud.git
cd text2cloud
```

2. Lancer un serveur PHP local :
```bash
php -S localhost:8000
```

3. Ouvrir dans le navigateur :
```
http://localhost:8000
```

## Structure du projet

```
projet_web/
├── index.php              # Interface principale
├── script/
│   └── app.js            # Logique JavaScript
├── style/
│   └── styles.css        # Feuilles de style
├── traitement/
│   ├── traitement.php    # Traitement serveur
│   └── mots-vides.txt    # Liste des stop words (~1500 mots)
├── img/
│   └── logo.png          # Logo
└── documentation/
    ├── documentation_technique.pdf
    ├── data_exemple/     # Fichiers de test
    └── screenshots/      # Captures d'écran
```

## Utilisation

1. Choisir un fichier texte (.txt) ou coller directement le texte
2. Cliquer sur "Générer le nuage de mots-clés"
3. Le nuage s'affiche avec les statistiques
4. Télécharger le nuage (PNG/JPEG) ou les occurrences (CSV)

## Traitement du texte

Le pipeline de traitement suit ces étapes :
1. Récupération du texte
2. Envoi au serveur PHP
3. Comptage des caractères
4. Tokenisation (découpage en mots)
5. Nettoyage et filtrage (minuscules, stop words)
6. Comptage des occurrences
7. Génération du nuage

## Auteur

Bademba SANGARE  
Master 1 Informatique et Big Data  
Université Paris 8 à Saint-Denis

Projet réalisé dans le cadre du cours "Introduction aux Technologies Hypermedia"  
Professeur : Nasreddine BOUHAÏ

## Licence

Ce projet est un projet académique réalisé pour l'Université Paris 8.