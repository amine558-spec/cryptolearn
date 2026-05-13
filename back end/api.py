# -*- coding: utf-8 -*-
"""
API FastAPI — CryptoLearn Backend
Relie le backend Python au frontend React.
"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import Optional
import bcrypt
import json
import os
import sys
import datetime
import secrets

# ─────────────────────────────────────────────
# Ajout du dossier parent au path pour importer
# les modules hashage/, symetrique/, asymetrique/
# ─────────────────────────────────────────────
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BACKEND_DIR)

# Imports des algorithmes du projet
try:
    from hashage.SHA256 import sha256 as sha256_manual
    from hashage.SHA1 import hash_sha as sha1_manual
    SHA_AVAILABLE = True
except ImportError:
    SHA_AVAILABLE = False

# ─────────────────────────────────────────────
# App FastAPI
# ─────────────────────────────────────────────
app = FastAPI(
    title="CryptoLearn API",
    description="Backend Python pour CryptoLearn — chiffrement, hachage, gestion utilisateurs",
    version="1.0.0"
)

# ─────────────────────────────────────────────
# CORS — autorise le frontend React (Vite = port 5173)
# ─────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────
# Gestion des utilisateurs (users.json)
# ─────────────────────────────────────────────
USERS_FILE = os.path.join(BACKEND_DIR, "users.json")
MAX_TENTATIVES = 3

# Tokens de session en mémoire : token -> {username, role}
active_sessions: dict[str, dict] = {}


def charger_users() -> dict:
    if not os.path.exists(USERS_FILE):
        users = {
            "admin": {"password": bcrypt.hashpw(b"1234", bcrypt.gensalt()).decode(), "role": "admin"},
            "ahmed": {"password": bcrypt.hashpw(b"abcd", bcrypt.gensalt()).decode(), "role": "user"},
        }
        sauvegarder_users(users)
        return users
    with open(USERS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def sauvegarder_users(users: dict):
    with open(USERS_FILE, "w", encoding="utf-8") as f:
        json.dump(users, f, indent=4, ensure_ascii=False)


def verifier_mdp(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))


def hacher_mdp(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


# ─────────────────────────────────────────────
# Journal des connexions (en mémoire)
# ─────────────────────────────────────────────
journal: list[dict] = []


def ajouter_journal(username: str, role: str, action: str = "connexion", statut: str = "succès"):
    journal.append({
        "username": username,
        "role": role,
        "heure": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "action": action,
        "statut": statut,
    })


# ─────────────────────────────────────────────
# Auth helper
# ─────────────────────────────────────────────
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)


def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    if not token or token not in active_sessions:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Non authentifié")
    return active_sessions[token]


def require_admin(current_user: dict = Depends(get_current_user)) -> dict:
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Accès admin requis")
    return current_user


# ─────────────────────────────────────────────
# Modèles Pydantic
# ─────────────────────────────────────────────
class LoginRequest(BaseModel):
    username: str
    password: str


class UserCreate(BaseModel):
    username: str
    password: str
    role: str = "user"


class UserUpdate(BaseModel):
    new_password: str


class CryptoRequest(BaseModel):
    text: str
    algorithm: str
    mode: str = "encrypt"          # "encrypt" | "decrypt"
    params: Optional[dict] = {}   # paramètres supplémentaires (shift, key, ...)


class HashRequest(BaseModel):
    text: str
    algorithm: str                 # "sha256" | "sha1" | "bcrypt"


class PasswordCheckRequest(BaseModel):
    password: str


# ─────────────────────────────────────────────
# ROUTES — Auth
# ─────────────────────────────────────────────
@app.post("/api/auth/login")
def login(data: LoginRequest):
    users = charger_users()
    tentatives_key = f"__tentatives_{data.username}"

    if data.username not in users:
        raise HTTPException(status_code=401, detail="Identifiants invalides")

    user_data = users[data.username]

    if not verifier_mdp(data.password, user_data["password"]):
        ajouter_journal(data.username, user_data.get("role", "user"), "connexion", "échec")
        raise HTTPException(status_code=401, detail="Identifiants invalides")

    token = secrets.token_hex(32)
    session_data = {"username": data.username, "role": user_data["role"]}
    active_sessions[token] = session_data
    ajouter_journal(data.username, user_data["role"], "connexion", "succès")

    return {
        "access_token": token,
        "token_type": "bearer",
        "username": data.username,
        "role": user_data["role"],
    }


@app.post("/api/auth/register", status_code=201)
def register(data: UserCreate):
    """Inscription publique — crée un compte avec le rôle 'user' par défaut."""
    users = charger_users()
    if data.username in users:
        raise HTTPException(status_code=400, detail="Ce nom d'utilisateur est déjà pris")
    if len(data.username) < 3:
        raise HTTPException(status_code=400, detail="Le nom d'utilisateur doit contenir au moins 3 caractères")
    if len(data.password) < 4:
        raise HTTPException(status_code=400, detail="Le mot de passe doit contenir au moins 4 caractères")
    users[data.username] = {"password": hacher_mdp(data.password), "role": "user"}
    sauvegarder_users(users)
    ajouter_journal(data.username, "user", "inscription", "succès")
    return {"message": f"Compte '{data.username}' créé avec succès"}


@app.post("/api/auth/logout")
def logout(current_user: dict = Depends(get_current_user), token: str = Depends(oauth2_scheme)):
    if token in active_sessions:
        del active_sessions[token]
    ajouter_journal(current_user["username"], current_user["role"], "déconnexion", "succès")
    return {"message": "Déconnecté avec succès"}


@app.get("/api/auth/me")
def me(current_user: dict = Depends(get_current_user)):
    return current_user


# ─────────────────────────────────────────────
# ROUTES — Utilisateurs (admin)
# ─────────────────────────────────────────────
@app.get("/api/users")
def get_users(admin: dict = Depends(require_admin)):
    users = charger_users()
    return [{"username": u, "role": info["role"]} for u, info in users.items()]


@app.post("/api/users", status_code=201)
def create_user(data: UserCreate, admin: dict = Depends(require_admin)):
    users = charger_users()
    if data.username in users:
        raise HTTPException(status_code=400, detail="L'utilisateur existe déjà")
    if data.role not in ["admin", "user"]:
        raise HTTPException(status_code=400, detail="Rôle invalide (admin ou user)")
    users[data.username] = {"password": hacher_mdp(data.password), "role": data.role}
    sauvegarder_users(users)
    return {"message": f"Utilisateur '{data.username}' créé avec succès"}


@app.put("/api/users/{username}")
def update_user(username: str, data: UserUpdate, admin: dict = Depends(require_admin)):
    users = charger_users()
    if username not in users:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")
    users[username]["password"] = hacher_mdp(data.new_password)
    sauvegarder_users(users)
    return {"message": f"Mot de passe de '{username}' mis à jour"}


@app.delete("/api/users/{username}")
def delete_user(username: str, admin: dict = Depends(require_admin)):
    users = charger_users()
    if username not in users:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")
    del users[username]
    sauvegarder_users(users)
    return {"message": f"Utilisateur '{username}' supprimé"}


# ─────────────────────────────────────────────
# ROUTES — Journal
# ─────────────────────────────────────────────
@app.get("/api/journal")
def get_journal(admin: dict = Depends(require_admin)):
    return journal


# ─────────────────────────────────────────────
# ROUTES — Chiffrement / Déchiffrement
# ─────────────────────────────────────────────
def cesar_encrypt(text: str, shift: int) -> str:
    result = []
    for c in text:
        if c.isalpha():
            base = ord('a') if c.islower() else ord('A')
            result.append(chr((ord(c) - base + shift) % 26 + base))
        else:
            result.append(c)
    return "".join(result)


def vigenere_encrypt(text: str, key: str) -> str:
    key = key.upper()
    key = "".join(c for c in key if c.isalpha()) or "KEY"
    result = []
    ki = 0
    for c in text:
        if c.isalpha():
            base = ord('a') if c.islower() else ord('A')
            shift = ord(key[ki % len(key)]) - ord('A')
            result.append(chr((ord(c) - base + shift) % 26 + base))
            ki += 1
        else:
            result.append(c)
    return "".join(result)


def vigenere_decrypt(text: str, key: str) -> str:
    key = key.upper()
    key = "".join(c for c in key if c.isalpha()) or "KEY"
    result = []
    ki = 0
    for c in text:
        if c.isalpha():
            base = ord('a') if c.islower() else ord('A')
            shift = ord(key[ki % len(key)]) - ord('A')
            result.append(chr((ord(c) - base - shift + 26) % 26 + base))
            ki += 1
        else:
            result.append(c)
    return "".join(result)


@app.post("/api/crypto/cipher")
def cipher(data: CryptoRequest, current_user: dict = Depends(get_current_user)):
    algo = data.algorithm.lower()
    text = data.text
    mode = data.mode
    params = data.params or {}

    try:
        if algo == "caesar" or algo == "cesar":
            shift = int(params.get("shift", 13))
            if mode == "encrypt":
                result = cesar_encrypt(text, shift)
            else:
                result = cesar_encrypt(text, 26 - shift)

        elif algo == "vigenere":
            key = params.get("key", "crypto")
            if mode == "encrypt":
                result = vigenere_encrypt(text, key)
            else:
                result = vigenere_decrypt(text, key)

        elif algo == "rot13":
            result = "".join(
                chr((ord(c) - (97 if c.islower() else 65) + 13) % 26 + (97 if c.islower() else 65))
                if c.isalpha() else c
                for c in text
            )

        elif algo == "base64":
            import base64 as b64
            if mode == "encrypt":
                result = b64.b64encode(text.encode("utf-8")).decode("utf-8")
            else:
                result = b64.b64decode(text.encode("utf-8")).decode("utf-8")

        elif algo == "xor":
            key = params.get("key", "mysecretkey")
            xored = bytes([ord(c) ^ ord(key[i % len(key)]) for i, c in enumerate(text)])
            if mode == "encrypt":
                result = xored.hex()
            else:
                try:
                    raw = bytes.fromhex(text)
                    result = "".join(chr(b ^ ord(key[i % len(key)])) for i, b in enumerate(raw))
                except Exception:
                    raise ValueError("Entrée XOR invalide (attendu: hex)")

        else:
            raise HTTPException(status_code=400, detail=f"Algorithme '{algo}' non supporté")

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

    ajouter_journal(current_user["username"], current_user["role"], f"chiffrement {algo}", "succès")
    return {"result": result, "algorithm": algo, "mode": mode}


# ─────────────────────────────────────────────
# ROUTES — Hachage
# ─────────────────────────────────────────────
@app.post("/api/crypto/hash")
def hash_text(data: HashRequest, current_user: dict = Depends(get_current_user)):
    algo = data.algorithm.lower()
    text = data.text

    try:
        if algo == "sha256":
            if SHA_AVAILABLE:
                result = sha256_manual(text)
            else:
                import hashlib
                result = hashlib.sha256(text.encode()).hexdigest()

        elif algo == "sha1":
            if SHA_AVAILABLE:
                result = sha1_manual(text)
            else:
                import hashlib
                result = hashlib.sha1(text.encode()).hexdigest()

        elif algo == "bcrypt":
            salt = bcrypt.gensalt()
            result = bcrypt.hashpw(text.encode("utf-8"), salt).decode("utf-8")

        elif algo == "md5":
            import hashlib
            result = hashlib.md5(text.encode()).hexdigest()

        else:
            raise HTTPException(status_code=400, detail=f"Algorithme de hachage '{algo}' non supporté")

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

    ajouter_journal(current_user["username"], current_user["role"], f"hachage {algo}", "succès")
    return {"result": result, "algorithm": algo}


# ─────────────────────────────────────────────
# ROUTES — Vérification mot de passe
# ─────────────────────────────────────────────
@app.post("/api/crypto/check-password")
def check_password(data: PasswordCheckRequest):
    mdp = data.password
    issues = []
    score = 0

    if len(mdp) >= 8:
        score += 1
    else:
        issues.append("Au moins 8 caractères requis")

    if any(c.isupper() for c in mdp):
        score += 1
    else:
        issues.append("Au moins une lettre majuscule requise")

    if any(c.islower() for c in mdp):
        score += 1
    else:
        issues.append("Au moins une lettre minuscule requise")

    if any(c.isdigit() for c in mdp):
        score += 1
    else:
        issues.append("Au moins un chiffre requis")

    specials = "!@#$%^&*()-_=+[]{}|;:'\",.<>?/"
    if any(c in specials for c in mdp):
        score += 1
    else:
        issues.append("Au moins un caractère spécial requis")

    strength_map = {5: "Très fort", 4: "Fort", 3: "Moyen", 2: "Faible", 1: "Très faible", 0: "Invalide"}
    strength = strength_map.get(score, "Invalide")

    return {
        "score": score,
        "max_score": 5,
        "strength": strength,
        "is_strong": score == 5,
        "issues": issues,
    }


# ─────────────────────────────────────────────
# ROUTE — Santé de l'API
# ─────────────────────────────────────────────
@app.get("/api/health")
def health():
    return {"status": "ok", "message": "CryptoLearn API opérationnelle"}



if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)