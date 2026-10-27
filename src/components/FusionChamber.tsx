import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { CharacterItem } from '../types/game';
import { RARITY_COLORS, RARITY_ORDER } from '../data/gameData';
import { Sparkles, Zap, Flame, AlertCircle, CheckCircle2 } from 'lucide-react';

export const FusionChamber: React.FC = () => {
  const { characters, inventory, fuseCharacters } = useGame();
  const [char1, setChar1] = useState<string>('');
  const [char2, setChar2] = useState<string>('');
  const [result, setResult] = useState<{ success: boolean; newChar?: CharacterItem; message: string } | null>(null);

  const fusionMats = [
    { name: "Fusion Material", count: inventory["Fusion Material"] || 0 },
    { name: "Fusion Core", count: inventory["Fusion Core"] || 0 },
    { name: "Fusion Crystal", count: inventory["Fusion Crystal"] || 0 },
    { name: "Fusion Catalyst", count: inventory["Fusion Catalyst"] || 0 },
  ];

  const totalMaterials = fusionMats.reduce((acc, m) => acc + m.count, 0);

  const c1 = characters.find(c => c.name === char1);
  const c2 = characters.find(c => c.name === char2);

  // Compute expected rarity
  let previewRarity = 'common';
  if (c1 && c2) {
    const o1 = RARITY_ORDER[c1.rarity] || 1;
    const o2 = RARITY_ORDER[c2.rarity] || 1;
    previewRarity = o1 >= o2 ? c1.rarity : c2.rarity;
  }

  const handleFuse = () => {
    if (!char1 || !char2) return;
    const res = fuseCharacters(char1, char2);
    setResult(res);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/30">
        <div className="flex items-center gap-2 text-purple-400 font-semibold text-xs uppercase tracking-wider">
          <Zap className="w-4 h-4 text-purple-400" />
          <span>Divine Metamoran Fusion Chamber</span>
        </div>
        <h2 className="text-2xl font-black font-heading text-white mt-1">
          Warrior Fusion & Synthesis
        </h2>
        <p className="text-sm text-slate-400 max-w-xl">
          Fuse two compatible warriors into an ascended combination. Fused warriors inherit the highest rarity and combine martial prowess. Requires fusion materials from the shop.
        </p>

        {/* Available Materials Chips */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 mr-1">Materials:</span>
          {fusionMats.map(m => (
            <span
              key={m.name}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                m.count > 0
                  ? "bg-purple-950/60 border-purple-500/40 text-purple-300"
                  : "bg-slate-950 border-slate-800 text-slate-500"
              }`}
            >
              {m.name}: <span className="font-bold">{m.count}</span>
            </span>
          ))}
        </div>
      </div>

      {result && (
        <div className={`p-4 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
          result.success
            ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
            : "bg-rose-950/60 border-rose-500/40 text-rose-300"
        }`}>
          {result.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
          <span>{result.message}</span>
        </div>
      )}

      {/* Fusion Stage */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Fighter 1 Picker */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <label className="text-xs font-bold uppercase text-slate-300 tracking-wider">
            First Warrior
          </label>
          <select
            value={char1}
            onChange={(e) => setChar1(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl p-3 focus:outline-none focus:border-amber-400"
          >
            <option value="">-- Choose Warrior 1 --</option>
            {characters.map(c => (
              <option key={c.name} value={c.name}>
                {c.name} ({c.rarity.toUpperCase()})
              </option>
            ))}
          </select>

          {c1 && (
            <div className={`p-3 rounded-xl border ${RARITY_COLORS[c1.rarity].bg} ${RARITY_COLORS[c1.rarity].border}`}>
              <div className="text-xs font-bold text-white">{c1.name}</div>
              <div className={`text-[10px] font-black uppercase ${RARITY_COLORS[c1.rarity].text}`}>
                {c1.rarity}
              </div>
            </div>
          )}
        </div>

        {/* Fusion Core Visual Indicator */}
        <div className="flex flex-col items-center justify-center p-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 flex items-center justify-center shadow-lg shadow-purple-500/30 animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div className="mt-3 text-center">
            <div className="text-xs font-bold font-heading text-purple-300 uppercase tracking-widest">
              Fusion Catalyst
            </div>
            {c1 && c2 && char1 !== char2 && (
              <div className="mt-1 text-xs text-amber-300 font-semibold">
                Will produce: <span className="text-white font-bold">{char1} & {char2}</span> ({previewRarity.toUpperCase()})
              </div>
            )}
          </div>
        </div>

        {/* Fighter 2 Picker */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <label className="text-xs font-bold uppercase text-slate-300 tracking-wider">
            Second Warrior
          </label>
          <select
            value={char2}
            onChange={(e) => setChar2(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl p-3 focus:outline-none focus:border-amber-400"
          >
            <option value="">-- Choose Warrior 2 --</option>
            {characters.filter(c => c.name !== char1).map(c => (
              <option key={c.name} value={c.name}>
                {c.name} ({c.rarity.toUpperCase()})
              </option>
            ))}
          </select>

          {c2 && (
            <div className={`p-3 rounded-xl border ${RARITY_COLORS[c2.rarity].bg} ${RARITY_COLORS[c2.rarity].border}`}>
              <div className="text-xs font-bold text-white">{c2.name}</div>
              <div className={`text-[10px] font-black uppercase ${RARITY_COLORS[c2.rarity].text}`}>
                {c2.rarity}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Perform Fusion Action */}
      <div className="flex justify-center pt-2">
        <button
          onClick={handleFuse}
          disabled={!char1 || !char2 || char1 === char2 || totalMaterials < 1}
          className={`flex items-center gap-2 px-8 py-4 rounded-xl font-heading font-black text-base tracking-wider shadow-xl transition cursor-pointer ${
            char1 && char2 && char1 !== char2 && totalMaterials >= 1
              ? "bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white hover:scale-105 active:scale-95 shadow-purple-500/25"
              : "bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed opacity-60"
          }`}
        >
          <Flame className="w-5 h-5" />
          <span>PERFORM FUSION DANCE</span>
        </button>
      </div>
    </div>
  );
};
