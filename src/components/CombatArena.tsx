import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { BattleLogEntry } from '../types/game';
import { BOSS, NPC_STREAK_FOR_BOSS } from '../data/gameData';
import { getArtwork } from '../data/characterArtwork';
import { ArenaCombatModal } from './ArenaCombatModal';
import {
  Swords,
  Skull,
  Shield,
  Award,
  Flame,
  Sparkles,
  RefreshCw,
  Trophy,
  Heart,
  Zap,
  Info,
  ArrowRight,
  Crosshair,
  Gamepad2,
} from 'lucide-react';

export const CombatArena: React.FC = () => {
  const { player, stats, inventory, exploreMenu, friezaBossBattle, healPlayer } = useGame();
  
  // Fast Simulation Battle State
  const [battleState, setBattleState] = useState<{
    inProgress: boolean;
    enemyName: string;
    won?: boolean;
    defeated?: boolean;
    log: BattleLogEntry[];
    rewards: string[];
    isBoss?: boolean;
  } | null>(null);

  // 2D Real-Time Interactive Arena Modal State
  const [interactiveBattle, setInteractiveBattle] = useState<{
    isOpen: boolean;
    enemyName: string;
    isBoss: boolean;
    hp: number;
    atk: number;
  }>({
    isOpen: false,
    enemyName: 'Saibaman',
    isBoss: false,
    hp: 4000,
    atk: 180,
  });

  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [healMessage, setHealMessage] = useState<string | null>(null);

  // Auto explore simulation
  const handleExploreChoice = (choice: '1' | '2' | '3') => {
    setInfoMessage(null);
    const res = exploreMenu(choice);
    if (choice === '2' || choice === '3') {
      setInfoMessage(res.message);
      return;
    }

    const d = res.data;
    setBattleState({
      inProgress: false,
      enemyName: d.enemy,
      won: d.won,
      defeated: d.defeated,
      log: d.log,
      rewards: d.rewards,
      isBoss: false,
    });
  };

  // Launch 2D Real-time Arena for exploration NPC
  const launchInteractiveExploreBattle = () => {
    setInfoMessage(null);
    // Pick current planet NPC or patrol target
    const currentPlanetEnemies: Record<string, string[]> = {
      Earth: ["Saibaman", "Red Ribbon Soldier", "Appule"],
      Hell: ["Cell Junior", "Frieza Soldier", "Spopovich"],
      "Kai Planet": ["Nappa", "Raditz", "Captain Ginyu (Body Change)"],
      "Supreme Kai Planet": ["Dabura (Demon Realm King)", "Majin Vegeta", "Super Buu (Gohan Absorbed)"],
      "Lord Beerus Planet": ["Whis", "Beerus", "Golden Frieza"],
      Omniverse: ["Jiren (Full Power)", "Grand Priest (Daishinkan)", "Ultra Instinct Goku"],
    };

    const list = currentPlanetEnemies[player.travel] || ["Saibaman", "Frieza Soldier"];
    const chosenEnemy = list[Math.floor(Math.random() * list.length)];

    const calculatedHp = Math.floor(stats.hp * (0.4 + Math.random() * 0.4));
    const calculatedAtk = Math.floor(stats.atk * (0.35 + Math.random() * 0.3));

    setInteractiveBattle({
      isOpen: true,
      enemyName: chosenEnemy,
      isBoss: false,
      hp: Math.max(2500, calculatedHp),
      atk: Math.max(120, calculatedAtk),
    });
  };

  // Launch 2D Real-time Arena for Boss Frieza
  const launchInteractiveBossBattle = () => {
    setInfoMessage(null);
    setInteractiveBattle({
      isOpen: true,
      enemyName: BOSS.name,
      isBoss: true,
      hp: BOSS.hp,
      atk: BOSS.dmg,
    });
  };

  const handleBossFightAuto = () => {
    setInfoMessage(null);
    const res = friezaBossBattle();
    setBattleState({
      inProgress: false,
      enemyName: BOSS.name,
      won: res.won,
      defeated: res.defeated,
      log: res.log,
      rewards: res.rewards || [],
      isBoss: true,
    });
  };

  const handleUseHeal = (item: 'Senzu Bean' | 'Mega Potion' | 'Potion' | 'Revive') => {
    const res = healPlayer(item);
    setHealMessage(res.message);
    setTimeout(() => setHealMessage(null), 3500);
  };

  const streakProgress = Math.min(100, Math.floor((player.npcStreak / NPC_STREAK_FOR_BOSS) * 100));
  const hpPercent = Math.max(0, Math.min(100, Math.floor((player.currentHp / stats.hp) * 100)));

  const senzuCount = inventory["Senzu Bean"] || 0;
  const potionCount = inventory["Potion"] || 0;
  const megaPotionCount = inventory["Mega Potion"] || 0;

  // Artwork for current boss preview
  const friezaArt = getArtwork(BOSS.name, 'boss');

  return (
    <div className="space-y-6">
      {/* Fighter Health & Quick Recovery Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Warrior Health Pool</span>
              <span className="font-bold text-white">
                {player.currentHp.toLocaleString()} / {stats.hp.toLocaleString()} HP ({hpPercent}%)
              </span>
            </div>
            <div className="w-48 sm:w-64 bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700 mt-1">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  hpPercent > 50
                    ? "bg-gradient-to-r from-emerald-500 to-green-400"
                    : hpPercent > 20
                    ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                    : "bg-gradient-to-r from-red-600 to-rose-500 animate-pulse"
                }`}
                style={{ width: `${hpPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick Recovery Items */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => handleUseHeal('Senzu Bean')}
            disabled={senzuCount <= 0 || player.currentHp >= stats.hp}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              senzuCount > 0 && player.currentHp < stats.hp
                ? "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 shadow-sm"
                : "bg-slate-950 text-slate-600 border border-slate-850 cursor-not-allowed"
            }`}
            title="Instantly restore 100% full HP"
          >
            <span>Eat Senzu Bean ({senzuCount})</span>
          </button>

          <button
            onClick={() => handleUseHeal('Mega Potion')}
            disabled={megaPotionCount <= 0 || player.currentHp >= stats.hp}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              megaPotionCount > 0 && player.currentHp < stats.hp
                ? "bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 shadow-sm"
                : "bg-slate-950 text-slate-600 border border-slate-850 cursor-not-allowed"
            }`}
            title="Restore 60% HP"
          >
            <span>Mega Potion ({megaPotionCount})</span>
          </button>

          <button
            onClick={() => handleUseHeal('Potion')}
            disabled={potionCount <= 0 || player.currentHp >= stats.hp}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              potionCount > 0 && player.currentHp < stats.hp
                ? "bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 shadow-sm"
                : "bg-slate-950 text-slate-600 border border-slate-850 cursor-not-allowed"
            }`}
            title="Restore 30% HP"
          >
            <span>Potion ({potionCount})</span>
          </button>
        </div>
      </div>

      {healMessage && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>{healMessage}</span>
        </div>
      )}

      {infoMessage && (
        <div className="p-3 bg-amber-950/40 border border-amber-500/40 text-amber-300 rounded-xl text-xs flex items-center gap-2">
          <Info className="w-4 h-4 shrink-0" />
          <span>{infoMessage}</span>
        </div>
      )}

      {/* Real-time 2D Arena Launcher Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-950/70 via-slate-900/90 to-purple-950/70 border border-cyan-500/40 p-5 shadow-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-lg shadow-cyan-500/30 shrink-0">
              <Gamepad2 className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-lg text-cyan-300 tracking-wide">
                  2D MULTIVERSE ACTION ARENA
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-200 border border-cyan-400/30">
                  Playable Joystick Mode
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-lg leading-relaxed">
                Take direct manual control of your Saiyan! Move with the virtual joystick or WASD, aim at enemies, fire rapid Ki blasts, and unleash devastating Kamehameha waves in real-time.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0 w-full md:w-auto">
            <button
              onClick={launchInteractiveExploreBattle}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs tracking-wider shadow-lg shadow-cyan-500/30 transition cursor-pointer"
            >
              <Crosshair className="w-4 h-4" />
              <span>PLAY 2D ENEMY ARENA</span>
            </button>

            {player.npcStreak >= NPC_STREAK_FOR_BOSS && (
              <button
                onClick={launchInteractiveBossBattle}
                className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-black text-xs tracking-wider shadow-lg shadow-amber-500/30 transition cursor-pointer"
              >
                <Flame className="w-4 h-4 fill-current" />
                <span>PLAY 2D FRIEZA CLASH</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Patrol & Boss Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Wilderness Patrol & Explore */}
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 text-amber-400 font-heading font-bold text-base">
                <Swords className="w-5 h-5" />
                <span>Wilderness Patrol: {player.travel}</span>
              </div>
              <span className="text-xs font-mono text-cyan-400 font-semibold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                {stats.worldMultiplier}x World Mult
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Scout regional enemies on {player.travel}. Defeat 5 consecutive enemies to unlock the Planetary Emperor Boss challenge!
            </p>

            {/* Streak Meter */}
            <div className="bg-slate-950 rounded-2xl p-3 border border-slate-800/80 mb-5">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-400 font-medium">Consecutive Victories:</span>
                <span className="font-bold text-amber-400 font-mono">
                  {player.npcStreak} / {NPC_STREAK_FOR_BOSS}
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-300"
                  style={{ width: `${streakProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Patrol Action Buttons */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={launchInteractiveExploreBattle}
                className="flex items-center justify-center gap-1.5 p-3 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-500/40 text-xs font-bold transition cursor-pointer"
              >
                <Crosshair className="w-4 h-4 text-cyan-300" />
                <span>Play 2D Arena</span>
              </button>

              <button
                onClick={() => handleExploreChoice('1')}
                className="flex items-center justify-center gap-1.5 p-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition cursor-pointer shadow-md shadow-amber-500/20"
              >
                <Swords className="w-4 h-4" />
                <span>1. Quick Sim</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleExploreChoice('2')}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition cursor-pointer text-center"
              >
                2. Run Away
              </button>
              <button
                onClick={() => handleExploreChoice('3')}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition cursor-pointer text-center"
              >
                3. Check Area
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: Frieza Planetary Boss */}
        <div className={`rounded-3xl border p-6 flex flex-col justify-between relative overflow-hidden transition-all ${
          player.npcStreak >= NPC_STREAK_FOR_BOSS
            ? "bg-slate-900/95 border-amber-500/50 shadow-xl shadow-amber-500/10"
            : "bg-slate-900/40 border-slate-800/60 opacity-85"
        }`}>
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 text-rose-400 font-heading font-bold text-base">
                <Skull className="w-5 h-5 text-rose-500" />
                <span>Emperor Boss: {BOSS.name}</span>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {player.npcStreak >= NPC_STREAK_FOR_BOSS ? "UNLOCKED" : "LOCKED"}
              </span>
            </div>

            {/* Boss Artwork & Stats Preview */}
            <div className="flex items-center gap-3.5 bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80 mb-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden border border-rose-500/40 shrink-0 bg-slate-900">
                <img
                  src={friezaArt.avatarUrl}
                  alt={BOSS.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-xs space-y-1">
                <div className="font-bold text-white">{BOSS.name}</div>
                <div className="text-slate-400">HP: <span className="text-emerald-400 font-mono">{BOSS.hp.toLocaleString()}</span></div>
                <div className="text-slate-400">ATK: <span className="text-rose-400 font-mono">{BOSS.dmg.toLocaleString()}</span></div>
              </div>
            </div>

            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Defeating Frieza grants massive Yens, EXP, Dragon Radar tokens, and unlocks advanced planet travel gates.
            </p>
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={launchInteractiveBossBattle}
                disabled={player.npcStreak < NPC_STREAK_FOR_BOSS}
                className="flex items-center justify-center gap-1.5 p-3 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 disabled:opacity-30 disabled:pointer-events-none text-slate-950 font-black text-xs transition cursor-pointer shadow-md shadow-rose-500/20"
              >
                <Crosshair className="w-4 h-4" />
                <span>2D Boss Clash</span>
              </button>

              <button
                onClick={handleBossFightAuto}
                disabled={player.npcStreak < NPC_STREAK_FOR_BOSS}
                className="flex items-center justify-center gap-1.5 p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-rose-300 border border-rose-500/40 text-xs font-bold transition cursor-pointer"
              >
                <Skull className="w-4 h-4" />
                <span>Auto Sim</span>
              </button>
            </div>
            {player.npcStreak < NPC_STREAK_FOR_BOSS && (
              <p className="text-[11px] text-center text-slate-500">
                Requires {NPC_STREAK_FOR_BOSS - player.npcStreak} more patrol victory to challenge Frieza.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Battle Results Drawer (When Auto-Battle Sim is used) */}
      {battleState && (
        <div className={`p-5 rounded-3xl border ${
          battleState.won
            ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-200"
            : "bg-rose-950/20 border-rose-500/30 text-rose-200"
        }`}>
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 font-heading font-black text-base">
              {battleState.won ? (
                <>
                  <Trophy className="w-5 h-5 text-emerald-400" />
                  <span className="text-emerald-400">Victory Against {battleState.enemyName}!</span>
                </>
              ) : (
                <>
                  <Skull className="w-5 h-5 text-rose-400" />
                  <span className="text-rose-400">Defeated by {battleState.enemyName}</span>
                </>
              )}
            </div>
          </div>

          {battleState.rewards && battleState.rewards.length > 0 && (
            <div className="mb-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs flex flex-wrap gap-2">
              <span className="font-bold text-amber-300">Rewards Acquired:</span>
              {battleState.rewards.map((r, i) => (
                <span key={i} className="text-slate-200 font-mono font-semibold">
                  {r}{i < battleState.rewards.length - 1 ? ' • ' : ''}
                </span>
              ))}
            </div>
          )}

          <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-900 max-h-44 overflow-y-auto font-mono text-[11px] space-y-1">
            {battleState.log.map((entry, idx) => (
              <div
                key={idx}
                className={entry.playerDamage > 0 ? 'text-cyan-300' : 'text-rose-300'}
              >
                {entry.text}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Real-time 2D Arena Combat Modal */}
      <ArenaCombatModal
        isOpen={interactiveBattle.isOpen}
        onClose={() => setInteractiveBattle(prev => ({ ...prev, isOpen: false }))}
        enemyName={interactiveBattle.enemyName}
        isBoss={interactiveBattle.isBoss}
        bossHpMax={interactiveBattle.hp}
        bossAtkVal={interactiveBattle.atk}
        onVictory={(rewards: string[]) => {
          // If boss, reset streak
          if (interactiveBattle.isBoss) {
            player.npcStreak = 0;
          } else {
            player.npcStreak = (player.npcStreak || 0) + 1;
          }
        }}
        onDefeat={() => {
          player.npcStreak = 0;
        }}
      />
    </div>
  );
};
