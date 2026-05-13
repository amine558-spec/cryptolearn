# -*- coding: utf-8 -*-
"""
Implémentation manuelle de l'algorithme de hachage SHA-1
"""

def message_pading(m):
    new_mess = m.encode('utf-8')
    original_length = len(new_mess) * 8
    new_mess += b'\x80'
    while (len(new_mess) % 64) != 56:
        new_mess += b'\x00'
    new_mess += original_length.to_bytes(8, byteorder='big')
    return new_mess

def ROTG(x, n):
    return ((x << n) | (x >> (32 - n))) & 0xffffffff

def initialisation(pading):
    h0 = 0x67452301
    h1 = 0xEFCDAB89
    h2 = 0x98BADCFE
    h3 = 0x10325476
    h4 = 0xC3D2E1F0

    for i in range(0, len(pading), 64):
        block = pading[i:i+64]
        w = [int.from_bytes(block[j:j+4], 'big') for j in range(0, 64, 4)]

        for j in range(16, 80):
            val = w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16]
            w.append(ROTG(val, 1))

        A, B, C, D, E = h0, h1, h2, h3, h4

        for j in range(80):
            if 0 <= j <= 19:
                F = (B & C) | ((~B) & D)
                k = 0x5A827999
            elif 20 <= j <= 39:
                F = B ^ C ^ D
                k = 0x6ED9EBA1
            elif 40 <= j <= 59:
                F = (B & C) | (B & D) | (C & D)
                k = 0x8F1BBCDC
            else:
                F = B ^ C ^ D
                k = 0xCA62C1D6

            temp = (ROTG(A, 5) + F + E + k + w[j]) & 0xffffffff
            E = D
            D = C
            C = ROTG(B, 30)
            B = A
            A = temp

        h0 = (h0 + A) & 0xffffffff
        h1 = (h1 + B) & 0xffffffff
        h2 = (h2 + C) & 0xffffffff
        h3 = (h3 + D) & 0xffffffff
        h4 = (h4 + E) & 0xffffffff

    return [h0, h1, h2, h3, h4]

def hash_sha(S):
    H = initialisation(message_pading(S))
    return ''.join(f"{x:08x}" for x in H)


if __name__ == "__main__":
    import hashlib
    texte = "amine20056789AZ"
    resultat_manuel = hash_sha(texte)
    resultat_hashlib = hashlib.sha1(texte.encode()).hexdigest()
    print("SHA-1 manuel  :", resultat_manuel)
    print("SHA-1 hashlib :", resultat_hashlib)
    print("Correspondance:", resultat_manuel == resultat_hashlib)
