const VISITED_KEY = "cl_visited";
const SCORES_KEY = "cl_scores";

export function getVisited() {
  try { return JSON.parse(localStorage.getItem(VISITED_KEY) || "[]"); }
  catch { return []; }
}

export function markVisited(id) {
  const visited = getVisited();
  if (!visited.includes(id)) {
    localStorage.setItem(VISITED_KEY, JSON.stringify([...visited, id]));
  }
}

export function getScores() {
  try { return JSON.parse(localStorage.getItem(SCORES_KEY) || "{}"); }
  catch { return {}; }
}

export function saveScore(algorithmId, score, total) {
  const scores = getScores();
  scores[algorithmId] = { score, total, percent: Math.round((score / total) * 100), date: new Date().toISOString() };
  localStorage.setItem(SCORES_KEY, JSON.stringify(scores));
}

export function getStats(totalAlgorithms) {
  const visited = getVisited();
  const scores = getScores();
  const scoreValues = Object.values(scores).map(s => s.percent);
  const avgScore = scoreValues.length > 0
    ? Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length)
    : null;
  const progressPercent = Math.round((visited.length / totalAlgorithms) * 100);

  let badge = { label: "Débutant", emoji: "🌱", color: "text-green-600", bg: "bg-green-50", border: "border-green-200", min: 0 };
  if (visited.length >= 3 && (avgScore === null || avgScore >= 40))
    badge = { label: "Apprenti", emoji: "📚", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", min: 3 };
  if (visited.length >= 6 && avgScore !== null && avgScore >= 60)
    badge = { label: "Intermédiaire", emoji: "⚡", color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200", min: 6 };
  if (visited.length >= 10 && avgScore !== null && avgScore >= 75)
    badge = { label: "Avancé", emoji: "🔥", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200", min: 10 };
  if (visited.length >= totalAlgorithms * 0.8 && avgScore !== null && avgScore >= 85)
    badge = { label: "Expert", emoji: "🏆", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", min: 15 };

  return { visited, scores, avgScore, progressPercent, badge, quizCount: scoreValues.length };
}