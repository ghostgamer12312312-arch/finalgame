import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { PLANETS, PLANET_ORDER } from '../data/gameData';
import { Globe, Lock, CheckCircle2, ArrowRight, ShieldAlert } from 'lucide-react';

export const PlanetMap: React.FC = () => {
  const { player, stats, travelToPlanet } = useGame();
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleTravel = (planetName: string) => {
    const res = travelToPlanet(planetName);
    setFeedback(res);
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
            <Globe className="w-4 h-4 text-indigo-400" />
            <span>Multiverse Exploration</span>
          </div>
          <h2 className="text-2xl font-black font-heading text-white mt-1">
            Galactic Travel & Planet Realms
          </h2>
          <p className="text-sm text-slate-400 max-w-xl">
            Each higher realm escalates rewards and encounter difficulty. Reach higher levels to bypass gravity barriers and access divine realms.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/90 border border-amber-500/30 text-xs">
          <div className="text-slate-400">Current Station</div>
          <div className="font-heading font-black text-amber-400 text-lg">
            {player.travel} ({stats.worldMultiplier}x)
          </div>
        </div>
      </div>

      {feedback && (
        <div className={`p-4 rounded-xl border text-xs font-semibold ${
          feedback.success
            ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
            : "bg-rose-950/60 border-rose-500/40 text-rose-300"
        }`}>
          {feedback.message}
        </div>
      )}

      {/* Planets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PLANET_ORDER.map((name) => {
          const planet = PLANETS[name];
          const isCurrent = player.travel === name;
          const isUnlocked = stats.level >= planet.levelMin;

          return (
            <div
              key={name}
              className={`relative overflow-hidden rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                isCurrent
                  ? "bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border-amber-500/60 shadow-xl shadow-amber-500/10"
                  : isUnlocked
                  ? "bg-slate-900/70 hover:bg-slate-900 border-slate-800 hover:border-slate-700"
                  : "bg-slate-950/60 border-slate-800/60 opacity-60"
              }`}
            >
              {/* Planet Status Header */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Level {planet.levelMin} - {planet.levelMax}
                  </span>
                  <span className="text-xs font-black text-amber-400">
                    {planet.multiplier}x Multiplier
                  </span>
                </div>

                <h3 className="text-xl font-heading font-black text-white flex items-center gap-2">
                  <span>{name}</span>
                  {isCurrent && (
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  )}
                </h3>

                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {planet.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3 border-t border-slate-800/80">
                {isCurrent ? (
                  <div className="w-full py-2 text-xs font-bold text-center rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Current Location
                  </div>
                ) : isUnlocked ? (
                  <button
                    onClick={() => handleTravel(name)}
                    className="w-full py-2.5 text-xs font-bold font-heading rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
                  >
                    <span>Travel to {name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <div className="w-full py-2 text-xs font-semibold text-center rounded-lg bg-slate-950 text-slate-500 flex items-center justify-center gap-1.5 border border-slate-800">
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Requires Level {planet.levelMin}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
