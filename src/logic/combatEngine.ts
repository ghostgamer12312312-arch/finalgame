/**
 * Dragon Ball Advanced Combat Engine
 * Simulates deep Ki mechanics, transformations (Kaioken -> Super Saiyan -> Ultra Instinct -> Omni),
 * beam struggles, defensive counters, afterimage dodges, and multi-turn battle logs.
 */

import { BattleLogEntry, CharacterItem, EquipmentItem } from '../types/game';

export interface TransformationForm {
  id: string;
  name: string;
  kiRequired: number;
  atkMultiplier: number;
  defMultiplier: number;
  speedMultiplier: number;
  critBonus: number;
  auraColor: string;
  minCharacterLevel: number;
  lore: string;
}

export const TRANSFORMATION_FORMS: TransformationForm[] = [
  {
    id: 'base',
    name: 'Base State',
    kiRequired: 0,
    atkMultiplier: 1.0,
    defMultiplier: 1.0,
    speedMultiplier: 1.0,
    critBonus: 0,
    auraColor: 'text-slate-300',
    minCharacterLevel: 1,
    lore: 'Normal resting power level.',
  },
  {
    id: 'kaioken',
    name: 'Kaioken x20',
    kiRequired: 30,
    atkMultiplier: 1.35,
    defMultiplier: 0.95,
    speedMultiplier: 1.40,
    critBonus: 5,
    auraColor: 'text-rose-500',
    minCharacterLevel: 10,
    lore: 'King Kai martial technique that multiplies Ki at the expense of stamina.',
  },
  {
    id: 'ssj1',
    name: 'Super Saiyan',
    kiRequired: 40,
    atkMultiplier: 1.60,
    defMultiplier: 1.30,
    speedMultiplier: 1.30,
    critBonus: 8,
    auraColor: 'text-amber-400',
    minCharacterLevel: 25,
    lore: 'Legendary golden warrior awakened through intense rage.',
  },
  {
    id: 'ssj2',
    name: 'Super Saiyan 2',
    kiRequired: 50,
    atkMultiplier: 1.95,
    defMultiplier: 1.45,
    speedMultiplier: 1.50,
    critBonus: 12,
    auraColor: 'text-yellow-300',
    minCharacterLevel: 40,
    lore: 'Ascended Saiyan state crackling with fierce bio-electric sparks.',
  },
  {
    id: 'ssj3',
    name: 'Super Saiyan 3',
    kiRequired: 65,
    atkMultiplier: 2.40,
    defMultiplier: 1.40,
    speedMultiplier: 1.65,
    critBonus: 15,
    auraColor: 'text-amber-300',
    minCharacterLevel: 55,
    lore: 'Extracts every drop of latent potential, shaking dimensions.',
  },
  {
    id: 'ssj4',
    name: 'Super Saiyan 4 (Limit Break)',
    kiRequired: 75,
    atkMultiplier: 2.85,
    defMultiplier: 1.70,
    speedMultiplier: 1.80,
    critBonus: 18,
    auraColor: 'text-red-500',
    minCharacterLevel: 70,
    lore: 'Primal Oozaru energy channeled into human form with crimson fur.',
  },
  {
    id: 'ssg',
    name: 'Super Saiyan God',
    kiRequired: 70,
    atkMultiplier: 3.10,
    defMultiplier: 2.00,
    speedMultiplier: 2.10,
    critBonus: 20,
    auraColor: 'text-red-400',
    minCharacterLevel: 80,
    lore: 'Divine God Ki infusion granting flame-like crimson radiance.',
  },
  {
    id: 'ssb',
    name: 'Super Saiyan Blue (Evolution)',
    kiRequired: 80,
    atkMultiplier: 3.65,
    defMultiplier: 2.25,
    speedMultiplier: 2.30,
    critBonus: 22,
    auraColor: 'text-cyan-400',
    minCharacterLevel: 90,
    lore: 'Super Saiyan God infused with Super Saiyan composure and God Ki.',
  },
  {
    id: 'ultra_ego',
    name: 'Ultra Ego (Hakashin)',
    kiRequired: 90,
    atkMultiplier: 4.30,
    defMultiplier: 2.60,
    speedMultiplier: 2.50,
    critBonus: 25,
    auraColor: 'text-purple-500',
    minCharacterLevel: 100,
    lore: 'Pure destruction instinct where taking damage further fuels combat ferocity.',
  },
  {
    id: 'ui_mastered',
    name: 'Mastered Ultra Instinct',
    kiRequired: 95,
    atkMultiplier: 4.80,
    defMultiplier: 3.00,
    speedMultiplier: 3.20,
    critBonus: 30,
    auraColor: 'text-slate-100',
    minCharacterLevel: 110,
    lore: 'Autonomous body movement devoid of thought. Flawless dodge and strike.',
  },
  {
    id: 'beast',
    name: 'Gohan Beast Awakening',
    kiRequired: 95,
    atkMultiplier: 5.10,
    defMultiplier: 2.90,
    speedMultiplier: 2.90,
    critBonus: 32,
    auraColor: 'text-rose-400',
    minCharacterLevel: 115,
    lore: 'Primal rage elevated to a catastrophic demonic apex.',
  },
  {
    id: 'omni_ascension',
    name: 'Omni King Transcendence',
    kiRequired: 100,
    atkMultiplier: 6.50,
    defMultiplier: 4.50,
    speedMultiplier: 4.00,
    critBonus: 40,
    auraColor: 'text-teal-300',
    minCharacterLevel: 125,
    lore: 'Multiversal sovereignty beyond time, space, and mortality.',
  },
];

