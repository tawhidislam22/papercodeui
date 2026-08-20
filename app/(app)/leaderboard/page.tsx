'use client';

import { useState, useEffect } from 'react';
import { Trophy, Flame, Zap, Medal, Crown, TrendingUp } from 'lucide-react';
import { api, getDemoUser, type Profile, getLevelFromXP } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type Tab = 'xp' | 'streak' | 'level';

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<(Profile & { rank?: number })[]>([]);
  const [tab, setTab] = useState<Tab>('xp');
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const demoUser = getDemoUser();
    if (demoUser) setCurrentUserId(demoUser.id);

    api.users.list()
      .then((data) => {
        if (data && data.length > 0) {
          setLeaders(data.map((p, i) => ({ ...p, rank: i + 1 })));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const sorted = [...leaders].sort((a, b) => {
    if (tab === 'xp') return b.xp - a.xp;
    if (tab === 'streak') return b.streak - a.streak;
    return (getLevelFromXP(b.xp) - getLevelFromXP(a.xp));
  }).map((p, i) => ({ ...p, rank: i + 1 }));

  function rankIcon(rank: number) {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="text-sm font-bold text-gray-400 w-5 text-center">{rank}</span>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg,#f59e0b,#ea580c)' }}>
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900">Leaderboard</h1>
        <p className="text-gray-500 mt-2">Top coders on Paper Code. Keep grinding!</p>
      </div>

      {/* Top 3 podium */}
      {!loading && sorted.length >= 3 && (
        <div className="flex items-end justify-center gap-4 mb-10">
          {[sorted[1], sorted[0], sorted[2]].map((leader, i) => {
            const isFirst = i === 1;
            const heights = ['h-28', 'h-36', 'h-24'];
            const podiumColors = ['bg-gray-100', 'bg-amber-50 border-amber-200', 'bg-orange-50 border-orange-200'];
            return (
              <div key={leader.username} className={`flex flex-col items-center gap-2 ${isFirst ? 'mb-0' : 'mb-4'}`}>
                <div className="relative">
                  <Avatar className={`${isFirst ? 'w-16 h-16' : 'w-12 h-12'} ring-4 ${isFirst ? 'ring-yellow-400' : 'ring-gray-200'}`}>
                    <AvatarImage src={leader.avatarUrl} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-400 to-cyan-400 text-white font-bold">
                      {(leader.displayName || leader.username).charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {isFirst && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Crown className="w-6 h-6 text-yellow-500" />
                    </div>
                  )}
                </div>
                <p className={`font-bold text-gray-900 ${isFirst ? 'text-base' : 'text-sm'}`}>
                  {leader.displayName || leader.username}
                </p>
                <div className={`${heights[i]} ${podiumColors[i]} border rounded-t-xl w-24 flex flex-col items-center justify-end pb-3 gap-1`}>
                  <p className="text-2xl font-black text-gray-700">{leader.rank}</p>
                  <p className="text-xs font-semibold text-gray-500 flex items-center gap-0.5">
                    <Zap className="w-3 h-3" />{leader.xp}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border border-gray-200 rounded-xl p-1 bg-gray-50 mb-6">
        {([['xp', 'XP', Zap], ['streak', 'Streak', Flame], ['level', 'Level', TrendingUp]] as const).map(([value, label, Icon]) => (
          <button
            key={value}
            onClick={() => setTab(value)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium rounded-lg transition-all ${
              tab === value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Rankings */}
      <div className="space-y-2">
        {sorted.map((leader) => {
          const isMe = leader.id === currentUserId;
          return (
            <div
              key={leader.username}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                isMe
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm'
              }`}
            >
              <div className="w-8 flex items-center justify-center shrink-0">
                {rankIcon(leader.rank ?? 0)}
              </div>

              <Avatar className="w-10 h-10 shrink-0">
                <AvatarImage src={leader.avatarUrl} />
                <AvatarFallback className="bg-gradient-to-br from-blue-400 to-cyan-400 text-white text-sm font-bold">
                  {(leader.displayName || leader.username).charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900 truncate">
                    {leader.displayName || leader.username}
                  </p>
                  {isMe && <Badge className="bg-blue-600 text-white border-0 text-xs shrink-0">You</Badge>}
                </div>
                <p className="text-xs text-gray-400">@{leader.username}</p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <p className="text-xs text-gray-400">XP</p>
                  <p className="font-bold text-sm text-gray-900 flex items-center gap-0.5">
                    <Zap className="w-3 h-3 text-amber-500" />{leader.xp}
                  </p>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-gray-400">Streak</p>
                  <p className="font-bold text-sm text-orange-600 flex items-center gap-0.5">
                    <Flame className="w-3 h-3" />{leader.streak}d
                  </p>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-gray-400">Level</p>
                  <p className="font-bold text-sm text-blue-600">Lv.{getLevelFromXP(leader.xp)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
