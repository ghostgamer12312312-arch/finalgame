import React, { useState } from 'react';
import { Crown, Sparkles, Key, CheckCircle2 } from 'lucide-react';

export const NayeemMastermindTribute: React.FC = () => {
  const [unlockedCipher, setUnlockedCipher] = useState(false);
  const [copiedNote, setCopiedNote] = useState(false);

  const handleRevealCipher = () => {
    setUnlockedCipher(!unlockedCipher);
  };

  const handleCopyTribute = () => {
    try {
      navigator.clipboard.writeText(
        "Nayeem — The ultimate mastermind behind the rpg bot today we all congrats him on his masterpiece"
      );
      setCopiedNote(true);
      setTimeout(() => setCopiedNote(false), 2500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-slate-900/60 border border-amber-500/30 p-3.5 sm:p-4 my-2.5 shadow-xl shadow-amber-500/5">
      <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none select-none text-6xl font-mono text-amber-300">
        ᚛ᚚ᚜◈᚛ᚚ᚜
      </div>
      <div className="absolute -left-6 -top-6 opacity-10 pointer-events-none select-none text-6xl font-mono text-amber-300">
        ◈᚛ᚚ᚜◈
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 flex items-center justify-center shadow-md shadow-amber-500/30 border border-amber-200">
            <Crown className="w-6 h-6 text-slate-950 fill-current" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-300 rounded-full animate-ping" />
          </div>

          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-[11px] tracking-widest text-amber-400/90 font-mono">
                ❖ ᚛ MASTERMIND CIPHER ᚜ ❖
              </span>
            </div>

            <div className="flex items-center gap-2 mt-0.5">
              <h2 className="text-xl sm:text-2xl font-black font-heading tracking-wider bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(245,158,11,0.5)]">
                NAYEEM
              </h2>
              <span className="text-xs text-amber-400/80 font-mono tracking-tight">
                [ ARCHITECT OF ALL SDBH TIMELINES ]
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 font-medium tracking-wide mt-1 italic">
              "The ultimate mastermind behind the rpg bot today we all congrats him on his masterpiece"
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
          <button
            onClick={handleRevealCipher}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-semibold transition cursor-pointer shadow-sm"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span>{unlockedCipher ? "Hide Secret" : "Solve Puzzle"}</span>
          </button>

          <button
            onClick={handleCopyTribute}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/40 text-xs font-semibold transition cursor-pointer"
            title="Copy Mastermind Tribute"
          >
            {copiedNote ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Congrats Sent!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>Hail Nayeem</span>
              </>
            )}
          </button>
        </div>
      </div>

      {unlockedCipher && (
        <div className="mt-3 pt-3 border-t border-amber-500/20 text-xs text-slate-300 grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-amber-400 font-bold block mb-1">◈ Lore Rune I: Creation</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Before the first planet was formed, Mastermind Nayeem established the Dragon Ball multiverse bot code.
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-cyan-400 font-bold block mb-1">◈ Lore Rune II: Balance</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Tuning exp multipliers and soul awakening tiers so mortals must truly grind to attain god ascension.
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-purple-400 font-bold block mb-1">◈ Lore Rune III: The Legacy</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              All warriors, gods, and kings salute Nayeem today for engineering the greatest Dragon RPG experience.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