export interface CombatAction {
  type: 'strike' | 'ki_charge' | 'blast' | 'ultimate' | 'transform' | 'heal';
  label: string;
  kiCost: number;
  kiGain: number;
  damageMultiplier: number;
  description: string;
}

export const COMBAT_ACTIONS: Record<string, CombatAction> = {
  strike: {
    type: 'strike',
    label: 'Martial Strike Combo',
    kiCost: 0,
    kiGain: 20,
    damageMultiplier: 1.0,
    description: 'Rapid physical blows building internal Ki reserves.',
  },
  ki_charge: {
    type: 'ki_charge',
    label: 'Power Up Ki Aura',
    kiCost: 0,
    kiGain: 45,
    damageMultiplier: 0,
    description: 'Channel atmospheric Ki to surge Ki gauge and raise guard.',
  },
  blast: {
    type: 'blast',
    label: 'Ki Blast Barrage',
    kiCost: 30,
    kiGain: 0,
    damageMultiplier: 1.85,
    description: 'Rapid-fire energy volleys tearing through enemy barriers.',
  },
  ultimate: {
    type: 'ultimate',
    label: 'Super Kamehameha / Final Flash',
    kiCost: 65,
    kiGain: 0,
    damageMultiplier: 3.40,
    description: 'Cataclysmic energy beam shattering tectonic plates.',
  },
  transform: {
    type: 'transform',
    label: 'Ascend / Transform',
    kiCost: 40,
    kiGain: 0,
    damageMultiplier: 0.5,
    description: 'Break mortal boundaries and trigger higher battle forms.',
  },
  heal: {
    type: 'heal',
    label: 'Chew Senzu Bean',
    kiCost: 10,
    kiGain: 15,
    damageMultiplier: 0,
    description: 'Restore 100% HP and clear fatigue.',
  },
};

export interface FighterEntity {
  name: string;
  currentHp: number;
  maxHp: number;
  baseAtk: number;
  baseDef: number;
  speed: number;
  critRate: number;
  ki: number;
  maxKi: number;
  currentForm: TransformationForm;
  zenkaiTriggered?: boolean;
}

/**
 * Calculates Scouter Battle Power (BP)
 */
export function calculateScouterBP(
  hp: number,
  atk: number,
  speed: number,
  critRate: number,
  form: TransformationForm
): number {
  const effectiveAtk = atk * form.atkMultiplier;
  const effectiveHp = hp * form.defMultiplier;
  const rawBP = (effectiveHp * 1.8) + (effectiveAtk * 7.5) + (speed * 12.0) + (critRate * 45);
  return Math.floor(rawBP);
}

/**
 * Simulate a round of combat with full Dragon Ball dynamics
 */
