# -*- coding: utf-8 -*-
"""DES — Data Encryption Standard (via pycryptodome)"""
from Crypto.Cipher import DES as _DES
from Crypto.Util.Padding import pad, unpad
import binascii

def _prepare_key(key: str) -> bytes:
    k = key.encode("utf-8")
    return k[:8].ljust(8, b'\0')  # DES exige exactement 8 octets

def des_encrypt(message: str, key: str) -> str:
    cipher = _DES.new(_prepare_key(key), _DES.MODE_ECB)
    ct = cipher.encrypt(pad(message.encode("utf-8"), 8))
    return binascii.hexlify(ct).decode()

def des_decrypt(hex_message: str, key: str) -> str:
    cipher = _DES.new(_prepare_key(key), _DES.MODE_ECB)
    ct = binascii.unhexlify(hex_message)
    return unpad(cipher.decrypt(ct), 8).decode("utf-8")

if __name__ == "__main__":
    msg, key = "Bonjour!", "CleSecre"
    enc = des_encrypt(msg, key)
    dec = des_decrypt(enc, key)
    print(f"Original  : {msg}")
    print(f"Chiffré   : {enc}")
    print(f"Déchiffré : {dec}")
    print(f"OK        : {msg == dec}")
