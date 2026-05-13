import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, Lock, ArrowLeft, Star } from "lucide-react";
import { getEarnedBadges, getAllBadges } from "../lib/badges";
import { algorithms } from "../lib/algorithmsData";
import { cn } from "@/lib/utils";

export default function Achievements() {
  const [earned, setEarned] = useState([]);
  const all = getAllBadges();

  useEffect(() => {
    setEarned(getEarnedBadges(algorithms));
  }, []);

  const earnedIds = new Set(earned.map((b) => b.id));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" />
          Retour au tableau de bord
        </Link>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <Trophy className="h-7 w-7 text-amber-500" />
          Mes Succès
        </h1>
        <p className="text-muted-foreground mt-1">
          {earned.length} / {all.length} badges obtenus
        </p>
      </div>

      {/* Progress bar */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium text-foreground">Progression des badges</span>
          <span className="font-bold text-primary">{Math.round((earned.length / all.length) * 100)}%</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(earned.length / all.length) * 100}%` }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        </div>
      </div>

      {/* Earned */}
      {earned.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
            Badges obtenus ({earned.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {earned.map((badge, i) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className={cn("border rounded-2xl p-5 flex items-center gap-4 shadow-sm", badge.color)}
              >
                <div className="text-4xl">{badge.emoji}</div>
                <div>
                  <p className="font-bold text-sm">{badge.label}</p>
                  <p className="text-xs opacity-70 mt-0.5 leading-relaxed">{badge.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Locked badges */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <Lock className="h-5 w-5 text-muted-foreground" />
          Badges à débloquer ({all.length - earned.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {all.filter((b) => !earnedIds.has(b.id)).map((badge, i) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className="border border-border rounded-2xl p-5 flex items-center gap-4 bg-muted/30 opacity-60"
            >
              <div className="text-4xl grayscale">{badge.emoji}</div>
              <div>
                <p className="font-bold text-sm text-muted-foreground">{badge.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{badge.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {earned.length === 0 && (
        <div className="text-center py-12 bg-card border border-border rounded-xl">
          <div className="text-5xl mb-4">🎯</div>
          <p className="font-semibold text-foreground mb-2">Aucun badge encore obtenu</p>
          <p className="text-sm text-muted-foreground mb-4">Explorez des algorithmes et complétez des quiz pour débloquer vos premiers badges.</p>
          <Link to="/algorithms" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            Explorer les algorithmes
          </Link>
        </div>
      )}
    </div>
  );
}