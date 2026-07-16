# Prêt Santé — Web : Accès de test & Charte graphique

## 1. Accès aux comptes (web)

L'écran d'accueil (`/`) propose 3 espaces : **Clinique**, **Banque**, **Administration**.
Tout est actuellement en mock côté frontend (aucun vrai backend) — pratique pour les tests, à remplacer avant mise en production.

### Espace Clinique
Un compte de démo est pré-enregistré automatiquement (créé au premier chargement de l'app dans le `localStorage` du navigateur) :

| Établissement | Email | Mot de passe |
|---|---|---|
| Clinique Avicenne (Démo) | `clinique@pretsante.ci` | `Clinique123` |

Il suffit de cliquer sur la carte **Clinique** → **Se connecter** avec ces identifiants.

On peut aussi créer d'autres comptes cliniques via **"Pas encore de compte ? Créer un compte"** (nom d'établissement, email, téléphone, mot de passe ≥ 8 caractères avec majuscule + chiffre). Tous les comptes (démo inclus) sont stockés dans le `localStorage` (clé `pretSanteClinics`) — propre à chaque navigateur/poste, pas partagé entre machines. Si le `localStorage` est vidé, le compte de démo est recréé automatiquement au rechargement.

### Espace Banque
| Email | Mot de passe |
|---|---|
| `banque@pretsante.ci` | `Banque123` |

### Administration
| Email | Mot de passe |
|---|---|
| `admin@pretsante.ci` | `Admin123` |

> Identifiants codés en dur dans `web/src/App.jsx` (constante `DEMO_CREDENTIALS`) — uniquement pour la démo, à remplacer par une vraie authentification serveur avant tout déploiement réel.

---

## 2. Charte graphique

Définie dans `web/src/index.css` (variables CSS `:root`).

### Couleurs de marque
| Rôle | Variable | Couleur |
|---|---|---|
| Primaire (bleu roi) | `--color-brand-primary` | `#155eef` |
| Secondaire (bleu marine) | `--color-brand-secondary` | `#0b1e3d` |
| Accent (bleu ciel) | `--color-brand-accent` | `#0ea5e9` |
| Clair (fond bleu pâle) | `--color-brand-light` | `#e3ecff` |
| Foncé | `--color-brand-dark` | `#081527` |

### Fond & surfaces
| Rôle | Variable | Couleur |
|---|---|---|
| Fond de base | `--color-bg-base` | `#f8fafc` |
| Surface (cartes, sidebar) | `--color-bg-surface` | `#ffffff` |
| Fond secondaire | `--color-bg-secondary` | `#f1f5f9` |
| Carte translucide | `--color-bg-card` | `rgba(255,255,255,0.85)` |

### Texte
| Rôle | Variable | Couleur |
|---|---|---|
| Texte principal | `--color-text-main` | `#0f172a` |
| Texte atténué | `--color-text-muted` | `#64748b` |
| Texte inversé (sur fond bleu) | `--color-text-inverse` | `#ffffff` |

### Statuts
| Statut | Variable | Couleur |
|---|---|---|
| Succès | `--color-status-success` | `#10b981` |
| Avertissement | `--color-status-warning` | `#f59e0b` |
| Info | `--color-status-info` | `#3b82f6` |

### Bordures
| Rôle | Variable | Couleur |
|---|---|---|
| Bordure standard | `--color-border` | `#e2e8f0` |
| Bordure au survol | `--color-border-hover` | `#cbd5e1` |

### Typographie
- Titres : `Outfit` (`--font-heading`)
- Texte courant : `Inter` (`--font-body`)

### Rayons de bordure
`--radius-sm: 12px` · `--radius-md: 18px` · `--radius-lg: 32px` · `--radius-xl: 48px` · `--radius-xxl: 64px` · `--radius-full: 9999px`

---

*Généré le 16/07/2026 pour usage interne de test.*
