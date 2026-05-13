# 🔐 CryptoLearn — Plateforme Éducative Frontend

<div align="center">

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-✓-000000?style=for-the-badge)

**Plateforme web éducative pour apprendre la cryptographie de manière interactive.**

*Academic project — École Mohammadia d'Ingénieurs | 2025–2026*

</div>

---

## 📌 Description

CryptoLearn Frontend est une Single Page Application React qui offre :
- Un système d'**authentification complet** connecté à l'API FastAPI backend
- Des pages éducatives sur les **algorithmes de cryptographie**
- Des **visualisations interactives** (AES, RSA, SHA-256, Diffie-Hellman)
- Un **quiz** pour tester ses connaissances
- Un **testeur de chiffrement** en temps réel
- Un tableau de bord d'**administration**
- Un système d'**achievements/badges**

---

## 🗂️ Pages & Fonctionnalités

| Page | Description |
|------|-------------|
| `/landing` | Connexion & inscription avec validation |
| `/home` | Accueil avec algorithmes en vedette |
| `/algorithms` | Liste complète avec filtres par catégorie |
| `/algorithms/:id` | Détail d'un algorithme avec visualisation |
| `/resources` | Ressources éducatives (vidéos, articles) |
| `/dashboard` | Progression personnelle de l'utilisateur |
| `/achievements` | Badges et accomplissements |
| `/admin` | Gestion des utilisateurs (admin seulement) |

---

## 🔬 Visualisations Interactives

- **AES** — Simulation des rounds de chiffrement
- **RSA** — Génération de clés et chiffrement/déchiffrement
- **SHA-256** — Visualisation du hachage étape par étape
- **Diffie-Hellman** — Échange de clés illustré

---

## 🛠️ Stack Technique

- **React 18** + **Vite** — Build ultra-rapide
- **React Router v6** — Navigation SPA
- **TailwindCSS** + **shadcn/ui** — Design system moderne
- **React Query (@tanstack)** — Gestion des requêtes API
- **React Hook Form** + **Zod** — Formulaires avec validation
- **Framer Motion** — Animations fluides
- **Recharts** — Graphiques de données
- **Lucide React** — Icônes cohérentes

---

## 🚀 Installation & Lancement

```bash
# 1. Cloner le repo
git clone https://github.com/amine558-spec/projet-cryptographie.git
cd projet-cryptographie/frontend

# 2. Installer les dépendances
npm install

# 3. Configurer l'environnement
echo "VITE_API_URL=http://localhost:8000" > .env

# 4. Lancer en développement
npm run dev
# → Ouvre http://localhost:5173

# 5. Build production
npm run build
```

> ⚠️ Le backend FastAPI doit tourner sur le port 8000.  
> Voir le dossier `backend/` pour l'installer.

---

## 📁 Structure du Projet

```
frontend/
├── src/
│   ├── App.jsx                  ← Routes principales
│   ├── main.jsx                 ← Point d'entrée
│   ├── index.css                ← Styles globaux (Tailwind)
│   ├── pages/
│   │   ├── Landing.jsx          ← Login / Register
│   │   ├── Home.jsx             ← Accueil
│   │   ├── Algorithms.jsx       ← Liste des algos
│   │   ├── AlgorithmDetail.jsx  ← Détail + visualisation
│   │   ├── Resources.jsx        ← Ressources éducatives
│   │   ├── Dashboard.jsx        ← Tableau de bord
│   │   ├── Achievements.jsx     ← Badges
│   │   └── Admin.jsx            ← Administration
│   ├── components/
│   │   ├── ui/                  ← Composants shadcn/ui
│   │   ├── visualizations/      ← AES, RSA, SHA256, DH
│   │   ├── AlgorithmCard.jsx
│   │   ├── CryptoTester.jsx     ← Testeur en temps réel
│   │   ├── AlgorithmQuiz.jsx    ← Quiz interactif
│   │   └── Layout.jsx
│   └── lib/
│       ├── AuthContext.jsx      ← Contexte d'authentification
│       └── query-client.jsx     ← Config React Query
├── public/
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## 🔗 Backend

Le frontend communique avec le backend Python FastAPI.  
👉 [Voir le backend](../backend/README.md)

**Endpoints utilisés :**
- `POST /api/auth/login` — Connexion
- `POST /api/auth/register` — Inscription
- `GET /api/users` — Liste des utilisateurs (admin)
- `POST /api/crypto/cipher` — Chiffrement
- `POST /api/crypto/hash` — Hachage
- `POST /api/crypto/check-password` — Vérification MDP

---

## 👨‍💻 Auteur

**Ahmed Amine Hmeddou**  
Élève ingénieur — Génie Informatique & Digitalisation  
École Mohammadia d'Ingénieurs, Rabat, Maroc

[![GitHub](https://img.shields.io/badge/GitHub-amine558--spec-181717?style=flat&logo=github)](https://github.com/amine558-spec)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-ahmed--amine--hmeddou-0A66C2?style=flat&logo=linkedin)](https://linkedin.com/in/ahmed-amine-hmeddou)

---

<div align="center">
<i>Built with ❤️ — École Mohammadia d'Ingénieurs 2025–2026</i>
</div>
