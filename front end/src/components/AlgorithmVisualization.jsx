import { useState } from "react";
import { BarChart2, ChevronDown, ChevronUp } from "lucide-react";
import AESVisualization from "./visualizations/AESVisualization";
import SHA256Visualization from "./visualizations/SHA256Visualization";
import RSAVisualization from "./visualizations/RSAVisualization";
import DHVisualization from "./visualizations/DHVisualization";

const visualizationMap = {
  aes: AESVisualization,
  sha256: SHA256Visualization,
  rsa: RSAVisualization,
  "diffie-hellman": DHVisualization,
};

export default function AlgorithmVisualization({ algorithmId, algorithmName }) {
  const [open, setOpen] = useState(true);
  const VisComp = visualizationMap[algorithmId];
  if (!VisComp) return null;

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-5 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <BarChart2 className="h-4 w-4 text-primary" />
          <h2 className="font-semibold text-foreground">Visualisation Interactive — {algorithmName}</h2>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>

      {open && (
        <div className="px-5 pb-6 border-t border-border">
          <p className="text-xs text-muted-foreground mt-4 mb-4">
            Naviguez entre les étapes pour visualiser le fonctionnement interne de l'algorithme.
          </p>
          <VisComp />
        </div>
      )}
    </div>
  );
}