import datetime

journal = []

def ajouter_journal(username, role):
    maintenant = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    journal.append({
        "username": username,
        "role": role,
        "heure": maintenant,
        "action": "connexion",
        "statut": "succès"
    })
