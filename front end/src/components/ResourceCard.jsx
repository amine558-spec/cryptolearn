import { BookOpen, Play, Code, Book, Shield, Trophy, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const iconMap = {
  BookOpen, Play, Code, Book, Shield, Trophy,
};

const typeColor = {
  "Article": "bg-blue-100 text-blue-700",
  "Vidéo": "bg-red-100 text-red-700",
  "Pratique": "bg-green-100 text-green-700",
  "Livre": "bg-purple-100 text-purple-700",
};

const difficultyColor = {
  "Débutant": "bg-green-100 text-green-700",
  "Intermédiaire": "bg-amber-100 text-amber-700",
  "Avancé": "bg-red-100 text-red-700",
};

export default function ResourceCard({ resource }) {
  const Icon = iconMap[resource.icon] || BookOpen;

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-card border border-border rounded-xl p-5 hover:shadow-md hover:border-primary/30 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className={cn("text-xs border-0", typeColor[resource.type])}>
            {resource.type}
          </Badge>
          <Badge variant="outline" className={cn("text-xs border-0", difficultyColor[resource.difficulty])}>
            {resource.difficulty}
          </Badge>
        </div>
      </div>

      <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
        {resource.title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
        {resource.description}
      </p>

      <div className="flex items-center text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
        Ouvrir la ressource
        <ExternalLink className="h-3 w-3 ml-1" />
      </div>
    </a>
  );
}