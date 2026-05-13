def cesar(massage, decalage=3):
    resultat = ""
    for char in massage:
        if char.isalpha():
            if char.islower():
                count=ord(char) + decalage
                if count > ord('z'):
                    count -= 26
                resultat += chr(count)
            else: 
                count=ord(char) + decalage
                if count > ord('Z'):
                    count -= 26
                resultat += chr(count)
        else:
            resultat += char
    return resultat

def cesar_dechiffrer(massage, decalage=3):
    resultat = ""
    for char in massage:
        if char.isalpha():
            if char.islower():
                count=ord(char) - decalage
                if count < ord('a'):
                    count += 26
                resultat += chr(count)
            else: 
                count=ord(char) - decalage
                if count < ord('A'):
                    count += 26
                resultat += chr(count)
        else:
            resultat += char
    return resultat
