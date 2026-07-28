# Prêt Santé — Captures de l'application mobile (parcours client)

## Contexte du projet

**Prêt Santé** est une plateforme de micro-crédit santé pour la Côte d'Ivoire. Elle met en relation trois acteurs :
- Le **client** (patient) qui a besoin de financer des soins médicaux (dentaire, accouchement, chirurgie, bilan de santé, etc.).
- Les **banques partenaires** (SGCI, BNI, Ecobank) qui accordent le prêt.
- Les **cliniques partenaires**, payées directement par la banque une fois le prêt validé — le client ne reçoit jamais les fonds sur son propre compte.

Règle clé du produit : un client ne peut demander un prêt qu'à **sa propre banque** (celle où il détient déjà un compte), pas à une autre. Le montant emprunté doit être justifié par une **facture pro-forma** (devis) de l'établissement de soin, et non par une simple saisie libre.

Ce dossier contient les captures d'écran de l'**application mobile cliente** (prototype, sans backend réel — données factices), qui couvre : l'inscription et la vérification d'identité (KYC), la découverte des partenaires, puis l'assistant de demande de prêt en 4 étapes jusqu'au suivi du dossier.

Ces captures + ce fichier sont destinés à être fournis à une IA pour rédiger un **guide utilisateur** du prototype.

---

## Ordre du parcours et description de chaque capture

### 01.jpeg — Écran d'accueil / onboarding
Écran de lancement avec un carrousel de 3 slides présentant la promesse du service ("Vos soins financés en 48h", "Le meilleur taux, comparé pour vous", "Identité vérifiée, données protégées"). Deux boutons en bas : **Créer un compte** et **J'ai déjà un compte**.

### 02.jpeg — Inscription
Formulaire de création de compte : nom complet, numéro de téléphone, adresse email, mot de passe. Bouton **Recevoir mon code de vérification**. Lien vers la connexion pour les utilisateurs déjà inscrits.

### 03.jpeg — Vérification par code OTP
Écran de saisie du code à 6 chiffres envoyé par SMS pour valider le numéro de téléphone (numéro partiellement masqué), avec minuteur de renvoi du code et bouton **Vérifier le code**.

### 04.jpeg — Introduction à la vérification d'identité (KYC)
Écran récapitulatif expliquant les 3 étapes à venir de la vérification (coordonnées bancaires, pièce d'identité, selfie de contrôle) et le délai annoncé ("2 minutes chrono"). Boutons **Commencer la vérification** ou **Passer la vérification pour l'instant**.

### 05.jpeg — Coordonnées bancaires
Sélection de la banque du client (ex. SGCI) dans une liste déroulante, puis saisie du numéro de compte et du RIB/IBAN — ces informations serviront uniquement au décaissement du prêt vers le compte du client.

### 06.jpeg — Pièce d'identité
Capture photo de la CNI (carte nationale d'identité), recto puis verso, via l'appareil photo du téléphone.

### 07.jpeg — Selfie de contrôle
Capture d'un selfie pour confirmer que le porteur du document est bien l'utilisateur (contrôle anti-fraude basique).

### 08.jpeg — Analyse des documents (chargement)
Écran de transition affichant un indicateur de chargement pendant l'« analyse » simulée des documents soumis.

### 09.jpeg — Identité vérifiée
Écran de confirmation : le profil du client est validé, il peut désormais simuler et demander son premier financement santé.

### 10.jpeg — Accueil (espace santé)
Tableau de bord principal après connexion : message de bienvenue personnalisé, bloc « Nouvelle demande » pour lancer une simulation de financement, et un flux d'activité récente (vide pour un nouveau compte). Barre de navigation basse avec 3 onglets : **Accueil**, **Partenaires**, **Profil**.

### 11.jpeg — Partenaires — onglet Banques
Liste des banques partenaires (SGCI, BNI, Ecobank) avec leur taux, leur délai de traitement et leur note. Possibilité de sélectionner au moins 2 banques pour comparer. Bandeau d'appel à l'action **Simulez votre prêt santé**.

### 12.jpeg — Partenaires — onglet Cliniques
Même écran, bascule sur la liste des cliniques agréées (Clinique Avicenne, Centre Médical IBK, Polyclinique Internationale) avec leur localisation à Abidjan, leur spécialité et leur note.

### 13.jpeg — Profil
Page de profil du client (nom, email, téléphone, badge « Identité vérifiée ») avec un « coffre de documents » indiquant la progression du dossier (0 % — 4 documents manquants dans cet exemple) et l'accès aux notifications.

### 14.jpeg — Demande de prêt, étape 1/4 : type de soin
Premier écran de l'assistant de demande : choix de la catégorie de soin à financer (Prothèse dentaire, Accouchement, Bilan de santé, Autre soin) et sélection de l'établissement de santé concerné.

### 15.jpeg — Demande de prêt, étape 2/4 : montant
Choix du montant du prêt via un curseur (de 50 000 à 2 000 000 FCFA) et de la durée de remboursement (6, 12, 18 ou 24 mois), avec calcul en direct de la mensualité, du taux et du coût total du crédit.

### 16.jpeg — Demande de prêt, étape 3/4 : complétude du dossier
Récapitulatif des justificatifs nécessaires : carte d'identité et bulletins de salaire (déjà vérifiés via le KYC), relevé bancaire et **facture pro-forma (devis)** de la clinique — ce dernier document justifie le montant demandé. Rappel que les fonds sont versés directement à la clinique, jamais sur le compte du client.

### 17.jpeg — Demande de prêt, étape 4/4 : relecture et signature
Récapitulatif final du contrat (« Acte de crédit médical ») : bénéficiaire, banque, montant, taux, durée, mensualité et clinique de décaissement. Le client appose sa signature électronique sur l'écran tactile avant de confirmer l'envoi de la demande à la banque.

### 18.jpeg — Suivi de la demande de prêt
Écran de suivi post-soumission montrant l'avancement du dossier en 3 étapes : **Demande envoyée** (validée) → **Examen bancaire** (en cours) → **Décaissement** (à venir), avec le récapitulatif du soin, du montant et de la banque choisie.

---

## Récapitulatif du parcours complet

```
Onboarding (01)
   └─ Inscription (02) → OTP (03)
        └─ Intro KYC (04) → Banque (05) → Pièce d'identité (06) → Selfie (07)
             → Analyse (08) → Identité vérifiée (09)
                  └─ Accueil (10) ⇄ Partenaires Banques/Cliniques (11, 12) ⇄ Profil (13)
                       └─ Nouvelle demande :
                            Type de soin (14) → Montant (15) → Dossier/justificatifs (16)
                            → Signature du contrat (17) → Suivi du prêt (18)
```
