import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { WORLD_RAID } from '../data/gameData';
import { getArtwork } from '../data/characterArtwork';
import { ArenaCombatModal } from './ArenaCombatModal';
import { Swords, Trophy, Skull, RefreshCw, Heart, Sparkles, ShieldAlert, Crosshair } from 'lucide-react';

export const WorldRaidLeaderboard: React.FC = () => {
  const { player, stats, inventory, worldRaid, attackWorldRaid, startWorldRaid, healPlayer } = useGame();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [is2DArenaOpen, setIs2DArenaOpen] = useState(false);

  const dragonArt = getArtwork(WORLD_RAID.name, 'raid');

  const handleAttack = () => {
    const res = attackWorldRaid();
    if (res.defeated) {
      setFeedback(`💥 OMEGA DRAGON ANNIHILATED! Multiverse raid bounty deposited!`);
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
      {/* World Raid Arena Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-rose-950/60 to-slate-900 border border-rose-500/40 shadow-2xl space-y-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-rose-500/40 shrink-0 bg-slate-950 relative shadow-xl">
              <img
                src={dragonArt.avatarUrl}
                alt={WORLD_RAID.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs uppercase tracking-wider">
                <Skull className="w-4 h-4 text-rose-400" />
                <span>Multiverse Global Event (10x Rewards)</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-heading text-white mt-1">
                {WORLD_RAID.name}
              </h2>
              <p className="text-xs text-slate-300 max-w-xl">
                Persistent multiversal shadow dragon! Choose real-time 2D joystick arena combat or rapid continuous strike.
              </p>
            </div>
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
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
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

          {/* COMBAT ACTIONS: 2D Interactive Arena or Free Rapid Strike */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <button
              onClick={() => setIs2DArenaOpen(true)}
              disabled={!worldRaid.active}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-heading font-black text-xs sm:text-sm tracking-wider flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 transition cursor-pointer shadow-xl shadow-cyan-500/20"
            >
              <Crosshair className="w-4 h-4" />
              <span>2D PLAYABLE RAID ARENA</span>
            </button>

            <button
              onClick={handleAttack}
              disabled={!worldRaid.active}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-heading font-black text-xs sm:text-sm tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-xl ${
                worldRaid.active
                  ? "bg-gradient-to-r from-red-600 via-rose-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white shadow-rose-600/30 active:scale-95"
                  : "bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed"
              }`}
            >
              <Swords className="w-4 h-4" />
              <span>{worldRaid.active ? "RAPID STRIKE (INSTANT)" : "RAID BOSS SLAIN"}</span>
            </button>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-semibold">
          {feedback}
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-bold font-heading text-white">
            Multiverse Combat Ranking
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="pb-3 pl-2">Rank</th>
                <th className="pb-3">Warrior</th>
                <th className="pb-3">Ascension</th>
                <th className="pb-3">Level</th>
                <th className="pb-3 text-right pr-2">Combat EXP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {mockLeaderboard.map((user) => (
                <tr
                  key={user.rank}
                  className={`hover:bg-slate-800/40 transition ${
                    user.isPlayer ? "bg-amber-500/10 text-amber-200 font-bold" : "text-slate-300"
                  }`}
                >
                  <td className="py-3 pl-2 font-mono">
                    {user.rank === 1 ? "🥇 #1" : user.rank === 2 ? "🥈 #2" : user.rank === 3 ? "🥉 #3" : `#${user.rank}`}
                  </td>
                  <td className="py-3 flex items-center gap-2">
                    <span>{user.name}</span>
                    {user.isPlayer && (
                      <span className="text-[10px] bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded font-black">
                        YOU
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-slate-400 font-mono">{user.rankTitle}</td>
                  <td className="py-3 text-cyan-400 font-mono">Lv. {user.level}</td>
                  <td className="py-3 text-right pr-2 font-mono text-amber-400">
                    {user.exp.toLocaleString()} EXP
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2D Interactive Arena Modal for Omega Dragon */}
      <ArenaCombatModal
        isOpen={is2DArenaOpen}
        onClose={() => setIs2DArenaOpen(false)}
        enemyName={WORLD_RAID.name}
        isBoss={true}
        bossHpMax={worldRaid.maxHp}
        bossAtkVal={WORLD_RAID.dmg}
        onVictory={() => {
          worldRaid.hp = 0;
          worldRaid.active = false;
        }}
        onDefeat={() => {
          // Handled inside arena
        }}
      />
    </div>
  );
};
