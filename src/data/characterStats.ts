import { Rarity } from '../types/game';

export interface RankBaseStatConfig {
  rank: Rarity;
  label: string;
  baseHp: number;
  baseAtk: number;
  baseSpeed: number;
  baseCritRate: number;
  // Growth per character level
  hpPerLevel: number;
  atkPerLevel: number;
  speedPerLevel: number;
  critPerLevel: number;
  maxCritRate: number;
  growthMultiplier: number;
  auraDescription: string;
}

export const RANK_STAT_CONFIGS: Record<Rarity, RankBaseStatConfig> = {
  common: {
    rank: 'common',
    label: 'Common',
    baseHp: 280,
    baseAtk: 50,
    baseSpeed: 20,
    baseCritRate: 5,
    hpPerLevel: 14,
    atkPerLevel: 3,
    speedPerLevel: 0.25,
    critPerLevel: 0.1,
    maxCritRate: 20,
    growthMultiplier: 1.0,
    auraDescription: 'Faint white Ki shroud',
  },
  rare: {
    rank: 'rare',
    label: 'Rare',
    baseHp: 420,
    baseAtk: 95,
    baseSpeed: 36,
    baseCritRate: 10,
    hpPerLevel: 22,
    atkPerLevel: 5.5,
    speedPerLevel: 0.4,
    critPerLevel: 0.15,
    maxCritRate: 30,
    growthMultiplier: 1.25,
    auraDescription: 'Vibrant blue electrical Ki',
  },
  epic: {
    rank: 'epic',
    label: 'Epic',
    baseHp: 650,
    baseAtk: 155,
    baseSpeed: 50,
    baseCritRate: 15,
    hpPerLevel: 34,
    atkPerLevel: 8.5,
    speedPerLevel: 0.6,
    critPerLevel: 0.2,
    maxCritRate: 40,
    growthMultiplier: 1.55,
    auraDescription: 'Surging purple cosmic Ki',
  },
  legendary: {
    rank: 'legendary',
    label: 'Legendary',
    baseHp: 950,
    baseAtk: 235,
    baseSpeed: 70,
    baseCritRate: 20,
    hpPerLevel: 50,
    atkPerLevel: 13,
    speedPerLevel: 0.8,
    critPerLevel: 0.25,
    maxCritRate: 50,
    growthMultiplier: 2.0,
    auraDescription: 'Roaring golden Super Saiyan plasma',
  },
  mythical: {
    rank: 'mythical',
    label: 'Mythical',
    baseHp: 1350,
    baseAtk: 380,
    baseSpeed: 88,
    baseCritRate: 28,
    hpPerLevel: 72,
    atkPerLevel: 20,
    speedPerLevel: 1.1,
    critPerLevel: 0.3,
    maxCritRate: 65,
    growthMultiplier: 2.65,
    auraDescription: 'Divine crimson God Ki & Ultra Instinct radiance',
  },
  sp_plus: {
    rank: 'sp_plus',
    label: 'SP+ (Super Heroes 2)',
    baseHp: 1650,
    baseAtk: 460,
    baseSpeed: 96,
    baseCritRate: 32,
    hpPerLevel: 90,
    atkPerLevel: 25,
    speedPerLevel: 1.3,
    critPerLevel: 0.35,
    maxCritRate: 75,
    growthMultiplier: 3.2,
    auraDescription: 'Super Dragon Ball Heroes 2 Limit Breaker Ultra Ki',
  },
  omni: {
    rank: 'omni',
    label: 'Omni-King',
    baseHp: 2000,
    baseAtk: 550,
    baseSpeed: 100,
    baseCritRate: 36,
    hpPerLevel: 115,
    atkPerLevel: 32,
    speedPerLevel: 1.5,
    critPerLevel: 0.4,
    maxCritRate: 85,
    growthMultiplier: 4.0,
    auraDescription: 'Multiversal Supreme Godhead Invariant Aura',
  },
};

/**
 * Calculates current warrior stats based on rank, base attributes, and character level
 */
export function calculateCharacterStats(
  base: { hp: number; atk: number; speed: number; critRate: number; rarity: Rarity },
  characterLevel: number = 1
): { hp: number; atk: number; speed: number; critRate: number } {
  const config = RANK_STAT_CONFIGS[base.rarity] || RANK_STAT_CONFIGS.common;
  const levelOffset = Math.max(0, characterLevel - 1);

  // Formulas for level-up stat growth
  const computedHp = Math.floor(base.hp + levelOffset * config.hpPerLevel * (config.growthMultiplier / 2 + 0.5));
  const computedAtk = Math.floor(base.atk + levelOffset * config.atkPerLevel * (config.growthMultiplier / 2 + 0.5));
  const computedSpeed = Math.floor(base.speed + levelOffset * config.speedPerLevel);
  const computedCrit = Math.min(
    config.maxCritRate,
    parseFloat((base.critRate + levelOffset * config.critPerLevel).toFixed(1))
  );

  return {
    hp: computedHp,
    atk: computedAtk,
    speed: computedSpeed,
    critRate: computedCrit,
  };
}

/**
 * Calculates total experience required to reach a specific character level
 */
export function calculateRequiredExpForLevel(targetLevel: number): number {
  if (targetLevel <= 1) return 0;
  // Quadratic exponential growth curve
  return Math.floor(100 * Math.pow(targetLevel - 1, 1.8) + (targetLevel - 1) * 50);
}

/**
 * Calculates character level from raw accumulated EXP
 */
export function calculateLevelFromExp(accumulatedExp: number): number {
  if (accumulatedExp <= 0) return 1;
  let lvl = 1;
  while (calculateRequiredExpForLevel(lvl + 1) <= accumulatedExp && lvl < 100) {
    lvl++;
  }
  return lvl;
}

/**
 * Projects stats preview at level 50 and level 100 for roster inspection
 */
export function getStatProjections(
  base: { hp: number; atk: number; speed: number; critRate: number; rarity: Rarity }
) {
  return {
    lvl1: calculateCharacterStats(base, 1),
    lvl50: calculateCharacterStats(base, 50),
    lvl100: calculateCharacterStats(base, 100),
  };
}
