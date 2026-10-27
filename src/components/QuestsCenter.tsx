import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { QuestItem } from '../types/game';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Trophy,
  Swords,
  Coins,
  Gem,
  Award,
  ChevronRight,
  Flame,
  Shield,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const STORAGE_QUESTS_KEY = 'dragon_battle_quests_progress_v1';

export const QuestsCenter: React.FC = () => {
  const { player, stats, characters, worldRaid, rewardPlayer } = useGame();
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [claimToast, setClaimToast] = useState<string | null>(null);

  // Initialize or load quests state
  const [questsState, setQuestsState] = useState<Record<string, { current: number; claimed: boolean }>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_QUESTS_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Save quest progress
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_QUESTS_KEY, JSON.stringify(questsState));
    } catch (e) {
      console.warn('Failed to save quest progress', e);
    }
  }, [questsState]);

  // Quests definitions with very low, balanced grinding rewards as requested
  const allQuests: QuestItem[] = [
    // --- DAILY QUESTS ---
    {
      id: 'd1_battles',
      category: 'daily',
      title: 'Patrol Sector: Win 3 Arena Battles',
      description: 'Engage enemy forces across the universe and win 3 battles.',
      target: 3,
      current: Math.min(3, player.npcStreak),
      completed: player.npcStreak >= 3,
      claimed: !!questsState['d1_battles']?.claimed,
      reward: { yens: 30, gems: 1, exp: 12 },
    },
    {
      id: 'd2_training',
      category: 'daily',
      title: 'Warrior Conditioning: Train any Fighter',
      description: 'Raise any unlocked fighter by at least 1 training level.',
      target: 1,
      current: characters.some(c => (c.level || 1) >= 2) ? 1 : 0,
      completed: characters.some(c => (c.level || 1) >= 2),
      claimed: !!questsState['d2_training']?.claimed,
      reward: { yens: 25, gems: 1, exp: 10 },
    },
    {
      id: 'd3_planet',
      category: 'daily',
      title: 'Universal Patrol: Explore a Planet',
      description: 'Travel to any planet or complete a sector scan.',
      target: 1,
      current: player.travel ? 1 : 0,
      completed: true,
      claimed: !!questsState['d3_planet']?.claimed,
      reward: { yens: 20, exp: 8 },
    },
    {
      id: 'd4_equipment',
      category: 'daily',
      title: 'Z-Fighter Arsenal: Equip Weapon & Armor',
      description: 'Equip your active warrior with combat gear from inventory.',
      target: 1,
      current: player.weapon && player.armor ? 1 : 0,
      completed: !!(player.weapon && player.armor),
      claimed: !!questsState['d4_equipment']?.claimed,
      reward: { yens: 25, gems: 1 },
    },
    {
      id: 'd5_boss',
      category: 'daily',
      title: 'Elite Challenge: Strike Raid or Summon Boss',
      description: 'Deal damage to a World Raid boss or summon a boss.',
      target: 1,
      current: worldRaid.totalAttacks > 0 ? 1 : 0,
      completed: worldRaid.totalAttacks > 0,
      claimed: !!questsState['d5_boss']?.claimed,
      reward: { yens: 35, gems: 2, exp: 15 },
    },

    // --- WEEKLY QUESTS ---
    {
      id: 'w1_streak',
      category: 'weekly',
      title: 'Planetary Defender: Win 12 Battles',
      description: 'Achieve a winning streak of 12 or more in Combat Arena.',
      target: 12,
      current: Math.min(12, player.npcStreak),
      completed: player.npcStreak >= 12,
      claimed: !!questsState['w1_streak']?.claimed,
      reward: { yens: 120, gems: 4, exp: 30 },
    },
    {
      id: 'w2_fusion',
      category: 'weekly',
      title: 'Metamoran Discipline: Fuse 1 Warrior',
      description: 'Synthesize two warriors in the Fusion Chamber.',
      target: 1,
      current: Math.min(1, player.fusionCount),
      completed: player.fusionCount >= 1,
      claimed: !!questsState['w2_fusion']?.claimed,
      reward: { yens: 90, gems: 3, exp: 20 },
    },
    {
      id: 'w3_raid_dmg',
      category: 'weekly',
      title: 'World Raid Hero: 5 Raid Strikes',
      description: 'Participate in the Multiverse World Raid at least 5 times.',
      target: 5,
      current: Math.min(5, worldRaid.totalAttacks),
      completed: worldRaid.totalAttacks >= 5,
      claimed: !!questsState['w3_raid_dmg']?.claimed,
      reward: { yens: 130, gems: 4, crystals: 1 },
    },
    {
      id: 'w4_roster',
      category: 'weekly',
      title: 'Z-Fighter Army: Own 8 Unique Warriors',
      description: 'Recruit at least 8 fighters to your character roster.',
      target: 8,
      current: Math.min(8, characters.length),
      completed: characters.length >= 8,
      claimed: !!questsState['w4_roster']?.claimed,
      reward: { yens: 110, gems: 3, tickets: 1 },
    },
    {
      id: 'w5_rank',
      category: 'weekly',
      title: 'Martial Ascendant: Reach Rank 2 or Higher',
      description: 'Ascend your martial rank to Super Saiyan or above.',
      target: 2,
      current: Math.min(2, player.rank),
      completed: player.rank >= 2,
      claimed: !!questsState['w5_rank']?.claimed,
      reward: { yens: 150, gems: 5, crystals: 1 },
    },

    // --- MONTHLY QUESTS ---
    {
      id: 'm1_soul_awaken',
      category: 'monthly',
      title: 'Soul Awakening: Awaken 1 Legendary or Mythical Warrior',
      description: 'Consume duplicate souls in the Character Roster to unlock divine Ki glow.',
      target: 1,
      current: characters.some(c => (c.soulAwakeningTier || 0) >= 1) ? 1 : 0,
      completed: characters.some(c => (c.soulAwakeningTier || 0) >= 1),
      claimed: !!questsState['m1_soul_awaken']?.claimed,
      reward: { yens: 250, gems: 8, crystals: 1, tickets: 1 },
    },
    {
      id: 'm2_level_hero',
      category: 'monthly',
      title: 'Omni Mastery: Train a Fighter to Level 30+',
      description: 'Ascend any fighter to Level 30 or higher.',
      target: 30,
      current: Math.min(30, Math.max(...characters.map(c => c.level || 1))),
      completed: characters.some(c => (c.level || 1) >= 30),
      claimed: !!questsState['m2_level_hero']?.claimed,
      reward: { yens: 220, gems: 7, exp: 50 },
    },
    {
      id: 'm3_dragonballs',
      category: 'monthly',
      title: 'Shenron Summoner: Collect 5+ Dragon Balls',
      description: 'Gather at least 5 different Dragon Balls across your journey.',
      target: 5,
      current: Math.min(5, player.crystals > 0 ? 5 : 2),
      completed: true,
      claimed: !!questsState['m3_dragonballs']?.claimed,
      reward: { yens: 180, gems: 6, crystals: 1 },
    },
    {
      id: 'm4_high_rank',
      category: 'monthly',
      title: 'Godly Pillar: Ascend to Rank 4 or Higher',
      description: 'Shatter boundaries and ascend to divine rank tier.',
      target: 4,
      current: Math.min(4, player.rank),
      completed: player.rank >= 4,
      claimed: !!questsState['m4_high_rank']?.claimed,
      reward: { yens: 300, gems: 10, crystals: 2 },
    },
    {
      id: 'm5_battlepower',
      category: 'monthly',
      title: 'Universe Shaker: Attain 1,000,000+ Battle Power',
      description: 'Equip top gear and high-tier warriors to break the 1M BP threshold.',
      target: 1000000,
      current: Math.min(1000000, stats.atk * 1500),
      completed: stats.atk * 1500 >= 1000000,
      claimed: !!questsState['m5_battlepower']?.claimed,
      reward: { yens: 350, gems: 12, crystals: 2, tickets: 1 },
    },
  ];

  const filteredQuests = allQuests.filter(q => q.category === activeTab);
  const completedCount = filteredQuests.filter(q => q.completed).length;
  const claimedCount = filteredQuests.filter(q => q.claimed).length;

  const handleClaim = (quest: QuestItem) => {
    if (!quest.completed || quest.claimed) return;

    // Award player resources
    rewardPlayer({
      yens: quest.reward.yens,
      gems: quest.reward.gems,
      crystals: quest.reward.crystals,
      tickets: quest.reward.tickets,
      exp: quest.reward.exp,
    });

    // Mark as claimed
    setQuestsState(prev => ({
      ...prev,
      [quest.id]: { current: quest.target, claimed: true },
    }));

    confetti({ particleCount: 60, spread: 70 });
    setClaimToast(`Claimed [${quest.title}]! Received reward.`);
    setTimeout(() => setClaimToast(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
              <Award className="w-4 h-4" />
              <span>Kai Mission Board</span>
            </div>
            <h1 className="text-2xl font-black font-heading text-white">
              Daily, Weekly & Monthly Quests
            </h1>
            <p className="text-xs text-slate-400 max-w-lg mt-1">
              Complete disciplined training missions to earn modest, balanced grinding resources.
              Rewards are carefully calibrated for long-term progression.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 px-4 py-2.5 rounded-xl text-center">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Progress</div>
              <div className="text-lg font-black text-amber-300 font-heading">
                {completedCount} / {filteredQuests.length} Done
              </div>
            </div>
          </div>
        </div>

        {claimToast && (
          <div className="mt-4 p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{claimToast}</span>
          </div>
        )}
      </div>

      {/* Category Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'daily', label: 'Daily Quests', icon: Clock, desc: 'Resets Daily' },
          { id: 'weekly', label: 'Weekly Quests', icon: Calendar, desc: 'Resets Weekly' },
          { id: 'monthly', label: 'Monthly Quests', icon: Trophy, desc: 'Resets Monthly' },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-heading transition cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Quests List */}
      <div className="space-y-3">
        {filteredQuests.map(quest => {
          const progressPercent = Math.min(100, Math.floor((quest.current / quest.target) * 100));

          return (
            <div
              key={quest.id}
              className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition ${
                quest.claimed
                  ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                  : quest.completed
                  ? 'bg-slate-900/90 border-amber-500/50 shadow-md shadow-amber-500/10'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-1.5 flex-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-bold text-sm text-white">{quest.title}</h3>
                  {quest.claimed ? (
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      Claimed
                    </span>
                  ) : quest.completed ? (
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      Ready to Claim
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      In Progress
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400">{quest.description}</p>

                {/* Progress bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400">
                    <span>
                      Progress: {quest.current.toLocaleString()} / {quest.target.toLocaleString()}
                    </span>
                    <span>{progressPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        quest.completed ? 'bg-emerald-400' : 'bg-amber-400'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Rewards & Action */}
              <div className="flex items-center gap-4 self-end sm:self-center">
                {/* Reward breakdown */}
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300 bg-slate-950/60 border border-slate-800 px-3 py-1.5 rounded-lg">
                  {quest.reward.yens && (
                    <span className="text-amber-400 font-mono">+{quest.reward.yens} Yens</span>
                  )}
                  {quest.reward.gems && (
                    <span className="text-emerald-400 font-mono">+{quest.reward.gems} Gems</span>
                  )}
                  {quest.reward.crystals && (
                    <span className="text-cyan-400 font-mono">+{quest.reward.crystals} Crystal</span>
                  )}
                  {quest.reward.tickets && (
                    <span className="text-purple-400 font-mono">+{quest.reward.tickets} Ticket</span>
                  )}
                  {quest.reward.exp && (
                    <span className="text-sky-400 font-mono">+{quest.reward.exp} EXP</span>
                  )}
                </div>

                {/* Claim Button */}
                <button
                  onClick={() => handleClaim(quest)}
                  disabled={!quest.completed || quest.claimed}
                  className={`px-4 py-2 rounded-xl text-xs font-black font-heading tracking-wide uppercase transition cursor-pointer ${
                    quest.claimed
                      ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                      : quest.completed
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 hover:scale-105 active:scale-95'
                      : 'bg-slate-800/80 text-slate-500 cursor-not-allowed border border-slate-700/60'
                  }`}
                >
                  {quest.claimed ? 'Claimed' : quest.completed ? 'Claim' : 'Locked'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
