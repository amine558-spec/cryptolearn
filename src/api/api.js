/**
 * api.js — Service frontend pour communiquer avec le backend FastAPI
 * 
 * Remplace/complète base44Client.js pour les opérations crypto locales.
 * Placez ce fichier dans :  Front end/src/api/api.js
 */

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────

/** Récupère le token depuis le localStorage */
function getToken() {
  return localStorage.getItem("crypto_token");
}

/** Sauvegarde le token dans le localStorage */
function saveToken(token) {
  localStorage.setItem("crypto_token", token);
}

/** Supprime le token du localStorage */
function removeToken() {
  localStorage.removeItem("crypto_token");
}

/** Effectue une requête HTTP vers le backend */
async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Erreur inconnue" }));
    throw new Error(error.detail || `Erreur HTTP ${response.status}`);
  }

  return response.json();
}

// ─────────────────────────────────────────────────────────
// Auth
// ─────────────────────────────────────────────────────────

/** Connexion — retourne { access_token, username, role } */
export async function login(username, password) {
  const data = await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  saveToken(data.access_token);
  return data;
}

/** Déconnexion */
export async function logout() {
  try {
    await request("/api/auth/logout", { method: "POST" });
  } finally {
    removeToken();
  }
}

/** Récupère l'utilisateur courant */
export async function getMe() {
  return request("/api/auth/me");
}

/** Vérifie si un token est présent (utilisateur potentiellement connecté) */
export function isLoggedIn() {
  return !!getToken();
}

// ─────────────────────────────────────────────────────────
// Utilisateurs (admin)
// ─────────────────────────────────────────────────────────

export async function getUsers() {
  return request("/api/users");
}

export async function createUser(username, password, role = "user") {
  return request("/api/users", {
    method: "POST",
    body: JSON.stringify({ username, password, role }),
  });
}

export async function updateUser(username, new_password) {
  return request(`/api/users/${username}`, {
    method: "PUT",
    body: JSON.stringify({ new_password }),
  });
}

export async function deleteUser(username) {
  return request(`/api/users/${username}`, { method: "DELETE" });
}

// ─────────────────────────────────────────────────────────
// Journal
// ─────────────────────────────────────────────────────────

export async function getJournal() {
  return request("/api/journal");
}

// ─────────────────────────────────────────────────────────
// Chiffrement / Déchiffrement
// ─────────────────────────────────────────────────────────

/**
 * Chiffre ou déchiffre un texte via le backend.
 * @param {string} text       - Texte à traiter
 * @param {string} algorithm  - "caesar" | "vigenere" | "rot13" | "base64" | "xor"
 * @param {string} mode       - "encrypt" | "decrypt"
 * @param {object} params     - Paramètres supplémentaires (ex: { shift: 13 })
 * @returns {Promise<{result: string}>}
 */
export async function cipherText(text, algorithm, mode = "encrypt", params = {}) {
  return request("/api/crypto/cipher", {
    method: "POST",
    body: JSON.stringify({ text, algorithm, mode, params }),
  });
}

// ─────────────────────────────────────────────────────────
// Hachage
// ─────────────────────────────────────────────────────────

/**
 * Hash un texte avec l'algorithme choisi.
 * @param {string} text       - Texte à hacher
 * @param {string} algorithm  - "sha256" | "sha1" | "bcrypt" | "md5"
 * @returns {Promise<{result: string}>}
 */
export async function hashText(text, algorithm) {
  return request("/api/crypto/hash", {
    method: "POST",
    body: JSON.stringify({ text, algorithm }),
  });
}

// ─────────────────────────────────────────────────────────
// Vérification de mot de passe
// ─────────────────────────────────────────────────────────

/**
 * Vérifie la complexité d'un mot de passe.
 * @param {string} password
 * @returns {Promise<{score, strength, is_strong, issues}>}
 */
export async function checkPassword(password) {
  return request("/api/crypto/check-password", {
    method: "POST",
    body: JSON.stringify({ password }),
  });
}

// ─────────────────────────────────────────────────────────
// Santé de l'API
// ─────────────────────────────────────────────────────────

export async function healthCheck() {
  return request("/api/health");
}
