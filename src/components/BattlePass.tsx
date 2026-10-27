import React, { useState } from 'react';
import {
  Award,
  Crown,
  CheckCircle2,
  Lock,
  Gift,
  Clock,
  Zap,
  Sparkles,
  Flame,
  Shield,
  Star,
  Swords,
  ChevronRight,
} from 'lucide-react';

interface PassTier {
  tier: number;
  xpRequired: number;
  freeReward: {
    name: string;
    type: 'zeni' | 'gems' | 'item' | 'ticket' | 'hero';
    amount: string;
    icon: string;
    claimed: boolean;
  };
  premiumReward: {
    name: string;
    type: 'gems' | 'crystals' | 'gear' | 'token' | 'hero' | 'item';
    amount: string;
    icon: string;
    claimed: boolean;
  };
}

interface PassTask {
  id: string;
  title: string;
  category: 'daily' | 'weekly' | 'seasonal';
  progress: number;
  target: number;
  xpReward: number;
  completed: boolean;
  claimed: boolean;
}

export function BattlePass() {
  const [activeTab, setActiveTab] = useState<'tiers' | 'tasks'>('tiers');
  const [taskFilter, setTaskFilter] = useState<'daily' | 'weekly' | 'seasonal'>('daily');
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(false);
  const [currentXp, setCurrentXp] = useState(1450); // Level 15
  const [claimedFreeTiers, setClaimedFreeTiers] = useState<number[]>([1, 2, 3, 4, 5]);
  const [claimedPremiumTiers, setClaimedPremiumTiers] = useState<number[]>([]);

  const currentTier = Math.min(30, Math.floor(currentXp / 100) + 1);
  const currentTierProgress = currentXp % 100;

  // 30 Tiers of rewards
  const tiers: PassTier[] = [
    {
      tier: 1,
      xpRequired: 100,
      freeReward: { name: '5,000 Zeni', type: 'zeni', amount: '5,000 Zeni', icon: '💰', claimed: claimedFreeTiers.includes(1) },
      premiumReward: { name: '100 Sacred Gems', type: 'gems', amount: '100 Gems', icon: '💎', claimed: claimedPremiumTiers.includes(1) },
    },
    {
      tier: 2,
      xpRequired: 200,
      freeReward: { name: '3x Senzu Beans', type: 'item', amount: '3x Beans', icon: '🌿', claimed: claimedFreeTiers.includes(2) },
      premiumReward: { name: '50 Chrono Crystals', type: 'crystals', amount: '50 Crystals', icon: '🔮', claimed: claimedPremiumTiers.includes(2) },
    },
    {
      tier: 3,
      xpRequired: 300,
      freeReward: { name: '1x Gacha Ticket', type: 'ticket', amount: '1x Ticket', icon: '🎫', claimed: claimedFreeTiers.includes(3) },
      premiumReward: { name: 'Katchin Steel Blade', type: 'gear', amount: 'Weapon', icon: '🗡️', claimed: claimedPremiumTiers.includes(3) },
    },
    {
      tier: 4,
      xpRequired: 400,
      freeReward: { name: '8,000 Zeni', type: 'zeni', amount: '8,000 Zeni', icon: '💰', claimed: claimedFreeTiers.includes(4) },
      premiumReward: { name: '150 Sacred Gems', type: 'gems', amount: '150 Gems', icon: '💎', claimed: claimedPremiumTiers.includes(4) },
    },
    {
      tier: 5,
      xpRequired: 500,
      freeReward: { name: 'Saiyan Battle Suit', type: 'item', amount: 'Armor', icon: '🛡️', claimed: claimedFreeTiers.includes(5) },
      premiumReward: { name: 'Warrior: Trunks: Xeno (SSJ)', type: 'hero', amount: 'Legendary', icon: '⚡', claimed: claimedPremiumTiers.includes(5) },
    },
    {
      tier: 6,
      xpRequired: 600,
      freeReward: { name: '10,000 Zeni', type: 'zeni', amount: '10,000 Zeni', icon: '💰', claimed: claimedFreeTiers.includes(6) },
      premiumReward: { name: '100 Chrono Crystals', type: 'crystals', amount: '100 Crystals', icon: '🔮', claimed: claimedPremiumTiers.includes(6) },
    },
    {
      tier: 7,
      xpRequired: 700,
      freeReward: { name: '5x Ki Energy Drink', type: 'item', amount: '5x Drinks', icon: '🧪', claimed: claimedFreeTiers.includes(7) },
      premiumReward: { name: 'Dragon Radar Battery', type: 'item', amount: 'Radar +20%', icon: '📡', claimed: claimedPremiumTiers.includes(7) },
    },
    {
      tier: 8,
      xpRequired: 800,
      freeReward: { name: '2x Gacha Tickets', type: 'ticket', amount: '2x Tickets', icon: '🎫', claimed: claimedFreeTiers.includes(8) },
      premiumReward: { name: '200 Sacred Gems', type: 'gems', amount: '200 Gems', icon: '💎', claimed: claimedPremiumTiers.includes(8) },
    },
    {
      tier: 9,
      xpRequired: 900,
      freeReward: { name: '15,000 Zeni', type: 'zeni', amount: '15,000 Zeni', icon: '💰', claimed: claimedFreeTiers.includes(9) },
      premiumReward: { name: 'Tokitoki Golden Feather', type: 'gear', amount: 'Accessory', icon: '🪶', claimed: claimedPremiumTiers.includes(9) },
    },
    {
      tier: 10,
      xpRequired: 1000,
      freeReward: { name: '4-Star Dragon Ball', type: 'item', amount: 'Artifact', icon: '⭐', claimed: claimedFreeTiers.includes(10) },
      premiumReward: { name: 'Warrior: SS4 Gogeta (GT)', type: 'hero', amount: 'Legendary', icon: '🔥', claimed: claimedPremiumTiers.includes(10) },
    },
    {
      tier: 15,
      xpRequired: 1500,
      freeReward: { name: '50,000 Zeni', type: 'zeni', amount: '50,000 Zeni', icon: '💰', claimed: claimedFreeTiers.includes(15) },
      premiumReward: { name: 'Universe Seed Core Fragment', type: 'gear', amount: 'Mythical', icon: '🌌', claimed: claimedPremiumTiers.includes(15) },
    },
    {
      tier: 20,
      xpRequired: 2000,
      freeReward: { name: '5x Gacha Tickets', type: 'ticket', amount: '5x Tickets', icon: '🎫', claimed: claimedFreeTiers.includes(20) },
      premiumReward: { name: 'Warrior: Beast Gohan', type: 'hero', amount: 'Mythical', icon: '⚡', claimed: claimedPremiumTiers.includes(20) },
    },
    {
      tier: 25,
      xpRequired: 2500,
      freeReward: { name: '100,000 Zeni', type: 'zeni', amount: '100,000 Zeni', icon: '💰', claimed: claimedFreeTiers.includes(25) },
      premiumReward: { name: 'Grand Priest Vestment', type: 'gear', amount: 'Omni Tier', icon: '👑', claimed: claimedPremiumTiers.includes(25) },
    },
    {
      tier: 30,
      xpRequired: 3000,
      freeReward: { name: 'Warrior: Ultra Instinct Goku', type: 'hero', amount: 'Mythical', icon: '✨', claimed: claimedFreeTiers.includes(30) },
      premiumReward: { name: 'Ultra Vegito (Limit Breaker SS4)', type: 'hero', amount: 'Transcendent SP+', icon: '💥', claimed: claimedPremiumTiers.includes(30) },
    },
  ];

  const [tasks, setTasks] = useState<PassTask[]>([
    { id: 'd1', title: 'Win 3 Patrol battles on any planet', category: 'daily', progress: 3, target: 3, xpReward: 40, completed: true, claimed: false },
    { id: 'd2', title: 'Complete 1 Beam Struggle clash', category: 'daily', progress: 1, target: 1, xpReward: 50, completed: true, claimed: false },
    { id: 'd3', title: 'Recover HP with a Senzu Bean', category: 'daily', progress: 0, target: 1, xpReward: 30, completed: false, claimed: false },
    { id: 'd4', title: 'Perform 1 Character Summon', category: 'daily', progress: 1, target: 1, xpReward: 40, completed: true, claimed: false },
    { id: 'w1', title: 'Defeat 25 enemies across the cosmos', category: 'weekly', progress: 18, target: 25, xpReward: 150, completed: false, claimed: false },
    { id: 'w2', title: 'Participate in 3 Clan World Raids', category: 'weekly', progress: 3, target: 3, xpReward: 200, completed: true, claimed: false },
    { id: 'w3', title: 'Earn 50,000 Yens from battles & quests', category: 'weekly', progress: 34500, target: 50000, xpReward: 180, completed: false, claimed: false },
    { id: 'w4', title: 'Win 5 Beam Struggles with 100%+ Power', category: 'weekly', progress: 4, target: 5, xpReward: 220, completed: false, claimed: false },
    { id: 's1', title: 'Ascend to Rank 5: Galactic Enforcer', category: 'seasonal', progress: 3, target: 5, xpReward: 400, completed: false, claimed: false },
    { id: 's2', title: 'Collect all 7 Dragon Balls & Make a Wish', category: 'seasonal', progress: 5, target: 7, xpReward: 500, completed: false, claimed: false },
    { id: 's3', title: 'Clear the Universe Tree SDBH Saga', category: 'seasonal', progress: 6, target: 6, xpReward: 600, completed: true, claimed: false },
  ]);

  const handleClaimFreeReward = (tierNum: number) => {
    if (currentTier >= tierNum && !claimedFreeTiers.includes(tierNum)) {
      setClaimedFreeTiers(prev => [...prev, tierNum]);
    }
  };

  const handleClaimPremiumReward = (tierNum: number) => {
    if (isPremiumUnlocked && currentTier >= tierNum && !claimedPremiumTiers.includes(tierNum)) {
      setClaimedPremiumTiers(prev => [...prev, tierNum]);
    }
  };

  const handleClaimTask = (taskId: string, xpBonus: number) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, claimed: true } : t))
    );
    setCurrentXp(prev => prev + xpBonus);
  };

  const handleClaimAllAvailable = () => {
    const newFree: number[] = [];
    const newPrem: number[] = [];
    tiers.forEach(t => {
      if (currentTier >= t.tier) {
        if (!claimedFreeTiers.includes(t.tier)) newFree.push(t.tier);
        if (isPremiumUnlocked && !claimedPremiumTiers.includes(t.tier)) newPrem.push(t.tier);
      }
    });
    setClaimedFreeTiers(prev => [...prev, ...newFree]);
    if (isPremiumUnlocked) setClaimedPremiumTiers(prev => [...prev, ...newPrem]);
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 border border-amber-500/30 p-6 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-widest flex items-center gap-1">
                <Crown className="w-3 h-3 text-amber-400" />
                Season 1: Omni Transcendence
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> 18 Days Left
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-wide">
              SUPER HEROES BATTLE PASS
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Complete daily, weekly, and seasonal trials to level up your pass and unlock
              exclusive Dragon Ball Super Heroes 2 warriors, Z-Swords, and Grand Priest attire!
            </p>
          </div>

          {/* Pass Unlock & Tier Status */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-3 text-center w-full sm:w-auto min-w-[130px]">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Current Tier</span>
              <div className="text-2xl font-black text-amber-400 font-heading">
                Tier {currentTier}
                <span className="text-xs font-normal text-slate-400"> / 30</span>
              </div>
            </div>

            {!isPremiumUnlocked ? (
              <button
                onClick={() => setIsPremiumUnlocked(true)}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition transform active:scale-95"
              >
                <Crown className="w-4 h-4 text-slate-950 fill-current" />
                <span>Unlock Premium Pass</span>
              </button>
            ) : (
              <div className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Premium Pass Active</span>
              </div>
            )}
          </div>
        </div>

        {/* Level Progress Bar */}
        <div className="relative z-10 mt-6 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Tier {currentTier} XP Progress: <b>{currentTierProgress} / 100 XP</b>
            </span>
            <span className="text-slate-400">Total Pass XP: {currentXp.toLocaleString()}</span>
          </div>
          <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${currentTierProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('tiers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-heading transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'tiers'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Tier Rewards</span>
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-heading transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'tasks'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Pass Missions</span>
          </button>
        </div>

        <button
          onClick={handleClaimAllAvailable}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs border border-slate-700 hover:border-amber-500/40 transition cursor-pointer flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Claim All Unlocked</span>
        </button>
      </div>

      {/* TAB 1: TIERS DISPLAY */}
      {activeTab === 'tiers' && (
        <div className="space-y-4">
          <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-800">
            <div className="min-w-[850px] space-y-3">
              {/* Header Label Row */}
              <div className="grid grid-cols-12 gap-3 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <div className="col-span-2 text-center">Tier</div>
                <div className="col-span-5 flex items-center gap-1 text-slate-300">
                  <Star className="w-3.5 h-3.5 text-slate-400" />
                  Free Track Rewards
                </div>
                <div className="col-span-5 flex items-center gap-1 text-amber-300">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  Premium Track (SDBH Exclusive)
                </div>
              </div>

              {/* Tiers List */}
              {tiers.map(t => {
                const isUnlocked = currentTier >= t.tier;
                const freeClaimed = claimedFreeTiers.includes(t.tier);
                const premiumClaimed = claimedPremiumTiers.includes(t.tier);

                return (
                  <div
                    key={t.tier}
                    className={`grid grid-cols-12 gap-3 items-center p-3 rounded-xl border transition ${
                      isUnlocked
                        ? 'bg-slate-900/80 border-slate-800'
                        : 'bg-slate-950/40 border-slate-900 opacity-75'
                    }`}
                  >
                    {/* Tier badge */}
                    <div className="col-span-2 flex flex-col items-center justify-center bg-slate-950 border border-slate-800/80 rounded-lg py-2">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Tier</span>
                      <span className="text-base font-black text-white font-heading">{t.tier}</span>
                      {isUnlocked && (
                        <span className="text-[9px] text-emerald-400 font-semibold flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Unlocked
                        </span>
                      )}
                    </div>

                    {/* Free Track Card */}
                    <div className="col-span-5 flex items-center justify-between p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/60">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{t.freeReward.icon}</span>
                        <div>
                          <div className="text-xs font-bold text-slate-200">{t.freeReward.name}</div>
                          <div className="text-[10px] text-slate-400">{t.freeReward.amount}</div>
                        </div>
                      </div>

                      {freeClaimed ? (
                        <span className="px-2 py-1 rounded bg-slate-800 text-[10px] text-slate-400 font-semibold">
                          Claimed
                        </span>
                      ) : isUnlocked ? (
                        <button
                          onClick={() => handleClaimFreeReward(t.tier)}
                          className="px-2.5 py-1 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] transition cursor-pointer"
                        >
                          Claim
                        </button>
                      ) : (
                        <span className="text-slate-600 text-xs flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                        </span>
                      )}
                    </div>

                    {/* Premium Track Card */}
                    <div
                      className={`col-span-5 flex items-center justify-between p-2.5 rounded-lg border ${
                        isPremiumUnlocked
                          ? 'bg-gradient-to-r from-amber-950/30 to-slate-950 border-amber-500/30'
                          : 'bg-slate-950/40 border-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{t.premiumReward.icon}</span>
                        <div>
                          <div className="text-xs font-bold text-amber-200">{t.premiumReward.name}</div>
                          <div className="text-[10px] text-amber-400/80">{t.premiumReward.amount}</div>
                        </div>
                      </div>

                      {!isPremiumUnlocked ? (
                        <span className="text-amber-500/50 text-xs flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                        </span>
                      ) : premiumClaimed ? (
                        <span className="px-2 py-1 rounded bg-slate-800 text-[10px] text-slate-400 font-semibold">
                          Claimed
                        </span>
                      ) : isUnlocked ? (
                        <button
                          onClick={() => handleClaimPremiumReward(t.tier)}
                          className="px-2.5 py-1 rounded-md bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-[10px] transition cursor-pointer"
                        >
                          Claim
                        </button>
                      ) : (
                        <span className="text-slate-600 text-xs flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MISSIONS / TASKS */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2">
            {(['daily', 'weekly', 'seasonal'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setTaskFilter(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition cursor-pointer ${
                  taskFilter === cat
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat} Tasks
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tasks
              .filter(t => t.category === taskFilter)
              .map(task => {
                const isReady = task.progress >= task.target && !task.claimed;

                return (
                  <div
                    key={task.id}
                    className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200">{task.title}</span>
                        <span className="text-[11px] font-black text-amber-400 flex items-center gap-1">
                          +{task.xpReward} Pass XP
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>Progress</span>
                          <span>
                            {task.progress.toLocaleString()} / {task.target.toLocaleString()}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full"
                            style={{
                              width: `${Math.min(100, Math.floor((task.progress / task.target) * 100))}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      {task.claimed ? (
                        <span className="px-2.5 py-1 rounded bg-slate-800 text-[10px] text-slate-400 font-semibold">
                          Claimed
                        </span>
                      ) : isReady ? (
                        <button
                          onClick={() => handleClaimTask(task.id, task.xpReward)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer"
                        >
                          Claim
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-500 font-medium">In Progress</span>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
