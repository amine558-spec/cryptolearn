# CryptoLearn — Guide de démarrage

## Structure du projet après correction

```
projet_cryp_corrige/
├── back end/
│   ├── api.py              ← ✅ NOUVEAU : API FastAPI (remplace le CLI)
│   ├── requirements.txt    ← ✅ NOUVEAU : dépendances Python
│   ├── main.py             ← CLI original (conservé, corrigé)
│   ├── journale.py
│   ├── users.json
│   ├── hashage/
│   │   ├── SHA256.py
│   │   └── SHA1.py
│   ├── symetrique/
│   └── asymetrique/
└── Front end/
    ├── src/
    │   ├── api/
    │   │   └── api.js          ← ✅ NOUVEAU : service HTTP vers FastAPI
    │   ├── lib/
    │   │   └── AuthContext.jsx ← ✅ REMPLACÉ : auth via FastAPI
    │   ├── components/
    │   │   └── CryptoTester.jsx ← ✅ REMPLACÉ : relié au backend
    │   └── pages/
    │       └── Landing.jsx     ← ✅ REMPLACÉ : formulaire de login réel
    └── .env                    ← ✅ NOUVEAU : VITE_API_URL
```

---

## 🚀 Commandes pour lancer le projet

### 1. Lancer le Backend (FastAPI)

```bash
# Se placer dans le dossier back end
cd "back end"

# Installer les dépendances Python
pip install -r requirements.txt

# Lancer l'API
python api.py
```

L'API sera disponible sur : http://localhost:8000
Documentation interactive : http://localhost:8000/docs

---

### 2. Lancer le Frontend (React + Vite)

Dans un **second terminal** :

```bash
# Se placer dans le dossier Front end
cd "Front end"

# Installer les dépendances Node.js
npm install

# Lancer le serveur de développement
npm run dev
```

Le frontend sera disponible sur : http://localhost:5173

---

## Comptes de test

| Utilisateur | Mot de passe | Rôle  |
|-------------|-------------|-------|
| admin       | 1234        | admin |
| ahmed       | abcd        | user  |

---

## Routes API disponibles

| Méthode | URL                          | Description                     |
|---------|------------------------------|---------------------------------|
| GET     | /api/health                  | Santé de l'API                  |
| POST    | /api/auth/login              | Connexion                       |
| POST    | /api/auth/logout             | Déconnexion                     |
| GET     | /api/auth/me                 | Utilisateur courant             |
| GET     | /api/users                   | Liste utilisateurs (admin)      |
| POST    | /api/users                   | Créer utilisateur (admin)       |
| PUT     | /api/users/{username}        | Modifier utilisateur (admin)    |
| DELETE  | /api/users/{username}        | Supprimer utilisateur (admin)   |
| GET     | /api/journal                 | Journal connexions (admin)      |
| POST    | /api/crypto/cipher           | Chiffrer/Déchiffrer             |
| POST    | /api/crypto/hash             | Hacher un texte                 |
| POST    | /api/crypto/check-password   | Vérifier complexité mot de passe|

---

## Corrections apportées au code original

### Backend (main.py)
- `import journale` déplacé en haut du fichier (doublon supprimé)
- `login()` retourne maintenant `(username, role)` au lieu de `role` seul
- `sauvegarder_users()` unifiée (une seule définition)
- `hashing()` restructuré en `if/elif` pour que l'option "Retour" soit accessible

### hashage/SHA256.py
- Les appels de test déplacés dans `if __name__ == "__main__"` pour ne pas s'exécuter à l'import

### hashage/SHA1.py  
- Idem : tests déplacés dans `if __name__ == "__main__"`

### journale.py
- Code SHA1.py qui était collé par erreur à la fin du fichier → supprimé

### Frontend
- `AuthContext.jsx` : suppression de la dépendance `@base44/sdk`, connexion via API FastAPI
- `Landing.jsx` : formulaire de login fonctionnel relié au backend
- `CryptoTester.jsx` : utilise le backend Python pour les opérations crypto
- `api.js` : service HTTP centralisé pour toutes les requêtes vers FastAPI




cd "C:\Users\radmi\Downloads\PROJET_CRYP_FINAL\projet_final_complet\Front end"
npm install
npm run dev


cd "C:\Users\radmi\Downloads\PROJET_CRYP_FINAL\projet_final_complet\back end"
pip install -r requirements.txt
python api.py


