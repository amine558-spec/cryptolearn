export const quizzes = {
  aes: {
    questions: [
      {
        id: 1,
        question: "Quelle est la taille des blocs traités par AES ?",
        options: ["64 bits", "128 bits", "256 bits", "512 bits"],
        correct: 1,
        explanation: "AES traite des blocs de 128 bits, quelle que soit la taille de la clé utilisée."
      },
      {
        id: 2,
        question: "Quelles sont les tailles de clé supportées par AES ?",
        options: ["56, 112, 168 bits", "64, 128, 256 bits", "128, 192, 256 bits", "128, 256, 512 bits"],
        correct: 2,
        explanation: "AES supporte des clés de 128, 192 ou 256 bits, correspondant à 10, 12 ou 14 tours."
      },
      {
        id: 3,
        question: "Combien de tours effectue AES avec une clé de 128 bits ?",
        options: ["8 tours", "10 tours", "12 tours", "16 tours"],
        correct: 1,
        explanation: "AES-128 effectue 10 tours. AES-192 en fait 12 et AES-256 en fait 14."
      },
      {
        id: 4,
        question: "Lequel de ces protocoles utilise AES ?",
        options: ["HTTP", "FTP", "WPA2 Wi-Fi", "DNS"],
        correct: 2,
        explanation: "WPA2 utilise AES pour chiffrer les communications Wi-Fi. C'est pourquoi il est plus sécurisé que WEP."
      }
    ]
  },
  rsa: {
    questions: [
      {
        id: 1,
        question: "Sur quel problème mathématique repose la sécurité de RSA ?",
        options: ["Le logarithme discret", "La factorisation de grands nombres", "Les courbes elliptiques", "Les nombres premiers de Mersenne"],
        correct: 1,
        explanation: "RSA repose sur la difficulté de factoriser le produit de deux grands nombres premiers."
      },
      {
        id: 2,
        question: "Quelle taille de clé RSA est recommandée aujourd'hui ?",
        options: ["512 bits", "1024 bits", "2048 bits ou plus", "256 bits"],
        correct: 2,
        explanation: "Il est recommandé d'utiliser des clés RSA d'au moins 2048 bits pour une sécurité suffisante."
      },
      {
        id: 3,
        question: "Dans RSA, la clé publique sert à :",
        options: ["Déchiffrer les messages", "Signer les messages", "Chiffrer les messages", "Générer des clés"],
        correct: 2,
        explanation: "La clé publique est utilisée pour chiffrer les messages. Seul le détenteur de la clé privée peut les déchiffrer."
      },
      {
        id: 4,
        question: "RSA est un algorithme de type :",
        options: ["Symétrique", "Asymétrique", "Hachage", "Flux"],
        correct: 1,
        explanation: "RSA est asymétrique car il utilise une paire de clés distinctes : une publique et une privée."
      }
    ]
  },
  sha256: {
    questions: [
      {
        id: 1,
        question: "Quelle est la taille de la sortie de SHA-256 ?",
        options: ["128 bits", "160 bits", "256 bits", "512 bits"],
        correct: 2,
        explanation: "SHA-256 produit toujours un condensé de 256 bits (32 octets), quelle que soit la taille de l'entrée."
      },
      {
        id: 2,
        question: "SHA-256 est une fonction :",
        options: ["Réversible", "À sens unique (irréversible)", "Symétrique", "Asymétrique"],
        correct: 1,
        explanation: "SHA-256 est une fonction de hachage à sens unique : il est impossible de retrouver l'entrée à partir du condensé."
      },
      {
        id: 3,
        question: "SHA-256 est utilisé dans :",
        options: ["Le chiffrement Wi-Fi", "Bitcoin et la blockchain", "Les VPN uniquement", "Les appels téléphoniques"],
        correct: 1,
        explanation: "SHA-256 est au cœur du mécanisme de preuve de travail (Proof of Work) de Bitcoin."
      },
      {
        id: 4,
        question: "Que se passe-t-il si on modifie un seul bit de l'entrée de SHA-256 ?",
        options: ["Le condensé change légèrement", "Le condensé est identique", "Le condensé change complètement (effet avalanche)", "SHA-256 génère une erreur"],
        correct: 2,
        explanation: "C'est l'effet avalanche : même un changement infime de l'entrée produit un condensé totalement différent."
      }
    ]
  },
  des: {
    questions: [
      {
        id: 1,
        question: "Pourquoi DES est-il considéré comme non sécurisé aujourd'hui ?",
        options: ["Il est trop lent", "Sa clé de 56 bits est trop courte", "Il n'utilise pas de sel", "Il manque de tours"],
        correct: 1,
        explanation: "La clé DES de 56 bits peut être cassée en quelques heures par force brute avec du matériel moderne."
      },
      {
        id: 2,
        question: "Quelle est la taille des blocs traités par DES ?",
        options: ["32 bits", "64 bits", "128 bits", "256 bits"],
        correct: 1,
        explanation: "DES traite des blocs de 64 bits avec une clé effective de 56 bits."
      },
      {
        id: 3,
        question: "Par quel algorithme DES a-t-il été remplacé ?",
        options: ["3DES", "RSA", "AES", "ECC"],
        correct: 2,
        explanation: "AES a été adopté comme standard en 2001 pour remplacer DES devenu trop vulnérable."
      },
      {
        id: 4,
        question: "Combien de tours le réseau de Feistel de DES effectue-t-il ?",
        options: ["8 tours", "12 tours", "16 tours", "24 tours"],
        correct: 2,
        explanation: "DES effectue 16 tours de réseau de Feistel pour chiffrer chaque bloc de 64 bits."
      }
    ]
  },
  "diffie-hellman": {
    questions: [
      {
        id: 1,
        question: "Sur quel problème repose Diffie-Hellman ?",
        options: ["La factorisation", "Le logarithme discret", "Les courbes elliptiques", "Les nombres premiers"],
        correct: 1,
        explanation: "Diffie-Hellman repose sur la difficulté du problème du logarithme discret dans un groupe fini."
      },
      {
        id: 2,
        question: "Diffie-Hellman permet à deux parties de :",
        options: ["Chiffrer des messages directement", "Établir un secret partagé sur un canal non sécurisé", "Signer des documents", "Stocker des mots de passe"],
        correct: 1,
        explanation: "DH permet de créer un secret commun sans jamais le transmettre, même sur un réseau non sécurisé."
      },
      {
        id: 3,
        question: "Diffie-Hellman seul fournit-il une authentification ?",
        options: ["Oui, toujours", "Non, il faut le combiner avec un autre mécanisme", "Oui, via les certificats intégrés", "Oui, via la clé publique"],
        correct: 1,
        explanation: "DH seul est vulnérable à l'attaque homme du milieu. Il doit être combiné avec une authentification."
      },
      {
        id: 4,
        question: "Dans quel protocole DH est-il utilisé pour la Perfect Forward Secrecy ?",
        options: ["HTTP", "FTP", "TLS/SSL", "SMTP"],
        correct: 2,
        explanation: "TLS utilise ECDHE (Diffie-Hellman éphémère sur courbes elliptiques) pour assurer la Perfect Forward Secrecy."
      }
    ]
  },
  md5: {
    questions: [
      {
        id: 1,
        question: "Quelle est la taille de la sortie de MD5 ?",
        options: ["64 bits", "128 bits", "160 bits", "256 bits"],
        correct: 1,
        explanation: "MD5 produit un condensé de 128 bits, représenté en 32 caractères hexadécimaux."
      },
      {
        id: 2,
        question: "Pourquoi MD5 ne doit-il PAS être utilisé pour la sécurité ?",
        options: ["Il est trop lent", "Des collisions peuvent être générées facilement", "Il produit des condensés trop courts", "Il n'est pas standard"],
        correct: 1,
        explanation: "Des chercheurs ont montré qu'on peut créer des collisions MD5 en quelques secondes sur un ordinateur ordinaire."
      },
      {
        id: 3,
        question: "MD5 peut encore être utilisé de façon acceptable pour :",
        options: ["Le stockage de mots de passe", "La vérification de certificats SSL", "Les checksums de fichiers non critiques", "Le chiffrement de données sensibles"],
        correct: 2,
        explanation: "Pour vérifier simplement l'intégrité d'un téléchargement non critique, MD5 reste acceptable car les collisions accidentelles sont rares."
      },
      {
        id: 4,
        question: "Quelle alternative à MD5 est recommandée pour la sécurité ?",
        options: ["SHA-1", "SHA-256 ou SHA-3", "CRC32", "Adler-32"],
        correct: 1,
        explanation: "SHA-256 (ou SHA-3) est recommandé en remplacement de MD5 pour les applications nécessitant une sécurité cryptographique."
      }
    ]
  },
  ecc: {
    questions: [
      {
        id: 1,
        question: "Quel est l'avantage principal d'ECC par rapport à RSA ?",
        options: ["ECC est plus ancien et plus stable", "ECC offre la même sécurité avec des clés plus petites", "ECC est plus facile à comprendre", "ECC est plus rapide à implémenter"],
        correct: 1,
        explanation: "Une clé ECC de 256 bits offre une sécurité comparable à une clé RSA de 3072 bits, ce qui réduit la charge de calcul."
      },
      {
        id: 2,
        question: "ECC est basé sur :",
        options: ["La factorisation de grands nombres", "Les logarithmes discrets sur courbes elliptiques", "Les nombres premiers de Fermat", "Les matrices de permutation"],
        correct: 1,
        explanation: "ECC exploite le problème du logarithme discret dans le groupe des points d'une courbe elliptique."
      },
      {
        id: 3,
        question: "Quelle courbe ECC utilise Bitcoin ?",
        options: ["P-256", "Curve25519", "secp256k1", "P-384"],
        correct: 2,
        explanation: "Bitcoin utilise la courbe secp256k1, définie par Standards for Efficient Cryptography (SEC)."
      },
      {
        id: 4,
        question: "Pour quel type d'appareils ECC est-il particulièrement adapté ?",
        options: ["Serveurs haut de gamme", "Appareils IoT et mobiles à ressources limitées", "Ordinateurs quantiques", "Supercalculateurs"],
        correct: 1,
        explanation: "ECC est idéal pour les appareils à faibles ressources car ses clés plus petites réduisent calculs, mémoire et énergie."
      }
    ]
  },
  bcrypt: {
    questions: [
      {
        id: 1,
        question: "Quel est le principal avantage de bcrypt pour les mots de passe ?",
        options: ["Il est très rapide", "Son facteur de coût est ajustable", "Il produit des condensés courts", "Il est basé sur AES"],
        correct: 1,
        explanation: "Le facteur de coût (work factor) de bcrypt peut être augmenté pour rester résistant malgré l'amélioration du matériel."
      },
      {
        id: 2,
        question: "Qu'est-ce qu'un 'sel' dans bcrypt ?",
        options: ["Un ingrédient secret de l'algorithme", "Une valeur aléatoire ajoutée au mot de passe avant hachage", "La clé de chiffrement", "Le nombre de tours"],
        correct: 1,
        explanation: "Le sel est une valeur aléatoire unique ajoutée à chaque mot de passe, empêchant les attaques par tables arc-en-ciel."
      },
      {
        id: 3,
        question: "Sur quel algorithme de chiffrement bcrypt est-il basé ?",
        options: ["AES", "DES", "Blowfish", "Twofish"],
        correct: 2,
        explanation: "bcrypt est basé sur le chiffrement Blowfish, modifié pour être coûteux en mémoire et résistant aux attaques GPU."
      },
      {
        id: 4,
        question: "Pourquoi bcrypt est-il résistant aux attaques par GPU ?",
        options: ["Il est propriétaire", "Son algorithme est secret", "Il est conçu pour être lent et gourmand en mémoire", "Il utilise des clés de 512 bits"],
        correct: 2,
        explanation: "bcrypt est intentionnellement lent et nécessite beaucoup de mémoire, ce qui rend les attaques massives par GPU non rentables."
      }
    ]
  }
};