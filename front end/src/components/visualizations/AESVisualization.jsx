import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    title: "1. Texte clair → Bloc de 128 bits",
    desc: "Le message est découpé en blocs de 128 bits (16 octets), disposés dans une matrice 4×4.",
    render: () => (
      <div className="flex flex-col items-center gap-4">
        <div className="font-mono text-xs bg-muted px-4 py-2 rounded-lg text-muted-foreground">
          "HelloCryptoLearn!" → 16 octets
        </div>
        <svg width="200" height="200" viewBox="0 0 200 200">
          {Array.from({ length: 16 }).map((_, i) => {
            const row = Math.floor(i / 4), col = i % 4;
            const hex = ["48","65","6C","6C","6F","43","72","79","70","74","6F","4C","65","61","72","6E"][i];
            return (
              <g key={i}>
                <motion.rect
                  x={col * 48 + 4} y={row * 48 + 4}
                  width={44} height={44} rx={6}
                  fill="hsl(var(--primary)/0.15)" stroke="hsl(var(--primary))" strokeWidth={1.5}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                />
                <motion.text
                  x={col * 48 + 26} y={row * 48 + 30}
                  textAnchor="middle" fontSize="11" fontFamily="monospace"
                  fill="hsl(var(--primary))" fontWeight="600"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 + 0.2 }}
                >
                  {hex}
                </motion.text>
              </g>
            );
          })}
        </svg>
        <p className="text-xs text-muted-foreground">Matrice d'état 4×4 en hexadécimal</p>
      </div>
    )
  },
  {
    title: "2. SubBytes — Substitution non-linéaire",
    desc: "Chaque octet est remplacé par une valeur de la S-Box AES, introduisant la non-linéarité.",
    render: () => {
      const colors = ["#6366f1","#8b5cf6","#a78bfa","#7c3aed","#4f46e5","#818cf8","#c4b5fd","#6d28d9",
                      "#7c3aed","#5b21b6","#8b5cf6","#4338ca","#6366f1","#7c3aed","#a78bfa","#818cf8"];
      return (
        <div className="flex flex-col items-center gap-4">
          <svg width="200" height="200" viewBox="0 0 200 200">
            {Array.from({ length: 16 }).map((_, i) => {
              const row = Math.floor(i / 4), col = i % 4;
              return (
                <g key={i}>
                  <motion.rect
                    x={col * 48 + 4} y={row * 48 + 4} width={44} height={44} rx={6}
                    fill={colors[i]} opacity={0.85}
                    initial={{ rotateY: 0 }} animate={{ rotateY: 360 }}
                    transition={{ delay: i * 0.06, duration: 0.4 }}
                  />
                  <motion.text
                    x={col * 48 + 26} y={row * 48 + 30}
                    textAnchor="middle" fontSize="10" fontFamily="monospace"
                    fill="white" fontWeight="700"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.06 + 0.3 }}
                  >
                    S[x]
                  </motion.text>
                </g>
              );
            })}
          </svg>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="px-2 py-1 bg-muted rounded font-mono">48 → 52</span>
            <span>→</span>
            <span className="text-primary font-medium">S-Box lookup</span>
          </div>
        </div>
      );
    }
  },
  {
    title: "3. ShiftRows — Décalage des lignes",
    desc: "Chaque ligne de la matrice est décalée cycliquement vers la gauche d'un certain nombre de positions.",
    render: () => {
      const shifts = [0, 1, 2, 3];
      const colors = ["#3b82f6","#10b981","#f59e0b","#ef4444"];
      return (
        <div className="flex flex-col items-center gap-4">
          <svg width="240" height="200" viewBox="0 0 240 200">
            {shifts.map((shift, row) => (
              Array.from({ length: 4 }).map((_, col) => {
                const origCol = (col + shift) % 4;
                return (
                  <g key={`${row}-${col}`}>
                    <motion.rect
                      x={col * 56 + 4} y={row * 46 + 4} width={50} height={40} rx={6}
                      fill={colors[row]} opacity={0.8}
                      initial={{ x: origCol * 56 + 4 - (col * 56 + 4) }}
                      animate={{ x: 0 }}
                      transition={{ delay: 0.3 + row * 0.15, duration: 0.5, type: "spring" }}
                    />
                    <motion.text
                      x={col * 56 + 29} y={row * 46 + 28}
                      textAnchor="middle" fontSize="10" fontFamily="monospace"
                      fill="white" fontWeight="700"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 + row * 0.15 }}
                    >
                      {`R${row}C${col}`}
                    </motion.text>
                  </g>
                );
              })
            ))}
          </svg>
          <div className="flex gap-3 text-xs">
            {["Ligne 0: +0","Ligne 1: +1","Ligne 2: +2","Ligne 3: +3"].map((l, i) => (
              <span key={i} className="px-2 py-1 rounded text-white text-xs" style={{ background: colors[i] }}>{l}</span>
            ))}
          </div>
        </div>
      );
    }
  },
  {
    title: "4. AddRoundKey — XOR avec la sous-clé",
    desc: "La matrice est combinée avec la sous-clé du tour via une opération XOR bit à bit.",
    render: () => (
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-2">État</p>
            <svg width="90" height="90" viewBox="0 0 90 90">
              {Array.from({ length: 9 }).map((_, i) => (
                <motion.rect key={i} x={(i%3)*29+2} y={Math.floor(i/3)*29+2} width={27} height={27} rx={4}
                  fill="hsl(var(--primary)/0.2)" stroke="hsl(var(--primary))" strokeWidth={1.2}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} />
              ))}
            </svg>
          </div>
          <motion.div className="text-2xl font-bold text-primary"
            animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            ⊕
          </motion.div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-2">Sous-clé</p>
            <svg width="90" height="90" viewBox="0 0 90 90">
              {Array.from({ length: 9 }).map((_, i) => (
                <motion.rect key={i} x={(i%3)*29+2} y={Math.floor(i/3)*29+2} width={27} height={27} rx={4}
                  fill="hsl(var(--accent)/0.2)" stroke="hsl(var(--accent))" strokeWidth={1.2}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 + 0.3 }} />
              ))}
            </svg>
          </div>
          <div className="text-2xl font-bold text-muted-foreground">=</div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-2">Résultat</p>
            <svg width="90" height="90" viewBox="0 0 90 90">
              {Array.from({ length: 9 }).map((_, i) => (
                <motion.rect key={i} x={(i%3)*29+2} y={Math.floor(i/3)*29+2} width={27} height={27} rx={4}
                  fill="hsl(142 76% 36% / 0.25)" stroke="hsl(142 76% 36%)" strokeWidth={1.2}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 + 0.6 }} />
              ))}
            </svg>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">XOR octet par octet entre l'état et la sous-clé du tour</p>
      </div>
    )
  }
];

export default function AESVisualization() {
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