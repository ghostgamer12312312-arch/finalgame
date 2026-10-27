import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { WORLD_RAID } from '../data/gameData';
import { Swords, Trophy, Skull, RefreshCw, Heart, Sparkles, ShieldAlert } from 'lucide-react';

export const WorldRaidLeaderboard: React.FC = () => {
  const { player, stats, inventory, worldRaid, attackWorldRaid, startWorldRaid, healPlayer } = useGame();
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleAttack = () => {
    const res = attackWorldRaid();
    if (res.defeated) {
      setFeedback(`💥 OMEGA DRAGON ANNIHILATED! Insane 10x multiversal bounty deposited!`);
    } else {
      setFeedback(`Struck ${WORLD_RAID.name} for ${res.damageDealt.toLocaleString()} DMG! (Remaining HP: ${worldRaid.hp.toLocaleString()})`);
    }
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleRespawn = () => {
    const res = startWorldRaid();
    setFeedback(res.message);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleHeal = (item: 'Senzu Bean' | 'Mega Potion') => {
    const res = healPlayer(item);
    setFeedback(res.message);
    setTimeout(() => setFeedback(null), 3000);
  };

  const hpPercent = Math.max(0, Math.floor((worldRaid.hp / worldRaid.maxHp) * 100));
  const senzuCount = inventory["Senzu Bean"] || 0;

  const mockLeaderboard = [
    { rank: 1, name: "Omni King Zeno", exp: 580000, level: 5801, rankTitle: "God" },
    { rank: 2, name: "Goku (Ultra Instinct)", exp: 285000, level: 2851, rankTitle: "God" },
    { rank: 3, name: "Vegeta (Ultra Ego)", exp: 242000, level: 2421, rankTitle: "God" },
    { rank: 4, name: player.firstName + " (You)", exp: player.exp, level: stats.level, rankTitle: stats.rankName, isPlayer: true },
    { rank: 5, name: "Jiren (Beyond Limits)", exp: 198000, level: 1981, rankTitle: "Celestial" },
    { rank: 6, name: "Broly (Full Power SSJ)", exp: 175000, level: 1751, rankTitle: "Celestial" },
    { rank: 7, name: "Gogeta Blue", exp: 142000, level: 1421, rankTitle: "Oracle" },
    { rank: 8, name: "Whis (Angel Attendant)", exp: 120000, level: 1201, rankTitle: "Oracle" },
    { rank: 9, name: "Beerus (Destroyer)", exp: 95000, level: 951, rankTitle: "Titan" },
  ].sort((a, b) => b.exp - a.exp).map((u, i) => ({ ...u, rank: i + 1 }));

  return (
    <div className="space-y-6">
      {/* World Raid Arena */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-rose-950/60 to-slate-900 border border-rose-500/40 shadow-2xl space-y-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs uppercase tracking-wider">
              <Skull className="w-4 h-4 text-rose-400" />
              <span>Multiverse Global Event (10x Rewards)</span>
            </div>
            <h2 className="text-3xl font-black font-heading text-white mt-1">
              {WORLD_RAID.name}
            </h2>
            <p className="text-xs text-slate-300 max-w-xl">
              Infinite attacks with ZERO countdown cooldown! Attack as much as you want. Even if defeated, the boss stays at the exact same HP so you can heal with Senzu Beans and continue fighting!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleHeal('Senzu Bean')}
              disabled={senzuCount <= 0 || player.currentHp >= stats.hp}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                senzuCount > 0 && player.currentHp < stats.hp
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-slate-950 text-slate-600 border border-slate-800 cursor-not-allowed"
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Eat Senzu ({senzuCount})</span>
            </button>

            {player.admin && (
              <button
                onClick={handleRespawn}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition cursor-pointer"
                title="Admin: Start or Respawn World Raid"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Admin: {worldRaid.active ? "Reset Boss" : "Start Raid"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Boss HP Bar */}
        <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Boss Life Force (Persistent Health)</span>
            </span>
            <span className="font-bold text-white text-sm">
              {worldRaid.hp.toLocaleString()} / {worldRaid.maxHp.toLocaleString()} ({hpPercent}%)
            </span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-400 transition-all duration-150"
              style={{ width: `${hpPercent}%` }}
            />
          </div>

          {/* FREE RAPID ATTACK BUTTON (NO COUNTDOWN) */}
          <div className="flex flex-col items-center gap-2 pt-2">
            <button
              onClick={handleAttack}
              disabled={!worldRaid.active}
              className={`px-10 py-4 rounded-xl font-heading font-black text-base tracking-wider flex items-center gap-2.5 transition cursor-pointer shadow-xl ${
                worldRaid.active
                  ? "bg-gradient-to-r from-red-600 via-rose-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white shadow-rose-600/30 hover:scale-105 active:scale-95 animate-pulse"
                  : "bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed"
              }`}
            >
              <Swords className="w-5 h-5" />
              <span>{worldRaid.active ? "RAPID STRIKE (NO COOLDOWN!)" : "RAID BOSS SLAIN"}</span>
            </button>
            <span className="text-[11px] text-amber-400 font-semibold">
              ⚡ Free unrestricted continuous attacks enabled. 10x reward drops upon defeat!
            </span>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-semibold">
          {feedback}
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h3 className="font-heading font-black text-xl text-white">Multiverse Fighter Leaderboard</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase">
                <th className="py-2.5 px-3">Rank</th>
                <th className="py-2.5 px-3">Fighter</th>
                <th className="py-2.5 px-3">Level</th>
                <th className="py-2.5 px-3">Title</th>
                <th className="py-2.5 px-3 text-right">EXP Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {mockLeaderboard.map((u) => (
                <tr
                  key={u.name}
                  className={`transition ${
                    u.isPlayer
                      ? "bg-amber-500/10 text-amber-300 font-bold"
                      : "hover:bg-slate-850 text-slate-300"
                  }`}
                >
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md font-black ${
                      u.rank === 1
                        ? "bg-amber-500 text-slate-950"
                        : u.rank === 2
                        ? "bg-slate-400 text-slate-950"
                        : u.rank === 3
                        ? "bg-amber-700 text-white"
                        : "bg-slate-950 text-slate-400"
                    }`}>
                      {u.rank}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-semibold flex items-center gap-2">
                    <span>{u.name}</span>
                    {u.isPlayer && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-black">
                        YOU
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-cyan-400 font-bold">Lv. {u.level}</td>
                  <td className="py-3 px-3 text-slate-400">{u.rankTitle}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-white">
                    {u.exp.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
