import React, { useState, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { Rarity, CharacterItem } from '../types/game';
import { RARITY_COLORS } from '../data/gameData';
import {
  computeWarriorProgression,
  getTrainingCost,
  getLimitBreakCost,
  ProgressionStats,
} from '../logic/characterProgression';
import {
  Check,
  Shield,
  Swords,
  Zap,
  Flame,
  Crown,
  Sparkles,
  Search,
  ArrowUpDown,
  Dumbbell,
  X,
  Lock,
  Unlock,
  ChevronRight,
  Coins,
  Gem,
} from 'lucide-react';

export const CharacterRoster: React.FC = () => {
  const { player, characters, equipCharacter, trainWarrior, limitBreakWarrior } = useGame();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'bp' | 'level' | 'rarity' | 'atk' | 'hp'>('bp');
  const [selectedWarrior, setSelectedWarrior] = useState<CharacterItem | null>(null);
  const [trainingFeedback, setTrainingFeedback] = useState<string | null>(null);

  const rarityTiers: { id: Rarity; label: string; badgeColor: string }[] = [
    { id: 'omni', label: 'Omni Kings', badgeColor: 'border-cyan-400 text-cyan-300 bg-cyan-950/80' },
    { id: 'sp_plus', label: 'SP+ (Super Heroes 2)', badgeColor: 'border-amber-400 text-amber-300 bg-gradient-to-r from-red-950/90 via-purple-950/90 to-amber-950/90' },
    { id: 'mythical', label: 'Mythical Warriors', badgeColor: 'border-rose-500 text-rose-300 bg-rose-950/80' },
    { id: 'legendary', label: 'Legendary Warriors', badgeColor: 'border-amber-500 text-amber-300 bg-amber-950/80' },
    { id: 'epic', label: 'Epic Warriors', badgeColor: 'border-purple-500 text-purple-300 bg-purple-950/80' },
    { id: 'rare', label: 'Rare Warriors', badgeColor: 'border-blue-500 text-blue-300 bg-blue-950/80' },
    { id: 'common', label: 'Common Recruits', badgeColor: 'border-slate-600 text-slate-300 bg-slate-900/80' },
  ];

  // Active equipped fighter
  const equipped = characters.find(c => c.name === player.equippedChar);
  const equippedProgression = equipped ? computeWarriorProgression(equipped) : null;

  // Filter & sort logic
  const processedCharacters = useMemo(() => {
    let list = characters.filter(c => {
      const matchesTab = activeTab === 'all' || c.rarity === activeTab;
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.series && c.series.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesTab && matchesSearch;
    });

    list.sort((a, b) => {
      const progA = computeWarriorProgression(a);
      const progB = computeWarriorProgression(b);

      if (sortBy === 'bp') return progB.battlePower - progA.battlePower;
      if (sortBy === 'level') return progB.level - progA.level;
      if (sortBy === 'atk') return progB.atk - progA.atk;
      if (sortBy === 'hp') return progB.hp - progA.hp;
      return 0;
    });

    return list;
  }, [characters, activeTab, searchQuery, sortBy]);

  // Group characters strictly by rank for separated views
  const groupedCharacters = rarityTiers.map(tier => ({
    ...tier,
    list: processedCharacters.filter(c => c.rarity === tier.id),
  }));

  // Selected warrior for training
  const currentSelectedChar = selectedWarrior ? characters.find(c => c.name === selectedWarrior.name) || selectedWarrior : null;
  const currentSelectedProgression: ProgressionStats | null = currentSelectedChar ? computeWarriorProgression(currentSelectedChar) : null;

  const handleTrain = (levels: number) => {
    if (!currentSelectedChar) return;
    const res = trainWarrior(currentSelectedChar.name, levels);
    setTrainingFeedback(res.message);
    setTimeout(() => setTrainingFeedback(null), 3500);
  };

  const handleLimitBreak = () => {
    if (!currentSelectedChar) return;
    const res = limitBreakWarrior(currentSelectedChar.name);
    setTrainingFeedback(res.message);
    setTimeout(() => setTrainingFeedback(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Active Leader Banner with Progression Engine */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>Active Lead Fighter & Battle Scouter</span>
          </div>
          <div className="flex flex-wrap items-baseline gap-3 mt-1">
            <h2 className="text-3xl font-black font-heading text-white">
              {equipped ? equipped.name : "None Equipped"}
            </h2>
            {equippedProgression && (
              <span className="text-xs font-black px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                ⚡ BP: {equippedProgression.battlePower.toLocaleString()}
              </span>
            )}
          </div>

          {equippedProgression && equipped && (
            <div className="space-y-2 mt-2">
              <div className="flex flex-wrap items-center gap-2.5 text-xs">
                <span className={`px-2 py-0.5 rounded font-black uppercase ${RARITY_COLORS[equipped.rarity].bg} ${RARITY_COLORS[equipped.rarity].text} border ${RARITY_COLORS[equipped.rarity].border}`}>
                  {equipped.rarity === 'sp_plus' ? 'SP+ SDBH' : equipped.rarity}
                </span>
                <span className="text-slate-300 font-semibold bg-slate-950/70 px-2 py-0.5 rounded border border-slate-800">
                  Level {equippedProgression.level} / {equippedProgression.maxLevel}
                </span>
                <span className="text-rose-400 font-bold">+{equippedProgression.atk} ATK</span>
                <span className="text-emerald-400 font-bold">+{equippedProgression.hp} HP</span>
                <span className="text-cyan-400 font-bold">+{equippedProgression.speed} SPD</span>
                <span className="text-amber-400 font-bold">+{equippedProgression.critRate}% CRIT</span>
              </div>

              {/* EXP Progress bar */}
              <div className="w-full max-w-md bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-amber-500 to-orange-500 h-full transition-all duration-300"
                  style={{ width: `${equippedProgression.expProgressPercent}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-400">
                EXP: {equippedProgression.currentExp.toLocaleString()} / {equippedProgression.expToNextLevel.toLocaleString()} ({equippedProgression.expProgressPercent}%) to next level
              </div>
            </div>
          )}
        </div>

        {/* Resources available for training */}
        <div className="text-xs text-slate-400 bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex flex-col gap-1.5 min-w-[200px]">
          <div className="font-bold text-white text-xs uppercase tracking-wider mb-0.5">Training Vault:</div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1"><Coins className="w-3.5 h-3.5 text-amber-400" /> Yens:</span>
            <span className="font-bold text-amber-300">{player.yens.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1"><Gem className="w-3.5 h-3.5 text-cyan-400" /> Gems:</span>
            <span className="font-bold text-cyan-300">{player.gems.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-purple-400" /> Crystals:</span>
            <span className="font-bold text-purple-300">{player.crystals.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Search & Sort Controls Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-slate-900/70 p-4 rounded-xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search warriors by name, series, or form..."
            className="w-full bg-slate-950 text-slate-200 text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-950 text-slate-200 text-xs px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-400"
          >
            <option value="bp">Battle Power (BP)</option>
            <option value="level">Level</option>
            <option value="atk">Attack (ATK)</option>
            <option value="hp">Health (HP)</option>
          </select>
        </div>
      </div>

      {/* Rarity Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
            activeTab === 'all'
              ? "bg-amber-500 text-slate-950 font-black shadow-md"
              : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
          }`}
        >
          All Ranks ({characters.length})
        </button>
        {rarityTiers.map(t => {
          const count = characters.filter(c => c.rarity === t.id).length;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                activeTab === t.id
                  ? "bg-amber-500 text-slate-950 font-black shadow-md"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {t.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Separated Sections by Rank */}
      <div className="space-y-8">
        {groupedCharacters.map(group => {
          if (activeTab !== 'all' && activeTab !== group.id) return null;
          if (group.list.length === 0) return null;

          return (
            <div key={group.id} className="space-y-3">
              {/* Group Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded text-xs font-black uppercase border ${group.badgeColor}`}>
                    {group.label}
                  </span>
                  <span className="text-xs text-slate-400">({group.list.length} Warriors Owned)</span>
                </div>
              </div>

              {/* Characters Grid for this rank */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {group.list.map(char => {
                  const isEquipped = player.equippedChar === char.name;
                  const style = RARITY_COLORS[char.rarity];
                  const prog = computeWarriorProgression(char);

                  return (
                    <div
                      key={char.name}
                      className={`p-4 rounded-xl border flex flex-col justify-between transition-all hover:scale-[1.02] ${style.bg} ${style.border} ${
                        char.rarity === 'omni'
                          ? 'omni-glow'
                          : char.rarity === 'sp_plus'
                          ? 'ring-1 ring-amber-400 shadow-[0_0_22px_rgba(245,158,11,0.35)]'
                          : ''
                      } ${isEquipped ? 'ring-2 ring-amber-400 shadow-lg' : ''}`}
                    >
                      <div>
                        {/* Header: Rarity + Level & BP */}
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${style.text} bg-slate-950/60 border border-current`}>
                            {char.rarity === 'sp_plus' ? 'SP+ SDBH' : char.rarity}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold text-slate-300 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">
                              Lv.{prog.level}/{prog.maxLevel}
                            </span>
                            {isEquipped && (
                              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40">
                                ACTIVE
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Name & Scouter Battle Power */}
                        <h3 className="font-heading font-black text-base text-white mt-2 leading-tight">
                          {char.name}
                        </h3>

                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-xs font-black text-amber-300">
                            ⚡ BP: {prog.battlePower.toLocaleString()}
                          </span>
                          {prog.limitBreakTier > 0 && (
                            <span className="text-[9px] font-black text-purple-300 bg-purple-950/80 px-1 rounded border border-purple-500/40">
                              ★ LB{prog.limitBreakTier}
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                          {char.description || char.series}
                        </p>

                        {/* Mini EXP Bar */}
                        <div className="mt-2.5 space-y-1">
                          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-amber-400 h-full"
                              style={{ width: `${prog.expProgressPercent}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[9px] text-slate-400">
                            <span>EXP: {prog.expProgressPercent}%</span>
                            {prog.unlockedTalents.length > 0 && (
                              <span className="text-emerald-400 font-semibold">
                                {prog.unlockedTalents.length} Talents Active
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Scaled Attributes */}
                        <div className="mt-3 grid grid-cols-2 gap-1.5 text-[11px] font-semibold">
                          <div className="flex items-center gap-1 text-rose-300 bg-slate-950/50 p-1 rounded">
                            <Swords className="w-3 h-3 text-rose-400" />
                            <span>+{prog.atk} ATK</span>
                          </div>
                          <div className="flex items-center gap-1 text-emerald-300 bg-slate-950/50 p-1 rounded">
                            <Shield className="w-3 h-3 text-emerald-400" />
                            <span>+{prog.hp} HP</span>
                          </div>
                          <div className="flex items-center gap-1 text-cyan-300 bg-slate-950/50 p-1 rounded">
                            <Zap className="w-3 h-3 text-cyan-400" />
                            <span>+{prog.speed} SPD</span>
                          </div>
                          <div className="flex items-center gap-1 text-amber-300 bg-slate-950/50 p-1 rounded">
                            <Flame className="w-3 h-3 text-amber-400" />
                            <span>+{prog.critRate}% CRIT</span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons: Train & Equip */}
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setSelectedWarrior(char)}
                          className="py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 hover:border-amber-400 cursor-pointer transition"
                        >
                          <Dumbbell className="w-3.5 h-3.5" />
                          <span>Train</span>
                        </button>

                        <button
                          onClick={() => equipCharacter(char.name)}
                          disabled={isEquipped}
                          className={`py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition ${
                            isEquipped
                              ? "bg-amber-500 text-slate-950 font-black cursor-default"
                              : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-amber-400 cursor-pointer"
                          }`}
                        >
                          {isEquipped ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Equipped</span>
                            </>
                          ) : (
                            <span>Equip</span>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Warrior Progression & Training Modal */}
      {currentSelectedChar && currentSelectedProgression && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-black uppercase px-2 py-0.5 rounded ${RARITY_COLORS[currentSelectedChar.rarity].bg} ${RARITY_COLORS[currentSelectedChar.rarity].text} border ${RARITY_COLORS[currentSelectedChar.rarity].border}`}>
                    {currentSelectedChar.rarity === 'sp_plus' ? 'SP+ (Super Heroes 2)' : currentSelectedChar.rarity}
                  </span>
                  <span className="text-xs text-slate-400">{currentSelectedChar.series}</span>
                </div>
                <h3 className="text-2xl font-black font-heading text-white mt-1">
                  {currentSelectedChar.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedWarrior(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {trainingFeedback && (
              <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-bold">
                {trainingFeedback}
              </div>
            )}

            {/* Combat Power & Level Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Battle Power (BP)</div>
                <div className="text-xl font-black text-amber-300 font-heading mt-0.5">
                  ⚡ {currentSelectedProgression.battlePower.toLocaleString()}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Level Progression</div>
                <div className="text-xl font-black text-white font-heading mt-0.5">
                  Lv. {currentSelectedProgression.level} <span className="text-xs text-slate-400 font-normal">/ {currentSelectedProgression.maxLevel}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Limit Break Status</div>
                <div className="text-xl font-black text-purple-300 font-heading mt-0.5">
                  Tier {currentSelectedProgression.limitBreakTier} / 2
                </div>
              </div>
            </div>

            {/* EXP Progress */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/50 border border-slate-800">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Experience to Next Level:</span>
                <span className="text-amber-300">
                  {currentSelectedProgression.currentExp.toLocaleString()} / {currentSelectedProgression.expToNextLevel.toLocaleString()} ({currentSelectedProgression.expProgressPercent}%)
                </span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-500 to-orange-500 h-full transition-all duration-300"
                  style={{ width: `${currentSelectedProgression.expProgressPercent}%` }}
                />
              </div>
            </div>

            {/* Scaled Attribute Matrix */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Martial Attributes & Level Growth
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-rose-500/20 text-center">
                  <div className="text-[10px] text-rose-400 font-bold uppercase">Attack</div>
                  <div className="text-lg font-black text-white">{currentSelectedProgression.atk}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-emerald-500/20 text-center">
                  <div className="text-[10px] text-emerald-400 font-bold uppercase">Health</div>
                  <div className="text-lg font-black text-white">{currentSelectedProgression.hp}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-cyan-500/20 text-center">
                  <div className="text-[10px] text-cyan-400 font-bold uppercase">Speed</div>
                  <div className="text-lg font-black text-white">{currentSelectedProgression.speed}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-amber-500/20 text-center">
                  <div className="text-[10px] text-amber-400 font-bold uppercase">Critical Rate</div>
                  <div className="text-lg font-black text-white">{currentSelectedProgression.critRate}%</div>
                </div>
              </div>
            </div>

            {/* Milestone Talents & Passives */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Ascended Milestone Talents</span>
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {[
                  { level: 10, name: 'Ki Surge', desc: '+8% ATK & +3 Speed' },
                  { level: 25, name: 'Z-Fighter Tenacity', desc: '+12% Max HP & +2% Crit Rate' },
                  { level: 50, name: 'God Ki Resonance', desc: '+15% ATK, +5% Crit & +5 Speed' },
                  { level: 75, name: 'Dimension Shatter', desc: '+20% ATK & +15% HP' },
                  { level: 100, name: 'Omniversal Transcendence', desc: '+30% All Base Attributes' },
                ].map(talent => {
                  const isUnlocked = currentSelectedProgression.level >= talent.level;
                  return (
                    <div
                      key={talent.level}
                      className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition ${
                        isUnlocked
                          ? "bg-purple-950/40 border-purple-500/40 text-purple-200"
                          : "bg-slate-950/40 border-slate-800 text-slate-500 opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isUnlocked ? <Unlock className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5 text-slate-600" />}
                        <div>
                          <span className="font-bold text-white mr-1.5">{talent.name}</span>
                          <span className="text-[10px] text-slate-400">(Lv. {talent.level})</span>
                          <div className="text-[11px] text-slate-300">{talent.desc}</div>
                        </div>
                      </div>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${isUnlocked ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-900 text-slate-500'}`}>
                        {isUnlocked ? 'ACTIVE' : 'LOCKED'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Training Action Buttons */}
            <div className="border-t border-slate-800 pt-4 space-y-3">
              {currentSelectedProgression.isMaxLevel ? (
                <div className="space-y-2">
                  <div className="text-xs text-amber-300 font-semibold bg-amber-950/50 p-2.5 rounded-xl border border-amber-500/40">
                    Max level reached for current tier! Perform a Limit Break to unlock the next level cap (+15 levels).
                  </div>
                  {currentSelectedProgression.canLimitBreak && (
                    <button
                      onClick={handleLimitBreak}
                      className="w-full py-3 rounded-xl font-heading font-black text-xs uppercase tracking-wider bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white shadow-xl hover:scale-[1.02] active:scale-95 transition cursor-pointer"
                    >
                      Ascend Limit Break (Tier {currentSelectedProgression.limitBreakTier + 1})
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {(() => {
                    const cost1 = getTrainingCost(currentSelectedProgression.level, currentSelectedChar.rarity, 1);
                    const canAfford1 = player.yens >= cost1.yens && player.gems >= cost1.gems && player.crystals >= cost1.crystals;

                    return (
                      <button
                        onClick={() => handleTrain(1)}
                        disabled={!canAfford1}
                        className={`p-3 rounded-xl flex flex-col items-center justify-center text-xs font-bold transition cursor-pointer ${
                          canAfford1
                            ? "bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 hover:border-amber-400"
                            : "bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed opacity-60"
                        }`}
                      >
                        <span className="font-heading font-black text-sm text-amber-300">TRAIN +1 LEVEL</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">
                          Cost: {cost1.yens.toLocaleString()} Yens {cost1.gems > 0 ? `| ${cost1.gems} Gems` : ''}
                        </span>
                      </button>
                    );
                  })()}

                  {(() => {
                    const cost5 = getTrainingCost(currentSelectedProgression.level, currentSelectedChar.rarity, 5);
                    const canAfford5 = player.yens >= cost5.yens && player.gems >= cost5.gems && player.crystals >= cost5.crystals;

                    return (
                      <button
                        onClick={() => handleTrain(5)}
                        disabled={!canAfford5}
                        className={`p-3 rounded-xl flex flex-col items-center justify-center text-xs font-bold transition cursor-pointer ${
                          canAfford5
                            ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black shadow-lg hover:scale-105 active:scale-95"
                            : "bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed opacity-60"
                        }`}
                      >
                        <span className="font-heading font-black text-sm">TRAIN +5 LEVELS</span>
                        <span className="text-[10px] text-slate-900 font-semibold mt-0.5">
                          Cost: {cost5.yens.toLocaleString()} Yens {cost5.gems > 0 ? `| ${cost5.gems} Gems` : ''}
                        </span>
                      </button>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
