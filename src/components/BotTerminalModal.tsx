import React, { useState, useRef, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Terminal, X, CornerDownLeft, Sparkles } from 'lucide-react';

interface BotTerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BotTerminalModal: React.FC<BotTerminalModalProps> = ({ isOpen, onClose }) => {
  const { runBotCommand } = useGame();
  const [history, setHistory] = useState<Array<{ type: 'input' | 'output'; text: string }>>([
    {
      type: 'output',
      text: "⚡ Dragon Battle RPG Telegram Bot CLI v2.0\nType /help to see all original bot commands or try /profile, /explore, /gacha 5, /wish.",
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim();
    if (!cmd) return;

    const output = runBotCommand(cmd);
    setHistory(prev => [
      ...prev,
      { type: 'input', text: cmd },
      { type: 'output', text: output },
    ]);
    setInputVal('');
  };

  const quickCommands = [
    '/profile',
    '/explore',
    '/gacha 5',
    '/wish',
    '/rankup',
    '/daily',
    '/weekly',
    '/admin_add me 10000 gems',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl rounded-2xl bg-slate-950 border border-emerald-500/40 shadow-2xl overflow-hidden flex flex-col h-[520px]">
        {/* Terminal Header */}
        <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 mr-2">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
            </div>
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="font-mono text-xs font-bold text-slate-300">
              Telegram Bot Command Line Emulator
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Command Pills */}
        <div className="px-4 py-2 bg-slate-900/50 border-b border-slate-850 flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono">
          <span className="text-slate-500 text-[10px] uppercase font-bold mr-1">Quick:</span>
          {quickCommands.map(qc => (
            <button
              key={qc}
              onClick={() => {
                setInputVal(qc);
              }}
              className="px-2 py-0.5 rounded bg-slate-850 hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 border border-slate-750 transition whitespace-nowrap cursor-pointer"
            >
              {qc}
            </button>
          ))}
        </div>

        {/* Console Output Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-xs">
          {history.map((h, i) => (
            <div key={i}>
              {h.type === 'input' ? (
                <div className="text-amber-400 flex items-center gap-2 font-bold">
                  <span>❯</span>
                  <span>{h.text}</span>
                </div>
              ) : (
                <div className="text-emerald-300 whitespace-pre-wrap pl-4 border-l-2 border-emerald-500/30">
                  {h.text}
                </div>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="p-3 bg-slate-900 border-t border-slate-850 flex items-center gap-2">
          <span className="text-emerald-400 font-mono font-bold">❯</span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type /command (e.g. /profile, /explore, /gacha 10)..."
            className="flex-1 bg-transparent text-emerald-300 font-mono text-xs focus:outline-none placeholder-slate-600"
            autoFocus
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold flex items-center gap-1 transition cursor-pointer"
          >
            <span>Run</span>
            <CornerDownLeft className="w-3 h-3" />
          </button>
        </form>
      </div>
    </div>
  );
};
