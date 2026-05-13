import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, BookOpen, BarChart2, CheckCircle, Lock, ArrowRight, Target, Flame, Star, Heart } from "lucide-react";
import { getFavorites } from "../lib/favorites";
import { getEarnedBadges } from "../lib/badges";
import { getStats, getScores, getVisited } from "../lib/progress";
import { algorithms } from "../lib/algorithmsData";
import { cn } from "@/lib/utils";

const TOTAL = algorithms.length;

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-5 flex items-center gap-4"
    >
      <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    setStats(getStats(TOTAL));
  }, []);

  if (!stats) return null;

  const scores = getScores();
  const visited = getVisited();
  const earnedBadges = getEarnedBadges(algorithms);
  const favoriteIds = getFavorites();
  const favoriteAlgorithms = algorithms.filter((a) => favoriteIds.includes(a.id));

  const visitedAlgorithms = algorithms.filter(a => visited.includes(a.id));
  const notVisited = algorithms.filter(a => !visited.includes(a.id));

  // Next badge progress
  const nextBadgeThresholds = [0, 3, 6, 10, Math.ceil(TOTAL * 0.8)];
  const currentBadgeIdx = nextBadgeThresholds.filter(t => visited.length >= t).length - 1;
  const nextThreshold = nextBadgeThresholds[currentBadgeIdx + 1];
  const nextProgress = nextThreshold
    ? Math.round((visited.length / nextThreshold) * 100)
    : 100;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mon Tableau de Bord</h1>
        <p className="text-muted-foreground mt-1">Suivez votre progression en cryptographie</p>
      </div>

      {/* Badge principal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className={cn("border-2 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6", stats.badge.bg, stats.badge.border)}
      >
        <div className="text-7xl">{stats.badge.emoji}</div>
        <div className="flex-1 text-center md:text-left">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Niveau actuel</p>
          <h2 className={cn("text-3xl font-bold mb-2", stats.badge.color)}>{stats.badge.label}</h2>
          <p className="text-sm text-muted-foreground">
            {visited.length} algorithme{visited.length !== 1 ? "s" : ""} explorés •{" "}
            {stats.avgScore !== null ? `${stats.avgScore}% de score moyen` : "Aucun quiz complété"}
          </p>
        </div>
        {nextThreshold && (
          <div className="w-full md:w-48 text-center">
            <p className="text-xs text-muted-foreground mb-2">Prochain niveau : {nextThreshold} algo</p>
            <div className="h-2 bg-white/60 rounded-full overflow-hidden">
              <motion.div
                className={cn("h-full rounded-full", stats.badge.color.replace("text-", "bg-").replace("-600", "-400"))}
                initial={{ width: 0 }} animate={{ width: `${nextProgress}%` }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </div>
            <p className="text-xs font-bold mt-1">{visited.length} / {nextThreshold}</p>
          </div>
        )}
      </motion.div>

      {/* Favoris */}
      {favoriteAlgorithms.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-semibold text-foreground flex items-center gap-2 mb-4">
            <Heart className="h-5 w-5 text-red-500 fill-red-500" />
            Mes Favoris ({favoriteAlgorithms.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {favoriteAlgorithms.map((algo) => (
              <Link key={algo.id} to={`/algorithms/${algo.id}`}
                className="flex items-center gap-3 bg-muted/30 border border-border rounded-xl p-3 hover:border-red-200 hover:bg-red-50/30 transition-all group">
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center text-white font-mono font-bold text-xs shrink-0 ${algo.color}`}>
                  {algo.name.substring(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm group-hover:text-red-600 transition-colors">{algo.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{algo.category}</p>
                </div>
                <Heart className="h-3.5 w-3.5 text-red-400 fill-red-400 shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Badges rapides */}
      {earnedBadges.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
              Badges obtenus ({earnedBadges.length})
            </h2>
            <Link to="/achievements" className="text-xs text-primary hover:underline flex items-center gap-1">
              Voir tout <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="flex flex-wrap gap-3">
            {earnedBadges.slice(0, 6).map((badge) => (
              <div key={badge.id} className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium ${badge.color}`}>
                <span className="text-lg">{badge.emoji}</span>
                {badge.label}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={BookOpen} label="Algorithmes explorés" value={`${visited.length}/${TOTAL}`} color="bg-blue-500" />
        <StatCard icon={BarChart2} label="Score moyen" value={stats.avgScore !== null ? `${stats.avgScore}%` : "—"} sub={stats.quizCount > 0 ? `${stats.quizCount} quiz complété${stats.quizCount > 1 ? "s" : ""}` : "Aucun quiz"} color="bg-purple-500" />
        <StatCard icon={Target} label="Progression" value={`${stats.progressPercent}%`} color="bg-green-500" />
        <StatCard icon={Flame} label="Quiz complétés" value={stats.quizCount} color="bg-orange-500" />
      </div>

      {/* Barre de progression globale */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-foreground">Progression globale</h3>
          <span className="text-sm font-bold text-primary">{stats.progressPercent}%</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <motion.div className="h-full bg-primary rounded-full"
            initial={{ width: 0 }} animate={{ width: `${stats.progressPercent}%` }}
            transition={{ delay: 0.3, duration: 1 }} />
        </div>
        <p className="text-xs text-muted-foreground mt-2">{visited.length} / {TOTAL} algorithmes</p>
      </div>

      {/* Algorithmes avec scores */}
      {visitedAlgorithms.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Algorithmes explorés
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {visitedAlgorithms.map((algo, i) => {
              const scoreData = scores[algo.id];
              return (
                <motion.div key={algo.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}>
                  <Link to={`/algorithms/${algo.id}`}
                    className="flex items-center gap-3 bg-card border border-border rounded-xl p-4 hover:shadow-sm hover:border-primary/30 transition-all group">
                    <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center text-white font-mono font-bold text-sm shrink-0", algo.color)}>
                      {algo.name.substring(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">{algo.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{algo.category}</p>
                    </div>
                    {scoreData ? (
                      <div className={cn("text-center shrink-0",
                        scoreData.percent >= 75 ? "text-green-600" :
                        scoreData.percent >= 50 ? "text-amber-600" : "text-red-500")}>
                        <p className="text-lg font-bold">{scoreData.percent}%</p>
                        <p className="text-xs">quiz</p>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground shrink-0">Quiz →</span>
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Algorithmes à découvrir */}
      {notVisited.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Lock className="h-5 w-5 text-muted-foreground" />
            À découvrir ({notVisited.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {notVisited.map((algo, i) => (
              <motion.div key={algo.id}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}>
                <Link to={`/algorithms/${algo.id}`}
                  className="flex items-center gap-3 bg-muted/40 border border-border rounded-xl p-3 hover:bg-card hover:shadow-sm transition-all group">
                  <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center text-white font-mono font-bold text-xs shrink-0 opacity-60", algo.color)}>
                    {algo.name.substring(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-muted-foreground text-sm group-hover:text-foreground transition-colors truncate">{algo.name}</p>
                  </div>
                  <ArrowRight className="h-3 w-3 text-muted-foreground ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {visited.length === 0 && (
        <div className="text-center py-12 bg-card border border-border rounded-xl">
          <div className="text-4xl mb-3">🚀</div>
          <p className="font-semibold text-foreground mb-1">Commencez votre parcours !</p>
          <p className="text-sm text-muted-foreground mb-4">Explorez votre premier algorithme pour démarrer la progression.</p>
          <Link to="/algorithms" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            Explorer les algorithmes <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}