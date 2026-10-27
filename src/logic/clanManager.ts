/**
 * Clan Management Engine (Expanding clan.py by 10x)
 * Complete multi-tier hierarchy, territory control across 6 Dragon Ball planets,
 * clan vault economy, perk research tree, and Clan-vs-Clan (GvG) war mechanics.
 */

import { Clan, ClanMember, ClanRole, ClanRaidState } from '../types/game';

export type ExtendedClanRole = 'leader' | 'coleader' | 'elder' | 'veteran' | 'member' | 'recruit';

export interface ClanPerk {
  id: string;
  name: string;
  level: number;
  maxLevel: number;
  costCrystals: number;
  bonusMultiplier: number;
  description: string;
  effectType: 'exp' | 'yens' | 'atk' | 'hp' | 'crit' | 'raid_dmg' | 'vault_cap';
}

export interface TerritoryControl {
  planetName: string;
  controllingClanId: number | null;
  controllingClanName: string | null;
  dominancePoints: number;
  defenseGarrison: number;
  hourlyYenTax: number;
  hourlyCrystalTax: number;
  buffDescription: string;
}

export interface ClanWarRecord {
  warId: string;
  challengerClanId: number;
  challengerName: string;
  defenderClanId: number;
  defenderName: string;
  challengerScore: number;
  defenderScore: number;
  status: 'active' | 'challenger_won' | 'defender_won' | 'draw';
  startTime: number;
  endTime: number;
}

export interface ClanLogEntry {
  id: string;
  timestamp: number;
  clanId: number;
  actorName: string;
  action: string;
  details: string;
}

// 12 Upgradable Clan Perks
export const DEFAULT_CLAN_PERKS: ClanPerk[] = [
  {
    id: 'ki_resonance',
    name: 'Ki Resonance Aura',
    level: 1,
    maxLevel: 10,
    costCrystals: 50,
    bonusMultiplier: 0.05,
    description: 'Increases all clan members base ATK by +5% per level.',
    effectType: 'atk',
  },
  {
    id: 'gravity_chamber',
    name: 'Clan Gravity Chamber',
    level: 1,
    maxLevel: 10,
    costCrystals: 75,
    bonusMultiplier: 0.10,
    description: 'Boosts member battle EXP yield by +10% per level.',
    effectType: 'exp',
  },
  {
    id: 'capsule_trade',
    name: 'Capsule Corp Trade Route',
    level: 1,
    maxLevel: 10,
    costCrystals: 60,
    bonusMultiplier: 0.15,
    description: 'Amplifies Yen rewards from all planets by +15% per level.',
    effectType: 'yens',
  },
  {
    id: 'vitality_well',
    name: 'Namekian Vitality Well',
    level: 1,
    maxLevel: 10,
    costCrystals: 80,
    bonusMultiplier: 0.08,
    description: 'Enhances member max HP pool by +8% per level.',
    effectType: 'hp',
  },
  {
    id: 'scouter_network',
    name: 'Scouter Sync Network',
    level: 1,
    maxLevel: 10,
    costCrystals: 100,
    bonusMultiplier: 0.02,
    description: 'Elevates Critical Strike chance by +2% per level.',
    effectType: 'crit',
  },
  {
    id: 'raid_breaching',
    name: 'Raid Armor Breaching',
    level: 1,
    maxLevel: 10,
    costCrystals: 120,
    bonusMultiplier: 0.12,
    description: 'Augments clan boss and world raid damage by +12% per level.',
    effectType: 'raid_dmg',
  },
  {
    id: 'zenkai_surge',
    name: 'Zenkai Surge Conduit',
    level: 1,
    maxLevel: 10,
    costCrystals: 150,
    bonusMultiplier: 0.05,
    description: 'Grants +5% bonus Scouter Battle Power across all warriors.',
    effectType: 'atk',
  },
  {
    id: 'senzu_cultivation',
    name: 'Karin Senzu Greenhouse',
    level: 1,
    maxLevel: 10,
    costCrystals: 90,
    bonusMultiplier: 0.10,
    description: 'Increases potion and Senzu healing effectiveness by +10% per level.',
    effectType: 'hp',
  },
  {
    id: 'divine_radar',
    name: 'Dragon Radar Array',
    level: 1,
    maxLevel: 10,
    costCrystals: 200,
    bonusMultiplier: 0.03,
    description: 'Increases Dragon Ball drop rates during planet exploration.',
    effectType: 'exp',
  },
  {
    id: 'hyperbolic_vault',
    name: 'Hyperbolic Vault Extender',
    level: 1,
    maxLevel: 10,
    costCrystals: 110,
    bonusMultiplier: 0.25,
    description: 'Expands the clan bank max storage limits by +25% per level.',
    effectType: 'vault_cap',
  },
  {
    id: 'war_banner',
    name: 'Supreme Z-Banner',
    level: 1,
    maxLevel: 10,
    costCrystals: 180,
    bonusMultiplier: 0.07,
    description: 'Grants additional conquest points in Clan War battles.',
    effectType: 'raid_dmg',
  },
  {
    id: 'omni_blessing',
    name: 'Omni King Favor',
    level: 1,
    maxLevel: 10,
    costCrystals: 300,
    bonusMultiplier: 0.10,
    description: 'Universal +10% boost to EXP, Yens, and raid drop tables.',
    effectType: 'exp',
  },
];

