# -*- coding: utf-8 -*-
"""
CryptoLearn — Application Python de cryptographie
Auteur : Ahmed Amine Hmeddou
École Mohammadia d'Ingénieurs — 2025-2026
"""

import journale
import bcrypt
import json
import getpass
import os

try:
    from colorama import init, Fore, Style
    init(autoreset=True)
    COLORS = True
except ImportError:
    COLORS = False
    class Fore:
        GREEN = YELLOW = RED = CYAN = MAGENTA = BLUE = WHITE = RESET = ""
    class Style:
        BRIGHT = DIM = RESET_ALL = ""

from symetrique.cesar import cesar, cesar_dechiffrer
from hashage.SHA256   import sha256
from hashage.SHA1     import hash_sha as sha1

MAX_TENTATIVES = 3

# ── UI ────────────────────────────────────────────────────────────────
def ligne(car="─", n=55, c=None):
    print((c or Fore.CYAN) + car * n)

def titre(t):
    print(); ligne("═"); print(Fore.CYAN + Style.BRIGHT + f"  {t}"); ligne("═")

def section(t):
    print(); ligne("─", 50, Fore.YELLOW)
    print(Fore.YELLOW + f"  {t}"); ligne("─", 50, Fore.YELLOW)

def ok(m):    print(Fore.GREEN  + Style.BRIGHT + f"  ✔  {m}")
def erreur(m):print(Fore.RED    + Style.BRIGHT + f"  ✘  {m}")
def info(m):  print(Fore.CYAN   + f"  ℹ  {m}")
def opt(n,t): print(f"  {Fore.CYAN}{n}.{Fore.WHITE} {t}")
def saisir(p):return input(Fore.MAGENTA + f"  ▶ {p}: " + Style.RESET_ALL)

# ── Utilisateurs ──────────────────────────────────────────────────────
def charger_users():
    if not os.path.exists("users.json"):
        users = {
            "admin": {"password": bcrypt.hashpw(b"Admin123!", bcrypt.gensalt()).decode(), "role": "admin"},
            "ahmed": {"password": bcrypt.hashpw(b"Ahmed123!", bcrypt.gensalt()).decode(), "role": "user"},
        }
        _sauvegarder(users); return users
    with open("users.json", "r", encoding="utf-8") as f:
        return json.load(f)

