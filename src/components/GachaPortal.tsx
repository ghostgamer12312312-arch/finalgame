import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { CharacterItem, Rarity } from '../types/game';
import { RARITY_COLORS, GACHA_RATES } from '../data/gameData';
import { Sparkles, Ticket, Flame, Check, Info, Crown, Zap, Shield, Swords } from 'lucide-react';

export const GachaPortal: React.FC = () => {
  const { player, rollGacha, equipCharacter } = useGame();
  const [summonResults, setSummonResults] = useState<CharacterItem[] | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSummon = (count: number) => {
    setErrorMsg(null);
    const res = rollGacha(count);
    if (!res.success) {
      setErrorMsg(res.message || "Failed to summon.");
      return;
    }
    setSummonResults(res.results);
  };

  return (
    <div className="space-y-6">
      {/* Gacha Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 border border-purple-500/40 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>Omni Kings & Divine Gods Portal Active</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black font-heading text-white tracking-wide">
              MULTIVERSE WARRIOR SUMMON
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 leading-relaxed">
              Summon 90+ warriors spanning Dragon Ball Z, Super, GT & Super Dragon Ball Heroes! Features <span className="text-cyan-300 font-bold">15 Omni Kings</span> (Zeno, Super Shenron, Zalama, Supreme Grand Zeno), <span className="text-amber-400 font-bold">SP+ SDBH Champions</span> (Vegito Xeno SSJ4 Limit Breaker, Goku Grand Priest, Mechikabura), and <span className="text-rose-400 font-bold">Mythical Titans</span>.
            </p>

            <div className="flex items-center gap-3 mt-4 text-xs font-semibold text-slate-300">
              <div className="flex items-center gap-1.5 bg-slate-900/90 px-3.5 py-1.5 rounded-lg border border-slate-700">
                <Ticket className="w-4 h-4 text-rose-400" />
                <span>Available Gacha Tickets:</span>
                <span className="text-rose-300 font-black text-sm">{player.tickets}</span>
              </div>
            </div>
          </div>

          {/* Summon Buttons (1x, 10x, 50x) */}
          <div className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto">
            <button
              onClick={() => handleSummon(1)}
              disabled={player.tickets < 1}
              className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-heading font-black text-xs tracking-wider transition cursor-pointer ${
                player.tickets >= 1
                  ? "bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-600 hover:border-amber-400 shadow-md active:scale-95"
                  : "bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed opacity-60"
              }`}
            >
              <Ticket className="w-4 h-4 text-rose-400" />
              <span>SINGLE (1x)</span>
            </button>

            <button
              onClick={() => handleSummon(10)}
              disabled={player.tickets < 10}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-heading font-black text-xs tracking-wider shadow-xl transition cursor-pointer ${
                player.tickets >= 10
                  ? "bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 hover:scale-105 active:scale-95 shadow-orange-500/25"
                  : "bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed opacity-60"
              }`}
            >
              <Flame className="w-4 h-4 text-slate-950" />
              <span>MULTI (10x)</span>
            </button>

            <button
              onClick={() => handleSummon(50)}
              disabled={player.tickets < 50}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-heading font-black text-xs tracking-wider shadow-xl transition cursor-pointer ${
                player.tickets >= 50
                  ? "bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 hover:from-cyan-300 hover:to-pink-400 text-slate-950 hover:scale-105 active:scale-95 shadow-cyan-500/25"
                  : "bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed opacity-60"
              }`}
            >
              <Crown className="w-4 h-4 text-slate-950" />
              <span>MEGA (50x)</span>
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-semibold">
            {errorMsg}
          </div>
        )}
      </div>

      {/* Summon Results Reveal Grid */}
      {summonResults && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-amber-500/40 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="font-heading font-black text-xl text-amber-300">
                Summon Results ({summonResults.length} Warriors Manifested)
              </h3>
            </div>
            <button
              onClick={() => setSummonResults(null)}
              className="text-xs text-slate-400 hover:text-white px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 transition"
            >
              Dismiss
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-h-[500px] overflow-y-auto p-1">
            {summonResults.map((char, idx) => {
              const rarityStyle = RARITY_COLORS[char.rarity];
              const isEquipped = player.equippedChar === char.name;

              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all hover:scale-105 ${rarityStyle.bg} ${rarityStyle.border} ${
                    char.rarity === 'omni'
                      ? 'omni-glow ring-2 ring-cyan-400'
                      : char.rarity === 'sp_plus'
                      ? 'ring-2 ring-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                      : ''
                  }`}
                >
                  <div>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${rarityStyle.text} bg-slate-950/60 border border-current`}>
                      {char.rarity === 'sp_plus' ? 'SP+ SDBH' : char.rarity}
                    </span>
                    <h4 className="font-heading font-bold text-sm text-white mt-2 leading-tight">
                      {char.name}
                    </h4>
                    <div className="mt-2 text-[10px] text-slate-300 space-y-0.5 font-semibold">
                      <div className="flex items-center gap-1 text-rose-300">
                        <Swords className="w-3 h-3 text-rose-400" /> +{char.atk} ATK
                      </div>
                      <div className="flex items-center gap-1 text-emerald-300">
                        <Shield className="w-3 h-3 text-emerald-400" /> +{char.hp} HP
                      </div>
                      <div className="flex items-center gap-1 text-cyan-300">
                        <Zap className="w-3 h-3 text-cyan-400" /> +{char.speed} SPD
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => equipCharacter(char.name)}
                    className={`mt-3 w-full py-1 text-xs font-bold rounded flex items-center justify-center gap-1 transition ${
                      isEquipped
                        ? "bg-amber-500 text-slate-950 font-black cursor-default"
                        : "bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                    }`}
                  >
                    {isEquipped ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Equipped</span>
                      </>
                    ) : (
                      <span>Equip</span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Drop Rates & Attributes Table */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
          <Info className="w-4 h-4 text-indigo-400" />
          <span>Summon Probability & Tier Scalings</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {GACHA_RATES.map(([rarity, rate]) => {
            const style = RARITY_COLORS[rarity];
            return (
              <div
                key={rarity}
                className={`p-3 rounded-xl border bg-slate-950/70 ${style.border}`}
              >
                <div className={`text-xs font-black uppercase ${style.text}`}>
                  {rarity === 'sp_plus' ? 'SP+' : rarity}
                </div>
                <div className="text-xl font-black text-white font-heading mt-0.5">
                  {rate}%
                </div>
                <div className="text-[10px] text-slate-400 mt-1 leading-tight">
                  {rarity === 'omni'
                    ? 'God-Tier Multiverse'
                    : rarity === 'sp_plus'
                    ? 'Super Heroes 2'
                    : rarity === 'mythical'
                    ? 'Deity Level'
                    : rarity === 'legendary'
                    ? 'Universal Elite'
                    : rarity === 'epic'
                    ? 'Z Champion'
                    : rarity === 'rare'
                    ? 'Martial Artist'
                    : 'Novice Recruit'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
