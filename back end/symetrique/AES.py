# -*- coding: utf-8 -*-
"""AES — Advanced Encryption Standard (via pycryptodome)"""
from Crypto.Cipher import AES as _AES
from Crypto.Util.Padding import pad, unpad
import binascii

def _prepare_key(key: str) -> bytes:
    k = key.encode("utf-8")
    # Ajuste la clé à 16, 24 ou 32 octets
    for size in (16, 24, 32):
        if len(k) <= size:
            return k.ljust(size, b'\0')
    return k[:32]

def aes_encrypt(message: str, key: str) -> str:
    cipher = _AES.new(_prepare_key(key), _AES.MODE_ECB)
    ct = cipher.encrypt(pad(message.encode("utf-8"), 16))
    return binascii.hexlify(ct).decode()

def aes_decrypt(hex_message: str, key: str) -> str:
    cipher = _AES.new(_prepare_key(key), _AES.MODE_ECB)
    ct = binascii.unhexlify(hex_message)
    return unpad(cipher.decrypt(ct), 16).decode("utf-8")

if __name__ == "__main__":
    msg, key = "Hello Ahmed!", "MaCleSecrete123"
    enc = aes_encrypt(msg, key)
    dec = aes_decrypt(enc, key)
    print(f"Original  : {msg}")
    print(f"Chiffré   : {enc}")
    print(f"Déchiffré : {dec}")
    print(f"OK        : {msg == dec}")
