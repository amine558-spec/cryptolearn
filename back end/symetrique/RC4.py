# -*- coding: utf-8 -*-
"""RC4 — Rivest Cipher 4 (implémentation manuelle from scratch)"""

def _ksa(key: bytes) -> list:
    """Key Scheduling Algorithm"""
    S = list(range(256))
    j = 0
    for i in range(256):
        j = (j + S[i] + key[i % len(key)]) % 256
        S[i], S[j] = S[j], S[i]
    return S

def _prga(S: list, length: int):
    """Pseudo-Random Generation Algorithm"""
    i = j = 0
    keystream = []
    for _ in range(length):
        i = (i + 1) % 256
        j = (j + S[i]) % 256
        S[i], S[j] = S[j], S[i]
        keystream.append(S[(S[i] + S[j]) % 256])
    return keystream

def _rc4(message: bytes, key: str) -> bytes:
    key_bytes = key.encode("utf-8")
    S = _ksa(key_bytes)
    keystream = _prga(S, len(message))
    return bytes([b ^ k for b, k in zip(message, keystream)])

def rc4_encrypt(message: str, key: str) -> str:
    result = _rc4(message.encode("utf-8"), key)
    return result.hex()

def rc4_decrypt(hex_message: str, key: str) -> str:
    data = bytes.fromhex(hex_message)
    return _rc4(data, key).decode("utf-8")

if __name__ == "__main__":
    msg, key = "Ahmed Amine", "MaCle2026"
    enc = rc4_encrypt(msg, key)
    dec = rc4_decrypt(enc, key)
    print(f"Original  : {msg}")
    print(f"Chiffré   : {enc}")
    print(f"Déchiffré : {dec}")
    print(f"OK        : {msg == dec}")
