import { cn } from "@/lib/utils";

export default function CategoryFilter({ categories, selected, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat.name}
          onClick={() => onSelect(cat.name)}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
            selected === cat.name
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
          )}
        >
          {cat.name}
          <span className="ml-1.5 text-xs opacity-70">({cat.count})</span>
        </button>
      ))}
    </div>
  );
}