import React from 'react';
import { useGame } from '../context/GameContext';
import {
  Coins,
  Gem,
  Sparkles,
  Ticket,
  Zap,
  Key,
  Shield,
  Swords,
  Globe,
  Award,
  Terminal,
  RotateCcw,
  PlusCircle,
} from 'lucide-react';

interface NavbarProps {
  onOpenTerminal: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenTerminal, onOpenAdmin }) => {
  const { player, stats, resetGame } = useGame();

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-amber-500/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-2.5">
        {/* Top brand & quick stats */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/30 border border-amber-300">
              <span className="text-xl font-black text-amber-100 font-heading">DB</span>
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-yellow-400 rounded-full animate-ping opacity-75" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-lg text-amber-400 tracking-wide">
                  DRAGON BATTLE RPG
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                  v2.0 Web Edition
                </span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span>{player.firstName}</span>
                <span>•</span>
                <span className="text-amber-400 font-semibold">Rank {player.rank} ({stats.rankName})</span>
                <span>•</span>
                <span className="text-cyan-400">Lv. {stats.level}</span>
              </div>
            </div>
          </div>

          {/* Quick Action Tools */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenTerminal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 hover:border-emerald-500/50 transition cursor-pointer"
              title="Open Telegram Bot CLI Simulator"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Bot CLI</span>
            </button>
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition cursor-pointer"
              title="Cheats & Test Resources"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Dev Cheats</span>
            </button>
            <button
              onClick={() => {
                if (window.confirm("Reset game to default state?")) {
                  resetGame();
                }
              }}
              className="p-1.5 text-xs rounded-lg bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-500/30 transition cursor-pointer"
              title="Reset progress"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Resources & Battle Stat Badges */}
        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-y-2 gap-x-4 text-xs font-medium">
          {/* Currencies */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800" title="Yens">
              <Coins className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-yellow-300 font-bold">{player.yens.toLocaleString()}</span>
              <span className="text-slate-400 text-[10px]">YEN</span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800" title="Gems">
              <Gem className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300 font-bold">{player.gems.toLocaleString()}</span>
              <span className="text-slate-400 text-[10px]">GEMS</span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800" title="Crystals">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-cyan-300 font-bold">{player.crystals.toLocaleString()}</span>
              <span className="text-slate-400 text-[10px]">CRYSTALS</span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800" title="Gacha Tickets">
              <Ticket className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-rose-300 font-bold">{player.tickets}</span>
              <span className="text-slate-400 text-[10px]">TICKETS</span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800" title="Skill Points">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-300 font-bold">{player.skillPoints}</span>
              <span className="text-slate-400 text-[10px]">SP</span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800" title="Elite & Boss Keys">
              <Key className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-purple-300 font-bold">{player.keysElite} / {player.keysBoss}</span>
              <span className="text-slate-400 text-[10px]">KEYS</span>
            </div>
          </div>

          {/* Combat Stats summary */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-rose-400">
              <Swords className="w-3.5 h-3.5" />
              <span className="font-bold text-rose-300">{stats.atk.toLocaleString()}</span>
              <span className="text-[10px] text-slate-400">ATK</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-400">
              <Shield className="w-3.5 h-3.5" />
              <span className="font-bold text-emerald-300">{stats.hp.toLocaleString()}</span>
              <span className="text-[10px] text-slate-400">HP</span>
            </div>
            <div className="flex items-center gap-1 text-indigo-400">
              <Globe className="w-3.5 h-3.5" />
              <span className="text-indigo-200 font-semibold">{player.travel}</span>
              <span className="text-[10px] text-indigo-400 font-bold">({stats.worldMultiplier}x)</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
