import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { SUMMONS } from '../data/gameData';
import { BattleLogEntry } from '../types/game';
import { Skull, Key, Swords, Shield, Award, Sparkles, Heart } from 'lucide-react';

export const BossSummons: React.FC = () => {
  const { player, stats, inventory, summonBoss, healPlayer } = useGame();
  const [battleResult, setBattleResult] = useState<{
    bossName: string;
    won: boolean;
    defeated?: boolean;
    log: BattleLogEntry[];
    rewards: string[];
  } | null>(null);

  const [healMessage, setHealMessage] = useState<string | null>(null);

  const handleSummon = (kind: 'elite' | 'mythical' | 'legendary' | 'jiren') => {
    const res = summonBoss(kind);
    setBattleResult({
      bossName: res.bossName,
      won: res.won,
      defeated: res.defeated,
      log: res.log,
      rewards: res.rewards,
    });
  };

  const handleUseHeal = (item: 'Senzu Bean' | 'Mega Potion' | 'Potion' | 'Revive') => {
    const res = healPlayer(item);
    setHealMessage(res.message);
    setTimeout(() => setHealMessage(null), 3500);
  };

  const bossList = Object.values(SUMMONS);
  const senzuCount = inventory["Senzu Bean"] || 0;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border border-rose-500/30">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs uppercase tracking-wider">
              <Skull className="w-4 h-4 text-rose-400" />
              <span>Forbidden Boss Summoning Gate</span>
            </div>
            <h2 className="text-2xl font-black font-heading text-white mt-1">
              Extraterrestrial Boss Summons (5x Bounty)
            </h2>
            <p className="text-xs text-slate-400 max-w-xl">
              Consume Elite Keys and Boss Keys (Mythical keys) to summon multiverse titans. Boss health persists between attempts if you fall, allowing you to heal with Senzu Beans and finish the battle!
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => handleUseHeal('Senzu Bean')}
              disabled={senzuCount <= 0 || player.currentHp >= stats.hp}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition cursor-pointer ${
                senzuCount > 0 && player.currentHp < stats.hp
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-slate-950 text-slate-600 border border-slate-800 cursor-not-allowed"
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Quick Senzu ({senzuCount})</span>
            </button>
          </div>
        </div>

        {healMessage && (
          <div className="mt-3 p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
            {healMessage}
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 bg-slate-950 px-3.5 py-1.5 rounded-lg border border-slate-800">
            <Key className="w-4 h-4 text-purple-400" />
            <span className="text-slate-400">Elite Keys:</span>
            <span className="text-purple-300 font-bold">{player.keysElite}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-950 px-3.5 py-1.5 rounded-lg border border-slate-800">
            <Key className="w-4 h-4 text-rose-400" />
            <span className="text-slate-400">Boss Keys (Mythical):</span>
            <span className="text-rose-300 font-bold">{player.keysBoss}</span>
          </div>
        </div>
      </div>

      {/* Boss Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {bossList.map(boss => {
          const keyCount = boss.keyType === 'keysElite' ? player.keysElite : player.keysBoss;
          const hasKey = keyCount > 0;

          return (
            <div
              key={boss.id}
              className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-slate-700 flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-700">
                    {boss.keyLabel}
                  </span>
                  <span className={`text-xs font-bold ${hasKey ? "text-emerald-400" : "text-rose-400"}`}>
                    Owned: {keyCount}
                  </span>
                </div>

                <h3 className="font-heading font-black text-lg text-white mt-3 leading-tight">
                  {boss.name}
                </h3>

                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {boss.description}
                </p>

                <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-850 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-emerald-400" /> Base HP:
                    </span>
                    <span className="font-bold text-white">{boss.hp.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Swords className="w-3.5 h-3.5 text-rose-400" /> Strike:
                    </span>
                    <span className="font-bold text-rose-300">{boss.dmg.toLocaleString()} DMG</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-amber-400 pt-1 border-t border-slate-800">
                    <span>Reward Multiplier:</span>
                    <span className="font-bold">5x ({boss.rewardMult * 5}x base)</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleSummon(boss.id as any)}
                disabled={!hasKey}
                className={`mt-4 w-full py-2.5 rounded-xl text-xs font-black font-heading tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-lg ${
                  hasKey
                    ? "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white hover:scale-[1.02] active:scale-[0.98] shadow-rose-600/25"
                    : "bg-slate-950 text-slate-600 border border-slate-850 cursor-not-allowed"
                }`}
              >
                <Skull className="w-4 h-4" />
                <span>CHALLENGE (1x KEY)</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Battle Results Modal */}
      {battleResult && (
        <div className={`p-6 rounded-2xl border ${
          battleResult.won
            ? "bg-emerald-950/50 border-emerald-500/40 shadow-xl"
            : "bg-rose-950/50 border-rose-500/40 shadow-xl"
        }`}>
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl border ${
                battleResult.won ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-rose-500/20 text-rose-400 border-rose-500/30"
              }`}>
                {battleResult.won ? <Award className="w-6 h-6" /> : <Skull className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="font-heading font-black text-xl text-white">
                  {battleResult.won ? "TITAN SLAIN!" : "FALLEN IN BATTLE"} vs {battleResult.bossName}
                </h3>
                {!battleResult.won && (
                  <p className="text-xs text-amber-300 mt-0.5">
                    Boss health remains reduced! Eat a Senzu Bean and challenge him again to finish the fight!
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => setBattleResult(null)}
              className="text-xs text-slate-400 hover:text-white px-3 py-1 rounded bg-slate-800 transition"
            >
              Dismiss
            </button>
          </div>

          {battleResult.won && battleResult.rewards.length > 0 && (
            <div className="mb-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Insane 5x Boss Bounty Harvested</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {battleResult.rewards.map((r, i) => (
                  <span key={i} className="px-3 py-1 text-xs font-semibold rounded-lg bg-slate-900 text-amber-200 border border-amber-500/30">
                    {r}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Combat Log */}
          <div className="max-h-56 overflow-y-auto space-y-1 p-3 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs">
            {battleResult.log.map((entry, idx) => (
              <div key={idx} className={entry.isVictory ? "text-emerald-400 font-bold" : entry.isDefeat ? "text-rose-400 font-bold" : "text-slate-300"}>
                {entry.text}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
