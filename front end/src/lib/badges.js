import { getVisited, getScores } from "./progress";

// Global level badges (based on visited count + score)
export const LEVEL_BADGES = [
  { id: "beginner", label: "Débutant Crypto", emoji: "🌱", desc: "Vous avez commencé votre parcours crypto.", color: "bg-green-100 text-green-700 border-green-200", condition: () => true },
  { id: "apprentice", label: "Apprenti Crypto", emoji: "📚", desc: "3 algorithmes explorés avec un score ≥ 40%.", color: "bg-blue-100 text-blue-700 border-blue-200", condition: (v, avg) => v.length >= 3 && (avg === null || avg >= 40) },
  { id: "intermediate", label: "Intermédiaire", emoji: "⚡", desc: "6 algorithmes explorés avec un score moyen ≥ 60%.", color: "bg-purple-100 text-purple-700 border-purple-200", condition: (v, avg) => v.length >= 6 && avg !== null && avg >= 60 },
  { id: "advanced", label: "Avancé", emoji: "🔥", desc: "10 algorithmes explorés avec un score moyen ≥ 75%.", color: "bg-orange-100 text-orange-700 border-orange-200", condition: (v, avg) => v.length >= 10 && avg !== null && avg >= 75 },
  { id: "expert", label: "Expert Cryptographie", emoji: "🏆", desc: "80%+ des algorithmes explorés avec score moyen ≥ 85%.", color: "bg-amber-100 text-amber-700 border-amber-200", condition: (v, avg, total) => v.length >= total * 0.8 && avg !== null && avg >= 85 },
];

// Algorithm-specific badges
export const ALGO_BADGES = [
  { id: "expert_aes", label: "Expert AES", emoji: "🔐", desc: "Quiz AES complété avec 100%.", color: "bg-cyan-100 text-cyan-700 border-cyan-200", algoId: "aes", minScore: 100 },
  { id: "expert_rsa", label: "Expert RSA", emoji: "🗝️", desc: "Quiz RSA complété avec 100%.", color: "bg-indigo-100 text-indigo-700 border-indigo-200", algoId: "rsa", minScore: 100 },
  { id: "sha_master", label: "Maître SHA-256", emoji: "🧮", desc: "Quiz SHA-256 complété avec ≥ 75%.", color: "bg-violet-100 text-violet-700 border-violet-200", algoId: "sha256", minScore: 75 },
  { id: "dh_master", label: "Maître Diffie-Hellman", emoji: "🤝", desc: "Quiz Diffie-Hellman complété avec ≥ 75%.", color: "bg-teal-100 text-teal-700 border-teal-200", algoId: "diffie-hellman", minScore: 75 },
  { id: "sym_explorer", label: "Explorateur Symétrique", emoji: "🔄", desc: "3 algorithmes symétriques explorés.", color: "bg-rose-100 text-rose-700 border-rose-200", custom: true },
  { id: "asym_explorer", label: "Explorateur Asymétrique", emoji: "🔑", desc: "2 algorithmes asymétriques explorés.", color: "bg-sky-100 text-sky-700 border-sky-200", custom: true },
  { id: "hash_hunter", label: "Chasseur de Hachage", emoji: "🔍", desc: "Tous les algorithmes de hachage explorés.", color: "bg-emerald-100 text-emerald-700 border-emerald-200", custom: true },
  { id: "quiz_master", label: "Maître des Quiz", emoji: "🎯", desc: "5 quiz complétés avec ≥ 80% chacun.", color: "bg-pink-100 text-pink-700 border-pink-200", custom: true },
  { id: "perfectionist", label: "Perfectionniste", emoji: "💎", desc: "Un quiz complété avec 100%.", color: "bg-yellow-100 text-yellow-700 border-yellow-200", custom: true },
];

export function getEarnedBadges(algorithms) {
  const visited = getVisited();
  const scores = getScores();
  const scoreValues = Object.values(scores).map((s) => s.percent);
  const avg = scoreValues.length > 0
    ? Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length)
    : null;
  const total = algorithms.length;

  const symAlgos = algorithms.filter((a) => a.category === "Chiffrement Symétrique").map((a) => a.id);
  const asymAlgos = algorithms.filter((a) => a.category === "Chiffrement Asymétrique").map((a) => a.id);
  const hashAlgos = algorithms.filter((a) => a.category === "Hachage").map((a) => a.id);

  const earned = [];

  // Level badges
  for (const b of LEVEL_BADGES) {
    if (b.condition(visited, avg, total)) earned.push({ ...b, type: "level" });
  }

  // Algo-specific
  for (const b of ALGO_BADGES) {
    if (b.algoId && scores[b.algoId]?.percent >= b.minScore) {
      earned.push({ ...b, type: "algo" });
    } else if (b.custom) {
      if (b.id === "sym_explorer" && symAlgos.filter((id) => visited.includes(id)).length >= 3) {
        earned.push({ ...b, type: "algo" });
      } else if (b.id === "asym_explorer" && asymAlgos.filter((id) => visited.includes(id)).length >= 2) {
        earned.push({ ...b, type: "algo" });
      } else if (b.id === "hash_hunter" && hashAlgos.every((id) => visited.includes(id))) {
        earned.push({ ...b, type: "algo" });
      } else if (b.id === "quiz_master") {
        const highScores = scoreValues.filter((s) => s >= 80);
        if (highScores.length >= 5) earned.push({ ...b, type: "algo" });
      } else if (b.id === "perfectionist" && scoreValues.some((s) => s === 100)) {
        earned.push({ ...b, type: "algo" });
      }
    }
  }

  return earned;
}

export function getAllBadges() {
  return [...LEVEL_BADGES, ...ALGO_BADGES];
}