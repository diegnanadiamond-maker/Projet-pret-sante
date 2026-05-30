# Prêt Santé 🏥

Application innovante de gestion et de demande de prêts pour les soins de santé.

## 📁 Structure du Projet

Le projet est organisé comme suit :

*   **`mobile/`** : L'application mobile principale développée avec **React Native** et **Expo**.
*   **`app/`** : Contient les prototypes et maquettes HTML initiales.
*   **`web/`** : (En cours) Dossier réservé pour la version web de la plateforme.
*   **`arduino/`** : (En cours) Dossier réservé pour d'éventuelles intégrations matérielles/IoT.

---

## 📱 Application Mobile (Expo)

L'application mobile se trouve dans le dossier `mobile`.

### 🚀 Prérequis

Assurez-vous d'avoir installé :
*   [Node.js](https://nodejs.org/) (v18 ou plus récent)
*   [npm](https://www.npmjs.com/) (installé avec Node.js)
*   L'application **Expo Go** sur votre smartphone (iOS/Android) ou un simulateur configuré sur votre PC.

### 🛠️ Installation

1. Naviguez dans le dossier mobile :
   ```bash
   cd mobile
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

### 💻 Commandes de lancement

Depuis le dossier `mobile`, vous pouvez utiliser les commandes suivantes :

| Commande | Description |
| :--- | :--- |
| `npm start` | Lance le serveur de développement Expo (Interface Metro). |
| `npm run android` | Ouvre l'application sur un émulateur Android. |
| `npm run ios` | Ouvre l'application sur un simulateur iOS (macOS uniquement). |
| `npm run web` | Ouvre l'application dans votre navigateur web. |

### 📱 Tester sur votre téléphone

Une fois `npm start` lancé, un QR code s'affichera dans votre terminal ou sur l'interface Metro (dans votre navigateur). Scannez ce code avec l'application **Expo Go** pour voir l'application en direct sur votre smartphone.

---

## 🎨 Maquettes HTML

Vous pouvez consulter les maquettes HTML initiales dans le dossier `app/` en ouvrant le fichier `pret_sante_mockup.html` dans un navigateur.

---

## 🛠️ Technologies utilisées

*   **Framework** : [React Native](https://reactnative.dev/) avec [Expo](https://expo.dev/)
*   **Navigation** : [Expo Router](https://docs.expo.dev/router/introduction/)
*   **Styles** : NativeBase / Tailwind (selon configuration)
*   **Icônes** : Lucide React Native / Expo Vector Icons
