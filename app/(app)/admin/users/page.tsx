'use client';

import { useEffect, useState, useCallback } from 'react';
import { Trash2, Shield, ShieldOff, Search, Users, Award, X } from 'lucide-react';
import { adminApi, type AdminUser, type Certificate } from '@/lib/admin-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const ROLE_COLORS: Record<string, string> = {
  ADMIN: 'bg-red-50 text-red-700 border-red-100',
  MODERATOR: 'bg-purple-50 text-purple-700 border-purple-100',
  AUTHOR: 'bg-blue-50 text-blue-700 border-blue-100',
  USER: 'bg-gray-50 text-gray-600 border-gray-100',
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Certificate modal state
  const [certUser, setCertUser] = useState<AdminUser | null>(null);
  const [certTitle, setCertTitle] = useState('');
  const [certDesc, setCertDesc] = useState('');
  const [issuing, setIssuing] = useState(false);
  const [userCerts, setUserCerts] = useState<Certificate[]>([]);

  const load = useCallback(() => {
    setLoading(true);
    adminApi.users.list().then(setUsers).catch(console.error).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  async function toggleRole(user: AdminUser) {
    try {
      const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
      await adminApi.users.update(user.id, { role: newRole });
      toast.success(`Role updated to ${newRole}`);
      load();
    } catch { toast.error('Failed to update role'); }
  }

  async function removeUser(id: string) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await adminApi.users.remove(id);
      toast.success('User deleted');
      load();
    } catch { toast.error('Failed to delete user'); }
  }

  async function openCertModal(user: AdminUser) {
    setCertUser(user);
    setCertTitle('');
    setCertDesc('');
    try {
      const certs = await adminApi.certificates.listForUser(user.id);
      setUserCerts(certs);
    } catch { setUserCerts([]); }
  }

  async function issueCertificate() {
    if (!certUser || !certTitle.trim()) return;
    setIssuing(true);
    try {
      await adminApi.certificates.issue({ userId: certUser.id, title: certTitle.trim(), description: certDesc.trim() });
      toast.success('Certificate issued');
      setCertTitle('');
      setCertDesc('');
      const certs = await adminApi.certificates.listForUser(certUser.id);
      setUserCerts(certs);
    } catch (e) { toast.error('Failed to issue certificate'); }
    finally { setIssuing(false); }
  }

  async function revokeCert(id: string) {
    if (!confirm('Revoke this certificate?')) return;
    try {
      await adminApi.certificates.revoke(id);
      toast.success('Certificate revoked');
      if (certUser) {
        const certs = await adminApi.certificates.listForUser(certUser.id);
        setUserCerts(certs);
      }
    } catch { toast.error('Failed to revoke certificate'); }
  }

  const filtered = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.displayName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-500 mt-1">{users.length} total users</p>
        </div>
      </div>
      <div className="relative max-w-sm mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 h-10 rounded-xl" />
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-4 py-3 font-semibold text-gray-600">User</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Email</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Role</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-600">XP</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-600">Submissions</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? [...Array(5)].map((_, i) => (<tr key={i} className="border-b border-gray-50"><td colSpan={6} className="px-4 py-4"><div className="h-5 bg-gray-100 rounded animate-pulse" /></td></tr>))
            : filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400"><Users className="w-8 h-8 mx-auto mb-2 opacity-40" />No users found</td></tr>
            ) : filtered.map((user) => (
              <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3"><p className="font-medium text-gray-900">{user.displayName || user.username}</p><p className="text-xs text-gray-400">@{user.username}</p></td>
                <td className="px-4 py-3 text-gray-600">{user.email}</td>
                <td className="px-4 py-3"><Badge className={`text-xs ${ROLE_COLORS[user.role] || ROLE_COLORS.USER}`}>{user.role}</Badge></td>
                <td className="px-4 py-3 text-center font-medium text-gray-700">{user.xp}</td>
                <td className="px-4 py-3 text-center text-gray-600">{user._count.submissions}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Button size="sm" variant="outline" onClick={() => openCertModal(user)} className="gap-1 text-xs h-8 rounded-lg text-amber-600 hover:text-amber-700 hover:bg-amber-50" title="Issue Certificate">
                      <Award className="w-3 h-3" /> Certificate
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => toggleRole(user)} className="gap-1 text-xs h-8 rounded-lg" title={user.role === 'ADMIN' ? 'Demote to User' : 'Make Admin'}>
                      {user.role === 'ADMIN' ? <><ShieldOff className="w-3 h-3" /> Demote</> : <><Shield className="w-3 h-3" /> Admin</>}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => removeUser(user.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Certificate Modal */}
      {certUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setCertUser(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Issue Certificate</h2>
                <p className="text-sm text-gray-500">For: {certUser.displayName || certUser.username}</p>
              </div>
              <button onClick={() => setCertUser(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><X className="w-4 h-4" /></button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Certificate Title</label>
                <Input placeholder="e.g. JavaScript Mastery Certificate" value={certTitle} onChange={(e) => setCertTitle(e.target.value)} className="rounded-xl" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Description (optional)</label>
                <textarea placeholder="Awarded for outstanding performance..." value={certDesc} onChange={(e) => setCertDesc(e.target.value)} rows={3} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm resize-y" />
              </div>
              <Button onClick={issueCertificate} disabled={issuing || !certTitle.trim()} className="w-full rounded-xl gap-2 text-white" style={{ background: 'linear-gradient(135deg,#f59e0b,#ef4444)' }}>
                <Award className="w-4 h-4" /> {issuing ? 'Issuing...' : 'Issue Certificate'}
              </Button>
            </div>

            {/* Existing certificates */}
            {userCerts.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Issued Certificates ({userCerts.length})</p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {userCerts.map((cert) => (
                    <div key={cert.id} className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
                      <Award className="w-4 h-4 text-amber-600 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{cert.title}</p>
                        <p className="text-xs text-gray-500">{new Date(cert.issuedAt).toLocaleDateString()}</p>
                      </div>
                      <button onClick={() => revokeCert(cert.id)} className="text-red-400 hover:text-red-600 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
