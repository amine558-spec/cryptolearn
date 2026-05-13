import { useState } from "react";
import { RotateCcw, Code2, ChevronDown, ChevronUp, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TEMPLATES = {
  aes: {
    label: "AES (Python)",
    code: `# Simulation pédagogique de AES avec XOR (Python)
# En pratique, utilisez la bibliothèque 'cryptography' ou 'pycryptodome'

def xor_encrypt(text: str, key: str) -> bytes:
    """Chiffrement XOR (simplifié pour l'apprentissage)"""
    key_bytes = key.encode()
    return bytes(
        char ^ key_bytes[i % len(key_bytes)]
        for i, char in enumerate(text.encode())
    )

def xor_decrypt(cipher: bytes, key: str) -> str:
    """XOR est sa propre inverse"""
    return xor_encrypt(cipher.decode('latin-1'), key).decode()

# Exemple d'utilisation
plaintext = "Hello Crypto!"
key = "mysecretkey"

encrypted = xor_encrypt(plaintext, key)
print(f"Texte original  : {plaintext}")
print(f"Chiffré (hex)   : {encrypted.hex()}")
print(f"Déchiffré       : {xor_decrypt(encrypted.decode('latin-1'), key)}")

# Avec la vraie bibliothèque AES (nécessite: pip install cryptography)
# from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
# cipher = Cipher(algorithms.AES(key_32_bytes), modes.CBC(iv_16_bytes))
`,
  },
  rsa: {
    label: "RSA (Python)",
    code: `# Implémentation RSA en Python pur (pédagogique)

def gcd(a: int, b: int) -> int:
    """Algorithme d'Euclide"""
    return a if b == 0 else gcd(b, a % b)

def mod_pow(base: int, exp: int, mod: int) -> int:
    """Exponentiation modulaire rapide"""
    result = 1
    base %= mod
    while exp > 0:
        if exp % 2 == 1:
            result = result * base % mod
        exp //= 2
        base = base * base % mod
    return result

# Génération des clés RSA (petits nombres pour l'exemple)
p, q = 61, 53          # Nombres premiers
n = p * q              # Module public = 3233
phi = (p - 1) * (q - 1)  # Indicatrice d'Euler = 3120
e = 17                 # Exposant public (clé publique)
d = 2753               # Exposant privé (clé privée)

print(f"Clé publique  (e, n) : ({e}, {n})")
print(f"Clé privée    (d, n) : ({d}, {n})")

# Chiffrement et déchiffrement
message = 65  # Valeur ASCII de 'A'
encrypted = mod_pow(message, e, n)
decrypted = mod_pow(encrypted, d, n)

print(f"\\nMessage original : {message} ({chr(message)})")
print(f"Chiffré          : {encrypted}")
print(f"Déchiffré        : {decrypted} ({chr(decrypted)})")

# Vérification : e * d mod phi == 1
print(f"\\nVérification : (e × d) mod φ(n) = {(e * d) % phi}")
`,
  },
  sha256: {
    label: "SHA-256 (Python)",
    code: `# Hachage SHA-256 avec le module hashlib intégré Python

import hashlib

def sha256(text: str) -> str:
    """Calcule le hash SHA-256 d'une chaîne"""
    return hashlib.sha256(text.encode()).hexdigest()

# Démonstration de base
messages = ["Hello", "Hello!", "CryptoLearn", ""]
print("=== Hachage SHA-256 ===")
for msg in messages:
    h = sha256(msg)
    print(f'sha256("{msg}") = {h[:32]}...')

# Effet avalanche : un seul bit différent = hash totalement différent
print("\\n=== Effet Avalanche ===")
h1 = sha256("crypto")
h2 = sha256("Crypto")  # Majuscule uniquement
print(f"sha256('crypto') = {h1}")
print(f"sha256('Crypto') = {h2}")

# Compter les bits différents
bits_diff = bin(int(h1, 16) ^ int(h2, 16)).count('1')
print(f"\\nBits différents : {bits_diff} / 256 ({bits_diff/256*100:.1f}%)")

# Hachage de fichier (exemple de code)
# with open("fichier.txt", "rb") as f:
#     file_hash = hashlib.sha256(f.read()).hexdigest()
`,
  },
  caesar: {
    label: "Chiffre de César (Python)",
    code: `# Chiffre de César en Python

def cesar_encrypt(text: str, shift: int) -> str:
    """Chiffre un texte avec le décalage de César"""
    result = []
    for char in text:
        if char.isalpha():
            base = ord('a') if char.islower() else ord('A')
            result.append(chr((ord(char) - base + shift) % 26 + base))
        else:
            result.append(char)
    return ''.join(result)

def cesar_decrypt(text: str, shift: int) -> str:
    """Déchiffre un texte chiffré avec César"""
    return cesar_encrypt(text, 26 - shift)

def brute_force(ciphertext: str) -> None:
    """Attaque par force brute : teste tous les décalages"""
    print("=== Attaque par force brute ===")
    for shift in range(1, 26):
        print(f"  Décalage {shift:2d} : {cesar_decrypt(ciphertext, shift)}")

# Exemple
message = "Bonjour le Monde"
shift = 13  # ROT-13

encrypted = cesar_encrypt(message, shift)
decrypted = cesar_decrypt(encrypted, shift)

print(f"Original          : {message}")
print(f"Chiffré (déc.{shift}) : {encrypted}")
print(f"Déchiffré         : {decrypted}")

print()
brute_force(encrypted)
`,
  },
  diffie_hellman: {
    label: "Diffie-Hellman (Python)",
    code: `# Protocole Diffie-Hellman en Python

import random

def mod_pow(base: int, exp: int, mod: int) -> int:
    """Exponentiation modulaire rapide"""
    result = 1
    base %= mod
    while exp > 0:
        if exp % 2 == 1:
            result = result * base % mod
        exp //= 2
        base = base * base % mod
    return result

# Paramètres publics (p premier, g générateur)
p = 23   # Nombre premier (petit pour l'exemple)
g = 5    # Générateur

print(f"Paramètres publics : p={p}, g={g}")

# Alice choisit sa clé privée secrète
a = random.randint(2, p - 2)
A = mod_pow(g, a, p)  # Clé publique d'Alice
print(f"\\nAlice  → clé privée a={a}, clé publique A={A}")

# Bob choisit sa clé privée secrète
b = random.randint(2, p - 2)
B = mod_pow(g, b, p)  # Clé publique de Bob
print(f"Bob    → clé privée b={b}, clé publique B={B}")

# Échange des clés publiques (sur un canal non sécurisé)
# Calcul du secret partagé
secret_alice = mod_pow(B, a, p)  # Alice calcule B^a mod p
secret_bob   = mod_pow(A, b, p)  # Bob calcule A^b mod p

print(f"\\nSecret partagé (Alice) : {secret_alice}")
print(f"Secret partagé (Bob)   : {secret_bob}")
print(f"Identiques ? {'✓ Oui !' if secret_alice == secret_bob else '✗ Non'}")
`,
  },
};

function highlight(code) {
  return code
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/(#.*$)/gm, '<span style="color:#6a9955">$1</span>')
    .replace(/("""[\s\S]*?"""|\'\'\'[\s\S]*?\'\'\')/g, '<span style="color:#6a9955">$1</span>')
    .replace(/\b(def|class|import|from|return|if|else|elif|for|in|while|and|or|not|True|False|None|print|range|len|str|int|bytes|chr|ord)\b/g, '<span style="color:#569cd6">$1</span>')
    .replace(/(".*?"|'.*?'|f".*?"|f'.*?')/g, '<span style="color:#ce9178">$1</span>')
    .replace(/\b(\d+)\b/g, '<span style="color:#b5cea8">$1</span>');
}

export default function CodeEditor({ algorithmId }) {
  const defaultKey = algorithmId && TEMPLATES[algorithmId] ? algorithmId :
    algorithmId === "diffie-hellman" ? "diffie_hellman" : "caesar";

  const [selectedTemplate, setSelectedTemplate] = useState(
    TEMPLATES[algorithmId] ? algorithmId : (TEMPLATES[algorithmId?.replace("-", "_")] ? algorithmId.replace("-", "_") : "caesar")
  );
  const [code, setCode] = useState(TEMPLATES[selectedTemplate]?.code || TEMPLATES.caesar.code);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleTemplateChange(key) {
    setSelectedTemplate(key);
    setCode(TEMPLATES[key].code);
  }

  function copyCode() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function resetCode() {
    setCode(TEMPLATES[selectedTemplate].code);
  }

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + "    " + code.substring(end);
      setCode(newCode);
      setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = start + 4; }, 0);
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center">
            <Code2 className="h-5 w-5 text-white" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-foreground">Éditeur de Code Python</h3>
            <p className="text-xs text-muted-foreground">Exemples Python à copier et exécuter localement</p>
          </div>
        </div>
        {open ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
      </button>

      {open && (
        <div className="border-t border-border">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 px-5 py-3 bg-muted/20 border-b border-border">
            <select
              value={selectedTemplate}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="text-sm bg-card border border-border rounded-lg px-3 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {Object.entries(TEMPLATES).map(([key, t]) => (
                <option key={key} value={key}>{t.label}</option>
              ))}
            </select>
            <div className="ml-auto flex items-center gap-2">
              <Button onClick={resetCode} variant="outline" size="sm" className="gap-1.5 h-8 text-xs">
                <RotateCcw className="h-3 w-3" />
                Réinitialiser
              </Button>
              <Button onClick={copyCode} size="sm" className="gap-1.5 h-8 text-xs">
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copié !" : "Copier le code"}
              </Button>
            </div>
          </div>

          {/* Info banner */}
          <div className="px-5 py-2 bg-violet-50 border-b border-violet-100 text-xs text-violet-700 flex items-center gap-2">
            <span>🐍</span>
            <span>Copiez ce code et exécutez-le avec <strong>Python 3</strong> sur votre machine ou sur <a href="https://replit.com" target="_blank" rel="noopener noreferrer" className="underline">Replit</a> / <a href="https://colab.research.google.com" target="_blank" rel="noopener noreferrer" className="underline">Google Colab</a>.</span>
          </div>

          {/* Editor */}
          <div className="relative bg-[#1e1e1e] font-mono text-sm">
            <div className="flex">
              <div className="select-none text-right pr-4 pt-4 pb-4 pl-3 text-[#858585] text-xs leading-6 min-w-[48px] border-r border-white/10">
                {code.split("\n").map((_, i) => <div key={i}>{i + 1}</div>)}
              </div>
              <div className="relative flex-1 overflow-auto">
                <pre
                  className="absolute inset-0 p-4 text-xs leading-6 text-[#d4d4d4] pointer-events-none overflow-hidden whitespace-pre"
                  dangerouslySetInnerHTML={{ __html: highlight(code) }}
                />
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={handleKeyDown}
                  spellCheck={false}
                  className="relative w-full p-4 bg-transparent text-transparent caret-white text-xs leading-6 resize-none outline-none min-h-[340px] font-mono"
                  style={{ caretColor: "white" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}