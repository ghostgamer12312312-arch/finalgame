import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Player,
  CharacterItem,
  BattleLogEntry,
  Rarity,
  Clan,
  ClanMember,
  ClanRole,
  ClanRaidState,
  WorldRaidState,
} from '../types/game';
import {
  STARTING_RESOURCES,
  PLANETS,
  PLANET_ORDER,
  EQUIPMENT,
  CHARACTERS,
  RARITY_ORDER,
  RARITY_ATK,
  RARITY_HP,
  SKILLS,
  SKILL_ATK,
  DRAGON_BALL_STARS,
  RANKS,
  RANKUP_CRYSTALS,
  CLAN_CREATE_CRYSTALS,
  SHOP_ITEMS,
  GACHA_RATES,
  SUMMONS,
  CLAN_RAIDS,
  WORLD_RAID,
  NPCS,
  NPC_STREAK_FOR_BOSS,
  BOSS,
  WEAPONS_CATALOG,
  ARMORS_CATALOG,
} from '../data/gameData';
import { executeTelegramCommand } from '../logic/telegramBotEngine';
import { calculateCharacterStats } from '../data/characterStats';
import {
  computeWarriorProgression,
  getTrainingCost,
  getLimitBreakCost,
  getMaxLevelForWarrior,
  getExpRequiredForLevel,
} from '../logic/characterProgression';

interface GameContextType {
  player: Player;
  inventory: Record<string, number>;
  characters: CharacterItem[];
  skills: string[];
  dragonBalls: Record<number, number>;
  clan: Clan | null;
  clanMembers: ClanMember[];
  clanRaid: ClanRaidState | null;
  worldRaid: WorldRaidState;
  
  // Computed stats
  stats: {
    atk: number;
    hp: number;
    speed: number;
    critRate: number;
    level: number;
    rankName: string;
    rankMultiplier: number;
    worldMultiplier: number;
    equippedCharacterData?: CharacterItem;
  };

  // Combat & Explore
  exploreMenu: (choice: '1' | '2' | '3') => { type: 'battle' | 'run' | 'info'; data?: any; message: string };
  executeBattleTurn: (enemyName: string, enemyHp: number, enemyDmg: number, enemySpeed?: number) => {
    won: boolean;
    defeated: boolean;
    fled?: boolean;
    log: BattleLogEntry[];
    rewards?: string[];
  };
  friezaBossBattle: () => { won: boolean; defeated: boolean; log: BattleLogEntry[]; rewards?: string[] };
  healPlayer: (itemType: 'Senzu Bean' | 'Mega Potion' | 'Potion' | 'Revive') => { success: boolean; message: string; healedAmount: number };

  // Shop & Inventory
  buyShopItem: (id: number, qty?: number) => { success: boolean; message: string };
  equipItem: (name: string) => { success: boolean; message: string };
  equipCharacter: (name: string) => { success: boolean; message: string };
  
  // Gacha & Warriors
  rollGacha: (times?: number) => { success: boolean; results: CharacterItem[]; message?: string };
  fuseCharacters: (char1: string, char2: string, materialName?: string) => { success: boolean; newChar?: CharacterItem; message: string };
  trainWarrior: (charName: string, levels?: number) => { success: boolean; message: string; newLevel?: number };
  limitBreakWarrior: (charName: string) => { success: boolean; message: string; newTier?: number };
  
  // Dojo & Shenron
  learnSkill: (name: string) => { success: boolean; message: string };
  makeWish: () => { success: boolean; reward: string; message: string };
  
  // Summons & Raids
  summonBoss: (kind: 'elite' | 'mythical' | 'legendary' | 'jiren') => {
    won: boolean;
    defeated: boolean;
    bossName: string;
    log: BattleLogEntry[];
    rewards: string[];
  };
  attackWorldRaid: () => { won: boolean; defeated: boolean; damageDealt: number; log: BattleLogEntry[]; rewards?: string[] };
  startWorldRaid: () => { success: boolean; message: string };
  
  // Clan system (Full 9 options)
  createClan: (name: string) => { success: boolean; message: string };
  joinClan: (name: string) => { success: boolean; message: string };
  leaveClan: () => { success: boolean; message: string };
  disbandClan: () => { success: boolean; message: string };
  promoteMember: (targetUserId: number) => { success: boolean; message: string };
  demoteOfficer: (targetUserId: number) => { success: boolean; message: string };
  transferLeadership: (targetUserId: number) => { success: boolean; message: string };
  kickMember: (targetUserId: number) => { success: boolean; message: string };
  setClanAnnouncement: (text: string) => { success: boolean; message: string };
  depositClanTreasure: (yens?: number, gems?: number, crystals?: number) => { success: boolean; message: string };
  startClanRaid: (bossName: string) => { success: boolean; message: string };
  attackClanRaid: () => { won: boolean; defeated: boolean; damageDealt: number; log: BattleLogEntry[]; rewards?: string[] };
  
  // Travel & Rank
  travelToPlanet: (planetName: string) => { success: boolean; message: string };
  rankUp: () => { success: boolean; message: string };
  claimDaily: () => { success: boolean; streak: number; rewards?: Record<string, number>; message: string };
  claimWeekly: () => { success: boolean; rewards?: Record<string, number>; star?: number; message: string };

  // Campaign & Bounties
  rewardPlayer: (rewards: { yens?: number; gems?: number; crystals?: number; tickets?: number; exp?: number }) => void;
  equipWarrior: (name: string) => { success: boolean; message: string };
  addEquipment: (item: { name: string; kind: 'weapon' | 'armor'; statBonus: number; description: string; tier: string }) => void;

  // Developer & Bot Console
  runBotCommand: (cmd: string) => string;
  resetGame: () => void;
  quickAddResources: (type: 'all' | 'keys' | 'gacha' | 'dragonballs' | 'senzu') => void;
}

const STORAGE_KEY = 'dragon_battle_rpg_state_v2';

// Pick a random starter character between Rare and Legendary
const pickStarterCharacter = (): CharacterItem => {
  const starterPool = CHARACTERS.filter(c => c.rarity === 'rare' || c.rarity === 'epic' || c.rarity === 'legendary');
  const chosen = starterPool[Math.floor(Math.random() * starterPool.length)];
  return chosen || { name: "Goku", rarity: "legendary", hp: 850, atk: 220, speed: 65, critRate: 18, series: "Dragon Ball Super", description: "Super Saiyan Blue" };
};

const starterHero = pickStarterCharacter();

const defaultPlayer: Player = {
  userId: 9001,
  firstName: "Saiyan Warrior",
  username: "DragonChampion",
  exp: STARTING_RESOURCES.exp,
  yens: STARTING_RESOURCES.yens,
  gems: STARTING_RESOURCES.gems,
  crystals: STARTING_RESOURCES.crystals,
  tickets: STARTING_RESOURCES.tickets,
  skillPoints: STARTING_RESOURCES.skillPoints,
  keysElite: STARTING_RESOURCES.keysElite,
  keysBoss: STARTING_RESOURCES.keysBoss,
  npcStreak: 0,
  equippedChar: starterHero.name,
  weapon: "Saiyan Blade",
  armor: "Saiyan Armor",
  lastRaidHit: 0,
  rank: 1,
  admin: true,
  banned: false,
  dailyDay: null,
  dailyStreak: 0,
  weeklyWeek: null,
  travel: "Earth",
  fusionCount: 0,
  currentHp: 1200,
  maxHp: 1200,
};

const defaultCharacters: CharacterItem[] = [
  starterHero,
  CHARACTERS.find(c => c.name === "Goku") || { name: "Goku", rarity: "legendary", hp: 850, atk: 220, speed: 65, critRate: 18, series: "Dragon Ball Super", description: "Super Saiyan Blue" },
  CHARACTERS.find(c => c.name === "Vegeta") || { name: "Vegeta", rarity: "legendary", hp: 840, atk: 225, speed: 64, critRate: 20, series: "Dragon Ball Super", description: "Super Saiyan Blue" },
  CHARACTERS.find(c => c.name === "Piccolo (Fused with Kami)") || { name: "Piccolo", rarity: "epic", hp: 640, atk: 148, speed: 48, critRate: 14, series: "Android Saga", description: "Super Namekian" },
  CHARACTERS.find(c => c.name === "Krillin (Destructo Disk)") || { name: "Krillin", rarity: "rare", hp: 410, atk: 98, speed: 36, critRate: 12, series: "Z Namek", description: "Earth's bravest" },
];

const defaultInventory: Record<string, number> = {
  "Power Pole": 1,
  "Saiyan Blade": 1,
  "Saiyan Armor": 1,
  "Turtle School Gi": 1,
  "Potion": 10,
  "Mega Potion": 5,
  "Revive": 3,
  "Senzu Bean": 5,
  "Fusion Material": 5,
  "Fusion Core": 2,
  "Fusion Crystal": 1,
};

const defaultSkills: string[] = ["Ki Blast", "Kaioken"];

const defaultDragonBalls: Record<number, number> = {
  1: 1,
  2: 1,
  3: 1,
  4: 1,
  5: 0,
  6: 0,
  7: 0,
};

