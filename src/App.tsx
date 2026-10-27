import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { CombatArena } from './components/CombatArena';
import { GachaPortal } from './components/GachaPortal';
import { PlanetMap } from './components/PlanetMap';
import { CharacterRoster } from './components/CharacterRoster';
import { FusionChamber } from './components/FusionChamber';
import { ShopInventory } from './components/ShopInventory';
import { SkillsDojo } from './components/SkillsDojo';
import { ShenronAltar } from './components/ShenronAltar';
import { BossSummons } from './components/BossSummons';
import { ClanHall } from './components/ClanHall';
import { WorldRaidLeaderboard } from './components/WorldRaidLeaderboard';
import { DailyRankAltar } from './components/DailyRankAltar';
import { BotTerminalModal } from './components/BotTerminalModal';
import { AdminToolbarModal } from './components/AdminToolbarModal';

import { StorySagaCampaign } from './components/StorySagaCampaign';
import { BattlePass } from './components/BattlePass';
import { WorkspaceHub } from './components/WorkspaceHub';
import { QuestsCenter } from './components/QuestsCenter';

import {
  Swords,
  Sparkles,
  Globe,
  Users,
  Zap,
  ShoppingBag,
  Flame,
  Skull,
  Shield,
  Trophy,
  Calendar,
  BookOpen,
  Award,
  Cloud,
  Target,
} from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('combat');
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const tabs = [
    { id: 'combat', label: 'Combat', icon: Swords },
    { id: 'sagas', label: 'Story Sagas', icon: BookOpen },
    { id: 'summon', label: 'Summon', icon: Sparkles },
    { id: 'travel', label: 'Planets', icon: Globe },
    { id: 'roster', label: 'Warriors', icon: Users },
    { id: 'fusion', label: 'Fusion', icon: Flame },
    { id: 'shop', label: 'Market & Bag', icon: ShoppingBag },
    { id: 'skills', label: 'Ki Dojo', icon: Zap },
    { id: 'shenron', label: 'Shenron', icon: Sparkles },
    { id: 'bosses', label: 'Boss Summons', icon: Skull },
    { id: 'clan', label: 'Clan', icon: Shield },
    { id: 'raid', label: 'World Raid', icon: Trophy },
    { id: 'rewards', label: 'Daily & Rank', icon: Calendar },
    { id: 'quests', label: 'Quests (D/W/M)', icon: Target },
    { id: 'battlepass', label: 'Battle Pass', icon: Award },
    { id: 'workspace', label: 'Google Workspace', icon: Cloud },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar
        onOpenTerminal={() => setIsTerminalOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main navigation tabs */}
      <nav className="bg-slate-900/60 border-b border-slate-800 sticky top-[95px] z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto scrollbar-none py-2">
          <div className="flex items-center gap-1.5 min-w-max">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold font-heading tracking-wide transition cursor-pointer ${
                    isActive
                      ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/80"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-slate-950" : "text-amber-400/80"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {activeTab === 'combat' && <CombatArena />}
        {activeTab === 'sagas' && <StorySagaCampaign />}
        {activeTab === 'summon' && <GachaPortal />}
        {activeTab === 'travel' && <PlanetMap />}
        {activeTab === 'roster' && <CharacterRoster />}
        {activeTab === 'fusion' && <FusionChamber />}
        {activeTab === 'shop' && <ShopInventory />}
        {activeTab === 'skills' && <SkillsDojo />}
        {activeTab === 'shenron' && <ShenronAltar />}
        {activeTab === 'bosses' && <BossSummons />}
        {activeTab === 'clan' && <ClanHall />}
        {activeTab === 'raid' && <WorldRaidLeaderboard />}
        {activeTab === 'rewards' && <DailyRankAltar />}
        {activeTab === 'quests' && <QuestsCenter />}
        {activeTab === 'battlepass' && <BattlePass />}
        {activeTab === 'workspace' && <WorkspaceHub />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-slate-400">Dragon Battle RPG</span>
            <span>•</span>
            <span>Web Edition Port of ghostgamer12312312-arch/dragon</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setIsTerminalOpen(true)}
              className="hover:text-emerald-400 transition cursor-pointer"
            >
              Telegram CLI Terminal
            </button>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="hover:text-amber-400 transition cursor-pointer"
            >
              Developer Cheats
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <BotTerminalModal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
      />
      <AdminToolbarModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}
