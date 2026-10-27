import { Rarity, CharacterItem } from '../types/game';
import { RANK_STAT_CONFIGS } from '../data/characterStats';

export interface MilestoneTalent {
  level: number;
  name: string;
  description: string;
  statModifier: {
    atkPercent?: number;
    hpPercent?: number;
    speedBonus?: number;
    critBonus?: number;
  };
}

export interface SoulAwakeningTierInfo {
  tier: number;
  name: string;
  auraTitle: string;
  glowClass: string;
  cardAuraClass: string;
  atkBonusPercent: number;
  hpBonusPercent: number;
  speedBonus: number;
  critBonus: number;
  duplicatesRequired: number;
  crystalsRequired: number;
  colorHex: string;
}

export const SOUL_AWAKENING_CONFIG: Record<number, SoulAwakeningTierInfo> = {
  1: {
    tier: 1,
    name: 'Awakened Ki I',
    auraTitle: 'Golden Super Saiyan Flare',
    glowClass: 'shadow-[0_0_20px_rgba(245,158,11,0.6)] border-amber-400',
    cardAuraClass: 'ring-2 ring-amber-400/80 shadow-lg shadow-amber-500/40 bg-gradient-to-t from-amber-950/30 via-transparent to-amber-900/20',
    atkBonusPercent: 12,
    hpBonusPercent: 12,
    speedBonus: 4,
    critBonus: 2,
    duplicatesRequired: 1,
    crystalsRequired: 1,
    colorHex: '#f59e0b',
  },
  2: {
    tier: 2,
    name: 'Super Soul II',
    auraTitle: 'Super Saiyan Blue Godly Ki',
    glowClass: 'shadow-[0_0_25px_rgba(14,165,233,0.7)] border-sky-400',
    cardAuraClass: 'ring-2 ring-sky-400/90 shadow-xl shadow-sky-500/50 bg-gradient-to-t from-sky-950/40 via-transparent to-cyan-900/30',
    atkBonusPercent: 25,
    hpBonusPercent: 25,
    speedBonus: 8,
    critBonus: 4,
    duplicatesRequired: 1,
    crystalsRequired: 2,
    colorHex: '#0ea5e9',
  },
  3: {
    tier: 3,
    name: 'God Soul III',
    auraTitle: 'Crimson God of Destruction Aura',
    glowClass: 'shadow-[0_0_30px_rgba(244,63,94,0.8)] border-rose-500',
    cardAuraClass: 'ring-2 ring-rose-500 shadow-2xl shadow-rose-600/60 bg-gradient-to-t from-rose-950/40 via-transparent to-red-900/30',
    atkBonusPercent: 40,
    hpBonusPercent: 40,
    speedBonus: 12,
    critBonus: 6,
    duplicatesRequired: 1,
    crystalsRequired: 3,
    colorHex: '#f43f5e',
  },
  4: {
    tier: 4,
    name: 'Instinct Soul IV',
    auraTitle: 'Ultra Instinct Stardust Nebula',
    glowClass: 'shadow-[0_0_35px_rgba(168,85,247,0.85)] border-purple-400',
    cardAuraClass: 'ring-2 ring-purple-400 shadow-2xl shadow-purple-600/70 bg-gradient-to-t from-purple-950/40 via-transparent to-fuchsia-900/30',
    atkBonusPercent: 60,
    hpBonusPercent: 60,
    speedBonus: 18,
    critBonus: 9,
    duplicatesRequired: 2,
    crystalsRequired: 4,
    colorHex: '#a855f7',
  },
  5: {
    tier: 5,
    name: 'Omni Sovereign V',
    auraTitle: 'Omniversal Sovereign Chromatic Radiance',
    glowClass: 'shadow-[0_0_45px_rgba(6,182,212,0.9)] border-cyan-300 animate-pulse',
    cardAuraClass: 'ring-2 ring-cyan-300 shadow-[0_0_35px_rgba(6,182,212,0.6)] bg-gradient-to-t from-cyan-950/50 via-purple-950/30 to-amber-900/30',
    atkBonusPercent: 85,
    hpBonusPercent: 85,
    speedBonus: 25,
    critBonus: 14,
    duplicatesRequired: 2,
    crystalsRequired: 5,
    colorHex: '#06b6d4',
  },
};

export interface ProgressionStats {
  level: number;
  currentExp: number;
  expToNextLevel: number;
  expProgressPercent: number;
  maxLevel: number;
  isMaxLevel: boolean;
  limitBreakTier: number;
  canLimitBreak: boolean;
  battlePower: number; // In-universe Scouter / Ki BP
  hp: number;
  atk: number;
  speed: number;
  critRate: number;
  soulAwakeningTier: number;
  soulAwakeningGlow: string;
  unlockedTalents: MilestoneTalent[];
  nextTalent?: MilestoneTalent;
}

// Level caps by rank
export const BASE_MAX_LEVELS: Record<Rarity, number> = {
  common: 25,
  rare: 40,
  epic: 55,
  legendary: 70,
  mythical: 85,
  sp_plus: 95,
  omni: 100,
};

