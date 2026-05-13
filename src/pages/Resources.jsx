import { useState, useMemo } from "react";
import { resources } from "../lib/algorithmsData";
import ResourceCard from "../components/ResourceCard";
import SearchBar from "../components/SearchBar";

const types = ["Tous", "Article", "Vidéo", "Pratique", "Livre"];

export default function Resources() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("Tous");

  const filtered = useMemo(() => {
    return resources.filter((r) => {
      const matchSearch = !search ||
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.description.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === "Tous" || r.type === typeFilter;
      return matchSearch && matchType;
    });
  }, [search, typeFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Ressources Éducatives</h1>
        <p className="text-muted-foreground mt-1">
          Articles, vidéos, livres et exercices pratiques pour approfondir vos connaissances
        </p>
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Rechercher une ressource..." />

      <div className="flex flex-wrap gap-2">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => setTypeFilter(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              typeFilter === type
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-card border border-border rounded-xl">
          <p className="text-muted-foreground">Aucune ressource trouvée</p>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-muted/50 rounded-xl p-6 text-center">
        <p className="text-xs text-muted-foreground">
          Ces ressources sont fournies à des fins éducatives. Les liens externes pointent 
          vers des contenus tiers dont nous ne sommes pas responsables.
        </p>
      </div>
    </div>
  );
}