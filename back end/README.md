# 🔐 CryptoLearn — Application Python de Cryptographie

> Projet académique de cryptographie — École Mohammadia d'Ingénieurs 2025-2026  
> Pr. Asmae EL KASSIRI  
> **Auteur : Ahmed Amine Hmeddou**

---

## 📌 Description

Application Python sécurisée avec interface console colorée permettant de gérer des utilisateurs et d'appliquer des algorithmes de cryptographie classiques et modernes.

---

## ✨ Fonctionnalités

- 🔑 **Authentification sécurisée** avec bcrypt (hachage salé)
- 👥 **Gestion des rôles** Admin / Utilisateur
- 🚫 **Protection brute force** (3 tentatives max)
- 📋 **Journal des connexions** horodaté
- 🎨 **Interface console colorée** avec colorama
- 🔄 **Changement de mot de passe** sécurisé avec vérification de complexité

---

## 🔒 Algorithmes implémentés

### Chiffrement Symétrique
| Algorithme | Description |
|-----------|-------------|
| César     | Chiffre par décalage configurable |
| XOR       | Chiffrement par clé XOR |
| ROT13     | Rotation de 13 positions |

### Chiffrement Asymétrique
| Algorithme | Description |
|-----------|-------------|
| RSA       | Chiffrement à clé publique/privée (p=61, q=53) |

### Hachage
| Algorithme | Description |
|-----------|-------------|
| SHA-256   | Implémentation **manuelle from scratch** |
| SHA-1     | Implémentation **manuelle from scratch** |
| bcrypt    | Hachage sécurisé pour mots de passe |

### API Backend (FastAPI)
- César, Vigenère, ROT13, Base64, XOR
- SHA-256, SHA-1, bcrypt, MD5
- Authentification JWT-like par token
- Gestion complète CRUD des utilisateurs

---

## 🐛 Bugs corrigés

| Bug | Description | Fix |
|-----|-------------|-----|
| Boucle infinie | `verifier_complexite` bouclait sans fin | Retour immédiat si mot de passe faible |
| Changement MDP | Utilisait `==` au lieu de `=` | Corrigé : `users[u]["password"] = hacher(p)` |
| Vérification ordre | Vérifiait après avoir changé | Vérification de l'ancien MDP en premier |

---

## 🚀 Installation

```bash
pip install bcrypt colorama
python main.py
```

**Comptes par défaut :**
- Admin : `admin` / `Admin123!`
- User  : `ahmed` / `Ahmed123!`

---

## 📁 Structure du projet

```
back end/
├── main.py              ← Application principale (corrigée)
├── api.py               ← API FastAPI (backend web)
├── journale.py          ← Journal des connexions
├── users.json           ← Base de données utilisateurs
├── symetrique/
│   ├── cesar.py         ← Chiffre de César
│   ├── AES.py, DES.py, RC4.py, ...
└── asymetrique/
│   ├── RSA.py, ECC.py, ElGamal.py, DSA.py
└── hashage/
    ├── SHA256.py        ← SHA-256 from scratch ✨
    ├── SHA1.py          ← SHA-1 from scratch ✨
    └── mybcrypt.py, Argon2.py, PBKDF2.py
```

---

## 👨‍💻 Auteur

**Ahmed Amine Hmeddou**  
Élève ingénieur en Génie Informatique et Digitalisation  
École Mohammadia d'Ingénieurs — Rabat, Maroc  
[GitHub](https://github.com/ahmed-amine-hmeddou)
