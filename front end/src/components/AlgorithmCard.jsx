import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { isFavorite, toggleFavorite } from "../lib/favorites";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const difficultyColor = {
  "Débutant": "bg-green-100 text-green-700",
  "Intermédiaire": "bg-amber-100 text-amber-700",
  "Avancé": "bg-red-100 text-red-700",
};

export default function AlgorithmCard({ algorithm, onFavoriteChange }) {
  const [fav, setFav] = useState(false);

  useEffect(() => { setFav(isFavorite(algorithm.id)); }, [algorithm.id]);

  function handleFav(e) {
    e.preventDefault();
    e.stopPropagation();
    const next = toggleFavorite(algorithm.id);
    setFav(next);
    onFavoriteChange?.();
  }

  return (
    <Link
      to={`/algorithms/${algorithm.id}`}
      className="group block bg-card border border-border rounded-xl p-5 hover:shadow-md hover:border-primary/30 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center text-white font-mono font-bold text-sm", algorithm.color)}>
          {algorithm.name.substring(0, 2)}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleFav}
            className={cn("h-7 w-7 rounded-full flex items-center justify-center transition-colors",
              fav ? "text-red-500 bg-red-50 hover:bg-red-100" : "text-muted-foreground hover:text-red-400 hover:bg-red-50")}
          >
            <Heart className={cn("h-3.5 w-3.5", fav && "fill-red-500")} />
          </button>
          <Badge variant="outline" className={cn("text-xs font-medium border-0", difficultyColor[algorithm.difficulty])}>
          {algorithm.difficulty}
        </Badge>
        </div>
      </div>

      <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
        {algorithm.name}
      </h3>
      <p className="text-xs text-muted-foreground mb-3">{algorithm.category}</p>
      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">
        {algorithm.description}
      </p>

      <div className="flex items-center text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Voir les détails
        <ArrowRight className="h-3 w-3 ml-1" />
      </div>
    </Link>
  );
}