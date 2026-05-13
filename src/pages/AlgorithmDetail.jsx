import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Play, CheckCircle, Bookmark, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { algorithms } from "../lib/algorithmsData";
import { cn } from "@/lib/utils";
import AlgorithmQuiz from "../components/AlgorithmQuiz";
import AlgorithmVisualization from "../components/AlgorithmVisualization";
import CodeEditor from "../components/CodeEditor";
import CryptoTester from "../components/CryptoTester";
import { markVisited } from "../lib/progress";
import { quizzes } from "../lib/quizData";

const difficultyColor = {
  "Débutant": "bg-green-100 text-green-700",
  "Intermédiaire": "bg-amber-100 text-amber-700",
  "Avancé": "bg-red-100 text-red-700",
};

export default function AlgorithmDetail() {
  const { algorithmId } = useParams();
  const algorithm = algorithms.find((a) => a.id === algorithmId);

  useEffect(() => {
    if (algorithm) markVisited(algorithm.id);
  }, [algorithm]);

  if (!algorithm) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground mb-4">Algorithme non trouvé</p>
        <Link to="/algorithms">
          <Button variant="outline">Retour aux algorithmes</Button>
        </Link>
      </div>
    );
  }

  function exportPDF() {
    const { jsPDF } = window.jspdf || {};
    if (!jsPDF) { alert('jsPDF non disponible'); return; }
    const doc = new jsPDF();
    const margin = 15;
    const pageW = doc.internal.pageSize.getWidth();
    let y = margin;

    // Header
    doc.setFillColor(59, 130, 246);
    doc.rect(0, 0, pageW, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(algorithm.name, margin, 18);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(algorithm.fullName || '', margin, 28);
    doc.text(`Catégorie : ${algorithm.category} | Niveau : ${algorithm.difficulty}`, margin, 35);

    y = 55;
    doc.setTextColor(30, 30, 30);

    // Description
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('Description', margin, y);
    y += 7;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const descLines = doc.splitTextToSize(algorithm.longDescription || algorithm.description || '', pageW - margin * 2);
    doc.text(descLines, margin, y);
    y += descLines.length * 5 + 8;

    // Key points
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('Points Clés', margin, y);
    y += 7;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    (algorithm.keyPoints || []).forEach((point) => {
      const lines = doc.splitTextToSize(`• ${point}`, pageW - margin * 2 - 4);
      if (y + lines.length * 5 > 280) { doc.addPage(); y = margin; }
      doc.text(lines, margin + 2, y);
      y += lines.length * 5 + 3;
    });

    // Use cases
    if (algorithm.useCases?.length) {
      y += 4;
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text("Cas d'utilisation", margin, y);
      y += 7;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const useLine = doc.splitTextToSize(algorithm.useCases.join(' • '), pageW - margin * 2);
      doc.text(useLine, margin, y);
      y += useLine.length * 5 + 5;
    }

    // Footer
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(`CryptoLearn — Fiche ${algorithm.name} | Page ${i}/${totalPages}`, margin, 290);
    }

    doc.save(`CryptoLearn_${algorithm.name}.pdf`);
  }

  const related = algorithms
    .filter((a) => a.category === algorithm.category && a.id !== algorithm.id)
    .slice(0, 3);

  return (
    <div className="space-y-8">
      <Link
        to="/algorithms"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux algorithmes
      </Link>

      {/* Header */}
      <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
        <div className="flex flex-wrap items-start gap-4 mb-4">
          <div className={cn("h-14 w-14 rounded-xl flex items-center justify-center text-white font-mono font-bold text-lg", algorithm.color)}>
            {algorithm.name.substring(0, 2)}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">{algorithm.name}</h1>
                <Badge variant="outline" className={cn("text-xs border-0", difficultyColor[algorithm.difficulty])}>
                  {algorithm.difficulty}
                </Badge>
              </div>
              <button
                onClick={exportPDF}
                className="inline-flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium px-4 py-2 rounded-lg"
              >
                <Download className="h-4 w-4" />
                Exporter en PDF
              </button>
            </div>
            <p className="text-muted-foreground">{algorithm.fullName}</p>
            <Badge variant="outline" className="mt-2 text-xs">{algorithm.category}</Badge>
          </div>
        </div>
      </div>

      {/* Video */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-border flex items-center gap-2">
          <Play className="h-4 w-4 text-primary" />
          <h2 className="font-semibold text-foreground">Vidéo Explicative</h2>
        </div>
        <div className="aspect-video">
          <iframe
            src={algorithm.videoUrl}
            title={`Vidéo - ${algorithm.name}`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-foreground mb-3">Description Détaillée</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{algorithm.longDescription}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-foreground mb-4">Points Clés</h2>
            <div className="space-y-3">
              {algorithm.keyPoints.map((point, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Bookmark className="h-4 w-4 text-primary" />
              Cas d'Utilisation
            </h2>
            <div className="flex flex-wrap gap-2">
              {algorithm.useCases.map((use, i) => (
                <Badge key={i} variant="outline" className="text-xs">{use}</Badge>
              ))}
            </div>
          </div>

          {related.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-semibold text-foreground mb-4">Algorithmes Similaires</h2>
              <div className="space-y-3">
                {related.map((r) => (
                  <Link key={r.id} to={`/algorithms/${r.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group">
                    <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center text-white font-mono text-xs font-bold", r.color)}>
                      {r.name.substring(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{r.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{r.fullName}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="bg-primary/5 border border-primary/10 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-foreground mb-2">💡 Conseil d'étude</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Regardez la vidéo en entier, puis relisez les points clés. Essayez d'expliquer
              l'algorithme dans vos propres mots pour vérifier votre compréhension.
            </p>
          </div>
        </div>
      </div>

      {/* Visualization */}
      <AlgorithmVisualization algorithmId={algorithmId} algorithmName={algorithm.name} />

      {/* Code Editor */}
      <CodeEditor algorithmId={algorithmId} />

      {/* Crypto Tester */}
      <CryptoTester />

      {/* Quiz */}
      {quizzes[algorithmId] && (
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-foreground">Testez vos connaissances</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Répondez aux questions pour vérifier votre compréhension de {algorithm.name}
            </p>
          </div>
          <AlgorithmQuiz
            questions={quizzes[algorithmId].questions}
            algorithmName={algorithm.name}
            algorithmId={algorithmId}
          />
        </div>
      )}
    </div>
  );
}