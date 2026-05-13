import { useState, useMemo } from "react";
import { algorithms, categories } from "../lib/algorithmsData";
import AlgorithmCard from "../components/AlgorithmCard";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";

export default function Algorithms() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tous");

  const filtered = useMemo(() => {
    return algorithms.filter((algo) => {
      const matchSearch = !search || 
        algo.name.toLowerCase().includes(search.toLowerCase()) ||
        algo.fullName.toLowerCase().includes(search.toLowerCase()) ||
        algo.description.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === "Tous" || algo.category === category;
      return matchSearch && matchCategory;
    });
  }, [search, category]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Algorithmes Cryptographiques</h1>
        <p className="text-muted-foreground mt-1">
          Explorez {algorithms.length} algorithmes avec vidéos et explications détaillées
        </p>
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Rechercher un algorithme (ex: AES, RSA, SHA...)" />
      
      <CategoryFilter categories={categories} selected={category} onSelect={setCategory} />

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((algo) => (
            <AlgorithmCard key={algo.id} algorithm={algo} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-card border border-border rounded-xl">
          <p className="text-muted-foreground">Aucun algorithme trouvé pour "{search}"</p>
        </div>
      )}
    </div>
  );
}