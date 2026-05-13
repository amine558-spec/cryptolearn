import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    title: "1. Paramètres publics partagés",
    desc: "Alice et Bob conviennent publiquement d'un nombre premier p et d'un générateur g. Ces valeurs sont connues de tous.",
    render: () => (
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-6">
          {[{label:"p (premier)", val:"23"}, {label:"g (générateur)", val:"5"}].map((item, i) => (
            <motion.div key={i} className="bg-card border-2 border-primary/40 rounded-xl p-4 text-center min-w-[120px]"
              initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.3, type: "spring" }}>
              <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
              <p className="text-3xl font-bold font-mono text-primary">{item.val}</p>
              <p className="text-xs text-muted-foreground mt-1">Public</p>
            </motion.div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          className="text-xs text-muted-foreground bg-muted/50 rounded-lg px-4 py-2">
          Transmis en clair sur le réseau — pas de secret ici
        </motion.div>
      </div>
    )
  },
  {
    title: "2. Secrets privés d'Alice et Bob",
    desc: "Alice choisit un secret privé a=6, Bob choisit b=15. Ces valeurs ne sont JAMAIS partagées.",
    render: () => (
      <div className="flex items-center gap-8">
        {[
          {name:"Alice", secret:"a = 6", pub:"A = 5⁶ mod 23 = 8", color:"#3b82f6"},
          {name:"Bob", secret:"b = 15", pub:"B = 5¹⁵ mod 23 = 19", color:"#8b5cf6"},
        ].map((p, i) => (
          <motion.div key={i} className="flex flex-col items-center gap-3"
            initial={{ x: i === 0 ? -30 : 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.3, type: "spring" }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: p.color }}>{p.name[0]}</div>
            <p className="text-sm font-bold" style={{ color: p.color }}>{p.name}</p>
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-center">
              <p className="text-xs text-red-500 font-medium">🔒 Secret</p>
              <p className="font-mono text-sm font-bold text-red-700">{p.secret}</p>
            </div>
            <div className="bg-card border border-border rounded-lg px-3 py-2 text-center">
              <p className="text-xs text-muted-foreground">Clé publique</p>
              <p className="font-mono text-xs font-bold text-foreground">{p.pub}</p>
            </div>
          </motion.div>
        ))}
      </div>
    )
  },
  {
    title: "3. Échange des clés publiques",
    desc: "Alice envoie A=8 à Bob, et Bob envoie B=19 à Alice. Ces valeurs transitent en clair sur le réseau.",
    render: () => (
      <div className="flex flex-col items-center gap-4 w-full">
        <svg width="300" height="80" viewBox="0 0 300 80">
          <motion.circle cx={30} cy={40} r={25} fill="#3b82f6"
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }} />
          <motion.text x={30} y={45} textAnchor="middle" fill="white" fontSize="14" fontWeight="bold"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>A</motion.text>
          <motion.circle cx={270} cy={40} r={25} fill="#8b5cf6"
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }} />
          <motion.text x={270} y={45} textAnchor="middle" fill="white" fontSize="14" fontWeight="bold"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>B</motion.text>
          {/* Arrow Alice → Bob (A=8) */}
          <motion.line x1={60} y1={30} x2={240} y2={30} stroke="#3b82f6" strokeWidth={2}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 0.6 }} />
          <motion.text x={150} y={22} textAnchor="middle" fontSize="11" fill="#3b82f6" fontWeight="600"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>A = 8 →</motion.text>
          {/* Arrow Bob → Alice (B=19) */}
          <motion.line x1={240} y1={52} x2={60} y2={52} stroke="#8b5cf6" strokeWidth={2}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.8, duration: 0.6 }} />
          <motion.text x={150} y={68} textAnchor="middle" fontSize="11" fill="#8b5cf6" fontWeight="600"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>← B = 19</motion.text>
        </svg>
        <p className="text-xs text-muted-foreground text-center">Même si un attaquant voit A et B, il ne peut pas calculer le secret facilement</p>
      </div>
    )
  },
  {
    title: "4. Secret partagé identique",
    desc: "Alice et Bob calculent chacun le même secret partagé S = 2, sans jamais l'avoir transmis !",
    render: () => (
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-6">
          {[
            {name:"Alice", calc:"S = 19⁶ mod 23 = 2", color:"#3b82f6"},
            {name:"Bob", calc:"S = 8¹⁵ mod 23 = 2", color:"#8b5cf6"},
          ].map((p, i) => (
            <motion.div key={i} className="flex flex-col items-center gap-2 text-center"
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.3 }}>
              <p className="text-sm font-bold" style={{ color: p.color }}>{p.name}</p>
              <div className="bg-card border border-border rounded-lg px-3 py-2">
                <p className="font-mono text-xs text-muted-foreground">{p.calc}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div className="bg-green-50 border-2 border-green-400 rounded-2xl px-8 py-4 text-center"
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8, type: "spring" }}>
          <p className="text-xs text-green-600 font-medium mb-1">🎉 Secret partagé</p>
          <p className="font-mono text-4xl font-bold text-green-700">S = 2</p>
          <p className="text-xs text-green-500 mt-1">Jamais transmis sur le réseau</p>
        </motion.div>
      </div>
    )
  }
];

export default function DHVisualization() {
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