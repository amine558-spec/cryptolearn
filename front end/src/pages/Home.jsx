import { Link } from "react-router-dom";
import { Lock, BookOpen, Play, ArrowRight, Shield, Hash, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { algorithms } from "../lib/algorithmsData";
import AlgorithmCard from "../components/AlgorithmCard";
import StatCard from "../components/StatCard";

export default function Home() {
  const featured = algorithms.slice(0, 4);

  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="relative overflow-hidden bg-card border border-border rounded-2xl p-8 md:p-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-full mb-4">
            <Shield className="h-3 w-3" />
            Plateforme Éducative
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 leading-tight">
            Apprenez la Cryptographie<br />
            <span className="text-primary">de manière interactive</span>
          </h1>
          
          <p className="text-muted-foreground max-w-lg mb-6 leading-relaxed">
            Explorez les algorithmes de chiffrement, comprenez leur fonctionnement 
            grâce à des vidéos explicatives et des ressources éducatives adaptées à votre niveau.
          </p>
          
          <div className="flex flex-wrap gap-3">
            <Link to="/algorithms">
              <Button className="h-11 px-6 gap-2">
                <Lock className="h-4 w-4" />
                Explorer les Algorithmes
              </Button>
            </Link>
            <Link to="/resources">
              <Button variant="outline" className="h-11 px-6 gap-2">
                <BookOpen className="h-4 w-4" />
                Ressources
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Lock} label="Algorithmes" value={algorithms.length} color="bg-blue-500" />
        <StatCard icon={Play} label="Vidéos" value={algorithms.length} color="bg-red-500" />
        <StatCard icon={Hash} label="Catégories" value="5" color="bg-green-500" />
        <StatCard icon={Key} label="Niveaux" value="3" color="bg-purple-500" />
      </div>

      {/* Featured Algorithms */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">Algorithmes Populaires</h2>
            <p className="text-sm text-muted-foreground mt-1">Commencez par les plus utilisés</p>
          </div>
          <Link to="/algorithms" className="text-sm font-medium text-primary flex items-center gap-1 hover:underline">
            Voir tout <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.map((algo) => (
            <AlgorithmCard key={algo.id} algorithm={algo} />
          ))}
        </div>
      </div>

      {/* Quick Access */}
      <div className="bg-card border border-border rounded-2xl p-8">
        <h2 className="text-xl font-bold text-foreground mb-2">Par où commencer ?</h2>
        <p className="text-sm text-muted-foreground mb-6">Suivez ce parcours pour un apprentissage progressif</p>
        
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { step: "01", title: "Les Bases", desc: "Commencez par MD5 et DES pour comprendre les concepts fondamentaux.", link: "/algorithms/md5" },
            { step: "02", title: "Intermédiaire", desc: "Explorez AES, SHA-256 et Diffie-Hellman pour les standards modernes.", link: "/algorithms/aes" },
            { step: "03", title: "Avancé", desc: "Plongez dans RSA et ECC pour la cryptographie asymétrique.", link: "/algorithms/rsa" },
          ].map((item) => (
            <Link
              key={item.step}
              to={item.link}
              className="group p-5 rounded-xl border border-border hover:border-primary/30 hover:shadow-sm transition-all"
            >
              <span className="text-3xl font-bold text-primary/20 group-hover:text-primary/40 transition-colors">{item.step}</span>
              <h3 className="font-semibold text-foreground mt-2 mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}