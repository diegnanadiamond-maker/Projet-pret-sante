# Prêt Santé — Captures du back-office web (partie « web »)

## Contexte du projet

**Prêt Santé** est une plateforme de micro-crédit santé pour la Côte d'Ivoire. Elle met en relation trois acteurs :
- Le **client** (patient), qui utilise l'application mobile pour demander un financement de soins (voir `docs/captures mobiles/` pour ce parcours).
- Les **banques partenaires** (SGCI, BNI, Ecobank), qui étudient et accordent les prêts.
- Les **cliniques partenaires**, payées directement par la banque une fois le prêt validé — le client ne reçoit jamais les fonds sur son propre compte ; le paiement est justifié par la facture pro-forma (devis) fournie par la clinique.

Ce dossier contient les captures d'écran du **back-office web** (prototype, sans backend réel — données factices), l'outil de pilotage utilisé par le personnel de la plateforme. C'est une application unique à 3 espaces distincts, avec un seul écran de connexion qui aiguille vers l'un des trois rôles :
- **Administration** : supervision globale de la plateforme (utilisateurs, réseau bancaire).
- **Banque** : traitement des demandes de prêt et analyse de risque, côté partenaire bancaire.
- **Clinique** : suivi des paiements reçus et des patients financés, côté établissement de soin.

Ces captures + ce fichier sont destinés à être fournis à une IA pour rédiger un **guide utilisateur** du prototype.

---

## Description de chaque capture

### 01-accueil.png — Écran de choix de l'espace
Page de connexion générale : le visiteur choisit son espace parmi **Clinique**, **Banque** ou **Administration**. Chaque rôle a son propre parcours de connexion.

### 02-connexion-banque.png — Connexion Espace Banque
Formulaire de connexion réservé aux partenaires bancaires (email + mot de passe), avec un lien « Retour » vers l'écran de choix d'espace.

### 03-banque-dashboard.png — Tableau de bord Banque (Vue d'ensemble)
Vue d'ensemble de l'activité de la banque connectée (ici SGCI) : dossiers en attente, montant décaissé ce mois, taux moyen accordé, délai moyen de traitement. En dessous : les dossiers prioritaires à traiter et la répartition des risques du portefeuille, ainsi que les décaissements récents.

### 04-banque-demandes-en-cours.png — Demandes en cours (Banque)
Liste des dossiers de demande de prêt en attente de décision, chacun avec le nom du client, le type de soin, la date, un score de risque (0-100), le montant demandé et des actions rapides (voir le détail, notification).

### 05-banque-analyse-risque.png — Analyse de Risque (Banque)
Vue d'analyse du portefeuille de prêts par niveau de risque (faible / moyen / élevé), l'exposition totale en FCFA, la liste des dossiers triés par score de risque, et le détail des facteurs qui composent le score (historique de crédit, stabilité des revenus, complétude du dossier, zone géographique).

### 06-connexion-admin.png — Connexion Administration
Formulaire de connexion réservé aux administrateurs de la plateforme (email + mot de passe).

### 07-admin-dashboard.png — Tableau de bord Admin (Vision 360°)
Vue de supervision globale de tout le système : nombre d'utilisateurs actifs, volume de crédit total, nombre de banques partenaires, temps de réponse moyen. En dessous : un flux d'activité en temps réel (simulations, validations de documents, tentatives de connexion) et l'état de santé du réseau bancaire (banques en ligne/hors ligne, nombre de prêts actifs par banque), plus les alertes de sécurité.

### 08-admin-utilisateurs.png — Annuaire des Assurés (Admin)
Liste de tous les clients (assurés) de la plateforme, avec leur statut (actif / en attente / inactif), leur rôle, le montant de crédit actif, leur progression de dossier et leur date d'inscription. Actions disponibles par ligne : voir, modifier, suspendre. Bouton pour ajouter un nouvel assuré.

### 09-admin-reseau-bancaire.png — Réseau Bancaire Partenaire (Admin)
Liste des banques partenaires de la plateforme (SGCI, BNI, Ecobank) avec leur nom complet, le nombre de prêts actifs, leur taux moyen, leur niveau de liquidité, leur temps de traitement et leur statut (en ligne / hors ligne). Bouton pour ajouter un nouveau partenaire.

### 10-clinique-dashboard.png — Tableau de bord Clinique (Vue d'ensemble)
Vue d'ensemble de l'établissement connecté (ici Clinique Avicenne) : montant total reçu aujourd'hui, reçu ce mois, nombre de patients financés, versements en attente, nombre de banques partenaires actives. En dessous : une activité en temps réel (versements reçus, dossiers validés) et la liste des versements récents.

### 11-clinique-paiements-recus.png — Paiements reçus (Clinique)
Historique détaillé des versements crédités par les banques partenaires : référence de paiement, nom du patient, soin concerné, banque payeuse, montant, date et statut (reçu / en attente). Total reçu affiché en haut, avec option d'export.

### 12-clinique-patients-finances.png — Patients financés (Clinique)
Vue en cartes des patients pris en charge par la clinique via un prêt santé : nom, type de soin, statut de la prise en charge (en soin / programmé / terminé), banque ayant financé et montant. Accès au dossier détaillé de chaque patient.

---

## Notes de couverture

Ces captures couvrent les 3 espaces (Administration, Banque, Clinique) et leurs vues principales. Deux éléments du back-office n'ont pas été capturés dans cette série et ne sont donc pas décrits ici :
- Le **Centre d'aide** et la page **Système / Paramètres**, accessibles depuis n'importe quel rôle (mêmes menus dans la barre latérale de gauche, en bas de la section « Assistance »).
- L'écran de **connexion/inscription Clinique** (le formulaire est similaire à celui de la Banque, avec en plus un lien « Créer un compte » pour l'auto-inscription d'un nouvel établissement).

## Structure du parcours

```
Accueil — choix de l'espace (01)
   ├─ Banque : connexion (02) → Dashboard (03) → Demandes en cours (04) → Analyse de Risque (05)
   ├─ Administration : connexion (06) → Dashboard (07) → Utilisateurs (08) → Réseau Bancaire (09)
   └─ Clinique : connexion → Dashboard (10) → Paiements reçus (11) → Patients financés (12)
```