// Limit break max extensions per tier
export const LIMIT_BREAK_BONUS_LEVELS = 15;
export const MAX_LIMIT_BREAK_TIERS = 2;

// Milestone talents unlocked as warriors level up
export const MILESTONE_TALENTS: MilestoneTalent[] = [
  {
    level: 10,
    name: 'Ki Surge',
    description: 'Focuses innate Ki flow, granting +8% ATK and +3 Speed.',
    statModifier: { atkPercent: 8, speedBonus: 3 },
  },
  {
    level: 25,
    name: 'Z-Fighter Tenacity',
    description: 'Hardened battle instincts grant +12% Max HP and +2% Critical Chance.',
    statModifier: { hpPercent: 12, critBonus: 2 },
  },
  {
    level: 50,
    name: 'God Ki Resonance',
    description: 'Channels divine Ki pressure, granting +15% ATK, +5% Crit, and +5 Speed.',
    statModifier: { atkPercent: 15, critBonus: 5, speedBonus: 5 },
  },
  {
    level: 75,
    name: 'Dimension Shatter',
    description: 'Attacks tear through spacetime, granting +20% ATK and +15% HP.',
    statModifier: { atkPercent: 20, hpPercent: 15 },
  },
  {
    level: 100,
    name: 'Omniversal Transcendence',
    description: 'Reaches the pinnacle of divine martial arts: +30% All Base Attributes.',
    statModifier: { atkPercent: 30, hpPercent: 30, speedBonus: 10, critBonus: 10 },
  },
];

/**
 * Calculates EXP required to reach the next level from a given level
 */
export function getExpRequiredForLevel(level: number, rarity: Rarity): number {
  const config = RANK_STAT_CONFIGS[rarity] || RANK_STAT_CONFIGS.rare;
  const rankFactor = config.growthMultiplier;
  // Non-linear exponential curve scaled to rank
  return Math.floor((120 * Math.pow(level, 1.45) + level * 75) * (0.8 + rankFactor * 0.15));
}

/**
 * Calculates maximum possible level for a warrior including limit breaks
 */
export function getMaxLevelForWarrior(rarity: Rarity, limitBreakTier: number = 0): number {
  const baseCap = BASE_MAX_LEVELS[rarity] || 40;
  return baseCap + limitBreakTier * LIMIT_BREAK_BONUS_LEVELS;
}

/**
 * Evaluates unlocked milestone talents for a character level
 */
export function getUnlockedTalents(level: number): MilestoneTalent[] {
  return MILESTONE_TALENTS.filter(t => level >= t.level);
}

/**
 * Returns the next upcoming talent
 */
export function getNextMilestoneTalent(level: number): MilestoneTalent | undefined {
  return MILESTONE_TALENTS.find(t => level < t.level);
}

/**
 * Calculates total Battle Power (BP) according to Dragon Ball power scaling
 */
export function calculateBattlePower(
  hp: number,
  atk: number,
  speed: number,
  critRate: number,
  rarity: Rarity,
  level: number
): number {
  const rankMultipliers: Record<Rarity, number> = {
    common: 1.0,
    rare: 1.8,
    epic: 3.2,
    legendary: 6.5,
    mythical: 12.0,
    sp_plus: 22.0,
    omni: 50.0,
  };

  const multiplier = rankMultipliers[rarity] || 2.0;
  const rawCombat = hp * 1.6 + atk * 4.5 + speed * 8.0 + critRate * 35;
  const levelScaling = 1 + level * 0.04;
  return Math.floor(rawCombat * multiplier * levelScaling);
}

/**
 * Comprehensive warrior progression calculator
 * Computes exact stats with rank growth formulas, milestone talents, and level caps
 */
