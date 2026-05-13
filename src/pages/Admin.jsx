import { useState, useEffect } from "react";
import { getUsers, deleteUser as apiDeleteUser, updateUser, getJournal } from "@/api/api";
import { useAuth } from "@/lib/AuthContext";
import { Users, Trash2, Shield, Clock, RefreshCw, UserCheck, UserX, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function Admin() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("users");

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const [userList, logList] = await Promise.all([
        getUsers(),
        getJournal(),
      ]);
      setUsers(userList);
      setLogs(logList);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  async function handleDelete(username) {
    if (!confirm(`Supprimer l'utilisateur "${username}" ?`)) return;
    try {
      await apiDeleteUser(username);
      setUsers((prev) => prev.filter((u) => u.username !== username));
    } catch (e) {
      alert("Erreur : " + e.message);
    }
  }

  async function toggleRole(user) {
    const newRole = user.role === "admin" ? "user" : "admin";
    const newPassword = prompt(`Nouveau mot de passe pour changer le rôle de "${user.username}" (obligatoire) :`);
    if (!newPassword) return;
    try {
      await updateUser(user.username, newPassword);
      setUsers((prev) => prev.map((u) => u.username === user.username ? { ...u, role: newRole } : u));
    } catch (e) {
      alert("Erreur : " + e.message);
    }
  }

  const filteredUsers = users.filter((u) =>
    u.username?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredLogs = logs.filter((l) =>
    l.username?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (currentUser?.role !== "admin") {
    return (
      <div className="text-center py-20">
        <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-foreground font-semibold text-lg">Accès Refusé</p>
        <p className="text-muted-foreground mt-2">Cette page est réservée aux administrateurs.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Panneau Administrateur
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gérez les utilisateurs et consultez les journaux de connexion
          </p>
        </div>
        <Button onClick={loadAll} variant="outline" size="sm" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Actualiser
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total utilisateurs", value: users.length, icon: Users, color: "text-blue-500" },
          { label: "Administrateurs", value: users.filter((u) => u.role === "admin").length, icon: Shield, color: "text-violet-500" },
          { label: "Connexions totales", value: logs.length, icon: Clock, color: "text-emerald-500" },
          { label: "Utilisateurs actifs", value: new Set(logs.map((l) => l.username)).size, icon: UserCheck, color: "text-amber-500" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-card border border-border rounded-xl p-5">
              <Icon className={cn("h-5 w-5 mb-3", s.color)} />
              <div className="text-2xl font-bold text-foreground">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted p-1 rounded-xl w-fit">
        {[
          { id: "users", label: "Utilisateurs", icon: Users },
          { id: "logs", label: "Journal de connexion", icon: Clock },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                tab === t.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un utilisateur..."
          className="pl-10"
        />
      </div>

      {/* Users Tab */}
      {tab === "users" && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Utilisateur</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Rôle</th>
                  <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((user) => (
                  <tr key={user.username} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary text-sm">
                          {user.username[0].toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-foreground">{user.username}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant="outline" className={cn(
                        "text-xs font-medium border-0",
                        user.role === "admin" ? "bg-violet-100 text-violet-700" : "bg-blue-100 text-blue-700"
                      )}>
                        {user.role === "admin" ? "Admin" : "Utilisateur"}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {user.username !== currentUser?.username ? (
                          <>
                            <Button onClick={() => handleDelete(user.username)} variant="outline" size="sm"
                              className="text-xs h-8 px-3 gap-1 text-destructive hover:text-destructive hover:border-destructive/30">
                              <Trash2 className="h-3 w-3" /> Supprimer
                            </Button>
                          </>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">Vous</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr><td colSpan={3} className="px-5 py-10 text-center text-muted-foreground text-sm">Aucun utilisateur trouvé</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Logs Tab */}
      {tab === "logs" && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Utilisateur</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Rôle</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Action</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Statut</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Date et Heure</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredLogs.map((log, i) => (
                  <tr key={i} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-emerald-500" />
                        </div>
                        <span className="text-sm font-medium text-foreground">{log.username}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant="outline" className={cn("text-xs border-0",
                        log.role === "admin" ? "bg-violet-100 text-violet-700" : "bg-blue-100 text-blue-700")}>
                        {log.role}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{log.action}</td>
                    <td className="px-5 py-4">
                      <Badge variant="outline" className={cn("text-xs border-0",
                        log.statut === "succès" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                        {log.statut}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{log.heure}</td>
                  </tr>
                ))}
                {filteredLogs.length === 0 && (
                  <tr><td colSpan={5} className="px-5 py-10 text-center text-muted-foreground text-sm">Aucune connexion enregistrée</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}