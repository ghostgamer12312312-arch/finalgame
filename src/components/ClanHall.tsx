import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { CLAN_RAIDS, CLAN_CREATE_CRYSTALS } from '../data/gameData';
import {
  Shield,
  Users,
  Coins,
  Gem,
  Sparkles,
  Swords,
  Crown,
  Megaphone,
  Plus,
  LogOut,
  Trash2,
  UserCheck,
  UserX,
  UserMinus,
  Send,
  Skull,
  UserPlus,
  Info,
  Zap,
  Globe,
  TrendingUp,
} from 'lucide-react';
import { DEFAULT_CLAN_PERKS, INITIAL_PLANET_TERRITORIES, ClanPerk, TerritoryControl } from '../logic/clanManager';

export const ClanHall: React.FC = () => {
  const {
    player,
    clan,
    clanMembers,
    clanRaid,
    createClan,
    joinClan,
    leaveClan,
    disbandClan,
    promoteMember,
    demoteOfficer,
    transferLeadership,
    kickMember,
    setClanAnnouncement,
    depositClanTreasure,
    startClanRaid,
    attackClanRaid,
  } = useGame();

  const [activeMenu, setActiveMenu] = useState<'info' | 'members' | 'manage' | 'treasure' | 'raid' | 'announcement' | 'invite' | 'perks' | 'territories'>('info');
  const [clanNameInput, setClanNameInput] = useState('');
  const [joinNameInput, setJoinNameInput] = useState('');
  const [announcementInput, setAnnouncementInput] = useState('');
  const [depositYens, setDepositYens] = useState(10000);
  const [depositGems, setDepositGems] = useState(100);
  const [depositCrystals, setDepositCrystals] = useState(10);
  const [inviteUsername, setInviteUsername] = useState('');
  const [selectedBoss, setSelectedBoss] = useState<string>('Perfect Cell');
  const [feedback, setFeedback] = useState<string | null>(null);

  const [perks, setPerks] = useState<ClanPerk[]>(DEFAULT_CLAN_PERKS);
  const [territories, setTerritories] = useState<TerritoryControl[]>(INITIAL_PLANET_TERRITORIES);

  const handleUpgradePerk = (perkId: string) => {
    const perk = perks.find(p => p.id === perkId);
    if (!perk) return;
    if (perk.level >= perk.maxLevel) {
      setFeedback(`Perk "${perk.name}" is already at maximum level!`);
      setTimeout(() => setFeedback(null), 3000);
      return;
    }
    if (!clan || clan.treasureCrystals < perk.costCrystals) {
      setFeedback(`Insufficient Clan Vault Crystals! Need ${perk.costCrystals} Crystals in vault.`);
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    setPerks(prev =>
      prev.map(p =>
        p.id === perkId
          ? { ...p, level: p.level + 1, costCrystals: Math.floor(p.costCrystals * 1.5) }
          : p
      )
    );
    setFeedback(`✨ Upgraded Clan Perk "${perk.name}" to Level ${perk.level + 1}!`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleContestTerritory = (planetName: string) => {
    if (!clan) return;
    setTerritories(prev =>
      prev.map(t =>
        t.planetName === planetName
          ? {
              ...t,
              controllingClanId: clan.id,
              controllingClanName: clan.name,
              dominancePoints: t.dominancePoints + 2500,
            }
          : t
      )
    );
    setFeedback(`🚩 Clan "${clan.name}" contested and raised dominance over ${planetName}!`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const myMember = clanMembers.find(m => m.userId === player.userId);
  const isLeader = myMember?.role === 'leader';
  const isOfficer = myMember?.role === 'officer' || isLeader;

  const handleCreate = () => {
    if (!clanNameInput.trim()) return;
    const res = createClan(clanNameInput);
    setFeedback(res.message);
    setClanNameInput('');
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleJoin = () => {
    if (!joinNameInput.trim()) return;
    const res = joinClan(joinNameInput);
    setFeedback(res.message);
    setJoinNameInput('');
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleSetAnnouncement = () => {
    if (!announcementInput.trim()) return;
    const res = setClanAnnouncement(announcementInput);
    setFeedback(res.message);
    setAnnouncementInput('');
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleDeposit = () => {
    const res = depositClanTreasure(depositYens, depositGems, depositCrystals);
    setFeedback(res.message);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleInvite = () => {
    if (!inviteUsername.trim()) return;
    setFeedback(`Recruitment scout dispatch sent to @${inviteUsername.trim()}!`);
    setInviteUsername('');
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleStartRaid = () => {
    const res = startClanRaid(selectedBoss);
    setFeedback(res.message);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleAttackRaid = () => {
    const res = attackClanRaid();
    if (res.defeated) {
      setFeedback(`🎉 Clan Raid Boss Slain! Millions of Yens and rare crystals deposited to Clan Treasury!`);
    } else {
      setFeedback(`Dealt ${res.damageDealt.toLocaleString()} damage to ${clanRaid?.bossName}!`);
    }
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Clan Overview Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/30">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
              <Shield className="w-4 h-4 text-indigo-400" />
              <span>Multiverse Clan Alliance System</span>
            </div>
            <h2 className="text-2xl font-black font-heading text-white mt-1">
              {clan ? clan.name : "Clan Fellowship Headquarters"}
            </h2>
            <p className="text-xs text-slate-400 max-w-xl">
              {clan
                ? clan.announcement || "Collaborate with allies to defeat legendary raid bosses and amass cosmic clan treasure."
                : "Form a fellowship of warriors or join an established guild to access Clan Raids and pooled rewards."}
            </p>
          </div>

          {clan && (
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                Role: {myMember?.role.toUpperCase()}
              </span>
              <button
                onClick={leaveClan}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Leave</span>
              </button>
            </div>
          )}
        </div>

        {/* Clan Vault Summary */}
        {clan && (
          <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-4 text-xs font-bold">
            <span className="text-slate-400">Clan Vault:</span>
            <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 text-yellow-400">
              <Coins className="w-3.5 h-3.5" />
              <span>{clan.treasureYens.toLocaleString()} Yens</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 text-emerald-400">
              <Gem className="w-3.5 h-3.5" />
              <span>{clan.treasureGems.toLocaleString()} Gems</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 text-cyan-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{clan.treasureCrystals.toLocaleString()} Crystals</span>
            </div>
          </div>
        )}
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-indigo-300 text-xs font-semibold">
          {feedback}
        </div>
      )}

      {/* NOT IN CLAN: CREATE OR JOIN INTERFACE */}
      {!clan ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-400" />
              <h3 className="font-heading font-black text-lg text-white">1. Create a New Clan</h3>
            </div>
            <p className="text-xs text-slate-400">
              Become a Clan Leader. Founding a clan requires <span className="text-cyan-400 font-bold">{CLAN_CREATE_CRYSTALS} crystals</span> (3-16 characters).
            </p>
            <input
              type="text"
              value={clanNameInput}
              onChange={(e) => setClanNameInput(e.target.value)}
              placeholder="e.g. Z Fighters"
              className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs rounded-xl p-3 focus:outline-none focus:border-amber-400"
            />
            <button
              onClick={handleCreate}
              disabled={player.crystals < CLAN_CREATE_CRYSTALS || !clanNameInput.trim()}
              className="w-full py-2.5 rounded-xl text-xs font-bold font-heading tracking-wider bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 transition cursor-pointer shadow-md disabled:opacity-50"
            >
              CREATE CLAN ({CLAN_CREATE_CRYSTALS} CRYSTALS)
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              <h3 className="font-heading font-black text-lg text-white">2. Join a Clan</h3>
            </div>
            <p className="text-xs text-slate-400">
              Enlist in an existing fellowship of warriors to participate in Clan Raids and pooled rewards.
            </p>
            <input
              type="text"
              value={joinNameInput}
              onChange={(e) => setJoinNameInput(e.target.value)}
              placeholder="e.g. Capsule Corp Allies"
              className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs rounded-xl p-3 focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={handleJoin}
              disabled={!joinNameInput.trim()}
              className="w-full py-2.5 rounded-xl text-xs font-bold font-heading tracking-wider bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 transition cursor-pointer disabled:opacity-50"
            >
              ENLIST IN CLAN
            </button>
          </div>
        </div>
      ) : (
        /* IN CLAN: ALL 9 WORKING COMMANDS / VIEWS */
        <div className="space-y-6">
          {/* Navigation Bar for Clan Options */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800">
            {[
              { id: 'info', label: '3. Clan Info', icon: Info },
              { id: 'members', label: '4. Members', icon: Users },
              { id: 'manage', label: '5. Management', icon: Shield },
              { id: 'treasure', label: '6. Vault Deposit', icon: Coins },
              { id: 'raid', label: '7. Clan Raid', icon: Skull },
              { id: 'announcement', label: '8. Announcement', icon: Megaphone },
              { id: 'invite', label: '9. Invite', icon: UserPlus },
              { id: 'perks', label: '10. Clan Perks', icon: Zap },
              { id: 'territories', label: '11. Dominance', icon: Globe },
            ].map(tab => {
              const Icon = tab.icon;
              const isSelected = activeMenu === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveMenu(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isSelected
                      ? "bg-amber-500 text-slate-950 shadow-md font-black"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* VIEW 3: CLAN INFO */}
          {activeMenu === 'info' && (
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h3 className="font-heading font-black text-xl text-white">Alliance Dossier</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div>Clan Name: <span className="font-bold text-amber-400 text-sm">{clan.name}</span></div>
                  <div>Your Role: <span className="font-bold text-white capitalize">{myMember?.role}</span></div>
                  <div>Total Roster: <span className="font-bold text-white">{clanMembers.length} Active Warriors</span></div>
                  <div>Established: <span className="text-slate-400">{new Date(clan.created).toLocaleDateString()}</span></div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="font-bold text-slate-300">Official Bulletin:</div>
                  <p className="text-slate-400 italic">"{clan.announcement || "No announcement set."}"</p>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 4: MEMBERS ROSTER */}
          {activeMenu === 'members' && (
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h3 className="font-heading font-black text-xl text-white">Clan Members ({clanMembers.length})</h3>
              <div className="divide-y divide-slate-800">
                {clanMembers.map(m => (
                  <div key={m.userId} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      {m.role === 'leader' ? (
                        <Crown className="w-4 h-4 text-amber-400" />
                      ) : m.role === 'officer' ? (
                        <Shield className="w-4 h-4 text-purple-400" />
                      ) : (
                        <Users className="w-3.5 h-3.5 text-slate-500" />
                      )}
                      <div>
                        <div className="font-bold text-white">{m.firstName} (@{m.username})</div>
                        <div className="text-[10px] text-slate-400">Contribution: {m.contributionExp.toLocaleString()} EXP</div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      m.role === 'leader'
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : m.role === 'officer'
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        : "bg-slate-800 text-slate-400"
                    }`}>
                      {m.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 5: CLAN MANAGEMENT */}
          {activeMenu === 'manage' && (
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
              <h3 className="font-heading font-black text-xl text-white">Clan Leadership Control</h3>
              {!isOfficer ? (
                <p className="text-xs text-slate-400">Only Leaders and Officers can manage clan members.</p>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs text-slate-400">
                    Promote members to officer, demote, transfer leadership, or remove inactive members:
                  </p>
                  <div className="space-y-2">
                    {clanMembers.filter(m => m.userId !== player.userId).map(m => (
                      <div key={m.userId} className="p-3 rounded-xl bg-slate-950 border border-slate-850 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{m.firstName}</span>
                          <span className="text-[10px] text-slate-500 capitalize">({m.role})</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {isLeader && m.role === 'member' && (
                            <button
                              onClick={() => promoteMember(m.userId)}
                              className="px-2.5 py-1 rounded bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-[11px] font-bold border border-purple-500/30 transition cursor-pointer"
                            >
                              Promote Officer
                            </button>
                          )}
                          {isLeader && m.role === 'officer' && (
                            <button
                              onClick={() => demoteOfficer(m.userId)}
                              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold border border-slate-700 transition cursor-pointer"
                            >
                              Demote Member
                            </button>
                          )}
                          {isLeader && (
                            <button
                              onClick={() => transferLeadership(m.userId)}
                              className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-bold border border-amber-500/30 transition cursor-pointer"
                            >
                              Transfer Leader
                            </button>
                          )}
                          <button
                            onClick={() => kickMember(m.userId)}
                            className="px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[11px] font-bold border border-rose-500/30 transition cursor-pointer"
                          >
                            Kick
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {isLeader && (
                    <div className="pt-4 border-t border-slate-800 flex justify-end">
                      <button
                        onClick={() => {
                          if (window.confirm("Disband this clan permanently?")) {
                            disbandClan();
                          }
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-500/40 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Disband Clan</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* VIEW 6: CLAN TREASURE DEPOSIT */}
          {activeMenu === 'treasure' && (
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
              <h3 className="font-heading font-black text-xl text-white">Clan Vault Deposit</h3>
              <p className="text-xs text-slate-400">
                Deposit personal resources into the shared Clan Vault to fund alliance expansions and upgrades.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 space-y-2">
                  <label className="text-xs font-bold text-yellow-400">Deposit Yens</label>
                  <input
                    type="number"
                    value={depositYens}
                    onChange={(e) => setDepositYens(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-lg p-2 focus:outline-none"
                  />
                  <div className="text-[10px] text-slate-500">You have: {player.yens.toLocaleString()}</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 space-y-2">
                  <label className="text-xs font-bold text-emerald-400">Deposit Gems</label>
                  <input
                    type="number"
                    value={depositGems}
                    onChange={(e) => setDepositGems(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-lg p-2 focus:outline-none"
                  />
                  <div className="text-[10px] text-slate-500">You have: {player.gems.toLocaleString()}</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 space-y-2">
                  <label className="text-xs font-bold text-cyan-400">Deposit Crystals</label>
                  <input
                    type="number"
                    value={depositCrystals}
                    onChange={(e) => setDepositCrystals(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-lg p-2 focus:outline-none"
                  />
                  <div className="text-[10px] text-slate-500">You have: {player.crystals.toLocaleString()}</div>
                </div>
              </div>

              <button
                onClick={handleDeposit}
                className="w-full py-3 rounded-xl font-heading font-black text-xs tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 transition cursor-pointer shadow-md"
              >
                CONFIRM DEPOSIT TO CLAN VAULT
              </button>
            </div>
          )}

          {/* VIEW 7: CLAN RAID */}
          {activeMenu === 'raid' && (
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skull className="w-5 h-5 text-rose-400" />
                  <h3 className="font-heading font-black text-xl text-white">Clan Raid Chamber</h3>
                </div>
                {clanRaid?.active && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold animate-pulse">
                    RAID IN PROGRESS
                  </span>
                )}
              </div>

              {clanRaid?.active ? (
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-rose-500/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-400 uppercase tracking-wider">Target Raid Boss</div>
                      <div className="text-2xl font-black font-heading text-rose-400">{clanRaid.bossName}</div>
                    </div>
                    <div className="text-right text-xs">
                      <span className="text-slate-400">Remaining HP: </span>
                      <span className="font-bold text-white text-sm">{clanRaid.hp.toLocaleString()} / {clanRaid.maxHp.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-700">
                    <div
                      className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 transition-all duration-300"
                      style={{ width: `${Math.max(0, Math.floor((clanRaid.hp / clanRaid.maxHp) * 100))}%` }}
                    />
                  </div>

                  <div className="flex justify-center pt-2">
                    <button
                      onClick={handleAttackRaid}
                      className="px-8 py-3.5 rounded-xl font-heading font-black text-sm tracking-wider bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-rose-600/30 active:scale-95 transition cursor-pointer flex items-center gap-2"
                    >
                      <Swords className="w-4 h-4" />
                      <span>STRIKE CLAN RAID BOSS</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs text-slate-400">
                    Select a boss to mobilize the clan raid team. Defeating clan bosses yields millions of Yens and thousands of Gems into the vault and bags:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(CLAN_RAIDS).map(([bName, bData]) => (
                      <button
                        key={bName}
                        onClick={() => setSelectedBoss(bName)}
                        className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                          selectedBoss === bName
                            ? "bg-slate-800 border-amber-500 text-white"
                            : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                        }`}
                      >
                        <div className="font-heading font-bold text-sm text-white">{bName}</div>
                        <div className="text-[11px] text-slate-400 mt-1">
                          HP: {bData.hp.toLocaleString()} | Strike: {bData.dmg} DMG
                        </div>
                        <div className="text-[10px] text-amber-400 mt-1 font-semibold">
                          Bounty: {(bData.rewardYens / 1000000).toFixed(0)}M Yens + {bData.rewardCrystals} Crystals
                        </div>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleStartRaid}
                    className="w-full py-3 rounded-xl font-heading font-black text-xs tracking-wider bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-md transition cursor-pointer"
                  >
                    START CLAN RAID: {selectedBoss.toUpperCase()}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* VIEW 8: ANNOUNCEMENT */}
          {activeMenu === 'announcement' && (
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h3 className="font-heading font-black text-xl text-white">Clan Announcement Bulletin</h3>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="text-slate-400 font-semibold">Current Notice:</span>
                <p className="text-amber-300 mt-1 font-medium">{clan.announcement || "No announcement set."}</p>
              </div>

              {isOfficer && (
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-bold text-slate-300">Update Bulletin Text:</label>
                  <textarea
                    value={announcementInput}
                    onChange={(e) => setAnnouncementInput(e.target.value)}
                    placeholder="Enter new clan instructions..."
                    rows={3}
                    className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs rounded-xl p-3 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    onClick={handleSetAnnouncement}
                    disabled={!announcementInput.trim()}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold font-heading tracking-wider bg-amber-500 hover:bg-amber-400 text-slate-950 transition cursor-pointer disabled:opacity-50"
                  >
                    BROADCAST NOTICE
                  </button>
                </div>
              )}
            </div>
          )}

          {/* VIEW 9: INVITE MEMBERS */}
          {activeMenu === 'invite' && (
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h3 className="font-heading font-black text-xl text-white">Recruit & Invite Fighters</h3>
              <p className="text-xs text-slate-400">
                Send a cosmic invitation pigeon to any multiverse warrior by username:
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inviteUsername}
                  onChange={(e) => setInviteUsername(e.target.value)}
                  placeholder="Enter fighter username (e.g. GokuBlack)"
                  className="flex-1 bg-slate-950 border border-slate-700 text-slate-100 text-xs rounded-xl p-3 focus:outline-none focus:border-cyan-400"
                />
                <button
                  onClick={handleInvite}
                  disabled={!inviteUsername.trim()}
                  className="px-6 py-3 rounded-xl text-xs font-bold font-heading tracking-wider bg-cyan-600 hover:bg-cyan-500 text-white transition cursor-pointer disabled:opacity-50"
                >
                  DISPATCH INVITE
                </button>
              </div>
            </div>
          )}

          {/* VIEW 10: CLAN PERKS & RESEARCH TREE */}
          {activeMenu === 'perks' && (
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-black text-xl text-white">Clan Perks & Research</h3>
                  <p className="text-xs text-slate-400">
                    Use Clan Vault Crystals to research passive bonuses shared across all members.
                  </p>
                </div>
                <div className="text-xs font-bold text-cyan-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                  Vault Crystals: {clan.treasureCrystals.toLocaleString()} 🔮
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {perks.map(perk => {
                  const isMax = perk.level >= perk.maxLevel;
                  const canAfford = clan.treasureCrystals >= perk.costCrystals;
                  return (
                    <div
                      key={perk.id}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-850 space-y-2 hover:border-slate-750 transition"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-heading font-bold text-xs text-white flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-amber-400" />
                          <span>{perk.name}</span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-850 text-amber-400">
                          Lv.{perk.level} / {perk.maxLevel}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{perk.description}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                        <span className="text-[11px] text-cyan-400 font-bold">
                          {isMax ? 'MAX LEVEL' : `Cost: ${perk.costCrystals} Crystals`}
                        </span>
                        {isOfficer && !isMax && (
                          <button
                            onClick={() => handleUpgradePerk(perk.id)}
                            disabled={!canAfford}
                            className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 transition cursor-pointer disabled:opacity-40"
                          >
                            Research
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW 11: PLANETARY DOMINANCE & TERRITORY CONTROL */}
          {activeMenu === 'territories' && (
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-black text-xl text-white">Planetary Dominance</h3>
                  <p className="text-xs text-slate-400">
                    Contest control across the 6 Dragon Ball planetary realms to reap hourly tax tributes and exclusive realm perks.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                {territories.map(t => {
                  const isControlledByMe = t.controllingClanId === clan.id;
                  return (
                    <div
                      key={t.planetName}
                      className={`p-4 rounded-xl border space-y-3 transition ${
                        isControlledByMe
                          ? 'bg-amber-950/20 border-amber-500/50'
                          : 'bg-slate-950 border-slate-850'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-heading font-bold text-sm text-white flex items-center gap-1.5">
                          <Globe className="w-4 h-4 text-emerald-400" />
                          <span>{t.planetName}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          isControlledByMe
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {isControlledByMe ? 'CONTROLLED' : 'NEUTRAL / RIVAL'}
                        </span>
                      </div>

                      <div className="text-[11px] space-y-1 text-slate-400">
                        <div>Ruling Clan: <b className="text-slate-200">{t.controllingClanName || 'None (Unclaimed)'}</b></div>
                        <div>Dominance: <b className="text-amber-400">{t.dominancePoints.toLocaleString()} PTS</b></div>
                        <div>Hourly Yield: <b className="text-emerald-400">+{t.hourlyYenTax.toLocaleString()} Yens / +{t.hourlyCrystalTax} Crystals</b></div>
                        <div className="text-[10px] text-amber-300 italic pt-1">{t.buffDescription}</div>
                      </div>

                      <button
                        onClick={() => handleContestTerritory(t.planetName)}
                        className="w-full py-2 rounded-lg text-xs font-bold font-heading bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 transition cursor-pointer"
                      >
                        Contest Territory (+2,500 PTS)
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
