export type Rarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythical' | 'sp_plus' | 'omni';

export type ClanRole = 'leader' | 'officer' | 'member';

export interface CharacterItem {
  name: string;
  rarity: Rarity;
  hp: number;
  atk: number;
  speed: number;
  critRate: number; // percentage, e.g. 15 for 15%
  series: string;
  description: string;
  level?: number;
  exp?: number;
  limitBreakTier?: number;
}

export interface EquipmentItem {
  name: string;
  kind: 'weapon' | 'armor';
  statBonus: number; // ATK for weapon, HP for armor
  speedBonus?: number;
  critBonus?: number;
  description: string;
  tier: string;
}

export interface Player {
  userId: number;
  firstName: string;
  username: string;
  exp: number;
  yens: number;
  gems: number;
  crystals: number;
  tickets: number;
  skillPoints: number;
  keysElite: number;
  keysBoss: number;
  npcStreak: number;
  equippedChar: string | null;
  weapon: string | null;
  armor: string | null;
  lastRaidHit: number;
  rank: number;
  admin: boolean;
  banned: boolean;
  dailyDay: string | null;
  dailyStreak: number;
  weeklyWeek: string | null;
  travel: string;
  fusionCount: number;
  currentHp: number;
  maxHp: number;
}

export interface PlanetInfo {
  id: number;
  name: string;
  levelMin: number;
  levelMax: number;
  multiplier: number;
  description: string;
  lore: string;
}

export interface NPC {
  name: string;
  hp: number;
  dmg: number;
  speed: number;
  reward: number;
  description: string;
}

export interface ShopItem {
  id: number;
  name: string;
  price: number;
  currency: 'yens' | 'gems' | 'crystals';
  kind: 'weapon' | 'armor' | 'crystal' | 'ticket' | 'heal' | 'fusion' | 'key_elite' | 'key_boss';
  amount: number;
  healValue?: number; // for healing potions and senzu beans
  statValue?: number;
  description: string;
}

export interface Clan {
  id: number;
  name: string;
  created: number;
  treasureYens: number;
  treasureGems: number;
  treasureCrystals: number;
  announcement: string;
}

export interface ClanMember {
  userId: number;
  clanId: number;
  role: ClanRole;
  firstName: string;
  username: string;
  contributionExp: number;
  joinedAt: number;
}

export interface ClanRaidState {
  clanId: number;
  bossName: string;
  hp: number;
  maxHp: number;
  damageJson: Record<string, number>;
  active: boolean;
}

export interface WorldRaidState {
  id: number;
  bossName: string;
  active: boolean;
  hp: number;
  maxHp: number;
  damageMap: Record<string, number>;
  totalAttacks: number;
}

export interface BattleLogEntry {
  round: number;
  playerDamage: number;
  enemyDamage: number;
  isCrit?: boolean;
  text: string;
  isVictory?: boolean;
  isDefeat?: boolean;
  playerHpLeft?: number;
  enemyHpLeft?: number;
}

export interface BossSummonData {
  id: string;
  name: string;
  hp: number;
  dmg: number;
  rewardMult: number;
  keyType: 'keysElite' | 'keysBoss';
  keyLabel: string;
  description: string;
}
