import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { RANKS, RANKUP_CRYSTALS } from '../data/gameData';
import { Calendar, Gift, Trophy, ArrowUpCircle, Sparkles, CheckCircle2 } from 'lucide-react';

export const DailyRankAltar: React.FC = () => {
  const { player, stats, rankUp, claimDaily, claimWeekly } = useGame();
  const [feedback, setFeedback] = useState<string | null>(null);

  const curRank = player.rank || 1;
  const nextRank = curRank < 10 ? curRank + 1 : null;
  const rankCost = curRank < 10 ? RANKUP_CRYSTALS[curRank] : null;
  const canRankUp = rankCost !== null && player.crystals >= rankCost;

  const handleRankUp = () => {
    const res = rankUp();
    setFeedback(res.message);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleClaimDaily = () => {
    const res = claimDaily();
    setFeedback(res.message);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleClaimWeekly = () => {
    const res = claimWeekly();
    setFeedback(res.message);
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Daily & Weekly Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Streak Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-amber-950/30 to-slate-900 border border-amber-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
                <Calendar className="w-4 h-4" />
                <span>Daily Meditation Bounty</span>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Streak: {player.dailyStreak} Days
              </span>
            </div>

            <h3 className="text-xl font-heading font-black text-white mt-2">
              Consecutive Login Rewards
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Log in daily to scale your Yen & Gem rewards. Every 3 days rewards a Gacha Ticket, and every 7 days rewards a Crystal!
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800/80">
            <button
              onClick={handleClaimDaily}
              className="w-full py-3 rounded-xl font-heading font-black text-xs tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 transition cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              <Gift className="w-4 h-4" />
              <span>CLAIM DAILY REWARD</span>
            </button>
          </div>
        </div>

        {/* Weekly Bounty Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-900 border border-indigo-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
                <Trophy className="w-4 h-4" />
                <span>Weekly Multiverse Tribute</span>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Weekly Quest
              </span>
            </div>

            <h3 className="text-xl font-heading font-black text-white mt-2">
              Weekly Dragon Ball Delivery
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Weekly harvest provides 5,000 Yens, 50 Gems, 5 Crystals, 3 Tickets, 5 SP, plus a guaranteed 1-3★ Dragon Ball!
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800/80">
            <button
              onClick={handleClaimWeekly}
              className="w-full py-3 rounded-xl font-heading font-black text-xs tracking-wider bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white transition cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>CLAIM WEEKLY TRIBUTE</span>
            </button>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-semibold">
          {feedback}
        </div>
      )}

      {/* Rank Ascension System */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider">
              <ArrowUpCircle className="w-4 h-4" />
              <span>Warrior Ascension Hierarchy</span>
            </div>
            <h2 className="text-2xl font-black font-heading text-white mt-1">
              Current Rank: {stats.rankName} (Rank {curRank} of 10)
            </h2>
            <p className="text-xs text-slate-400 max-w-xl">
              Ascending ranks boosts baseline strike ATK (+10/rank) and health HP (+20/rank) across all planets, while awarding massive EXP and Skill Points.
            </p>
          </div>

          {nextRank && (
            <button
              onClick={handleRankUp}
              disabled={!canRankUp}
              className={`px-6 py-3 rounded-xl font-heading font-black text-xs tracking-wider flex items-center gap-2 transition cursor-pointer shadow-lg ${
                canRankUp
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-cyan-500/25"
                  : "bg-slate-950 text-slate-600 border border-slate-800 cursor-not-allowed"
              }`}
            >
              <ArrowUpCircle className="w-4 h-4" />
              <span>ASCEND TO {RANKS[nextRank].toUpperCase()} ({rankCost?.toLocaleString()} CRYSTALS)</span>
            </button>
          )}
        </div>

        {/* 10 Ranks Progression Tracker */}
        <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2 pt-2">
          {Array.from({ length: 10 }, (_, i) => i + 1).map(r => {
            const isPassed = curRank >= r;
            const isCurrent = curRank === r;

            return (
              <div
                key={r}
                className={`p-2.5 rounded-xl border text-center transition ${
                  isCurrent
                    ? "bg-amber-500/20 border-amber-400 text-amber-300 ring-1 ring-amber-400"
                    : isPassed
                    ? "bg-slate-950/80 border-emerald-500/40 text-emerald-400"
                    : "bg-slate-950/40 border-slate-850 text-slate-600"
                }`}
              >
                <div className="text-[10px] font-bold uppercase">
                  {isCurrent ? "Active" : isPassed ? "Achieved" : `Rank ${r}`}
                </div>
                <div className="font-heading font-black text-xs mt-0.5 truncate">
                  {RANKS[r]}
                </div>
                {r < 10 && (
                  <div className="text-[9px] text-slate-500 mt-1">
                    {RANKUP_CRYSTALS[r]?.toLocaleString()} cry
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
