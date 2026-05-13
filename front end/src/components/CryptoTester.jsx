/**
 * CryptoTester.jsx — Testeur de chiffrement relié au backend FastAPI
 * 
 * Les opérations sont envoyées au backend Python qui utilise vos vrais algorithmes.
 * Placez ce fichier dans :  Front end/src/components/CryptoTester.jsx
 */

import { useState } from "react";
import { Lock, Unlock, ArrowRight, RotateCcw, ChevronDown, ChevronUp, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { cipherText, hashText, checkPassword } from "@/api/api";
import { useAuth } from "@/lib/AuthContext";

const ALGORITHMS = {
  // ── Chiffrement ──────────────────────────────────────
  caesar: {
    label: "Chiffre de César",
    category: "cipher",
    params: [{ key: "shift", label: "Décalage (1-25)", type: "number", min: 1, max: 25, default: 13 }],
  },
  vigenere: {
    label: "Chiffre de Vigenère",
    category: "cipher",
    params: [{ key: "key", label: "Clé (lettres uniquement)", type: "text", default: "crypto" }],
  },
  rot13: {
    label: "ROT-13",
    category: "cipher",
    params: [],
  },
  base64: {
    label: "Base64",
    category: "cipher",
    params: [],
  },
  xor: {
    label: "XOR",
    category: "cipher",
    params: [{ key: "key", label: "Clé secrète", type: "text", default: "mysecretkey" }],
  },
  // ── Hachage ──────────────────────────────────────────
  sha256: {
    label: "SHA-256",
    category: "hash",
    params: [],
  },
  sha1: {
    label: "SHA-1",
    category: "hash",
    params: [],
  },
  bcrypt: {
    label: "bcrypt",
    category: "hash",
    params: [],
  },
  // ── Vérification mot de passe ─────────────────────────
  password_check: {
    label: "Vérifier un mot de passe",
    category: "check",
    params: [],
  },
};

export default function CryptoTester() {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [algoKey, setAlgoKey] = useState("caesar");
  const [params, setParams] = useState({ shift: 13, key: "mysecretkey" });
  const [input, setInput] = useState("Bonjour le Monde!");
  const [mode, setMode] = useState("encrypt");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const algo = ALGORITHMS[algoKey];

  async function process() {
    if (!isAuthenticated) {
      setError("Vous devez être connecté pour utiliser le testeur.");
      return;
    }
    setError("");
    setResult("");
    setLoading(true);
    try {
      if (algo.category === "cipher") {
        const res = await cipherText(input, algoKey, mode, params);
        setResult(res.result);
      } else if (algo.category === "hash") {
        const res = await hashText(input, algoKey);
        setResult(res.result);
      } else if (algo.category === "check") {
        const res = await checkPassword(input);
        const lines = [
          `Force : ${res.strength} (${res.score}/5)`,
          ...(res.issues.length ? ["", "Problèmes :"] : ["", "✅ Mot de passe fort !"]),
          ...res.issues.map(i => `• ${i}`),
        ];
        setResult(lines.join("\n"));
      }
    } catch (e) {
      setError(e.message || "Erreur lors de l'appel au backend.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setInput("Bonjour le Monde!");
    setResult("");
    setError("");
  }

  const isCipher = algo.category === "cipher";
  const isHash = algo.category === "hash";
  const isCheck = algo.category === "check";

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* Header toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
            <Lock className="h-5 w-5 text-white" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-foreground">Testeur de Chiffrement / Déchiffrement</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Server className="h-3 w-3" />
              Propulsé par le backend Python
            </p>
          </div>
        </div>
        {open ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
      </button>

      {open && (
        <div className="border-t border-border p-5 space-y-4">
          {!isAuthenticated && (
            <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-lg px-4 py-3">
              ⚠️ Connectez-vous pour utiliser le testeur relié au backend.
            </div>
          )}

          {/* Selector */}
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[180px]">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Algorithme</label>
              <select
                value={algoKey}
                onChange={(e) => { setAlgoKey(e.target.value); setResult(""); setError(""); }}
                className="w-full text-sm bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <optgroup label="Chiffrement">
                  {Object.entries(ALGORITHMS).filter(([, a]) => a.category === "cipher").map(([k, a]) => (
                    <option key={k} value={k}>{a.label}</option>
                  ))}
                </optgroup>
                <optgroup label="Hachage">
                  {Object.entries(ALGORITHMS).filter(([, a]) => a.category === "hash").map(([k, a]) => (
                    <option key={k} value={k}>{a.label}</option>
                  ))}
                </optgroup>
                <optgroup label="Outils">
                  {Object.entries(ALGORITHMS).filter(([, a]) => a.category === "check").map(([k, a]) => (
                    <option key={k} value={k}>{a.label}</option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Mode encrypt/decrypt (seulement pour cipher) */}
            {isCipher && (
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Mode</label>
                <div className="flex gap-1 bg-muted p-1 rounded-lg">
                  <button
                    onClick={() => { setMode("encrypt"); setResult(""); }}
                    className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                      mode === "encrypt" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground")}
                  >
                    <Lock className="h-3 w-3" /> Chiffrer
                  </button>
                  <button
                    onClick={() => { setMode("decrypt"); setResult(""); }}
                    className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                      mode === "decrypt" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground")}
                  >
                    <Unlock className="h-3 w-3" /> Déchiffrer
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Params */}
          {algo.params.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {algo.params.map((param) => (
                <div key={param.key} className="min-w-[160px]">
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{param.label}</label>
                  <input
                    type={param.type}
                    min={param.min}
                    max={param.max}
                    value={params[param.key] ?? param.default}
                    onChange={(e) => setParams((p) => ({ ...p, [param.key]: e.target.value }))}
                    className="w-full text-sm bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Input / Output */}
          <div className="grid md:grid-cols-2 gap-4 items-start">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                {isCheck ? "Mot de passe à vérifier" : isCipher && mode === "encrypt" ? "Texte clair" : isHash ? "Texte à hacher" : "Texte chiffré"}
              </label>
              <textarea
                value={input}
                onChange={(e) => { setInput(e.target.value); setResult(""); }}
                rows={5}
                className="w-full text-sm bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none font-mono"
                placeholder="Entrez votre texte..."
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-muted-foreground">
                  {isCheck ? "Résultat de l'analyse" : isHash ? "Empreinte (hash)" : mode === "encrypt" ? "Texte chiffré" : "Texte déchiffré"}
                </label>
                {result && isCipher && (
                  <button
                    onClick={() => { setInput(result); setResult(""); setMode(mode === "encrypt" ? "decrypt" : "encrypt"); }}
                    className="text-xs text-primary hover:underline"
                  >
                    Utiliser comme entrée
                  </button>
                )}
              </div>
              <div className={cn(
                "min-h-[120px] rounded-lg border px-3 py-2 text-sm font-mono whitespace-pre-wrap break-all",
                result ? "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-700 dark:text-emerald-300" :
                  error ? "bg-red-50 border-red-200 text-red-700" :
                  "bg-muted/30 border-border text-muted-foreground"
              )}>
                {loading ? "⏳ Traitement en cours..." : result || error || "Le résultat apparaîtra ici..."}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={process} disabled={loading || !isAuthenticated} className="gap-2 flex-1">
              <ArrowRight className="h-4 w-4" />
              {loading ? "En cours..." : isCheck ? "Analyser" : isHash ? "Hacher" : mode === "encrypt" ? "Chiffrer" : "Déchiffrer"}
            </Button>
            <Button onClick={reset} variant="outline" size="icon">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
