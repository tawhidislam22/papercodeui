'use client';

import { useEffect, useState, useCallback } from 'react';
import { Trophy, Award, Search, Trash2 } from 'lucide-react';
import { adminApi, type LeaderboardUser, type Certificate } from '@/lib/admin-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { getLevelFromXP } from '@/lib/api';

export default function AdminLeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Quick certificate form
  const [certUserId, setCertUserId] = useState<string | null>(null);
  const [certTitle, setCertTitle] = useState('');
  const [certDesc, setCertDesc] = useState('');
  const [issuing, setIssuing] = useState(false);
  const [allCerts, setAllCerts] = useState<Certificate[]>([]);

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([adminApi.leaderboard.list(), adminApi.certificates.list()])
      .then(([u, c]) => { setUsers(u); setAllCerts(c); })
      .catch(console.error).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  async function issueCert(userId: string) {
    if (!certTitle.trim()) return;
    setIssuing(true);
    try {
      await adminApi.certificates.issue({ userId, title: certTitle.trim(), description: certDesc.trim() });
      setCertUserId(null); setCertTitle(''); setCertDesc('');
      load();
    } catch (e) { console.error(e); }
    finally { setIssuing(false); }
  }

  async function revokeCert(id: string) {
    if (!confirm('Revoke this certificate?')) return;
    await adminApi.certificates.revoke(id);
    load();
  }

  const filtered = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.displayName.toLowerCase().includes(search.toLowerCase())
  );

  const getMedalColor = (index: number) => {
    if (index === 0) return 'bg-gradient-to-r from-amber-400 to-yellow-300 text-white';
    if (index === 1) return 'bg-gradient-to-r from-gray-300 to-gray-200 text-gray-700';
    if (index === 2) return 'bg-gradient-to-r from-orange-400 to-amber-300 text-white';
    return 'bg-gray-100 text-gray-500';
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leaderboard Management</h1>
          <p className="text-gray-500 mt-1">Top {users.length} performers · {allCerts.length} certificates issued</p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 h-10 rounded-xl" />
      </div>

      {/* Leaderboard */}
      <div className="space-y-3">
        {loading ? [...Array(5)].map((_, i) => <div key={i} className="h-20 bg-white rounded-2xl border border-gray-100 animate-pulse" />) :
          filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400"><Trophy className="w-10 h-10 mx-auto mb-2 opacity-40" />No users found</div>
          ) : filtered.map((user, index) => {
            const level = getLevelFromXP(user.xp);
            const userCertificates = allCerts.filter(c => c.userId === user.id);
            return (
              <div key={user.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center gap-4 p-4">
                  {/* Rank */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${getMedalColor(index)}`}>
                    {index < 3 ? ['🥇', '🥈', '🥉'][index] : index + 1}
                  </div>

                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold shrink-0">
                    {(user.displayName || user.username).charAt(0).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900 truncate">{user.displayName || user.username}</p>
                      <Badge className="bg-blue-50 text-blue-600 border-blue-100 text-xs">Lv. {level}</Badge>
                      {user.role === 'ADMIN' && <Badge className="bg-red-50 text-red-600 border-red-100 text-xs">Admin</Badge>}
                      {userCertificates.length > 0 && <Badge className="bg-amber-50 text-amber-600 border-amber-100 text-xs gap-1"><Award className="w-3 h-3" />{userCertificates.length}</Badge>}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span className="font-medium text-blue-600">{user.xp} XP</span>
                      <span>·</span>
                      <span>{user.streak} day streak</span>
                      <span>·</span>
                      <span>{user._count.submissions} submissions</span>
                      <span>·</span>
                      <span>{user._count.blogs} blogs</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="shrink-0">
                    <Button size="sm" variant="outline" onClick={() => { setCertUserId(certUserId === user.id ? null : user.id); setCertTitle(''); setCertDesc(''); }} className="gap-1 text-xs h-8 rounded-lg text-amber-600 hover:bg-amber-50">
                      <Award className="w-3 h-3" /> {certUserId === user.id ? 'Cancel' : 'Certificate'}
                    </Button>
                  </div>
                </div>

                {/* Quick cert form */}
                {certUserId === user.id && (
                  <div className="border-t border-gray-100 p-4 bg-amber-50/30 space-y-3">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <Input placeholder="Certificate title" value={certTitle} onChange={(e) => setCertTitle(e.target.value)} className="rounded-xl bg-white" />
                      <Input placeholder="Description (optional)" value={certDesc} onChange={(e) => setCertDesc(e.target.value)} className="rounded-xl bg-white" />
                    </div>
                    <Button onClick={() => issueCert(user.id)} disabled={issuing || !certTitle.trim()} size="sm" className="rounded-xl gap-2 text-white" style={{ background: 'linear-gradient(135deg,#f59e0b,#ef4444)' }}>
                      <Award className="w-3.5 h-3.5" /> {issuing ? 'Issuing...' : 'Issue Certificate'}
                    </Button>
                  </div>
                )}

                {/* User's certificates */}
                {userCertificates.length > 0 && certUserId === user.id && (
                  <div className="border-t border-gray-100 p-4 bg-gray-50/50 space-y-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Certificates</p>
                    {userCertificates.map((cert) => (
                      <div key={cert.id} className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-gray-100">
                        <Award className="w-4 h-4 text-amber-500 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{cert.title}</p>
                          <p className="text-xs text-gray-400">Issued {new Date(cert.issuedAt).toLocaleDateString()} by {cert.issuedBy}</p>
                        </div>
                        <button onClick={() => revokeCert(cert.id)} className="text-red-400 hover:text-red-600 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        }
      </div>
    </div>
  );
}