const defaultClan: Clan = {
  id: 1,
  name: "Z Fighters",
  created: Date.now(),
  treasureYens: 2500000,
  treasureGems: 18000,
  treasureCrystals: 1200,
  announcement: "Defend universe 7, train in the gravity chamber, and crush clan raid bosses together!",
};

const defaultClanMembers: ClanMember[] = [
  { userId: 9001, clanId: 1, role: "leader", firstName: "Saiyan Warrior", username: "DragonChampion", contributionExp: 15400, joinedAt: Date.now() - 86400000 },
  { userId: 1002, clanId: 1, role: "officer", firstName: "Vegeta", username: "PrinceVegeta", contributionExp: 14200, joinedAt: Date.now() - 72000000 },
  { userId: 1003, clanId: 1, role: "officer", firstName: "FutureTrunks", username: "Trunks", contributionExp: 11000, joinedAt: Date.now() - 50000000 },
  { userId: 1004, clanId: 1, role: "member", firstName: "MysticGohan", username: "Gohan", contributionExp: 9800, joinedAt: Date.now() - 40000000 },
  { userId: 1005, clanId: 1, role: "member", firstName: "Piccolo", username: "SuperNamekian", contributionExp: 8900, joinedAt: Date.now() - 30000000 },
];

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [player, setPlayer] = useState<Player>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_player');
      return saved ? JSON.parse(saved) : defaultPlayer;
    } catch {
      return defaultPlayer;
    }
  });

  const [inventory, setInventory] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_inv');
      return saved ? JSON.parse(saved) : defaultInventory;
    } catch {
      return defaultInventory;
    }
  });

  const [characters, setCharacters] = useState<CharacterItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_chars');
      return saved ? JSON.parse(saved) : defaultCharacters;
    } catch {
      return defaultCharacters;
    }
  });

  const [skills, setSkills] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_skills');
      return saved ? JSON.parse(saved) : defaultSkills;
    } catch {
      return defaultSkills;
    }
  });

  const [dragonBalls, setDragonBalls] = useState<Record<number, number>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_db');
      return saved ? JSON.parse(saved) : defaultDragonBalls;
    } catch {
      return defaultDragonBalls;
    }
  });

  const [clan, setClan] = useState<Clan | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_clan');
      return saved ? JSON.parse(saved) : defaultClan;
    } catch {
      return defaultClan;
    }
  });

  const [clanMembers, setClanMembers] = useState<ClanMember[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_clan_members');
      return saved ? JSON.parse(saved) : defaultClanMembers;
    } catch {
      return defaultClanMembers;
    }
  });

  const [clanRaid, setClanRaid] = useState<ClanRaidState | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_clan_raid');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [worldRaid, setWorldRaid] = useState<WorldRaidState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_world_raid');
      return saved ? JSON.parse(saved) : { id: 1, bossName: WORLD_RAID.name, active: true, hp: WORLD_RAID.hp, maxHp: WORLD_RAID.hp, damageMap: {}, totalAttacks: 0 };
    } catch {
      return { id: 1, bossName: WORLD_RAID.name, active: true, hp: WORLD_RAID.hp, maxHp: WORLD_RAID.hp, damageMap: {}, totalAttacks: 0 };
    }
  });

  // Local storage save effects
  useEffect(() => { localStorage.setItem(STORAGE_KEY + '_player', JSON.stringify(player)); }, [player]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY + '_inv', JSON.stringify(inventory)); }, [inventory]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY + '_chars', JSON.stringify(characters)); }, [characters]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY + '_skills', JSON.stringify(skills)); }, [skills]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY + '_db', JSON.stringify(dragonBalls)); }, [dragonBalls]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY + '_clan', JSON.stringify(clan)); }, [clan]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY + '_clan_members', JSON.stringify(clanMembers)); }, [clanMembers]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY + '_clan_raid', JSON.stringify(clanRaid)); }, [clanRaid]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY + '_world_raid', JSON.stringify(worldRaid)); }, [worldRaid]);

  // -----------------------------------------------------------
  // STATS CALCULATION (With Rank Multiplier Scaling)
  // -----------------------------------------------------------
  const level = 1 + Math.floor(player.exp / 100);
  const curRank = player.rank || 1;
  const rankName = RANKS[curRank] || "Beginner";
  // As requested: Rank up increases overall stats at least 1x or more (10% to 20% boost per rank)
  const rankMultiplier = 1.0 + (curRank - 1) * 0.15;

  let baseAtk = 15 + level * 4;
  let baseHp = 120 + level * 15;
  let baseSpeed = 25 + Math.floor(level * 0.5);
  let baseCrit = 5;

  // Equipment weapon bonus
  if (player.weapon) {
    const weaponData = WEAPONS_CATALOG.find(w => w.name === player.weapon);
    if (weaponData) {
      baseAtk += weaponData.statBonus;
      baseSpeed += weaponData.speedBonus || 0;
      baseCrit += weaponData.critBonus || 0;
    } else if (EQUIPMENT[player.weapon]) {
      baseAtk += EQUIPMENT[player.weapon][1];
    }
  }

  // Equipment armor bonus
  if (player.armor) {
    const armorData = ARMORS_CATALOG.find(a => a.name === player.armor);
    if (armorData) {
      baseHp += armorData.statBonus;
      baseSpeed += armorData.speedBonus || 0;
    } else if (EQUIPMENT[player.armor]) {
      baseHp += EQUIPMENT[player.armor][1] * 2;
    }
  }

  // Equipped character bonus with full progression & milestone passives
  const activeChar = characters.find(c => c.name === player.equippedChar);
  if (activeChar) {
    const charProgress = computeWarriorProgression(activeChar);
    baseAtk += charProgress.atk;
    baseHp += charProgress.hp;
    baseSpeed += charProgress.speed;
    baseCrit += charProgress.critRate;
  }

  // Learned skills bonus
  skills.forEach(s => {
    baseAtk += SKILL_ATK[s] || 0;
  });

  // Apply rank growth scaling
  const finalAtk = Math.floor(baseAtk * rankMultiplier);
  const finalHp = Math.floor(baseHp * rankMultiplier);
  const finalSpeed = Math.floor(baseSpeed * (1 + (curRank - 1) * 0.05));
  const finalCrit = Math.min(60, baseCrit + (curRank - 1) * 2);

  const worldName = player.travel || "Earth";
  const worldMultiplier = PLANETS[worldName]?.multiplier || 1.0;

  const stats = {
    atk: finalAtk,
    hp: finalHp,
    speed: finalSpeed,
    critRate: finalCrit,
    level,
    rankName,
    rankMultiplier,
    worldMultiplier,
    equippedCharacterData: activeChar,
  };

  // Sync player maxHp
  useEffect(() => {
    if (player.maxHp !== finalHp) {
      setPlayer(prev => ({
        ...prev,
        maxHp: finalHp,
        currentHp: prev.currentHp > finalHp ? finalHp : prev.currentHp,
      }));
    }
  }, [finalHp]);

  // -----------------------------------------------------------
  // HEALING SYSTEM (Senzu Beans, Mega Potions, Potions, Revives)
  // -----------------------------------------------------------
  const healPlayer = (itemType: 'Senzu Bean' | 'Mega Potion' | 'Potion' | 'Revive') => {
    const owned = inventory[itemType] || 0;
    if (owned <= 0) {
      return { success: false, message: `You have no ${itemType} left. Buy more in the Shop.`, healedAmount: 0 };
    }

    let healPct = 0.3;
    if (itemType === 'Senzu Bean') healPct = 1.0;
    else if (itemType === 'Revive') healPct = 0.8;
    else if (itemType === 'Mega Potion') healPct = 0.6;

    const maxHp = stats.hp;
    const healAmount = Math.floor(maxHp * healPct);
    const newHp = Math.min(maxHp, player.currentHp + healAmount);
    const actualHealed = newHp - player.currentHp;

    setInventory(prev => ({ ...prev, [itemType]: prev[itemType] - 1 }));
    setPlayer(prev => ({ ...prev, currentHp: newHp }));

    return {
      success: true,
      message: `${itemType} consumed! Restored +${actualHealed.toLocaleString()} HP! (${newHp}/${maxHp})`,
      healedAmount: actualHealed,
    };
  };

  // -----------------------------------------------------------
  // COMBAT SIMULATION (With Crit, Speed, and Drops)
  // -----------------------------------------------------------
  const simulateCombat = (
    playerAtk: number,
    playerCurrentHp: number,
    playerSpeed: number,
    playerCrit: number,
    enemyDmg: number,
    enemyHp: number,
    enemySpeed = 20,
    enrage = false
  ) => {
    const log: BattleLogEntry[] = [];
    let p_hp = playerCurrentHp <= 0 ? stats.hp : playerCurrentHp;
    let e_hp = enemyHp;
    const e_max = enemyHp;

    for (let rnd = 1; rnd <= 40; rnd++) {
      // Speed check: who strikes first
      const playerFirst = playerSpeed >= enemySpeed;

      const performPlayerHit = () => {
        const isCrit = Math.random() * 100 < playerCrit;
        const critMultiplier = isCrit ? 1.75 : 1.0;
        const hit = Math.max(10, Math.floor(playerAtk * critMultiplier * (0.85 + Math.random() * 0.45)));
        e_hp -= hit;
        log.push({
          round: rnd,
          playerDamage: hit,
          enemyDamage: 0,
          isCrit,
          playerHpLeft: Math.max(0, p_hp),
          enemyHpLeft: Math.max(0, e_hp),
          text: `Round ${rnd}: You unleashed a ${isCrit ? "🔥 CRITICAL KI STRIKE" : "Ki Blast"} dealing ${hit.toLocaleString()} DMG! [Enemy HP: ${Math.max(0, e_hp).toLocaleString()}]`,
        });
      };

      const performEnemyHit = () => {
        const mult = enrage && e_hp <= Math.floor(e_max / 2) ? 1.35 : 1.0;
        const taken = Math.max(8, Math.floor(enemyDmg * mult * (0.8 + Math.random() * 0.4)));
        p_hp -= taken;
        log.push({
          round: rnd,
          playerDamage: 0,
          enemyDamage: taken,
          playerHpLeft: Math.max(0, p_hp),
          enemyHpLeft: Math.max(0, e_hp),
          text: `Round ${rnd}: Enemy struck back violently for ${taken.toLocaleString()} DMG! [Your HP: ${Math.max(0, p_hp).toLocaleString()}]`,
        });
      };

      if (playerFirst) {
        performPlayerHit();
        if (e_hp <= 0) break;
        performEnemyHit();
        if (p_hp <= 0) break;
      } else {
        performEnemyHit();
        if (p_hp <= 0) break;
        performPlayerHit();
        if (e_hp <= 0) break;
      }
    }

    const won = e_hp <= 0;
    const defeated = p_hp <= 0;

    return {
      won,
      defeated,
      remainingPlayerHp: Math.max(1, p_hp),
      remainingEnemyHp: Math.max(0, e_hp),
      log,
    };
  };

  // -----------------------------------------------------------
  // EXPLORE MENU (Option 1: Battle, Option 2: Run, Option 3: Info)
  // -----------------------------------------------------------
  const exploreMenu = (choice: '1' | '2' | '3'): { type: 'battle' | 'run' | 'info'; data?: any; message: string } => {
    const curPlanet = PLANETS[player.travel || "Earth"];

    if (choice === '2') {
      return {
        type: 'run',
        message: "You used Instant Transmission to disengage safely from the patrol sector.",
      };
    }

    if (choice === '3') {
      return {
        type: 'info',
        data: {
          planet: curPlanet.name,
          multiplier: curPlanet.multiplier,
          streak: player.npcStreak,
          streakMax: NPC_STREAK_FOR_BOSS,
          lore: curPlanet.lore,
        },
        message: `🌍 Planet Patrol Briefing: ${curPlanet.name} (${curPlanet.multiplier}x Multiplier). Current Streak: ${player.npcStreak}/${NPC_STREAK_FOR_BOSS}. Boss: Frieza Force Commander appears every 15 wins.`,
      };
    }

    // Choice 1: Battle
    const enemy = NPCS[Math.floor(Math.random() * NPCS.length)];
    const battle = simulateCombat(stats.atk, player.currentHp, stats.speed, stats.critRate, enemy.dmg, enemy.hp, enemy.speed);
    const rewards: string[] = [];

    if (battle.won) {
      // 5x improved rewards as requested
      const rewardTotal = Math.floor(enemy.reward * 5 * worldMultiplier * (1 + curRank * 0.25));
      const expGain = Math.floor(150 * worldMultiplier);
      const spGain = Math.floor(15 * worldMultiplier);

      rewards.push(`+${rewardTotal.toLocaleString()} Yens`);
      rewards.push(`+${expGain} EXP`);
      rewards.push(`+${spGain} Skill Points`);

      let bonusGems = 0;
      if (Math.random() < 0.35) {
        bonusGems = Math.floor(Math.random() * 8) + 2;
        rewards.push(`+${bonusGems} Gems`);
      }

      let bonusCrystals = 0;
      if (Math.random() < 0.18) {
        bonusCrystals = Math.floor(Math.random() * 2) + 1;
        rewards.push(`+${bonusCrystals} Crystal(s)`);
      }

      let bonusTickets = 0;
      if (Math.random() < 0.25) {
        bonusTickets = Math.floor(Math.random() * 2) + 1;
        rewards.push(`+${bonusTickets} Gacha Ticket(s)`);
      }

      let dragonBallWon: number | null = null;
      if (Math.random() < 0.20) {
        dragonBallWon = Math.floor(Math.random() * 7) + 1;
        rewards.push(`Found ${dragonBallWon}★ Dragon Ball!`);
      }

      // NPC drop low level equipment (Weapons & Armors)
      let itemWon: string | null = null;
      if (Math.random() < 0.25) {
        const pool = ["Wooden Sword", "Iron Sword", "Power Pole", "Leather Vest", "Steel Armor", "Turtle School Gi", "Potion", "Senzu Bean"];
        itemWon = pool[Math.floor(Math.random() * pool.length)];
        rewards.push(`Dropped Loot: ${itemWon}`);
      }

      setPlayer(prev => ({
        ...prev,
        currentHp: battle.remainingPlayerHp,
        yens: prev.yens + rewardTotal,
        exp: prev.exp + expGain,
        skillPoints: prev.skillPoints + spGain,
        gems: prev.gems + bonusGems,
        crystals: prev.crystals + bonusCrystals,
        tickets: prev.tickets + bonusTickets,
        npcStreak: prev.npcStreak + 1,
      }));

      if (player.equippedChar) {
        awardCharacterExp(player.equippedChar, expGain);
      }

      if (dragonBallWon) {
        setDragonBalls(prev => ({ ...prev, [dragonBallWon!]: (prev[dragonBallWon!] || 0) + 1 }));
      }
      if (itemWon) {
        setInventory(prev => ({ ...prev, [itemWon!]: (prev[itemWon!] || 0) + 1 }));
      }
    } else {
      // Defeated: Set player HP to 1 so they can heal or retry
      setPlayer(prev => ({ ...prev, currentHp: 1 }));
    }

    return {
      type: 'battle',
      data: {
        enemy: enemy.name,
        won: battle.won,
        defeated: battle.defeated,
        log: battle.log,
        rewards,
      },
      message: battle.won ? `Victory! Slain ${enemy.name}!` : `Defeat against ${enemy.name}. Use a Senzu Bean to restore full HP!`,
    };
  };

  const executeBattleTurn = (enemyName: string, enemyHp: number, enemyDmg: number, enemySpeed = 20) => {
    const battle = simulateCombat(stats.atk, player.currentHp, stats.speed, stats.critRate, enemyDmg, enemyHp, enemySpeed);
    return {
      won: battle.won,
      defeated: battle.defeated,
      log: battle.log,
      rewards: [],
    };
  };

  const friezaBossBattle = () => {
    const battle = simulateCombat(stats.atk, player.currentHp, stats.speed, stats.critRate, BOSS.dmg, BOSS.hp, BOSS.speed, true);
    const rewards: string[] = [];

    if (battle.won) {
      confetti({ particleCount: 90, spread: 80 });
      // 5x boss rewards
      const yensEarned = BOSS.yens * 5 * worldMultiplier;
      const gemsEarned = BOSS.gems * 5;
      const crystalsEarned = BOSS.crystals * 2;
      const ticketsEarned = BOSS.tickets * 3;
      const spEarned = BOSS.skillPoints * 4;

      rewards.push(`+${yensEarned.toLocaleString()} Yens`);
      rewards.push(`+${gemsEarned.toLocaleString()} Gems`);
      rewards.push(`+${crystalsEarned} Crystals`);
      rewards.push(`+${ticketsEarned} Gacha Tickets`);
      rewards.push(`+${spEarned} Skill Points`);
      rewards.push(`+2,000 EXP`);

      // Guaranteed Dragon Ball drop from boss
      const star = Math.floor(Math.random() * 7) + 1;
      rewards.push(`Boss Drop: ${star}★ Dragon Ball`);
      setDragonBalls(prev => ({ ...prev, [star]: (prev[star] || 0) + 1 }));

      // Rare boss gear drop
      const bossDrops = ["Saiyan Blade", "Saiyan Armor", "Kamehameha Blade", "God Armor", "Senzu Bean"];
      const droppedGear = bossDrops[Math.floor(Math.random() * bossDrops.length)];
      rewards.push(`Loot: ${droppedGear}`);
      setInventory(prev => ({ ...prev, [droppedGear]: (prev[droppedGear] || 0) + 1 }));

      setPlayer(prev => ({
        ...prev,
        currentHp: battle.remainingPlayerHp,
        yens: prev.yens + yensEarned,
        gems: prev.gems + gemsEarned,
        crystals: prev.crystals + crystalsEarned,
        tickets: prev.tickets + ticketsEarned,
        skillPoints: prev.skillPoints + spEarned,
        exp: prev.exp + 2000,
        npcStreak: 0,
      }));
    } else {
      // Retain HP at 1 on defeat so player can use Senzu Bean
      setPlayer(prev => ({ ...prev, currentHp: 1 }));
    }

    return {
      won: battle.won,
      defeated: battle.defeated,
      log: battle.log,
      rewards,
    };
  };

  // -----------------------------------------------------------
  // SHOP & BULK BUYING
  // -----------------------------------------------------------
  const buyShopItem = (id: number, qty = 1) => {
    const item = SHOP_ITEMS.find(i => i.id === id);
    if (!item) return { success: false, message: "Item not found in shop." };
    const totalCost = item.price * qty;
    const currentFunds = player[item.currency];

    if (currentFunds < totalCost) {
      return { success: false, message: `Insufficient ${item.currency}. Need ${totalCost.toLocaleString()} ${item.currency}.` };
    }

    setPlayer(prev => {
      const next = { ...prev };
      next[item.currency] = prev[item.currency] - totalCost;

      if (item.kind === 'crystal') next.crystals += item.amount * qty;
      else if (item.kind === 'ticket') next.tickets += item.amount * qty;
      else if (item.kind === 'key_elite') next.keysElite += item.amount * qty;
      else if (item.kind === 'key_boss') next.keysBoss += item.amount * qty;
      return next;
    });

    if (item.kind === 'weapon' || item.kind === 'armor' || item.kind === 'heal' || item.kind === 'fusion') {
      setInventory(prev => ({
        ...prev,
        [item.name]: (prev[item.name] || 0) + (item.amount * qty),
      }));
    }

    return { success: true, message: `Purchased ${qty}x ${item.name} for ${totalCost.toLocaleString()} ${item.currency}.` };
  };

  const equipItem = (name: string) => {
    if (!EQUIPMENT[name]) return { success: false, message: "Invalid equipment item." };
    if ((inventory[name] || 0) < 1) return { success: false, message: `You do not have ${name} in your bag.` };
    const [kind] = EQUIPMENT[name];
    setPlayer(prev => ({ ...prev, [kind]: name }));
    return { success: true, message: `Equipped ${name} as active ${kind}!` };
  };

  const equipCharacter = (name: string) => {
    const exists = characters.find(c => c.name === name);
    if (!exists) return { success: false, message: `You do not have ${name} unlocked.` };
    setPlayer(prev => ({ ...prev, equippedChar: name }));
    return { success: true, message: `Equipped ${name} (${exists.rarity.toUpperCase()}) as lead fighter!` };
  };

  // -----------------------------------------------------------
  // GACHA PULLS (With 70+ Characters Roster)
  // -----------------------------------------------------------
  const rollGacha = (times = 1) => {
    if (player.tickets < times) {
      return { success: false, results: [], message: `Need ${times} Gacha Tickets. You have ${player.tickets}.` };
    }

    setPlayer(prev => ({ ...prev, tickets: prev.tickets - times }));

    const results: CharacterItem[] = [];
    const totalWeight = GACHA_RATES.reduce((acc, [, w]) => acc + w, 0);

    for (let i = 0; i < times; i++) {
      const rand = Math.random() * totalWeight;
      let cum = 0;
      let chosenRarity: Rarity = 'common';
      for (const [r, w] of GACHA_RATES) {
        cum += w;
        if (rand <= cum) {
          chosenRarity = r;
          break;
        }
      }

      const pool = CHARACTERS.filter(c => c.rarity === chosenRarity);
      const chosen = pool.length > 0
        ? pool[Math.floor(Math.random() * pool.length)]
        : { name: "Yamcha (Wolf Fang Fist)", rarity: "rare" as Rarity, hp: 390, atk: 88, speed: 36, critRate: 10, series: "Dragon Ball OG", description: "Desert rogue" };

      results.push(chosen);
    }

    setCharacters(prev => {
      const next = [...prev];
      results.forEach(res => {
        if (!next.some(c => c.name === res.name)) {
          next.push(res);
        }
      });
      return next;
    });

    if (results.some(r => r.rarity === 'omni' || r.rarity === 'mythical')) {
      confetti({ particleCount: 120, spread: 100 });
    }

    return { success: true, results };
  };

  // -----------------------------------------------------------
  // FUSION SYSTEM
  // -----------------------------------------------------------
  const fuseCharacters = (char1: string, char2: string, materialName?: string) => {
    if (char1 === char2) return { success: false, message: "Cannot fuse the exact same character." };
    const c1 = characters.find(c => c.name === char1);
    const c2 = characters.find(c => c.name === char2);
    if (!c1 || !c2) return { success: false, message: "Both warriors must be unlocked in your roster." };

    const fusionMats = ["Fusion Material", "Fusion Core", "Fusion Crystal", "Fusion Catalyst", "Potara Earrings"];
    const matToUse = materialName || fusionMats.find(m => (inventory[m] || 0) > 0);
    if (!matToUse || (inventory[matToUse] || 0) < 1) {
      return { success: false, message: "You need at least one Fusion Material or Potara Earrings (buy in Shop)." };
    }

    setInventory(prev => ({ ...prev, [matToUse]: prev[matToUse] - 1 }));

    // Inherit highest rarity or escalate
    const o1 = RARITY_ORDER[c1.rarity] || 1;
    const o2 = RARITY_ORDER[c2.rarity] || 1;
    let highestRarity = o1 >= o2 ? c1.rarity : c2.rarity;

    // Potara or Catalyst has chance to upgrade rarity tier
    if ((matToUse === 'Potara Earrings' || matToUse === 'Fusion Catalyst') && highestRarity !== 'omni') {
      const tiers: Rarity[] = ['common', 'rare', 'epic', 'legendary', 'mythical', 'sp_plus', 'omni'];
      const curIndex = tiers.indexOf(highestRarity);
      if (curIndex < tiers.length - 1 && Math.random() < 0.5) {
        highestRarity = tiers[curIndex + 1];
      }
    }

    const fusedName = `${c1.name} & ${c2.name}`;
    const newChar: CharacterItem = {
      name: fusedName,
      rarity: highestRarity,
      hp: Math.floor((c1.hp + c2.hp) * 0.75),
      atk: Math.floor((c1.atk + c2.atk) * 0.75),
      speed: Math.max(c1.speed, c2.speed) + 5,
      critRate: Math.min(50, Math.floor((c1.critRate + c2.critRate) * 0.7)),
      series: "Fusion Metamoran",
      description: `Ascended fusion between ${c1.name} and ${c2.name} forged with ${matToUse}.`,
    };

    setCharacters(prev => prev.some(c => c.name === fusedName) ? prev : [newChar, ...prev]);
    setPlayer(prev => ({
      ...prev,
      fusionCount: prev.fusionCount + 1,
      equippedChar: fusedName,
    }));

    confetti({ particleCount: 110, spread: 90 });
    return {
      success: true,
      newChar,
      message: `Fusion Synthesis Complete! Created ${fusedName} (${highestRarity.toUpperCase()}) and equipped as your leader!`,
    };
  };

  // -----------------------------------------------------------
  // WARRIOR LEVEL PROGRESSION & TRAINING ENGINE
  // -----------------------------------------------------------
  const awardCharacterExp = (charName: string, expAmount: number) => {
    setCharacters(prev => {
      const idx = prev.findIndex(c => c.name === charName);
      if (idx === -1) return prev;
      const target = { ...prev[idx] };
      const curLvl = target.level || 1;
      const curExp = (target.exp || 0) + expAmount;
      const maxLvl = getMaxLevelForWarrior(target.rarity, target.limitBreakTier || 0);

      let newLvl = curLvl;
      let remExp = curExp;
      let expReq = getExpRequiredForLevel(newLvl, target.rarity);

      while (remExp >= expReq && newLvl < maxLvl) {
        remExp -= expReq;
        newLvl += 1;
        expReq = getExpRequiredForLevel(newLvl, target.rarity);
      }

      if (newLvl > curLvl) {
        confetti({ particleCount: 75, spread: 70 });
      }

      target.level = newLvl;
      target.exp = remExp;

      const next = [...prev];
      next[idx] = target;
      return next;
    });
  };

  const trainWarrior = (charName: string, levelsToTrain = 1) => {
    const target = characters.find(c => c.name === charName);
    if (!target) return { success: false, message: "Warrior not found in roster." };

    const curLvl = target.level || 1;
    const maxLvl = getMaxLevelForWarrior(target.rarity, target.limitBreakTier || 0);
    if (curLvl >= maxLvl) {
      return {
        success: false,
        message: `${charName} has reached the level cap (${maxLvl})! Perform a Limit Break to train further.`,
      };
    }

    const actualLevels = Math.min(levelsToTrain, maxLvl - curLvl);
    const cost = getTrainingCost(curLvl, target.rarity, actualLevels);

    if (player.yens < cost.yens) {
      return { success: false, message: `Need ${cost.yens.toLocaleString()} Yens. You have ${player.yens.toLocaleString()}.` };
    }
    if (player.gems < cost.gems) {
      return { success: false, message: `Need ${cost.gems} Gems. You have ${player.gems}.` };
    }
    if (player.crystals < cost.crystals) {
      return { success: false, message: `Need ${cost.crystals} Crystals. You have ${player.crystals}.` };
    }

    setPlayer(prev => ({
      ...prev,
      yens: prev.yens - cost.yens,
      gems: prev.gems - cost.gems,
      crystals: prev.crystals - cost.crystals,
    }));

    setCharacters(prev => {
      return prev.map(c => {
        if (c.name === charName) {
          return {
            ...c,
            level: (c.level || 1) + actualLevels,
          };
        }
        return c;
      });
    });

    confetti({ particleCount: 80, spread: 80 });
    return {
      success: true,
      newLevel: curLvl + actualLevels,
      message: `Trained ${charName} by +${actualLevels} level(s)! Now Level ${curLvl + actualLevels}!`,
    };
  };

  const limitBreakWarrior = (charName: string) => {
    const target = characters.find(c => c.name === charName);
    if (!target) return { success: false, message: "Warrior not found in roster." };

    const curTier = target.limitBreakTier || 0;
    if (curTier >= 2) {
      return { success: false, message: `${charName} has achieved maximum Limit Break (Tier ${curTier})!` };
    }

    const curLvl = target.level || 1;
    const maxLvl = getMaxLevelForWarrior(target.rarity, curTier);
    if (curLvl < maxLvl) {
      return { success: false, message: `${charName} must reach Level ${maxLvl} before unlocking Limit Break.` };
    }

    const cost = getLimitBreakCost(target.rarity, curTier);
    if (player.yens < cost.yens) {
      return { success: false, message: `Need ${cost.yens.toLocaleString()} Yens for Limit Break.` };
    }
    if (player.crystals < cost.crystals) {
      return { success: false, message: `Need ${cost.crystals} Crystals for Limit Break.` };
    }
    if (player.gems < cost.gems) {
      return { success: false, message: `Need ${cost.gems} Gems for Limit Break.` };
    }

    setPlayer(prev => ({
      ...prev,
      yens: prev.yens - cost.yens,
      crystals: prev.crystals - cost.crystals,
      gems: prev.gems - cost.gems,
    }));

    const newTier = curTier + 1;
    setCharacters(prev => {
      return prev.map(c => {
        if (c.name === charName) {
          return {
            ...c,
            limitBreakTier: newTier,
          };
        }
        return c;
      });
    });

    confetti({ particleCount: 140, spread: 110 });
    return {
      success: true,
      newTier,
      message: `LIMIT BREAK ASCENSION! ${charName} shattered limits to Tier ${newTier}! Level cap increased to ${maxLvl + 15}!`,
    };
  };

  // -----------------------------------------------------------
  // SKILLS & SHENRON WISHES
  // -----------------------------------------------------------
  const learnSkill = (name: string) => {
    if (!SKILLS[name]) return { success: false, message: "Skill not found." };
    if (skills.includes(name)) return { success: false, message: `You already mastered ${name}.` };
    const cost = SKILLS[name];
    if (player.skillPoints < cost) {
      return { success: false, message: `Need ${cost} Skill Points. You have ${player.skillPoints}.` };
    }

    setPlayer(prev => ({ ...prev, skillPoints: prev.skillPoints - cost }));
    setSkills(prev => [...prev, name]);
    return { success: true, message: `Mastered ${name}! Permanently increased ATK by +${SKILL_ATK[name]}!` };
  };

  const makeWish = () => {
    const missing: number[] = [];
    for (const star of DRAGON_BALL_STARS) {
      if ((dragonBalls[star] || 0) < 1) missing.push(star);
    }
    if (missing.length > 0) {
      return { success: false, reward: "", message: `Missing dragon balls: ${missing.map(m => m + '★').join(', ')}.` };
    }

    setDragonBalls(prev => {
      const next = { ...prev };
      DRAGON_BALL_STARS.forEach(s => { next[s] = Math.max(0, (next[s] || 1) - 1); });
      return next;
    });

    confetti({ particleCount: 160, spread: 130 });

    const roll = Math.random();
    let rewardText = "";
    if (roll < 0.15) {
      const pool = CHARACTERS.filter(c => c.rarity === 'mythical' || c.rarity === 'omni');
      const char = pool[Math.floor(Math.random() * pool.length)];
      setCharacters(prev => prev.some(c => c.name === char.name) ? prev : [...prev, char]);
      rewardText = `Divine Warrior: ${char.name} (${char.rarity.toUpperCase()})!`;
    } else if (roll < 0.35) {
      setInventory(prev => ({ ...prev, "Deadly Divine Sword": (prev["Deadly Divine Sword"] || 0) + 1 }));
      rewardText = "Supreme Weapon: Deadly Divine Sword (+360 ATK)!";
    } else if (roll < 0.55) {
      if (!skills.includes("Universe Breaker")) {
        setSkills(prev => [...prev, "Universe Breaker"]);
        rewardText = "God Ki Technique: Universe Breaker (+344 ATK)!";
      } else {
        setPlayer(prev => ({ ...prev, yens: prev.yens + 500000, gems: prev.gems + 1000 }));
        rewardText = "500,000 Yens & 1,000 Gems!";
      }
    } else if (roll < 0.80) {
      setPlayer(prev => ({
        ...prev,
        yens: prev.yens + 250000,
        gems: prev.gems + 500,
        crystals: prev.crystals + 30,
        skillPoints: prev.skillPoints + 50,
      }));
      rewardText = "250,000 Yens, 500 Gems, 30 Crystals, & 50 Skill Points!";
    } else {
      setPlayer(prev => ({
        ...prev,
        gems: prev.gems + 1200,
        crystals: prev.crystals + 50,
      }));
      rewardText = "1,200 Gems and 50 Crystals!";
    }

    return {
      success: true,
      reward: rewardText,
      message: `Shenron: 'YOUR WISH HAS BEEN GRANTED! FAREWELL!'`,
    };
  };

  // -----------------------------------------------------------
  // SUMMON BOSSES (5x REWARDS & PERSISTENT HEALTH)
  // -----------------------------------------------------------
  const [bossHealthStates, setBossHealthStates] = useState<Record<string, number>>({});

  const summonBoss = (kind: 'elite' | 'mythical' | 'legendary' | 'jiren') => {
    const data = SUMMONS[kind];
    if (!data) return { won: false, defeated: false, bossName: "", log: [], rewards: [] };

    const keyCol = data.keyType;
    if (player[keyCol] < 1) {
      return { won: false, defeated: false, bossName: data.name, log: [{ round: 0, playerDamage: 0, enemyDamage: 0, text: `Missing ${data.keyLabel}.`, isDefeat: true }], rewards: [] };
    }

    setPlayer(prev => ({ ...prev, [keyCol]: prev[keyCol] - 1 }));

    const currentBossHp = bossHealthStates[kind] !== undefined ? bossHealthStates[kind] : data.hp;
    const battle = simulateCombat(stats.atk, player.currentHp, stats.speed, stats.critRate, data.dmg, currentBossHp, 45, true);
    const rewards: string[] = [];

    if (battle.won) {
      confetti({ particleCount: 130, spread: 110 });
      // 5x summon rewards
      const mult = data.rewardMult * 5;
      const yenReward = 20000 * mult;
      const gemReward = 50 * mult;
      const crystalReward = 6 * mult;
      const expReward = 500 * mult;
      const spReward = 20 * mult;

      rewards.push(`+${yenReward.toLocaleString()} Yens`);
      rewards.push(`+${gemReward.toLocaleString()} Gems`);
      rewards.push(`+${crystalReward.toLocaleString()} Crystals`);
      rewards.push(`+${expReward.toLocaleString()} EXP`);
      rewards.push(`+${spReward.toLocaleString()} Skill Points`);

      // Gear drop
      const gearPool = ["Supernova Blade", "Crusher Edge", "Doom Armor", "Celestial Armor", "Katchin Armor", "Kamehameha Blade", "Senzu Bean"];
      const dropped = gearPool[Math.floor(Math.random() * gearPool.length)];
      rewards.push(`Rare Boss Gear: ${dropped}`);
      setInventory(prev => ({ ...prev, [dropped]: (prev[dropped] || 0) + 1 }));

      // Dragon Ball drop
      const dbStar = Math.floor(Math.random() * 7) + 1;
      rewards.push(`Acquired ${dbStar}★ Dragon Ball`);
      setDragonBalls(prev => ({ ...prev, [dbStar]: (prev[dbStar] || 0) + 1 }));

      // Reset boss health for next summon
      setBossHealthStates(prev => ({ ...prev, [kind]: data.hp }));

      setPlayer(prev => ({
        ...prev,
        currentHp: battle.remainingPlayerHp,
        yens: prev.yens + yenReward,
        gems: prev.gems + gemReward,
        crystals: prev.crystals + crystalReward,
        exp: prev.exp + expReward,
        skillPoints: prev.skillPoints + spReward,
      }));
    } else {
      // Retain the remaining boss health so player can fight him again at same HP!
      setBossHealthStates(prev => ({ ...prev, [kind]: battle.remainingEnemyHp }));
      setPlayer(prev => ({ ...prev, currentHp: 1 }));
    }

    return {
      won: battle.won,
      defeated: battle.defeated,
      bossName: data.name,
      log: battle.log,
      rewards,
    };
  };

  // -----------------------------------------------------------
  // WORLD RAID (10x REWARDS, NO COUNTDOWN, PERSISTENT HP)
  // -----------------------------------------------------------
  const attackWorldRaid = () => {
    if (!worldRaid.active) {
      return { won: false, defeated: false, damageDealt: 0, log: [] };
    }

    const isCrit = Math.random() * 100 < stats.critRate;
    const damage = Math.floor(stats.atk * (isCrit ? 2.2 : 1.4) * (0.9 + Math.random() * 0.4));
    const newHp = Math.max(0, worldRaid.hp - damage);
    const defeated = newHp <= 0;

    const log: BattleLogEntry[] = [
      {
        round: 1,
        playerDamage: damage,
        enemyDamage: WORLD_RAID.dmg,
        isCrit,
        text: `You unleashed a devastating ${isCrit ? "CRITICAL FINAL BLOW" : "Raid Attack"} dealing ${damage.toLocaleString()} DMG to ${WORLD_RAID.name}!`,
      },
    ];

    const rewards: string[] = [];
    if (defeated) {
      confetti({ particleCount: 160, spread: 130 });
      // 10x world raid rewards
      const yens = 10000 * WORLD_RAID.rewardMult;
      const gems = 500 * 10;
      const crystals = 50 * 10;
      const exp = 5000 * 10;

      rewards.push(`+${yens.toLocaleString()} Yens`);
      rewards.push(`+${gems.toLocaleString()} Gems`);
      rewards.push(`+${crystals.toLocaleString()} Crystals`);
      rewards.push(`+${exp.toLocaleString()} EXP`);
      rewards.push(`+25 Gacha Tickets`);

      setPlayer(prev => ({
        ...prev,
        yens: prev.yens + yens,
        gems: prev.gems + gems,
        crystals: prev.crystals + crystals,
        exp: prev.exp + exp,
        tickets: prev.tickets + 25,
      }));
    }

    setWorldRaid(prev => ({
      ...prev,
      hp: newHp,
      active: !defeated,
      totalAttacks: prev.totalAttacks + 1,
      damageMap: {
        ...prev.damageMap,
        [player.userId]: (prev.damageMap[player.userId] || 0) + damage,
      },
    }));

    return {
      won: true,
      defeated,
      damageDealt: damage,
      log,
      rewards: defeated ? rewards : undefined,
    };
  };

  const startWorldRaid = () => {
    if (!player.admin) {
      return { success: false, message: "Only admin or owner can start or respawn the World Raid." };
    }
    setWorldRaid({
      id: 1,
      bossName: WORLD_RAID.name,
      active: true,
      hp: WORLD_RAID.hp,
      maxHp: WORLD_RAID.hp,
      damageMap: {},
      totalAttacks: 0,
    });
    return { success: true, message: "World Raid Boss Multiverse Omega Dragon has descended! Free attacks enabled!" };
  };

  // -----------------------------------------------------------
  // FULL CLAN ALLIANCE SYSTEM (9 OPTIONS)
  // -----------------------------------------------------------
  const createClan = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed || trimmed.length < 3 || trimmed.length > 16) {
      return { success: false, message: "Clan names must be between 3 and 16 letters or numbers." };
    }
    if (clan) return { success: false, message: "Leave your current clan before creating a new one." };
    if (player.crystals < CLAN_CREATE_CRYSTALS) {
      return { success: false, message: `Creating a clan costs ${CLAN_CREATE_CRYSTALS} crystals.` };
    }

    setPlayer(prev => ({ ...prev, crystals: prev.crystals - CLAN_CREATE_CRYSTALS }));

    const newClan: Clan = {
      id: Date.now(),
      name: trimmed,
      created: Date.now(),
      treasureYens: 0,
      treasureGems: 0,
      treasureCrystals: 0,
      announcement: `Welcome to ${trimmed}! Join our raids!`,
    };

    const leaderMember: ClanMember = {
      userId: player.userId,
      clanId: newClan.id,
      role: 'leader',
      firstName: player.firstName,
      username: player.username,
      contributionExp: 1000,
      joinedAt: Date.now(),
    };

    setClan(newClan);
    setClanMembers([leaderMember]);
    return { success: true, message: `Clan '${trimmed}' successfully founded!` };
  };

  const joinClan = (name: string) => {
    if (clan) return { success: false, message: "Leave your current clan first." };
    const joinedClan: Clan = {
      id: 2,
      name: name.trim() || "Capsule Corp Allies",
      created: Date.now(),
      treasureYens: 1500000,
      treasureGems: 12000,
      treasureCrystals: 500,
      announcement: "Defend universe 7 together!",
    };
    setClan(joinedClan);
    setClanMembers([
      { userId: player.userId, clanId: joinedClan.id, role: 'member', firstName: player.firstName, username: player.username, contributionExp: 0, joinedAt: Date.now() },
      { userId: 101, clanId: joinedClan.id, role: 'leader', firstName: 'Bulma', username: 'CapsuleLeader', contributionExp: 25000, joinedAt: Date.now() - 9999999 },
    ]);
    return { success: true, message: `Joined clan ${joinedClan.name}!` };
  };

  const leaveClan = () => {
    if (!clan) return { success: false, message: "You are not in a clan." };
    const myRole = clanMembers.find(m => m.userId === player.userId)?.role;
    const others = clanMembers.filter(m => m.userId !== player.userId);
    if (myRole === 'leader' && others.length > 0) {
      return { success: false, message: "Transfer leadership with /clan transfer before leaving." };
    }
    setClan(null);
    setClanMembers([]);
    setClanRaid(null);
    return { success: true, message: "You left the clan." };
  };

  const disbandClan = () => {
    if (!clan) return { success: false, message: "You are not in a clan." };
    const myRole = clanMembers.find(m => m.userId === player.userId)?.role;
    if (myRole !== 'leader') return { success: false, message: "Only the clan leader can disband the clan." };
    setClan(null);
    setClanMembers([]);
    setClanRaid(null);
    return { success: true, message: "Clan has been disbanded." };
  };

  const promoteMember = (targetUserId: number) => {
    if (!clan) return { success: false, message: "You are not in a clan." };
    const myRole = clanMembers.find(m => m.userId === player.userId)?.role;
    if (myRole !== 'leader') return { success: false, message: "Only leaders can promote members." };
    setClanMembers(prev => prev.map(m => m.userId === targetUserId ? { ...m, role: 'officer' } : m));
    return { success: true, message: "Member promoted to Officer!" };
  };

  const demoteOfficer = (targetUserId: number) => {
    if (!clan) return { success: false, message: "You are not in a clan." };
    const myRole = clanMembers.find(m => m.userId === player.userId)?.role;
    if (myRole !== 'leader') return { success: false, message: "Only leaders can demote officers." };
    setClanMembers(prev => prev.map(m => m.userId === targetUserId ? { ...m, role: 'member' } : m));
    return { success: true, message: "Officer demoted to Member." };
  };

  const transferLeadership = (targetUserId: number) => {
    if (!clan) return { success: false, message: "You are not in a clan." };
    const myRole = clanMembers.find(m => m.userId === player.userId)?.role;
    if (myRole !== 'leader') return { success: false, message: "Only leaders can transfer leadership." };
    setClanMembers(prev => prev.map(m => {
      if (m.userId === player.userId) return { ...m, role: 'officer' };
      if (m.userId === targetUserId) return { ...m, role: 'leader' };
      return m;
    }));
    return { success: true, message: "Clan leadership transferred!" };
  };

  const kickMember = (targetUserId: number) => {
    if (!clan) return { success: false, message: "You are not in a clan." };
    const myRole = clanMembers.find(m => m.userId === player.userId)?.role;
    if (myRole !== 'leader' && myRole !== 'officer') return { success: false, message: "Permission denied." };
    setClanMembers(prev => prev.filter(m => m.userId !== targetUserId));
    return { success: true, message: "Member removed from clan." };
  };

  const setClanAnnouncement = (text: string) => {
    if (!clan) return { success: false, message: "You are not in a clan." };
    setClan(prev => prev ? ({ ...prev, announcement: text }) : null);
    return { success: true, message: "Clan announcement updated!" };
  };

  const depositClanTreasure = (yens = 0, gems = 0, crystals = 0) => {
    if (!clan) return { success: false, message: "You are not in a clan." };
    if (player.yens < yens || player.gems < gems || player.crystals < crystals) {
      return { success: false, message: "Insufficient currency to deposit." };
    }
    setPlayer(prev => ({
      ...prev,
      yens: prev.yens - yens,
      gems: prev.gems - gems,
      crystals: prev.crystals - crystals,
    }));
    setClan(prev => prev ? ({
      ...prev,
      treasureYens: prev.treasureYens + yens,
      treasureGems: prev.treasureGems + gems,
      treasureCrystals: prev.treasureCrystals + crystals,
    }) : null);
    return { success: true, message: `Deposited into Clan Treasury: ${yens.toLocaleString()} Yens, ${gems.toLocaleString()} Gems, ${crystals.toLocaleString()} Crystals!` };
  };

  const startClanRaid = (bossName: string) => {
    if (!clan) return { success: false, message: "Must be in a clan to begin clan raids." };
    const boss = CLAN_RAIDS[bossName];
    if (!boss) return { success: false, message: "Boss not found in Clan Raid roster." };

    setClanRaid({
      clanId: clan.id,
      bossName,
      hp: boss.hp,
      maxHp: boss.hp,
      damageJson: {},
      active: true,
    });

    return { success: true, message: `Clan Raid initiated against ${bossName}! All members can strike!` };
  };

  const attackClanRaid = () => {
    if (!clan || !clanRaid || !clanRaid.active) {
      return { won: false, defeated: false, damageDealt: 0, log: [] };
    }
    const bossData = CLAN_RAIDS[clanRaid.bossName];
    const isCrit = Math.random() * 100 < stats.critRate;
    const damage = Math.floor(stats.atk * (isCrit ? 1.8 : 1.25) * (0.9 + Math.random() * 0.4));
    const newHp = Math.max(0, clanRaid.hp - damage);
    const defeated = newHp <= 0;

    const log: BattleLogEntry[] = [
      {
        round: 1,
        playerDamage: damage,
        enemyDamage: bossData.dmg,
        isCrit,
        text: `You struck ${clanRaid.bossName} with a ${isCrit ? "CRITICAL CLAN COMBO" : "strike"} dealing ${damage.toLocaleString()} DMG!`,
      },
    ];

    const rewards: string[] = [];
    if (defeated) {
      confetti({ particleCount: 140, spread: 110 });
      rewards.push(`+${bossData.rewardYens.toLocaleString()} Yens`);
      rewards.push(`+${bossData.rewardGems.toLocaleString()} Gems`);
      rewards.push(`+${bossData.rewardCrystals.toLocaleString()} Crystals`);
      rewards.push(`+${bossData.rewardTickets} Gacha Tickets`);
      rewards.push(`+${bossData.rewardSkillPoints} Skill Points`);

      setPlayer(prev => ({
        ...prev,
        yens: prev.yens + bossData.rewardYens,
        gems: prev.gems + bossData.rewardGems,
        crystals: prev.crystals + bossData.rewardCrystals,
        tickets: prev.tickets + bossData.rewardTickets,
        skillPoints: prev.skillPoints + bossData.rewardSkillPoints,
      }));

      setClan(prev => prev ? ({
        ...prev,
        treasureYens: prev.treasureYens + bossData.rewardYens,
        treasureGems: prev.treasureGems + bossData.rewardGems,
        treasureCrystals: prev.treasureCrystals + bossData.rewardCrystals,
      }) : null);
    }

    setClanRaid(prev => prev ? ({
      ...prev,
      hp: newHp,
      active: !defeated,
      damageJson: {
        ...prev.damageJson,
        [player.userId]: (prev.damageJson[player.userId] || 0) + damage,
      },
    }) : null);

    return {
      won: true,
      defeated,
      damageDealt: damage,
      log,
      rewards: defeated ? rewards : undefined,
    };
  };

  // -----------------------------------------------------------
  // TRAVEL & RANK ASCENSION
  // -----------------------------------------------------------
  const travelToPlanet = (planetName: string) => {
    const pInfo = PLANETS[planetName];
    if (!pInfo) return { success: false, message: "Planet not found." };
    if (level < pInfo.levelMin) {
      return { success: false, message: `Requires Level ${pInfo.levelMin} to travel to ${planetName}. (Your Level: ${level})` };
    }
    setPlayer(prev => ({ ...prev, travel: planetName }));
    return { success: true, message: `Traveled to ${planetName}! Rewards multiplied by ${pInfo.multiplier}x!` };
  };

  const rankUp = () => {
    if (curRank >= 10) return { success: false, message: "You have already ascended to maximum rank: God." };
    const cost = RANKUP_CRYSTALS[curRank];
    if (player.crystals < cost) {
      return { success: false, message: `Rank ${curRank} -> ${curRank + 1} requires ${cost.toLocaleString()} crystals. You have ${player.crystals.toLocaleString()}.` };
    }

    setPlayer(prev => ({
      ...prev,
      crystals: prev.crystals - cost,
      rank: curRank + 1,
      exp: prev.exp + (300 * curRank),
      skillPoints: prev.skillPoints + (40 * curRank),
    }));

    confetti({ particleCount: 140, spread: 110 });
    return {
      success: true,
      message: `Ascended to Rank ${curRank + 1}: ${RANKS[curRank + 1]}! Gained +${300 * curRank} EXP, +${40 * curRank} SP, and +15% permanent multiplier across all stats!`,
    };
  };

  const claimDaily = () => {
    const today = new Date().toISOString().split('T')[0];
    if (player.dailyDay === today) {
      return { success: false, streak: player.dailyStreak, message: "Daily reward already claimed today. Try again tomorrow!" };
    }

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const streak = player.dailyDay === yesterday ? player.dailyStreak + 1 : 1;

    const rewards: Record<string, number> = {
      yens: 1500 + Math.min(streak, 20) * 500,
      gems: Math.min(10 + Math.floor(streak * 2), 60),
    };
    if (streak % 3 === 0) rewards.tickets = 2;
    if (streak % 7 === 0) rewards.crystals = 3;

    setPlayer(prev => ({
      ...prev,
      dailyDay: today,
      dailyStreak: streak,
      yens: prev.yens + rewards.yens,
      gems: prev.gems + rewards.gems,
      tickets: prev.tickets + (rewards.tickets || 0),
      crystals: prev.crystals + (rewards.crystals || 0),
    }));

    confetti({ particleCount: 70, spread: 70 });
    return {
      success: true,
      streak,
      rewards,
      message: `Claimed Daily Reward for Day ${streak}!`,
    };
  };

  const claimWeekly = () => {
    const now = new Date();
    const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    const weekKey = `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;

    if (player.weeklyWeek === weekKey) {
      return { success: false, message: "Weekly bounty already claimed this week. Try again next week!" };
    }

    const rewards = {
      yens: 25000,
      gems: 250,
      crystals: 15,
      tickets: 5,
      skillPoints: 20,
    };
    const star = Math.floor(Math.random() * 3) + 1;

    setPlayer(prev => ({
      ...prev,
      weeklyWeek: weekKey,
      yens: prev.yens + rewards.yens,
      gems: prev.gems + rewards.gems,
      crystals: prev.crystals + rewards.crystals,
      tickets: prev.tickets + rewards.tickets,
      skillPoints: prev.skillPoints + rewards.skillPoints,
    }));

    setDragonBalls(prev => ({ ...prev, [star]: (prev[star] || 0) + 1 }));

    confetti({ particleCount: 90, spread: 80 });
    return {
      success: true,
      rewards,
      star,
      message: `Weekly Bounty Claimed! Received resources and a ${star}★ Dragon Ball!`,
    };
  };

  // -----------------------------------------------------------
  // BOT COMMAND INTERPRETER
  // -----------------------------------------------------------
  const runBotCommand = (raw: string): string => {
    const text = raw.trim();
    if (!text.startsWith('/')) {
      return "Commands must start with a slash (e.g. /profile, /explore, /gacha, /heal).";
    }
    const parts = text.slice(1).split(/\s+/);
    const cmd = parts[0]?.toLowerCase();
    const args = parts.slice(1);

    switch (cmd) {
      case 'start':
      case 'help':
        return `🐉 Dragon Battle RPG Bot Commands:
/profile - Fighter attributes, stats & currencies
/explore [1|2|3] - 1: Battle, 2: Run away, 3: Info
/heal [senzu|mega|potion|revive] - Restore battle HP
/shop - Inspect armors, weapons, crystals, heals, keys
/buy <id> [qty] - Purchase marketplace gear in bulk
/inventory - Inspect all owned items & bag
/gacha [qty] - Summon warriors (1x, 10x, 50x)
/mycharacters - View warriors divided by rank
/team - Active warrior & battle stats
/equip <name> - Equip weapon, armor, or warrior
/skills - View all 20 Dragon Ball Ki skills
/learn <skill> - Learn skill to permanently scale ATK
/wish - Gather 1-7★ balls to summon Shenron
/summon <elite|mythical|legendary|jiren> - Key boss raids
/daily - Claim daily streak bonus
/weekly - Claim weekly tribute & dragon ball
/rankup - Ascend through 10 ranks from Beginner to God
/travel [1-6] - Travel to Earth, Hell, Kai, Beerus, Omniverse
/fusion <char1> <char2> - Fuse two warriors
/clan - Clan alliance overview, roster & raids
/raid - Challenge Multiverse Omega Dragon
/raid_start - Owner/Admin start world raid
/admin_add <target> <amt> <type> [name] - Admin cheat`;

      case 'profile':
        return `👤 Fighter Profile:
Name: ${player.firstName} (@${player.username})
Level: ${stats.level} (EXP: ${player.exp})
Rank: ${player.rank} (${stats.rankName}) [${stats.rankMultiplier.toFixed(2)}x Multiplier]
Battle HP: ${player.currentHp} / ${stats.hp}
Strike ATK: ${stats.atk} | Speed: ${stats.speed} | Crit: ${stats.critRate}%
World: ${player.travel} (${stats.worldMultiplier}x rewards)
Yens: ${player.yens.toLocaleString()} | Gems: ${player.gems.toLocaleString()} | Crystals: ${player.crystals.toLocaleString()}
Tickets: ${player.tickets} | SP: ${player.skillPoints} | Keys: ${player.keysElite} Elite / ${player.keysBoss} Boss
Equipped Leader: ${player.equippedChar || 'None'}
Weapon: ${player.weapon || 'None'} | Armor: ${player.armor || 'None'}`;

      case 'explore': {
        const choice = (args[0] || '1') as '1' | '2' | '3';
        const res = exploreMenu(choice);
        if (res.type === 'run' || res.type === 'info' || !res.data) return res.message;
        const d = res.data;
        return `⚔️ Battle Outcome: ${d.won ? 'VICTORY' : 'DEFEAT'} vs ${d.enemy}!\n${d.log?.slice(-3).map((l: BattleLogEntry) => l.text).join('\n')}\nRewards: ${d.rewards?.join(', ') || 'None'}`;
      }

      case 'heal': {
        const itemArg = (args[0] || 'senzu').toLowerCase();
        let targetItem: 'Senzu Bean' | 'Mega Potion' | 'Potion' | 'Revive' = 'Senzu Bean';
        if (itemArg.includes('mega')) targetItem = 'Mega Potion';
        else if (itemArg.includes('potion')) targetItem = 'Potion';
        else if (itemArg.includes('revive')) targetItem = 'Revive';
        const res = healPlayer(targetItem);
        return res.message;
      }

      case 'gacha': {
        const qty = args[0] ? parseInt(args[0], 10) : 1;
        const res = rollGacha(qty);
        if (!res.success) return `❌ ${res.message}`;
        return `✨ Gacha Pull Results (${qty}x):\n` + res.results.map(c => `• ${c.name} [${c.rarity.toUpperCase()}]`).join('\n');
      }

      case 'mycharacters': {
        const groups: Record<Rarity, CharacterItem[]> = { omni: [], sp_plus: [], mythical: [], legendary: [], epic: [], rare: [], common: [] };
        characters.forEach(c => { groups[c.rarity]?.push(c); });
        let out = `🥋 Character Roster (${characters.length} Total):\n`;
        (['omni', 'sp_plus', 'mythical', 'legendary', 'epic', 'rare', 'common'] as Rarity[]).forEach(r => {
          if (groups[r] && groups[r].length > 0) {
            out += `\n🌟 ${r === 'sp_plus' ? 'SP+ (SUPER HEROES 2)' : r.toUpperCase()} (${groups[r].length}):\n`;
            out += groups[r].map(c => `  • ${c.name} (HP: ${c.hp}, ATK: ${c.atk})`).join('\n') + '\n';
          }
        });
        return out;
      }

      case 'inventory': {
        const items = Object.entries(inventory).filter(([, q]) => q > 0);
        return `🎒 Inventory:\n` + (items.length ? items.map(([i, q]) => `• ${i} x${q}`).join('\n') : "Empty");
      }

      case 'rankup': return rankUp().message;
      case 'daily': return claimDaily().message;
      case 'weekly': return claimWeekly().message;
      case 'wish': return makeWish().message;

      case 'travel': {
        if (!args[0]) {
          return `🪐 Planets:\n` + PLANET_ORDER.map((p, i) => `${i + 1}. ${p} (Lvl ${PLANETS[p].levelMin}+) [${PLANETS[p].multiplier}x]`).join('\n') + `\nUse /travel <1-6>`;
        }
        const idx = parseInt(args[0], 10) - 1;
        const name = PLANET_ORDER[idx] || args[0];
        return travelToPlanet(name).message;
      }

      case 'raid_start': return startWorldRaid().message;
      case 'raid':
      case 'raid_attack': {
        const res = attackWorldRaid();
        return `💥 World Raid Attack:\nDealt ${res.damageDealt.toLocaleString()} DMG to ${WORLD_RAID.name}!\nBoss Remaining HP: ${worldRaid.hp.toLocaleString()}`;
      }

      case 'admin_add': {
        const amt = parseInt(args[1] || "100", 10);
        const kind = (args[2] || "gems").toLowerCase();
        if (kind === 'gems') setPlayer(p => ({ ...p, gems: p.gems + amt }));
        else if (kind === 'yens') setPlayer(p => ({ ...p, yens: p.yens + amt }));
        else if (kind === 'crystals') setPlayer(p => ({ ...p, crystals: p.crystals + amt }));
        else if (kind === 'tickets') setPlayer(p => ({ ...p, tickets: p.tickets + amt }));
        else if (kind === 'keys') setPlayer(p => ({ ...p, keysElite: p.keysElite + amt, keysBoss: p.keysBoss + amt }));
        return `✅ Admin granted +${amt} ${kind}!`;
      }

      default: {
        const tgRes = executeTelegramCommand(raw, {
          player,
          userCharacters: characters,
          inventory,
          weapons: WEAPONS_CATALOG,
          armors: ARMORS_CATALOG,
          clan,
          clanMember: clanMembers.find(m => m.userId === player.userId) || null,
          allClans: clan ? [clan] : [],
          clanMembersByClan: clan ? { [clan.id]: clanMembers } : {},
          clanRaid,
          worldRaid,
          dragonBalls: Object.entries(dragonBalls).filter(([_, count]) => count > 0).map(([star]) => parseInt(star, 10)),
          dragonBallWishesUsed: 0,
        }, {
          onUpdatePlayer: setPlayer,
          onUpdateInventory: setInventory,
          onUpdateCharacters: setCharacters,
          onUpdateClan: (c, m) => {
            setClan(c);
            if (m) setClanMembers([m]);
            else setClanMembers([]);
          },
          onPerformExplore: (choice) => {
            const res = exploreMenu(choice === 'battle' ? '1' : choice === 'run' ? '2' : '3');
            return res.message;
          },
          onAttackRaid: () => {
            const res = attackWorldRaid();
            return `💥 World Raid Attack:\nDealt ${res.damageDealt.toLocaleString()} DMG!\nRemaining HP: ${worldRaid.hp.toLocaleString()}`;
          },
          onPerformGacha: (count) => {
            const res = rollGacha(count);
            return {
              pulled: res.results,
              message: res.success
                ? `✨ Summoned ${res.results.length} warriors:\n` + res.results.map(c => `• ${c.name} [${c.rarity.toUpperCase()}]`).join('\n')
                : `❌ ${res.message}`,
            };
          },
        });
        return tgRes.text.replace(/<[^>]*>?/gm, '');
      }
    }
  };

  const resetGame = () => {
    localStorage.clear();
    setPlayer(defaultPlayer);
    setInventory(defaultInventory);
    setCharacters(defaultCharacters);
    setSkills(defaultSkills);
    setDragonBalls(defaultDragonBalls);
    setClan(defaultClan);
    setClanMembers(defaultClanMembers);
    setClanRaid(null);
    setWorldRaid({ id: 1, bossName: WORLD_RAID.name, active: true, hp: WORLD_RAID.hp, maxHp: WORLD_RAID.hp, damageMap: {}, totalAttacks: 0 });
  };

  const quickAddResources = (type: 'all' | 'keys' | 'gacha' | 'dragonballs' | 'senzu') => {
    if (type === 'all') {
      setPlayer(prev => ({
        ...prev,
        yens: prev.yens + 5000000,
        gems: prev.gems + 100000,
        crystals: prev.crystals + 50000,
        tickets: prev.tickets + 200,
        skillPoints: prev.skillPoints + 1000,
        keysElite: prev.keysElite + 30,
        keysBoss: prev.keysBoss + 30,
      }));
    } else if (type === 'keys') {
      setPlayer(prev => ({ ...prev, keysElite: prev.keysElite + 20, keysBoss: prev.keysBoss + 20 }));
    } else if (type === 'gacha') {
      setPlayer(prev => ({ ...prev, tickets: prev.tickets + 100 }));
    } else if (type === 'dragonballs') {
      setDragonBalls({ 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1 });
    } else if (type === 'senzu') {
      setInventory(prev => ({ ...prev, "Senzu Bean": (prev["Senzu Bean"] || 0) + 10 }));
    }
  };

  const rewardPlayer = (rewards: { yens?: number; gems?: number; crystals?: number; tickets?: number; exp?: number }) => {
    setPlayer(prev => ({
      ...prev,
      yens: prev.yens + (rewards.yens || 0),
      gems: prev.gems + (rewards.gems || 0),
      crystals: prev.crystals + (rewards.crystals || 0),
      tickets: prev.tickets + (rewards.tickets || 0),
      exp: prev.exp + (rewards.exp || 0),
    }));
  };

  const equipWarrior = (name: string) => equipCharacter(name);

  const addEquipment = (item: { name: string; kind: 'weapon' | 'armor'; statBonus: number; description: string; tier: string }) => {
    if (item.kind === 'weapon') {
      setPlayer(prev => ({ ...prev, weapon: item.name }));
    } else {
      setPlayer(prev => ({ ...prev, armor: item.name }));
    }
  };

  return (
    <GameContext.Provider
      value={{
        player,
        inventory,
        characters,
        skills,
        dragonBalls,
        clan,
        clanMembers,
        clanRaid,
        worldRaid,
        stats,
        exploreMenu,
        executeBattleTurn,
        friezaBossBattle,
        healPlayer,
        buyShopItem,
        equipItem,
        equipCharacter,
        rollGacha,
        fuseCharacters,
        trainWarrior,
        limitBreakWarrior,
        learnSkill,
        makeWish,
        summonBoss,
        attackWorldRaid,
        startWorldRaid,
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
        travelToPlanet,
        rankUp,
        claimDaily,
        claimWeekly,
        rewardPlayer,
        equipWarrior,
        addEquipment,
        runBotCommand,
        resetGame,
        quickAddResources,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within a GameProvider');
  return context;
};