def _sauvegarder(users):
    data = {u: {"password": i["password"].decode() if isinstance(i["password"], bytes) else i["password"], "role": i["role"]} for u, i in users.items()}
    with open("users.json", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

def hacher(p):    return bcrypt.hashpw(p.encode(), bcrypt.gensalt())
def verifier(p,h): return bcrypt.checkpw(p.encode(), h.encode() if isinstance(h, str) else h)

# ── Complexité (CORRIGÉ — plus de boucle infinie) ─────────────────────
def verifier_complexite(mdp):
    pb = []
    if len(mdp) < 8:                                       pb.append("8 caractères minimum")
    if not any(c.isupper() for c in mdp):                  pb.append("1 majuscule minimum")
    if not any(c.islower() for c in mdp):                  pb.append("1 minuscule minimum")
    if not any(c.isdigit() for c in mdp):                  pb.append("1 chiffre minimum")
    if not any(c in "!@#$%^&*()-_=+[]{}|;:'\",.<>?/" for c in mdp): pb.append("1 caractère spécial")
    if pb:
        erreur("Mot de passe trop faible :"); [print(Fore.RED + f"      • {p}") for p in pb]; return False
    ok("Mot de passe fort ✔"); return True

# ── Login ──────────────────────────────────────────────────────────────
def login(users):
    for t in range(MAX_TENTATIVES):
        u = saisir("Nom d'utilisateur")
        p = getpass.getpass(Fore.MAGENTA + "  ▶ Mot de passe : " + Style.RESET_ALL)
        if u in users and verifier(p, users[u]["password"]):
            ok(f"Bienvenue, {u} 👋"); journale.ajouter_journal(u, users[u]["role"]); return u, users[u]["role"]
        erreur(f"Identifiants incorrects. {MAX_TENTATIVES-t-1} tentative(s) restante(s).")
    erreur("Compte bloqué !"); return None, None

# ── Mon compte (CORRIGÉ) ───────────────────────────────────────────────
def mon_compte(username, users):
    section(f"Mon compte — {username}")
    info(f"Utilisateur : {username}"); info(f"Rôle        : {users[username]['role']}")
    print(); opt(1, "Changer mon mot de passe"); opt(2, "Retour")
    if saisir("Choix") != "1": return
    ancien = getpass.getpass(Fore.MAGENTA + "  ▶ Mot de passe actuel : " + Style.RESET_ALL)
    if not verifier(ancien, users[username]["password"]):
        erreur("Mot de passe actuel incorrect."); return
    nouveau = getpass.getpass(Fore.MAGENTA + "  ▶ Nouveau mot de passe : " + Style.RESET_ALL)
    if not verifier_complexite(nouveau): return          # CORRIGÉ : return, pas boucle
    confirm = getpass.getpass(Fore.MAGENTA + "  ▶ Confirmer : " + Style.RESET_ALL)
    if nouveau != confirm: erreur("Les mots de passe ne correspondent pas."); return
    users[username]["password"] = hacher(nouveau)        # CORRIGÉ : = pas ==
    _sauvegarder(users); ok("Mot de passe modifié !")

# ── Hachage ────────────────────────────────────────────────────────────
def menu_hachage():
    section("Hachage")
    opt(1,"SHA-256 (manuel)"); opt(2,"SHA-1 (manuel)"); opt(3,"bcrypt"); opt(4,"Les 3 en même temps"); opt(5,"Retour")
    c = saisir("Choix"); 
    if c == "5": return
    msg = saisir("Message à hacher")
    if c == "1": ok(f"SHA-256 : {sha256(msg)}")
    elif c == "2": ok(f"SHA-1   : {sha1(msg)}")
    elif c == "3": ok(f"bcrypt  : {bcrypt.hashpw(msg.encode(), bcrypt.gensalt()).decode()}")
    elif c == "4":
        ok(f"SHA-1   : {sha1(msg)}")
        ok(f"SHA-256 : {sha256(msg)}")
        ok(f"bcrypt  : {bcrypt.hashpw(msg.encode(), bcrypt.gensalt()).decode()}")

# ── Chiffrement symétrique ─────────────────────────────────────────────
def menu_sym():
    section("Chiffrement Symétrique")
    opt(1,"César (chiffre de décalage)"); opt(2,"XOR (clé personnalisée)"); opt(3,"ROT13"); opt(4,"Retour")
    c = saisir("Choix")
    if c == "4": return
    msg = saisir("Message")
    if c == "1":
        try: d = int(saisir("Décalage (ex: 3)"))
        except: d = 3
        chiffre = cesar(msg, d); ok(f"Chiffré   : {chiffre}"); ok(f"Déchiffré : {cesar_dechiffrer(chiffre, d)}")
    elif c == "2":
        cle = saisir("Clé XOR")
        xored = bytes([ord(ch) ^ ord(cle[i % len(cle)]) for i, ch in enumerate(msg)]).hex()
        dechiffre = "".join(chr(int(xored[i:i+2], 16) ^ ord(cle[(i//2) % len(cle)])) for i in range(0, len(xored), 2))
        ok(f"Chiffré (hex) : {xored}"); ok(f"Déchiffré     : {dechiffre}")
    elif c == "3":
        rot = "".join(chr((ord(ch)-(97 if ch.islower() else 65)+13)%26+(97 if ch.islower() else 65)) if ch.isalpha() else ch for ch in msg)
        ok(f"ROT13 : {rot}"); ok(f"Inversé : {''.join(chr((ord(ch)-(97 if ch.islower() else 65)+13)%26+(97 if ch.islower() else 65)) if ch.isalpha() else ch for ch in rot)}")

# ── Chiffrement asymétrique RSA simplifié ─────────────────────────────
def menu_asym():
    section("Chiffrement Asymétrique — RSA (simplifié)")
    info("p=61, q=53 → n=3233, e=17, d=2753")
    msg = saisir("Message (entier ≤ 3232)")
    try:
        m = int(msg)
        e, d, n = 17, 2753, 3233
        chiffre = pow(m, e, n); dechiffre = pow(chiffre, d, n)
        ok(f"Message original : {m}"); ok(f"Chiffré (RSA)    : {chiffre}"); ok(f"Déchiffré        : {dechiffre}")
        ok("✔ Déchiffrement correct !" if m == dechiffre else "✘ Erreur de déchiffrement")
    except ValueError:
        erreur("Entrez un nombre entier.")

# ── Gestion utilisateurs (admin) ───────────────────────────────────────
def gerer_utilisateurs(users):
    while True:
        section("Gestion des utilisateurs")
        opt(1,"Créer"); opt(2,"Modifier mot de passe"); opt(3,"Supprimer"); opt(4,"Lister"); opt(5,"Retour")
        c = saisir("Choix")
        if c == "5": break
        elif c == "1":
            u = saisir("Username"); 
            if u in users: erreur("Existe déjà."); continue
            p = saisir("Password"); r = saisir("Rôle (admin/user)")
            if r not in ["admin","user"]: erreur("Rôle invalide."); continue
            users[u] = {"password": hacher(p), "role": r}; _sauvegarder(users); ok(f"'{u}' créé.")
        elif c == "2":
            u = saisir("Username")
            if u not in users: erreur("Introuvable."); continue
            p = saisir("Nouveau mot de passe"); users[u]["password"] = hacher(p); _sauvegarder(users); ok("Modifié.")
        elif c == "3":
            u = saisir("Username")
            if u not in users: erreur("Introuvable."); continue
            del users[u]; _sauvegarder(users); ok(f"'{u}' supprimé.")
        elif c == "4":
            section("Utilisateurs")
            for u, d in users.items():
                print(f"  {Fore.WHITE}{u:20s} {Fore.RED if d['role']=='admin' else Fore.GREEN}[{d['role']}]")

def afficher_journal():
    section("Journal des connexions")
    if not journale.journal: info("Aucune connexion enregistrée."); return
    for e in journale.journal:
        c = Fore.GREEN if e["statut"] == "succès" else Fore.RED
        print(c + f"  [{e['heure']}] {e['username']:15s} ({e['role']:5s}) — {e['action']} — {e['statut']}")

# ── Menus principaux ───────────────────────────────────────────────────
def menu_user(username, users):
    while True:
        titre(f"Menu Utilisateur — {username}")
        opt(1,"Mon compte"); opt(2,"Vérifier complexité d'un mot de passe")
        opt(3,"Chiffrement symétrique"); opt(4,"Chiffrement asymétrique (RSA)")
        opt(5,"Hachage (SHA-256, SHA-1, bcrypt)"); opt(6,"Quitter"); print()
        c = saisir("Choix")
        if c=="1": mon_compte(username, users)
        elif c=="2":
            section("Testeur de complexité")
            while True:
                mdp = getpass.getpass(Fore.MAGENTA + "  ▶ Mot de passe (ou 'q' pour quitter) : " + Style.RESET_ALL)
                if mdp.lower() == "q": break
                verifier_complexite(mdp)
        elif c=="3": menu_sym()
        elif c=="4": menu_asym()
        elif c=="5": menu_hachage()
        elif c=="6": ok("Au revoir !"); break
        else: erreur("Option invalide.")

def menu_admin(username, users):
    while True:
        titre(f"Menu Admin — {username}")
        opt(1,"Gérer les utilisateurs"); opt(2,"Journal des connexions")
        opt(3,"Accéder aux outils crypto"); opt(4,"Quitter"); print()
        c = saisir("Choix")
        if c=="1": gerer_utilisateurs(users)
        elif c=="2": afficher_journal()
        elif c=="3": menu_user(username, users)
        elif c=="4": ok("Au revoir !"); break
        else: erreur("Option invalide.")

# ── Main ───────────────────────────────────────────────────────────────
def main():
    os.system("cls" if os.name == "nt" else "clear")
    titre("CryptoLearn — Application de Cryptographie")
    info("École Mohammadia d'Ingénieurs — 2025-2026")
    info("Auteur : Ahmed Amine Hmeddou"); print()
    opt(1,"Créer un compte"); opt(2,"Se connecter"); opt(3,"Quitter"); print()

    users = charger_users()
    c = saisir("Votre choix")

    if c == "1":
        section("Création de compte")
        u = saisir("Nom d'utilisateur")
        if u in users: erreur("Utilisateur déjà existant."); return
        p = getpass.getpass(Fore.MAGENTA + "  ▶ Mot de passe : " + Style.RESET_ALL)
        if not verifier_complexite(p): erreur("Compte non créé."); return
        users[u] = {"password": hacher(p), "role": "user"}
        _sauvegarder(users); ok(f"Compte '{u}' créé ! Reconnectez-vous.")

    elif c == "2":
        section("Connexion")
        username, role = login(users)
        if role == "admin": menu_admin(username, users)
        elif role == "user": menu_user(username, users)
        else: erreur("Connexion échouée.")

    elif c == "3": ok("À bientôt !")
    else: erreur("Option invalide.")

if __name__ == "__main__":
    main()