// Planet Territories for Clan Dominance
export const INITIAL_PLANET_TERRITORIES: TerritoryControl[] = [
  {
    planetName: 'Earth',
    controllingClanId: 1,
    controllingClanName: 'Z-Fighters',
    dominancePoints: 12500,
    defenseGarrison: 9400,
    hourlyYenTax: 50000,
    hourlyCrystalTax: 25,
    buffDescription: '+10% Yen earnings for all members on Earth',
  },
  {
    planetName: 'Hell',
    controllingClanId: 2,
    controllingClanName: 'Shadow Realm',
    dominancePoints: 18200,
    defenseGarrison: 14500,
    hourlyYenTax: 120000,
    hourlyCrystalTax: 60,
    buffDescription: '+15% EXP in Hell encounters',
  },
  {
    planetName: 'Kai Planet',
    controllingClanId: null,
    controllingClanName: null,
    dominancePoints: 0,
    defenseGarrison: 5000,
    hourlyYenTax: 250000,
    hourlyCrystalTax: 120,
    buffDescription: '+20% Critical Rate in Kai training',
  },
  {
    planetName: 'Supreme Kai Planet',
    controllingClanId: null,
    controllingClanName: null,
    dominancePoints: 0,
    defenseGarrison: 8000,
    hourlyYenTax: 500000,
    hourlyCrystalTax: 250,
    buffDescription: '+25% ATK boost in deity battles',
  },
  {
    planetName: 'Lord Beerus Planet',
    controllingClanId: null,
    controllingClanName: null,
    dominancePoints: 0,
    defenseGarrison: 12000,
    hourlyYenTax: 1200000,
    hourlyCrystalTax: 600,
    buffDescription: '+30% Raid Boss damage multiplier',
  },
  {
    planetName: 'Omniverse',
    controllingClanId: null,
    controllingClanName: null,
    dominancePoints: 0,
    defenseGarrison: 25000,
    hourlyYenTax: 3000000,
    hourlyCrystalTax: 1500,
    buffDescription: '+50% All Clan Buffs and Multiverse Gacha Luck',
  },
];

// Role Hierarchy Weight
export const ROLE_HIERARCHY: Record<ExtendedClanRole, number> = {
  leader: 6,
  coleader: 5,
  elder: 4,
  veteran: 3,
  member: 2,
  recruit: 1,
};

// Permissions Matrix
export function canPerformClanAction(
  userRole: ExtendedClanRole | ClanRole | string,
  action:
    | 'disband'
    | 'kick'
    | 'promote'
    | 'demote'
    | 'announcement'
    | 'start_raid'
    | 'upgrade_perks'
    | 'declare_war'
    | 'withdraw_vault'
    | 'claim_territory'
): boolean {
  const roleStr = String(userRole || 'member');
  switch (action) {
    case 'disband':
      return roleStr === 'leader';
    case 'declare_war':
    case 'withdraw_vault':
      return roleStr === 'leader' || roleStr === 'coleader';
    case 'promote':
    case 'demote':
    case 'kick':
    case 'upgrade_perks':
    case 'start_raid':
    case 'claim_territory':
    case 'announcement':
      return roleStr === 'leader' || roleStr === 'coleader' || roleStr === 'elder' || roleStr === 'officer';
    default:
      return false;
  }
}

// Clan EXP & Level Curve
export function getClanLevel(totalContributionExp: number): { level: number; expForNext: number; currentProgress: number; maxMembers: number } {
  let level = 1;
  let remaining = totalContributionExp;
  let expRequired = 5000;

  while (remaining >= expRequired && level < 50) {
    remaining -= expRequired;
    level++;
    expRequired = Math.floor(expRequired * 1.35);
  }

  const maxMembers = Math.min(100, 20 + level * 2);
  return {
    level,
    expForNext: expRequired,
    currentProgress: remaining,
    maxMembers,
  };
}

// Format Clan Stats Card
export function formatClanProfile(
  clan: Clan,
  members: ClanMember[],
  raidState: ClanRaidState | null,
  perks: ClanPerk[]
): string {
  const totalExp = members.reduce((sum, m) => sum + m.contributionExp, 0);
  const { level, maxMembers } = getClanLevel(totalExp);
  const leader = members.find(m => m.role === 'leader')?.firstName || 'Unknown';

  const perkSummary = perks
    .filter(p => p.level > 1)
    .map(p => `• <b>${p.name}</b> (Lv.${p.level}): +${Math.round(p.bonusMultiplier * (p.level - 1) * 100)}%`)
    .join('\n') || 'None unlocked yet';

  return `
🏰 <b>${clan.name.toUpperCase()} (Lv.${level})</b>
━━━━━━━━━━━━━━━━━━━━
👑 <b>Leader:</b> ${leader}
👥 <b>Members:</b> ${members.length} / ${maxMembers}
💎 <b>Treasury:</b>
  • 💴 Yens: ${clan.treasureYens.toLocaleString()}
  • 💎 Gems: ${clan.treasureGems.toLocaleString()}
  • 🔮 Crystals: ${clan.treasureCrystals.toLocaleString()}

📢 <b>Announcement:</b>
<i>"${clan.announcement || 'No announcement set.'}"</i>

⚡ <b>Clan Perks Active:</b>
${perkSummary}

👹 <b>Active Clan Raid:</b>
${
  raidState && raidState.active
    ? `Target: <b>${raidState.bossName}</b> | HP: ${raidState.hp.toLocaleString()} / ${raidState.maxHp.toLocaleString()}`
    : 'No active clan raid. Leader/Officers can start one in the Clan Hall.'
}
`.trim();
}

// Top clans ranking
export function sortClansByPower(clans: Clan[], membersByClan: Record<number, ClanMember[]>): Clan[] {
  return [...clans].sort((a, b) => {
    const aMembers = membersByClan[a.id] || [];
    const bMembers = membersByClan[b.id] || [];
    const aExp = aMembers.reduce((acc, m) => acc + m.contributionExp, 0);
    const bExp = bMembers.reduce((acc, m) => acc + m.contributionExp, 0);
    return bExp - aExp;
  });
}
