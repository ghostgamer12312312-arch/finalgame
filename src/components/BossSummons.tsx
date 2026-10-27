import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { SUMMONS } from '../data/gameData';
import { BattleLogEntry } from '../types/game';
import { getArtwork } from '../data/characterArtwork';
import { ArenaCombatModal } from './ArenaCombatModal';
import { Skull, Key, Swords, Shield, Award, Sparkles, Heart, Crosshair } from 'lucide-react';

export const BossSummons: React.FC = () => {
  const { player, stats, inventory, summonBoss, healPlayer } = useGame();
  const [battleResult, setBattleResult] = useState<{
    bossName: string;
    won: boolean;
    defeated?: boolean;
    log: BattleLogEntry[];
    rewards: string[];
  } | null>(null);

  const [interactiveBoss, setInteractiveBoss] = useState<{
    isOpen: boolean;
    bossName: string;
    hp: number;
    atk: number;
  }>({
    isOpen: false,
    bossName: 'Elite Ginyu Force',
    hp: 260000,
    atk: 11000,
  });

  const [healMessage, setHealMessage] = useState<string | null>(null);

  const handleSummonAuto = (kind: 'elite' | 'mythical' | 'legendary' | 'jiren') => {
    const res = summonBoss(kind);
    setBattleResult({
      bossName: res.bossName,
      won: res.won,
      defeated: res.defeated,
      log: res.log,
      rewards: res.rewards,
    });
  };

  const handleSummon2DArena = (bossKey: 'elite' | 'mythical' | 'legendary' | 'jiren') => {
    const b = SUMMONS[bossKey];
    if (!b) return;

    // Check key requirements
    const currentKeys = player[b.keyType as keyof typeof player] as number;
    if (currentKeys < 1) {
      alert(`You need at least 1 ${b.keyLabel} to summon this titan!`);
      return;
    }

    // Deduct 1 key
    if (b.keyType === 'keysElite') {
      player.keysElite = Math.max(0, player.keysElite - 1);
    } else {
      player.keysBoss = Math.max(0, player.keysBoss - 1);
    }

    setInteractiveBoss({
      isOpen: true,
      bossName: b.name,
      hp: b.hp,
      atk: b.dmg,
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
              Consume Elite Keys and Boss Keys (Mythical keys) to summon multiverse titans. Play in real-time 2D joystick arena or simulate directly!
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
          <div className="mt-3 p-2.5 bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 rounded-lg text-xs">
            {healMessage}
          </div>
        )}
      </div>

      {/* Boss Cards Grid with Artwork */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bossList.map((boss) => {
          const keyCount = player[boss.keyType as keyof typeof player] as number;
          const hasKey = keyCount >= 1;
          const art = getArtwork(boss.name, 'summon');

          return (
            <div
              key={boss.id}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-rose-500/30 flex flex-col justify-between transition-all"
            >
              <div>
                {/* Boss Artwork & Title Header */}
                <div className="flex items-center gap-3.5 mb-3">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border border-rose-500/40 shrink-0 bg-slate-950 relative shadow-md">
                    <img
                      src={art.avatarUrl}
                      alt={boss.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="font-heading font-black text-base text-rose-300 truncate">
                        {boss.name}
                      </h3>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0">
                        5x Bounty
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 font-mono">
                      <span>HP: {boss.hp.toLocaleString()}</span>
                      <span>•</span>
                      <span>ATK: {boss.dmg.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  {boss.description}
                </p>

                <div className="flex items-center justify-between text-xs font-mono text-slate-400 bg-slate-950/70 p-2.5 rounded-xl border border-slate-850 mb-4">
                  <span>Required Key:</span>
                  <span className={`font-bold ${hasKey ? 'text-amber-400' : 'text-red-400'}`}>
                    1x {boss.keyLabel} (You have: {keyCount})
                  </span>
                </div>
              </div>

              {/* Action buttons: 2D Playable Arena or Auto Sim */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleSummon2DArena(boss.id as 'elite' | 'mythical' | 'legendary' | 'jiren')}
                  disabled={!hasKey}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 disabled:opacity-30 disabled:pointer-events-none text-slate-950 font-black text-xs transition cursor-pointer shadow-md shadow-rose-500/20"
                >
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>2D Arena</span>
                </button>

                <button
                  onClick={() => handleSummonAuto(boss.id as 'elite' | 'mythical' | 'legendary' | 'jiren')}
                  disabled={!hasKey}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-200 border border-slate-700 text-xs font-bold transition cursor-pointer"
                >
                  <Skull className="w-3.5 h-3.5 text-rose-400" />
                  <span>Auto Sim</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Battle result drawer */}
      {battleResult && (
        <div className={`p-5 rounded-2xl border ${
          battleResult.won
            ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-200"
            : "bg-rose-950/20 border-rose-500/30 text-rose-200"
        }`}>
          <div className="flex items-center gap-2 mb-2 font-heading font-black text-base">
            <Skull className="w-5 h-5 text-rose-400" />
            <span>Summon Battle Result: {battleResult.bossName}</span>
          </div>

          {battleResult.rewards && battleResult.rewards.length > 0 && (
            <div className="mb-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs flex flex-wrap gap-2">
              <span className="font-bold text-amber-300">Summon Spoils:</span>
              {battleResult.rewards.map((r, i) => (
                <span key={i} className="text-slate-200 font-mono font-semibold">
                  {r}
                </span>
              ))}
            </div>
          )}

          <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-900 max-h-44 overflow-y-auto font-mono text-[11px] space-y-1">
            {battleResult.log.map((entry, idx) => (
              <div
                key={idx}
                className={entry.playerDamage > 0 ? 'text-cyan-300' : 'text-rose-300'}
              >
                {entry.text}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2D Interactive Modal */}
      <ArenaCombatModal
        isOpen={interactiveBoss.isOpen}
        onClose={() => setInteractiveBoss(prev => ({ ...prev, isOpen: false }))}
        enemyName={interactiveBoss.bossName}
        isBoss={true}
        bossHpMax={interactiveBoss.hp}
        bossAtkVal={interactiveBoss.atk}
        onVictory={() => {
          // Handled inside arena
        }}
        onDefeat={() => {
          // Handled inside arena
        }}
      />
    </div>
  );
};