export function computeWarriorProgression(
  char: CharacterItem,
  overrideLevel?: number,
  overrideExp?: number,
  overrideLimitBreak?: number
): ProgressionStats {
  const level = Math.max(1, overrideLevel ?? char.level ?? 1);
  const currentExp = Math.max(0, overrideExp ?? char.exp ?? 0);
  const limitBreakTier = overrideLimitBreak ?? char.limitBreakTier ?? 0;
  const maxLevel = getMaxLevelForWarrior(char.rarity, limitBreakTier);

  const expToNextLevel = getExpRequiredForLevel(level, char.rarity);
  const expProgressPercent = Math.min(100, Math.floor((currentExp / expToNextLevel) * 100));

  const config = RANK_STAT_CONFIGS[char.rarity] || RANK_STAT_CONFIGS.rare;
  const levelOffset = Math.max(0, level - 1);

  // Base growth formulas from level
  let baseHp = Math.floor(char.hp + levelOffset * config.hpPerLevel * (config.growthMultiplier / 2 + 0.5));
  let baseAtk = Math.floor(char.atk + levelOffset * config.atkPerLevel * (config.growthMultiplier / 2 + 0.5));
  let baseSpeed = Math.floor(char.speed + levelOffset * config.speedPerLevel);
  let baseCrit = Math.min(
    config.maxCritRate,
    parseFloat((char.critRate + levelOffset * config.critPerLevel).toFixed(1))
  );

  // Apply unlocked milestone talent bonuses
  const unlockedTalents = getUnlockedTalents(level);
  let bonusAtkPercent = 0;
  let bonusHpPercent = 0;
  let bonusSpeed = 0;
  let bonusCrit = 0;

  unlockedTalents.forEach(t => {
    if (t.statModifier.atkPercent) bonusAtkPercent += t.statModifier.atkPercent;
    if (t.statModifier.hpPercent) bonusHpPercent += t.statModifier.hpPercent;
    if (t.statModifier.speedBonus) bonusSpeed += t.statModifier.speedBonus;
    if (t.statModifier.critBonus) bonusCrit += t.statModifier.critBonus;
  });

  // Apply Soul Awakening bonuses (Tier 1-5)
  const awakeningTier = Math.min(5, Math.max(0, char.soulAwakeningTier || 0));
  const awakeningInfo = SOUL_AWAKENING_CONFIG[awakeningTier];
  let soulAtkBonus = 0;
  let soulHpBonus = 0;
  let soulSpeedBonus = 0;
  let soulCritBonus = 0;

  if (awakeningInfo) {
    soulAtkBonus = awakeningInfo.atkBonusPercent;
    soulHpBonus = awakeningInfo.hpBonusPercent;
    soulSpeedBonus = awakeningInfo.speedBonus;
    soulCritBonus = awakeningInfo.critBonus;
  }

  const finalHp = Math.floor(baseHp * (1 + (bonusHpPercent + soulHpBonus) / 100));
  const finalAtk = Math.floor(baseAtk * (1 + (bonusAtkPercent + soulAtkBonus) / 100));
  const finalSpeed = Math.floor(baseSpeed + bonusSpeed + soulSpeedBonus);
  const finalCrit = Math.min(config.maxCritRate, parseFloat((baseCrit + bonusCrit + soulCritBonus).toFixed(1)));

  const bp = calculateBattlePower(finalHp, finalAtk, finalSpeed, finalCrit, char.rarity, level);

  const canLimitBreak = level >= maxLevel && limitBreakTier < MAX_LIMIT_BREAK_TIERS;
  const nextTalent = getNextMilestoneTalent(level);

  return {
    level,
    currentExp,
    expToNextLevel,
    expProgressPercent,
    maxLevel,
    isMaxLevel: level >= maxLevel,
    limitBreakTier,
    canLimitBreak,
    battlePower: bp,
    hp: finalHp,
    atk: finalAtk,
    speed: finalSpeed,
    critRate: finalCrit,
    soulAwakeningTier: awakeningTier,
    soulAwakeningGlow: awakeningInfo ? awakeningInfo.cardAuraClass : '',
    unlockedTalents,
    nextTalent,
  };
}

/**
 * Calculates resource costs to train a warrior to the next level
 */
export function getTrainingCost(
  currentLevel: number,
  rarity: Rarity,
  levelsToGain: number = 1
): { yens: number; gems: number; crystals: number } {
  const config = RANK_STAT_CONFIGS[rarity] || RANK_STAT_CONFIGS.rare;
  const mult = config.growthMultiplier;

  let totalYens = 0;
  let totalGems = 0;
  let totalCrystals = 0;

  for (let i = 0; i < levelsToGain; i++) {
    const lvl = currentLevel + i;
    totalYens += Math.floor(1500 * (1 + lvl * 0.25) * mult);
    if (lvl % 5 === 0) totalGems += Math.floor(5 + lvl * 0.1);
    if (lvl % 20 === 0) totalCrystals += 1;
  }

  return {
    yens: totalYens,
    gems: totalGems,
    crystals: totalCrystals,
  };
}

/**
 * Limit Break ascension requirements
 */
export function getLimitBreakCost(
  rarity: Rarity,
  tier: number
): { yens: number; crystals: number; gems: number; description: string } {
  const tierFactor = tier + 1;
  const rankMultipliers: Record<Rarity, number> = {
    common: 1,
    rare: 1.5,
    epic: 2.5,
    legendary: 4,
    mythical: 7,
    sp_plus: 10,
    omni: 15,
  };
  const factor = rankMultipliers[rarity] || 2;

  return {
    yens: Math.floor(50000 * factor * tierFactor),
    crystals: Math.floor(5 * factor * tierFactor),
    gems: Math.floor(100 * factor * tierFactor),
    description: `Breaks mortal boundaries to raise level cap by +${LIMIT_BREAK_BONUS_LEVELS} levels.`,
  };
}

export const calculateCharacterProgression = computeWarriorProgression;

export function calculateWarriorBattlePower(char: CharacterItem): number {
  return calculateBattlePower(char.hp, char.atk, char.speed, char.critRate, char.rarity, char.level || 1);
}