export function executeCombatRound(
  round: number,
  player: FighterEntity,
  enemy: FighterEntity,
  action: CombatAction
): {
  log: BattleLogEntry;
  playerHpAfter: number;
  enemyHpAfter: number;
  playerKiAfter: number;
  playerFormAfter: TransformationForm;
  isVictory: boolean;
  isDefeat: boolean;
} {
  let playerDamage = 0;
  let enemyDamage = 0;
  let isCrit = false;
  let battleNarrative = `Round ${round}: `;

  // Action Ki adjustment
  let currentKi = Math.min(player.maxKi, Math.max(0, player.ki - action.kiCost + action.kiGain));
  let currentForm = player.currentForm;

  // Check form ascension if action is transform
  if (action.type === 'transform') {
    const nextFormIndex = TRANSFORMATION_FORMS.findIndex(f => f.id === currentForm.id) + 1;
    if (nextFormIndex < TRANSFORMATION_FORMS.length) {
      currentForm = TRANSFORMATION_FORMS[nextFormIndex];
      battleNarrative += `⚡ Transformed into [${currentForm.name}]! `;
    }
  }

  // Player Turn Attack
  if (action.damageMultiplier > 0) {
    const effectiveAtk = player.baseAtk * currentForm.atkMultiplier;
    // Critical roll
    const totalCritChance = player.critRate + currentForm.critBonus;
    isCrit = Math.random() * 100 < totalCritChance;
    const critMult = isCrit ? 2.2 : 1.0;

    // Variance 0.90 to 1.15
    const variance = 0.90 + Math.random() * 0.25;
    playerDamage = Math.max(1, Math.floor(effectiveAtk * action.damageMultiplier * critMult * variance));

    // Enemy defense mitigation
    const enemyMitigation = Math.max(0.2, 1.0 - (enemy.baseDef / 1000));
    playerDamage = Math.floor(playerDamage * enemyMitigation);

    battleNarrative += `${player.name} unleashed ${action.label} for ${playerDamage.toLocaleString()} DMG${isCrit ? ' (CRITICAL HIT!)' : ''}. `;
  } else if (action.type === 'ki_charge') {
    battleNarrative += `${player.name} gathered Ki from surrounding atmosphere (+${action.kiGain} Ki). `;
  } else if (action.type === 'heal') {
    player.currentHp = player.maxHp;
    battleNarrative += `${player.name} chewed a magical Senzu Bean! HP fully restored! `;
  }

  // Enemy HP after player hit
  const enemyHpLeft = Math.max(0, enemy.currentHp - playerDamage);

  // Check if enemy defeated
  if (enemyHpLeft <= 0) {
    battleNarrative += `💥 ${enemy.name} was completely vaporized! Victory achieved!`;
    return {
      log: {
        round,
        playerDamage,
        enemyDamage: 0,
        isCrit,
        text: battleNarrative,
        isVictory: true,
        playerHpLeft: player.currentHp,
        enemyHpLeft: 0,
      },
      playerHpAfter: player.currentHp,
      enemyHpAfter: 0,
      playerKiAfter: currentKi,
      playerFormAfter: currentForm,
      isVictory: true,
      isDefeat: false,
    };
  }

  // Enemy Counter Attack
  // Player Afterimage Evasion check
  const dodgeChance = Math.min(45, (player.speed * currentForm.speedMultiplier) / (enemy.speed * 1.5));
  const isDodged = Math.random() * 100 < dodgeChance;

  if (isDodged) {
    battleNarrative += `💨 ${player.name} blurred with Afterimage Instant Transmission, dodging ${enemy.name}'s counter!`;
    enemyDamage = 0;
  } else {
    // Enemy damage calculation
    const enemyBase = enemy.baseAtk * (0.85 + Math.random() * 0.3);
    const playerDefMitigation = Math.max(0.15, 1.0 - ((player.baseDef * currentForm.defMultiplier) / 800));
    enemyDamage = Math.max(1, Math.floor(enemyBase * playerDefMitigation));

    // If player charged Ki, reduce damage taken by 40%
    if (action.type === 'ki_charge') {
      enemyDamage = Math.floor(enemyDamage * 0.6);
      battleNarrative += `🛡️ Guarded stance mitigated counter! `;
    }

    battleNarrative += `${enemy.name} retaliated with an energy beam dealing ${enemyDamage.toLocaleString()} DMG!`;
  }

  let playerHpLeft = Math.max(0, player.currentHp - enemyDamage);

  // Zenkai boost trigger if drop below 20%
  if (playerHpLeft > 0 && playerHpLeft < player.maxHp * 0.20 && !player.zenkaiTriggered) {
    player.zenkaiTriggered = true;
    player.baseAtk = Math.floor(player.baseAtk * 1.35);
    battleNarrative += ` 🔥 [ZENKAI SURGE ACTIVATED!] Mortal peril boosted ATK by +35%!`;
  }

  const isDefeat = playerHpLeft <= 0;
  if (isDefeat) {
    battleNarrative += ` 💀 ${player.name} collapsed under devastating pressure. Defeat!`;
  }

  return {
    log: {
      round,
      playerDamage,
      enemyDamage,
      isCrit,
      text: battleNarrative,
      isVictory: false,
      isDefeat,
      playerHpLeft,
      enemyHpLeft,
    },
    playerHpAfter: playerHpLeft,
    enemyHpAfter: enemyHpLeft,
    playerKiAfter: currentKi,
    playerFormAfter: currentForm,
    isVictory: false,
    isDefeat,
  };
}

