import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { SKILLS, SKILL_ATK } from '../data/gameData';
import { Zap, Swords, CheckCircle2, Award } from 'lucide-react';

export const SkillsDojo: React.FC = () => {
  const { player, skills, learnSkill } = useGame();
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleLearn = (name: string) => {
    const res = learnSkill(name);
    setFeedback(res.message);
    setTimeout(() => setFeedback(null), 3500);
  };

  const skillEntries = Object.entries(SKILLS);
  const totalSkillAtk = skills.reduce((sum, s) => sum + (SKILL_ATK[s] || 0), 0);

  return (
    <div className="space-y-6">
      {/* Dojo Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/30">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Master Roshi's Turtle School & Kai Dojo</span>
          </div>
          <h2 className="text-2xl font-black font-heading text-white mt-1">
            Ki Technique Mastery & Martial Arts
          </h2>
          <p className="text-xs text-slate-400 max-w-xl">
            Spend Skill Points (SP) gained from battles and quests to permanently unlock iconic Dragon Ball skills and amplify your baseline strike power.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-right">
            <div className="text-slate-400">Available SP</div>
            <div className="font-heading font-black text-amber-400 text-xl">
              {player.skillPoints} SP
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-right">
            <div className="text-slate-400">Mastered Skills Bonus</div>
            <div className="font-heading font-black text-rose-400 text-xl">
              +{totalSkillAtk.toLocaleString()} ATK
            </div>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-semibold">
          {feedback}
        </div>
      )}

      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {skillEntries.map(([name, cost]) => {
          const isMastered = skills.includes(name);
          const atkBonus = SKILL_ATK[name] || 0;
          const canAfford = player.skillPoints >= cost;

          return (
            <div
              key={name}
              className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                isMastered
                  ? "bg-slate-900/90 border-emerald-500/40 shadow-sm"
                  : canAfford
                  ? "bg-slate-900/80 border-slate-700 hover:border-amber-500/50"
                  : "bg-slate-950/70 border-slate-850 opacity-70"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                    isMastered
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                      : "bg-slate-950 text-slate-400 border-slate-800"
                  }`}>
                    {isMastered ? "Mastered" : `${cost} SP Cost`}
                  </span>
                  <div className="flex items-center gap-1 text-rose-400 text-xs font-bold">
                    <Swords className="w-3.5 h-3.5" />
                    <span>+{atkBonus} ATK</span>
                  </div>
                </div>

                <h3 className="font-heading font-black text-base text-white mt-3">
                  {name}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Permanently boosts strike power by +{atkBonus} damage points.
                </p>
              </div>

              <button
                onClick={() => handleLearn(name)}
                disabled={isMastered || !canAfford}
                className={`mt-4 w-full py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition ${
                  isMastered
                    ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 cursor-default"
                    : canAfford
                    ? "bg-amber-500 hover:bg-amber-400 text-slate-950 font-black cursor-pointer shadow-sm hover:scale-[1.02]"
                    : "bg-slate-950 text-slate-600 border border-slate-850 cursor-not-allowed"
                }`}
              >
                {isMastered ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Technique Mastered</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    <span>Learn Technique</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
