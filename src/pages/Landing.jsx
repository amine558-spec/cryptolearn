/**
 * Landing.jsx — Page de connexion + inscription
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { Shield, Lock, Eye, EyeOff, AlertCircle, Loader2, UserPlus, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function registerUser(username, password) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, role: "user" }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Erreur inconnue" }));
    throw new Error(err.detail || "Erreur lors de l'inscription");
  }
  return res.json();
}

export default function Landing() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState("login"); // "login" | "register"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess("");
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    resetForm();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await login(username.trim(), password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Identifiants invalides.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    if (username.trim().length < 3) {
      setError("Le nom d'utilisateur doit contenir au moins 3 caractères.");
      return;
    }
    if (password.length < 4) {
      setError("Le mot de passe doit contenir au moins 4 caractères.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      await registerUser(username.trim(), password);
      setSuccess("Compte créé avec succès ! Vous pouvez maintenant vous connecter.");
      setTimeout(() => switchMode("login"), 2000);
    } catch (err) {
      setError(err.message || "Erreur lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-blue-600 mb-4 shadow-lg">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">CryptoLearn</h1>
          <p className="text-slate-400 mt-2">Apprenez la cryptographie de façon interactive</p>
        </div>

        {/* Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-xl">

          {/* Tab switcher */}
          <div className="flex gap-1 bg-slate-700/50 p-1 rounded-xl mb-6">
            <button
              onClick={() => switchMode("login")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === "login"
                  ? "bg-slate-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <LogIn className="h-4 w-4" />
              Connexion
            </button>
            <button
              onClick={() => switchMode("register")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === "register"
                  ? "bg-slate-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <UserPlus className="h-4 w-4" />
              Créer un compte
            </button>
          </div>

          {/* ── CONNEXION ── */}
          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Nom d'utilisateur</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ex: admin"
                  autoComplete="username"
                  className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Mot de passe</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />{error}
                </div>
              )}

              <Button type="submit" disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition">
                {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Connexion...</span> : "Se connecter"}
              </Button>

              {/* Comptes démo */}
              <div className="mt-4 pt-4 border-t border-slate-700">
                <p className="text-xs text-slate-500 text-center mb-3">Comptes de démonstration</p>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => { setUsername("admin"); setPassword("1234"); }}
                    className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg px-3 py-2 transition text-left">
                    <span className="block font-medium text-white">Admin</span>
                    <span className="text-slate-400">admin / 1234</span>
                  </button>
                  <button type="button" onClick={() => { setUsername("ahmed"); setPassword("abcd"); }}
                    className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg px-3 py-2 transition text-left">
                    <span className="block font-medium text-white">Utilisateur</span>
                    <span className="text-slate-400">ahmed / abcd</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ── INSCRIPTION ── */}
          {mode === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Nom d'utilisateur</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choisissez un nom d'utilisateur"
                  autoComplete="username"
                  className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Mot de passe</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Créez un mot de passe"
                    autoComplete="new-password"
                    className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Confirmer le mot de passe</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Répétez le mot de passe"
                  autoComplete="new-password"
                  className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              {/* Indicateur de force du mot de passe */}
              {password.length > 0 && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[
                      password.length >= 8,
                      /[A-Z]/.test(password),
                      /[0-9]/.test(password),
                      /[^a-zA-Z0-9]/.test(password),
                    ].map((ok, i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${ok ? "bg-green-500" : "bg-slate-600"}`} />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500">
                    Force : {
                      [password.length >= 8, /[A-Z]/.test(password), /[0-9]/.test(password), /[^a-zA-Z0-9]/.test(password)]
                        .filter(Boolean).length <= 1 ? "Très faible" :
                      [password.length >= 8, /[A-Z]/.test(password), /[0-9]/.test(password), /[^a-zA-Z0-9]/.test(password)]
                        .filter(Boolean).length === 2 ? "Faible" :
                      [password.length >= 8, /[A-Z]/.test(password), /[0-9]/.test(password), /[^a-zA-Z0-9]/.test(password)]
                        .filter(Boolean).length === 3 ? "Moyen" : "Fort"
                    }
                  </p>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />{error}
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 text-green-400 text-sm bg-green-400/10 border border-green-400/20 rounded-lg px-3 py-2">
                  ✅ {success}
                </div>
              )}

              <Button type="submit" disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition">
                {loading
                  ? <span className="flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Création...</span>
                  : "Créer mon compte"}
              </Button>

              <p className="text-xs text-slate-500 text-center">
                Le compte sera créé avec le rôle <span className="text-slate-300 font-medium">Utilisateur</span>.
                Seul un admin peut attribuer le rôle Admin.
              </p>
            </form>
          )}
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          CryptoLearn — Projet pédagogique de cryptographie
        </p>
      </div>
    </div>
  );
}