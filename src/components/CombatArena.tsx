import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { BattleLogEntry } from '../types/game';
import { BOSS, NPC_STREAK_FOR_BOSS } from '../data/gameData';
import { Swords, Skull, Shield, Award, Flame, Sparkles, RefreshCw, Trophy, Heart, Zap, Info, ArrowRight } from 'lucide-react';

export const CombatArena: React.FC = () => {
  const { player, stats, inventory, exploreMenu, friezaBossBattle, healPlayer } = useGame();
  const [battleState, setBattleState] = useState<{
    inProgress: boolean;
    enemyName: string;
    won?: boolean;
    defeated?: boolean;
    log: BattleLogEntry[];
    rewards: string[];
    isBoss?: boolean;
  } | null>(null);

  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [healMessage, setHealMessage] = useState<string | null>(null);

  const handleExploreChoice = (choice: '1' | '2' | '3') => {
    setInfoMessage(null);
    const res = exploreMenu(choice);
    if (choice === '2' || choice === '3') {
      setInfoMessage(res.message);
      return;
    }

    const d = res.data;
    setBattleState({
      inProgress: false,
      enemyName: d.enemy,
      won: d.won,
      defeated: d.defeated,
      log: d.log,
      rewards: d.rewards,
      isBoss: false,
    });
  };

  const handleBossFight = () => {
    setInfoMessage(null);
    const res = friezaBossBattle();
    setBattleState({
      inProgress: false,
      enemyName: BOSS.name,
      won: res.won,
      defeated: res.defeated,
      log: res.log,
      rewards: res.rewards || [],
      isBoss: true,
    });
  };

  const handleUseHeal = (item: 'Senzu Bean' | 'Mega Potion' | 'Potion' | 'Revive') => {
    const res = healPlayer(item);
    setHealMessage(res.message);
    setTimeout(() => setHealMessage(null), 3500);
  };

  const streakProgress = Math.min(100, Math.floor((player.npcStreak / NPC_STREAK_FOR_BOSS) * 100));
  const hpPercent = Math.max(0, Math.min(100, Math.floor((player.currentHp / stats.hp) * 100)));

  const senzuCount = inventory["Senzu Bean"] || 0;
  const potionCount = inventory["Potion"] || 0;
  const megaPotionCount = inventory["Mega Potion"] || 0;

  return (
    <div className="space-y-6">
      {/* Fighter Health & Quick Recovery Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Warrior Health Pool</span>
              <span className="font-bold text-white">
                {player.currentHp.toLocaleString()} / {stats.hp.toLocaleString()} HP ({hpPercent}%)
              </span>
            </div>
            <div className="w-48 sm:w-64 bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700 mt-1">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  hpPercent > 50
                    ? "bg-gradient-to-r from-emerald-500 to-green-400"
                    : hpPercent > 20
                    ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                    : "bg-gradient-to-r from-red-600 to-rose-500 animate-pulse"
                }`}
                style={{ width: `${hpPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick Recovery Items */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => handleUseHeal('Senzu Bean')}
            disabled={senzuCount <= 0 || player.currentHp >= stats.hp}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              senzuCount > 0 && player.currentHp < stats.hp
                ? "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 shadow-sm"
                : "bg-slate-950 text-slate-600 border border-slate-850 cursor-not-allowed"
            }`}
            title="Instantly restore 100% full HP"
          >
            <span>Eat Senzu Bean ({senzuCount})</span>
          </button>

          <button
            onClick={() => handleUseHeal('Mega Potion')}
            disabled={megaPotionCount <= 0 || player.currentHp >= stats.hp}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              megaPotionCount > 0 && player.currentHp < stats.hp
                ? "bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 shadow-sm"
                : "bg-slate-950 text-slate-600 border border-slate-850 cursor-not-allowed"
            }`}
            title="Restore 60% HP"
          >
            <span>Mega Potion ({megaPotionCount})</span>
          </button>

          <button
            onClick={() => handleUseHeal('Potion')}
            disabled={potionCount <= 0 || player.currentHp >= stats.hp}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              potionCount > 0 && player.currentHp < stats.hp
                ? "bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 shadow-sm"
                : "bg-slate-950 text-slate-600 border border-slate-850 cursor-not-allowed"
            }`}
            title="Restore 30% HP"
          >
            <span>Potion ({potionCount})</span>
          </button>
        </div>
      </div>

      {healMessage && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
          {healMessage}
        </div>
      )}

      {/* Explore Command Card with the 3 Distinct Options */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-500/30 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
              <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
              <span>Current Battlefield: {player.travel}</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {stats.worldMultiplier}x Reward Multiplier
              </span>
            </div>
            <h2 className="text-2xl font-black font-heading text-white mt-1">
              Explore Patrol Menu
            </h2>
            <p className="text-xs text-slate-400 max-w-xl">
              Choose your action: Engage invaders in mortal combat, disengage safely, or analyze the realm intel.
            </p>
          </div>

          {/* The 3 Explore Options */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => handleExploreChoice('1')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black font-heading text-sm shadow-lg shadow-orange-500/25 hover:scale-105 active:scale-95 transition cursor-pointer"
            >
              <Swords className="w-4 h-4" />
              <span>1. BATTLE</span>
            </button>

            <button
              onClick={() => handleExploreChoice('2')}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-200 font-black font-heading text-sm border border-slate-700 transition cursor-pointer"
            >
              <ArrowRight className="w-4 h-4 text-slate-400" />
              <span>2. RUN AWAY</span>
            </button>

            <button
              onClick={() => handleExploreChoice('3')}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-850 hover:bg-slate-800 text-cyan-300 font-black font-heading text-sm border border-cyan-500/30 transition cursor-pointer"
            >
              <Info className="w-4 h-4 text-cyan-400" />
              <span>3. INFO</span>
            </button>

            {player.npcStreak >= NPC_STREAK_FOR_BOSS && (
              <button
                onClick={handleBossFight}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-black font-heading text-sm shadow-lg shadow-red-600/40 animate-bounce transition cursor-pointer border border-red-400"
              >
                <Skull className="w-4 h-4 text-red-200" />
                <span>CHALLENGE BOSS</span>
              </button>
            )}
          </div>
        </div>

        {/* Boss Streak Progress */}
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-300 font-medium flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>NPC Defeat Streak ({player.npcStreak} / {NPC_STREAK_FOR_BOSS})</span>
            </span>
            <span className="text-amber-400 font-semibold">
              {player.npcStreak >= NPC_STREAK_FOR_BOSS
                ? "FRIEZA FORCE COMMANDER READY!"
                : `${NPC_STREAK_FOR_BOSS - player.npcStreak} wins until boss appearance`}
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                player.npcStreak >= NPC_STREAK_FOR_BOSS
                  ? "bg-gradient-to-r from-amber-400 via-rose-500 to-red-600 animate-pulse"
                  : "bg-gradient-to-r from-indigo-500 to-amber-500"
              }`}
              style={{ width: `${streakProgress}%` }}
            />
          </div>
        </div>
      </div>

      {infoMessage && (
        <div className="p-4 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-indigo-300 text-xs font-semibold">
          {infoMessage}
        </div>
      )}

      {/* Battle Results Display */}
      {battleState && (
        <div className={`rounded-2xl border p-6 transition-all ${
          battleState.won
            ? "bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-950 border-emerald-500/40 shadow-xl"
            : "bg-gradient-to-b from-rose-950/40 via-slate-900 to-slate-950 border-rose-500/40 shadow-xl"
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl border ${
                battleState.won
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                  : "bg-rose-500/20 text-rose-400 border-rose-500/40"
              }`}>
                {battleState.won ? <Award className="w-6 h-6" /> : <Skull className="w-6 h-6" />}
              </div>
              <div>
                <div className="text-xs font-semibold tracking-wider uppercase text-slate-400">
                  {battleState.isBoss ? "Boss Encounter" : "Combat Result"}
                </div>
                <h3 className={`text-xl font-black font-heading ${
                  battleState.won ? "text-emerald-400" : "text-rose-400"
                }`}>
                  {battleState.won ? "VICTORY ACHIEVED" : "DEFEAT IN BATTLE"} vs {battleState.enemyName}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleExploreChoice('1')}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Battle Next</span>
              </button>
            </div>
          </div>

          {/* Loot Cards */}
          {battleState.won && battleState.rewards.length > 0 && (
            <div className="mb-5 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Rewards & Equipment Acquired</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {battleState.rewards.map((rew, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 text-xs font-semibold rounded-lg bg-slate-900 text-amber-200 border border-amber-500/40 shadow-sm"
                  >
                    {rew}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Combat Log */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Round Breakdown ({battleState.log.length} Rounds)
            </div>
            <div className="max-h-64 overflow-y-auto space-y-1.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs">
              {battleState.log.map((entry, idx) => (
                <div
                  key={idx}
                  className={`p-1.5 rounded transition ${
                    entry.isVictory
                      ? "text-emerald-400 bg-emerald-950/30 font-bold"
                      : entry.isDefeat
                      ? "text-rose-400 bg-rose-950/30 font-bold"
                      : "text-slate-300 hover:bg-slate-900"
                  }`}
                >
                  {entry.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
