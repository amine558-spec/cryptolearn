import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    title: "1. Message → Blocs de 512 bits",
    desc: "Le message est découpé en blocs de 512 bits. Le dernier bloc est complété avec un padding spécifique.",
    render: () => (
      <div className="flex flex-col items-center gap-4 w-full max-w-sm">
        <div className="font-mono text-xs bg-primary/10 text-primary px-4 py-2 rounded-lg w-full text-center">
          "hello world" → 88 bits
        </div>
        <svg width="320" height="80" viewBox="0 0 320 80">
          {/* Bloc principal */}
          <motion.rect x={2} y={10} width={220} height={60} rx={8}
            fill="hsl(var(--primary)/0.15)" stroke="hsl(var(--primary))" strokeWidth={1.5}
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5 }} />
          <motion.text x={112} y={45} textAnchor="middle" fontSize="11" fontFamily="monospace"
            fill="hsl(var(--primary))" fontWeight="600"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            "hello world" (88 bits)
          </motion.text>
          {/* Padding */}
          <motion.rect x={226} y={10} width={90} height={60} rx={8}
            fill="hsl(var(--accent)/0.2)" stroke="hsl(var(--accent))" strokeWidth={1.5} strokeDasharray="4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} />
          <motion.text x={271} y={40} textAnchor="middle" fontSize="10" fontFamily="monospace"
            fill="hsl(var(--accent))" fontWeight="600"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
            Padding
          </motion.text>
          <motion.text x={271} y={55} textAnchor="middle" fontSize="9" fontFamily="monospace"
            fill="hsl(var(--accent))" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
            424 bits
          </motion.text>
        </svg>
        <p className="text-xs text-muted-foreground text-center">Total : 512 bits par bloc</p>
      </div>
    )
  },
  {
    title: "2. Valeurs initiales H0–H7",
    desc: "SHA-256 commence avec 8 valeurs de hachage initiales (H0 à H7) dérivées des racines carrées des premiers nombres premiers.",
    render: () => {
      const hvals = ["6a09e667","bb67ae85","3c6ef372","a54ff53a","510e527f","9b05688c","1f83d9ab","5be0cd19"];
      return (
        <div className="flex flex-col items-center gap-3">
          <div className="grid grid-cols-4 gap-2">
            {hvals.map((h, i) => (
              <motion.div key={i}
                initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-lg p-2 text-center"
              >
                <p className="text-xs text-muted-foreground font-medium">H{i}</p>
                <p className="text-xs font-mono text-primary font-bold mt-1">{h}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Dérivées de √2, √3, √5, √7, √11, √13, √17, √19</p>
        </div>
      );
    }
  },
  {
    title: "3. 64 Tours de Compression",
    desc: "Pour chaque tour, des opérations logiques (AND, XOR, rotation) mélangent les données avec les constantes K.",
    render: () => {
      const boxLabels = ["Σ0","Σ1","Ch","Maj","T1","T2","H+T1","H+T2"];
      return (
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-1 flex-wrap justify-center">
            {Array.from({length: 8}).map((_, i) => (
              <motion.div key={i}
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ delay: i * 0.08, type: "spring" }}
                className="w-14 h-10 bg-primary/10 border border-primary/30 rounded-md flex items-center justify-center"
              >
                <span className="text-xs font-mono font-bold text-primary">{boxLabels[i]}</span>
              </motion.div>
            ))}
          </div>
          <svg width="300" height="60" viewBox="0 0 300 60">
            {Array.from({length: 7}).map((_, i) => (
              <motion.line key={i}
                x1={18 + i * 37} y1={10} x2={18 + (i+1) * 37} y2={10}
                stroke="hsl(var(--primary))" strokeWidth={2}
                initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 0.8 + i * 0.05 }}
              />
            ))}
            <motion.text x={150} y={40} textAnchor="middle" fontSize="11"
              fill="hsl(var(--muted-foreground))" fontWeight="500"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
              × 64 tours = condensé final
            </motion.text>
          </svg>
        </div>
      );
    }
  },
  {
    title: "4. Condensé Final — 256 bits",
    desc: "Après les 64 tours, les 8 valeurs H sont concaténées pour former le condensé SHA-256 de 256 bits (64 hex).",
    render: () => {
      const hash = "b94d27b9934d3e08a52e52d7da7dabfac484efe04294e576b";
      return (
        <div className="flex flex-col items-center gap-4 w-full">
          <svg width="300" height="100" viewBox="0 0 300 100">
            {["H0","H1","H2","H3","H4","H5","H6","H7"].map((h, i) => (
              <g key={i}>
                <motion.rect x={i*36+4} y={4} width={32} height={40} rx={6}
                  fill="hsl(var(--primary)/0.15)" stroke="hsl(var(--primary))" strokeWidth={1.2}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }} />
                <motion.text x={i*36+20} y={30} textAnchor="middle" fontSize="9"
                  fontFamily="monospace" fill="hsl(var(--primary))" fontWeight="700"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i*0.1+0.2 }}>
                  {h}
                </motion.text>
                {i < 7 && (
                  <motion.text x={i*36+39} y={30} textAnchor="middle" fontSize="12"
                    fill="hsl(var(--muted-foreground))"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i*0.1+0.3 }}>
                    ‖
                  </motion.text>
                )}
              </g>
            ))}
            <motion.rect x={4} y={58} width={292} height={36} rx={8}
              fill="hsl(142 76% 36% / 0.15)" stroke="hsl(142 76% 36%)" strokeWidth={1.5}
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1, duration: 0.6 }} />
            <motion.text x={150} y={81} textAnchor="middle" fontSize="9"
              fontFamily="monospace" fill="hsl(142 76% 36%)" fontWeight="700"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
              {hash}...
            </motion.text>
          </svg>
          <p className="text-xs text-muted-foreground">H0‖H1‖H2‖H3‖H4‖H5‖H6‖H7 = 256 bits</p>
        </div>
      );
    }
  }
];

export default function SHA256Visualization() {
  const [step, setStep] = useState(0);
  const current = steps[step];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        {steps.map((s, i) => (
          <button key={i} onClick={() => setStep(i)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              i === step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}>
            Étape {i + 1}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step}
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="bg-muted/30 rounded-xl p-6 border border-border"
        >
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