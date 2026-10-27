import React from 'react';
import { useGame } from '../context/GameContext';
import { PlusCircle, X, Sparkles, Key, Ticket, Coins, RotateCcw, Heart } from 'lucide-react';

interface AdminToolbarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminToolbarModal: React.FC<AdminToolbarModalProps> = ({ isOpen, onClose }) => {
  const { quickAddResources, resetGame } = useGame();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-amber-500/40 p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-amber-400" />
            <h3 className="font-heading font-black text-lg text-white">Developer Testing & Cheats</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Instantly grant currencies, senzu beans, keys, and summon materials to test all game features without grinding.
        </p>

        <div className="grid grid-cols-1 gap-2.5 pt-1">
          <button
            onClick={() => {
              quickAddResources('all');
              onClose();
            }}
            className="p-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold text-left flex items-center justify-between transition cursor-pointer"
          >
            <span>Grant Everything (+5M Yens, +100k Gems & Crystals, +200 Tickets, +30 Keys)</span>
            <Coins className="w-4 h-4 text-amber-400" />
          </button>

          <button
            onClick={() => {
              quickAddResources('senzu');
              onClose();
            }}
            className="p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold text-left flex items-center justify-between transition cursor-pointer"
          >
            <span>Grant 10x Karin Tower Senzu Beans (Full HP Restores)</span>
            <Heart className="w-4 h-4 text-emerald-400" />
          </button>

          <button
            onClick={() => {
              quickAddResources('dragonballs');
              onClose();
            }}
            className="p-3 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs font-bold text-left flex items-center justify-between transition cursor-pointer"
          >
            <span>Grant All 7 Dragon Balls (Summon Shenron Instantly)</span>
            <Sparkles className="w-4 h-4 text-orange-400" />
          </button>

          <button
            onClick={() => {
              quickAddResources('keys');
              onClose();
            }}
            className="p-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold text-left flex items-center justify-between transition cursor-pointer"
          >
            <span>Grant Boss Keys (+20 Elite Keys, +20 Boss Keys)</span>
            <Key className="w-4 h-4 text-purple-400" />
          </button>

          <button
            onClick={() => {
              quickAddResources('gacha');
              onClose();
            }}
            className="p-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold text-left flex items-center justify-between transition cursor-pointer"
          >
            <span>Grant 100 Gacha Summon Tickets</span>
            <Ticket className="w-4 h-4 text-rose-400" />
          </button>

          <button
            onClick={() => {
              if (window.confirm("Reset game to default state?")) {
                resetGame();
                onClose();
              }
            }}
            className="p-3 rounded-xl bg-slate-950 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/40 text-xs font-bold text-left flex items-center justify-between transition cursor-pointer mt-2"
          >
            <span>Reset Save Data to Initial New Game</span>
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
