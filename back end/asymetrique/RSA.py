# -*- coding: utf-8 -*-
"""
RSA — Rivest–Shamir–Adleman
Implémentation manuelle from scratch avec génération de clés réelles.
"""
import random
import math

def est_premier(n: int, k: int = 20) -> bool:
    """Test de primalité de Miller-Rabin."""
    if n < 2: return False
    if n == 2 or n == 3: return True
    if n % 2 == 0: return False
    r, d = 0, n - 1
    while d % 2 == 0:
        r += 1; d //= 2
    for _ in range(k):
        a = random.randrange(2, n - 1)
        x = pow(a, d, n)
        if x in (1, n - 1): continue
        for _ in range(r - 1):
            x = pow(x, 2, n)
            if x == n - 1: break
        else:
            return False
    return True

def generer_premier(bits: int = 256) -> int:
    while True:
        n = random.getrandbits(bits) | (1 << bits - 1) | 1
        if est_premier(n): return n

def extended_gcd(a, b):
    if a == 0: return b, 0, 1
    g, x, y = extended_gcd(b % a, a)
    return g, y - (b // a) * x, x

def inverse_mod(e, phi):
    g, x, _ = extended_gcd(e % phi, phi)
    if g != 1: raise ValueError("Pas d'inverse modulaire")
    return x % phi

def rsa_generer_cles(bits: int = 256):
    """Génère une paire de clés RSA (publique, privée)."""
    p = generer_premier(bits)
    q = generer_premier(bits)
    while q == p: q = generer_premier(bits)
    n = p * q
    phi = (p - 1) * (q - 1)
    e = 65537
    while math.gcd(e, phi) != 1: e += 2
    d = inverse_mod(e, phi)
    return (e, n), (d, n)  # (clé_publique, clé_privée)

def rsa_chiffrer(message: str, cle_publique: tuple) -> list:
    """Chiffre un message caractère par caractère."""
    e, n = cle_publique
    return [pow(ord(c), e, n) for c in message]

def rsa_dechiffrer(chiffre: list, cle_privee: tuple) -> str:
    """Déchiffre un message chiffré par RSA."""
    d, n = cle_privee
    return "".join(chr(pow(c, d, n)) for c in chiffre)

if __name__ == "__main__":
    print("Génération des clés RSA (256 bits)...")
    pub, priv = rsa_generer_cles(128)  # 128 bits pour la démo (plus rapide)
    msg = "Ahmed"
    chiffre = rsa_chiffrer(msg, pub)
    dechiffre = rsa_dechiffrer(chiffre, priv)
    print(f"Message   : {msg}")
    print(f"Chiffré   : {chiffre[:3]}...")
    print(f"Déchiffré : {dechiffre}")
    print(f"OK        : {msg == dechiffre}")