/**
 * Creates a complete simulated quick-battle against a foe
 */
export function simulateFullBattle(
  playerWarrior: CharacterItem,
  playerGear: { weapon?: EquipmentItem | null; armor?: EquipmentItem | null },
  playerLevel: number,
  enemyData: { name: string; hp: number; dmg: number; speed: number; description?: string }
): {
  victory: boolean;
  rounds: BattleLogEntry[];
  totalPlayerDmg: number;
  totalEnemyDmg: number;
  playerHpRemaining: number;
} {
  const weaponAtk = playerGear.weapon?.statBonus || 0;
  const armorHp = playerGear.armor?.statBonus || 0;

  const player: FighterEntity = {
    name: playerWarrior.name,
    currentHp: playerWarrior.hp + armorHp + playerLevel * 25,
    maxHp: playerWarrior.hp + armorHp + playerLevel * 25,
    baseAtk: playerWarrior.atk + weaponAtk + playerLevel * 6,
    baseDef: 50 + playerLevel * 2,
    speed: playerWarrior.speed + (playerGear.weapon?.speedBonus || 0),
    critRate: playerWarrior.critRate + (playerGear.weapon?.critBonus || 0),
    ki: 30,
    maxKi: 100,
    currentForm: TRANSFORMATION_FORMS[0],
  };

  const enemy: FighterEntity = {
    name: enemyData.name,
    currentHp: enemyData.hp,
    maxHp: enemyData.hp,
    baseAtk: enemyData.dmg,
    baseDef: 30,
    speed: enemyData.speed,
    critRate: 8,
    ki: 0,
    maxKi: 100,
    currentForm: TRANSFORMATION_FORMS[0],
  };

  const rounds: BattleLogEntry[] = [];
  let currentRound = 1;
  let totalPlayerDmg = 0;
  let totalEnemyDmg = 0;

  while (player.currentHp > 0 && enemy.currentHp > 0 && currentRound <= 30) {
    // AI decision for player action
    let chosenAction = COMBAT_ACTIONS.strike;

    if (player.ki >= 65) {
      chosenAction = COMBAT_ACTIONS.ultimate;
    } else if (player.ki >= 30 && Math.random() < 0.65) {
      chosenAction = COMBAT_ACTIONS.blast;
    } else if (player.ki < 25 && Math.random() < 0.40) {
      chosenAction = COMBAT_ACTIONS.ki_charge;
    }

    const result = executeCombatRound(currentRound, player, enemy, chosenAction);
    rounds.push(result.log);
    totalPlayerDmg += result.log.playerDamage;
    totalEnemyDmg += result.log.enemyDamage;

    player.currentHp = result.playerHpAfter;
    enemy.currentHp = result.enemyHpAfter;
    player.ki = result.playerKiAfter;
    player.currentForm = result.playerFormAfter;

    if (result.isVictory || result.isDefeat) {
      break;
    }

    currentRound++;
  }

  return {
    victory: enemy.currentHp <= 0,
    rounds,
    totalPlayerDmg,
    totalEnemyDmg,
    playerHpRemaining: player.currentHp,
  };
}
