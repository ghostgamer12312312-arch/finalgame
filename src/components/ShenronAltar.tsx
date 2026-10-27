import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { DRAGON_BALL_STARS } from '../data/gameData';
import { Sparkles, Flame, CheckCircle, Gift, AlertCircle } from 'lucide-react';

export const ShenronAltar: React.FC = () => {
  const { dragonBalls, makeWish } = useGame();
  const [wishResult, setWishResult] = useState<{ success: boolean; reward: string; message: string } | null>(null);

  const missingStars = DRAGON_BALL_STARS.filter(s => (dragonBalls[s] || 0) < 1);
  const canSummon = missingStars.length === 0;

  const handleSummon = () => {
    const res = makeWish();
    setWishResult(res);
  };

  return (
    <div className="space-y-6">
      {/* Altar Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-amber-950/60 via-slate-900 to-slate-950 border border-amber-500/40 p-6 md:p-8 shadow-2xl text-center">
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sacred Dragon Pedestal</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-black font-title text-amber-300 tracking-wide">
            SUMMON THE ETERNAL DRAGON SHENRON
          </h2>

          <p className="text-xs md:text-sm text-slate-300">
            Gather all seven mystical Dragon Balls (1★ through 7★) from planet patrols, boss summons, and weekly rewards to awaken Shenron and claim divine wishes.
          </p>
        </div>

        {/* The 7 Dragon Balls Display Circle */}
        <div className="my-8 flex flex-wrap items-center justify-center gap-4 md:gap-6">
          {DRAGON_BALL_STARS.map(star => {
            const count = dragonBalls[star] || 0;
            const hasBall = count > 0;

            return (
              <div
                key={star}
                className="flex flex-col items-center gap-2"
              >
                <div
                  className={`relative w-14 h-14 md:w-16 md:h-16 rounded-full flex flex-col items-center justify-center border-2 transition-all duration-300 ${
                    hasBall
                      ? "bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-300 border-yellow-200 shadow-lg shadow-orange-500/50 scale-105"
                      : "bg-slate-900 border-slate-700 opacity-40 grayscale"
                  }`}
                >
                  <div className="text-red-900 font-black text-sm md:text-base tracking-tighter">
                    {star}★
                  </div>
                  {hasBall && (
                    <div className="absolute top-1.5 left-2 w-3 h-3 bg-white/40 rounded-full blur-[1px]" />
                  )}
                </div>

                <div className="text-[11px] font-bold text-slate-400">
                  {star}★ Ball: <span className={hasBall ? "text-amber-300 font-black" : "text-slate-600"}>{count}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summon Button */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={handleSummon}
            disabled={!canSummon}
            className={`flex items-center gap-2.5 px-8 py-4 rounded-xl font-heading font-black text-base tracking-wider shadow-2xl transition cursor-pointer ${
              canSummon
                ? "bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 hover:scale-105 active:scale-95 shadow-orange-500/40 animate-pulse"
                : "bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed opacity-60"
            }`}
          >
            <Flame className="w-5 h-5 text-slate-950" />
            <span>AWAKEN SHENRON (1 OF EACH 1-7★)</span>
          </button>

          {!canSummon && (
            <div className="text-xs text-amber-400/80 font-medium">
              Missing stars: {missingStars.map(s => s + '★').join(', ')}
            </div>
          )}
        </div>

        {/* Wish Outcome Dialog */}
        {wishResult && (
          <div className="mt-6 p-5 rounded-2xl bg-amber-950/70 border border-amber-400/60 shadow-xl max-w-xl mx-auto text-left">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
              <Gift className="w-5 h-5 text-amber-400" />
              <span>Shenron's Divine Decree</span>
            </div>
            <div className="text-sm font-semibold text-white mt-1 italic">
              "{wishResult.message}"
            </div>
            <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-amber-500/30">
              <div className="text-xs text-slate-400">Granted Wish Reward:</div>
              <div className="text-base font-black text-amber-300 font-heading">
                {wishResult.reward}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Possible Wishes Info Table */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Shenron's Blessing Pool</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-rose-500/30">
            <div className="text-rose-400 font-bold">12% Chance</div>
            <div className="text-white font-semibold mt-1">Mythical Character</div>
            <div className="text-slate-400 text-[11px]">e.g. Beerus, SSJ4 Gogeta, Whis</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/30">
            <div className="text-amber-400 font-bold">18% Chance</div>
            <div className="text-white font-semibold mt-1">Deadly Divine Sword</div>
            <div className="text-slate-400 text-[11px]">+360 ATK Legendary Weapon</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-purple-500/30">
            <div className="text-purple-400 font-bold">22% Chance</div>
            <div className="text-white font-semibold mt-1">Universe Breaker</div>
            <div className="text-slate-400 text-[11px]">+344 ATK Ultimate Ki Skill</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30">
            <div className="text-emerald-400 font-bold">24% Chance</div>
            <div className="text-white font-semibold mt-1">Treasury Bounty</div>
            <div className="text-slate-400 text-[11px]">100k Yens + 250 Gems + 15 Crystals</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-cyan-500/30">
            <div className="text-cyan-400 font-bold">24% Chance</div>
            <div className="text-white font-semibold mt-1">Divine Jewels</div>
            <div className="text-slate-400 text-[11px]">500 Gems + 20 Crystals</div>
          </div>
        </div>
      </div>
    </div>
  );
};
