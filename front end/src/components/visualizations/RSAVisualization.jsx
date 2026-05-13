import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    title: "1. Génération des clés — Choisir p et q",
    desc: "On choisit deux grands nombres premiers p et q. Leur produit n = p × q forme le module RSA.",
    render: () => (
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-6">
          {[{label:"p", val:"61", color:"#6366f1"}, {label:"q", val:"53", color:"#8b5cf6"}].map((item, i) => (
            <motion.div key={i} className="flex flex-col items-center gap-2"
              initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.3, type: "spring" }}>
              <div className="w-20 h-20 rounded-full flex flex-col items-center justify-center border-2 text-white font-bold"
                style={{ backgroundColor: item.color, borderColor: item.color }}>
                <span className="text-xs">premier</span>
                <span className="text-2xl">{item.val}</span>
              </div>
              <span className="text-sm font-mono font-bold text-foreground">{item.label}</span>
            </motion.div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          className="flex items-center gap-3 bg-card border border-border rounded-xl px-6 py-3">
          <span className="font-mono text-sm">n = 61 × 53 =</span>
          <motion.span className="font-mono text-xl font-bold text-primary"
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1, type: "spring" }}>
            3233
          </motion.span>
        </motion.div>
      </div>
    )
  },
  {
    title: "2. Clé publique (e, n)",
    desc: "On choisit e tel que 1 < e < φ(n) et gcd(e, φ(n)) = 1. Ici φ(n) = 3120, e = 17.",
    render: () => (
      <div className="flex flex-col items-center gap-5">
        <motion.div className="bg-blue-50 border-2 border-blue-400 rounded-2xl p-6 text-center"
          initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", delay: 0.2 }}>
          <p className="text-xs text-blue-600 font-medium mb-1">🔓 Clé Publique</p>
          <p className="font-mono text-2xl font-bold text-blue-700">(e=17, n=3233)</p>
          <p className="text-xs text-blue-500 mt-1">Partagée avec tout le monde</p>
        </motion.div>
        <motion.div className="text-sm text-muted-foreground bg-muted/50 rounded-lg px-4 py-3 font-mono"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          Chiffrement : c = m<sup>17</sup> mod 3233
        </motion.div>
      </div>
    )
  },
  {
    title: "3. Clé privée (d, n)",
    desc: "d est calculé comme l'inverse modulaire de e. d × e ≡ 1 (mod φ(n)). Ici d = 2753.",
    render: () => (
      <div className="flex flex-col items-center gap-5">
        <motion.div className="bg-purple-50 border-2 border-purple-400 rounded-2xl p-6 text-center"
          initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", delay: 0.2 }}>
          <p className="text-xs text-purple-600 font-medium mb-1">🔐 Clé Privée</p>
          <p className="font-mono text-2xl font-bold text-purple-700">(d=2753, n=3233)</p>
          <p className="text-xs text-purple-500 mt-1">Gardée secrète</p>
        </motion.div>
        <motion.div className="text-sm text-muted-foreground bg-muted/50 rounded-lg px-4 py-3 font-mono"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          Déchiffrement : m = c<sup>2753</sup> mod 3233
        </motion.div>
      </div>
    )
  },
  {
    title: "4. Chiffrement & Déchiffrement",
    desc: "Alice chiffre avec la clé publique de Bob. Seul Bob peut déchiffrer avec sa clé privée.",
    render: () => (
      <div className="flex flex-col items-center gap-3 w-full">
        {[
          { from: "Alice", msg: "Message : 65", op: "65¹⁷ mod 3233", result: "2790 (chiffré)", color: "#3b82f6", arrow: "→ Bob" },
          { from: "Bob", msg: "Chiffré : 2790", op: "2790²⁷⁵³ mod 3233", result: "65 (déchiffré)", color: "#8b5cf6", arrow: "✓" },
        ].map((row, i) => (
          <motion.div key={i} className="flex items-center gap-2 w-full bg-card border border-border rounded-lg p-3"
            initial={{ x: i % 2 === 0 ? -30 : 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.4 }}>
            <span className="text-xs font-bold w-12" style={{ color: row.color }}>{row.from}</span>
            <span className="text-xs text-muted-foreground flex-1 font-mono">{row.msg}</span>
            <span className="text-xs font-mono text-foreground bg-muted px-2 py-1 rounded">{row.op}</span>
            <span className="text-xs" style={{ color: row.color }}>→</span>
            <span className="text-xs font-mono font-bold" style={{ color: row.color }}>{row.result}</span>
          </motion.div>
        ))}
      </div>
    )
  }
];

export default function RSAVisualization() {
  const [step, setStep] = useState(0);
  const current = steps[step];
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        {steps.map((_, i) => (
          <button key={i} onClick={() => setStep(i)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              i === step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}>Étape {i + 1}</button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={step}
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }} className="bg-muted/30 rounded-xl p-6 border border-border">
          <h4 className="font-semibold text-foreground text-sm mb-1">{current.title}</h4>
          <p className="text-xs text-muted-foreground mb-5 leading-relaxed">{current.desc}</p>
          <div className="flex justify-center">{current.render()}</div>
        </motion.div>
      </AnimatePresence>
      <div className="flex justify-between items-center">
        <Button variant="outline" size="sm" onClick={() => setStep(s => s - 1)} disabled={step === 0} className="gap-1">
          <ChevronLeft className="h-3 w-3" /> Précédent
        </Button>
        <span className="text-xs text-muted-foreground">{step + 1} / {steps.length}</span>
        <Button variant="outline" size="sm" onClick={() => setStep(s => s + 1)} disabled={step === steps.length - 1} className="gap-1">
          Suivant <ChevronRight className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}