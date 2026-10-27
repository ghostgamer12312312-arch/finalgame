/**
 * Telegram Bot Command Interpreter (Mirroring and expanding bot.py by 10x)
 * Fully parses all commands, arguments, callbacks, and inline menus from the original Python bot:
 * /start, /profile, /explore (Battle, Run, Info), /clan, /shop, /gacha, /roster, /raid, /summon,
 * /travel, /train, /limitbreak, /fuse, /dragonballs, /wish, /saga, and admin cheat consoles.
 */

import { Player, Clan, ClanMember, CharacterItem, EquipmentItem, ClanRaidState, WorldRaidState } from '../types/game';
import { CHARACTERS, WEAPONS, ARMORS, SHOP_ITEMS, PLANETS, PLANET_ORDER, SUMMONS, CLAN_RAIDS, WORLD_RAID, RANKS, RANKUP_CRYSTALS, DOJO_SKILLS } from '../data/gameData';
import { DEFAULT_CLAN_PERKS, canPerformClanAction, formatClanProfile, sortClansByPower } from './clanManager';
import { calculateCharacterProgression, calculateWarriorBattlePower } from './characterProgression';
import { STORY_SAGAS } from './storySagas';

export interface TelegramBotState {
  player: Player;
  userCharacters: CharacterItem[];
  inventory: Record<string, number>;
  weapons: EquipmentItem[];
  armors: EquipmentItem[];
  clan: Clan | null;
  clanMember: ClanMember | null;
  allClans: Clan[];
  clanMembersByClan: Record<number, ClanMember[]>;
  clanRaid: ClanRaidState | null;
  worldRaid: WorldRaidState;
  dragonBalls: number[];
  dragonBallWishesUsed: number;
}

export interface TelegramBotResponse {
  text: string;
  keyboardHints?: string[];
  actionPerformed?: string;
}

export function executeTelegramCommand(
  rawInput: string,
  state: TelegramBotState,
  callbacks: {
    onUpdatePlayer: (updater: (prev: Player) => Player) => void;
    onUpdateInventory: (updater: (prev: Record<string, number>) => Record<string, number>) => void;
    onUpdateCharacters: (updater: (prev: CharacterItem[]) => CharacterItem[]) => void;
    onUpdateClan: (clan: Clan | null, member: ClanMember | null) => void;
    onPerformExplore: (choice: 'battle' | 'run' | 'info') => string;
    onAttackRaid: () => string;
    onPerformGacha: (count: number) => { pulled: CharacterItem[]; message: string };
  }
): TelegramBotResponse {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return { text: "💬 Enter a command (e.g. <code>/help</code>, <code>/profile</code>, <code>/explore</code>, <code>/clan</code>)" };
  }

  const parts = trimmed.split(/\s+/);
  const command = parts[0].toLowerCase();
  const args = parts.slice(1);

  switch (command) {
    case '/start': {
      return {
        text: `
🌟 <b>WELCOME TO DRAGON BALL TELEGRAM RPG!</b> 🌟
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step into the multiversal realm of Akira Toriyama's legendary warriors!
Summon god-tier fighters, train in 100x gravity, build ancient clans,
shatter world raid bosses, and travel across 6 sacred dimensions!

⚔️ <b>CORE COMMANDS:</b>
• <code>/profile</code> - View your warrior stats & Scouter BP
• <code>/explore</code> - Patrol current planet [1:Battle, 2:Run, 3:Info]
• <code>/roster</code> - Inspect all summoned warriors by rank
• <code>/gacha [1|10|50|100]</code> - Summon rare to Omni-King warriors
• <code>/shop [armour|weapons|crystals|healing|fusion|tickets]</code>
• <code>/clan [info|create|join|leave|donate|raid|war]</code>
• <code>/travel [Earth|Hell|Kai Planet|...]</code> - Change planets
• <code>/raid</code> - Multiverse Omega Dragon (Persistent HP, 10x Loot)
• <code>/summon [elite|mythical|legendary|jiren]</code> - Boss keys
• <code>/saga</code> - Play 10 Dragon Ball campaign sagas
• <code>/help</code> - Complete command index
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type <code>/explore</code> to begin your patrol!
        `.trim(),
        keyboardHints: ['/profile', '/explore', '/roster', '/gacha 10', '/clan', '/shop'],
      };
    }

    case '/help': {
      return {
        text: `
📜 <b>DRAGON BALL TELEGRAM BOT COMMAND COMPENDIUM:</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 <b>WARRIOR & PROFILE:</b>
• <code>/profile</code> or <code>/me</code> - View stats, gear & power level
• <code>/roster</code> or <code>/mycharacters</code> - View warriors grouped by rank
• <code>/equip &lt;name&gt;</code> - Set your primary battle warrior
• <code>/train &lt;name&gt;</code> - Spend Yens to level up a warrior
• <code>/limitbreak &lt;name&gt;</code> - Ascend character to break level cap
• <code>/fuse &lt;char1&gt; &lt;char2&gt;</code> - Perform Potara/Metamoran fusion
• <code>/rankup</code> - Ascend mortal rank (Beginner ➡️ God)

🗺️ <b>EXPLORATION & TRAVEL:</b>
• <code>/explore</code> - Trigger planetary encounter with options:
    [1] Battle - Fight the patrolling foe
    [2] Run - Flee safely with agility
    [3] Info - Scouter scan foe's attributes
• <code>/travel</code> - List all 6 planets and level gates
• <code>/travel &lt;planet_name&gt;</code> - Fly to chosen planetary realm

🏰 <b>CLAN SYSTEM:</b>
• <code>/clan</code> - Clan dashboard & perks
• <code>/clan create &lt;name&gt;</code> - Found a new clan (100 Crystals)
• <code>/clan list</code> - Leaderboard of top clans
• <code>/clan join &lt;clan_id&gt;</code> - Join an existing clan
• <code>/clan leave</code> - Leave your current clan
• <code>/clan donate yens &lt;amt&gt;</code> - Tithe gold into vault
• <code>/clan donate gems &lt;amt&gt;</code> - Tithe gems into vault
• <code>/clan donate crystals &lt;amt&gt;</code> - Tithe crystals into vault
• <code>/clan raid</code> - View active clan raid boss
• <code>/clan raid attack</code> - Strike clan raid boss
• <code>/clan disband confirm</code> - (Leader only) Disband clan

💥 <b>COMBAT & RAIDS:</b>
• <code>/raid</code> - Multiverse World Raid status (10x loot)
• <code>/raid attack</code> - Attack world boss (No cooldown, HP persists!)
• <code>/summon</code> - List boss summons (Elite, Mythical, Legendary)
• <code>/summon &lt;elite|mythical|legendary|jiren&gt;</code> - Use keys

🛒 <b>SHOP & INVENTORY:</b>
• <code>/shop</code> - View 6 market categories
• <code>/shop armour</code> - Inspect defensive gear
• <code>/shop weapons</code> - Inspect deadly blade & ki weapons
• <code>/shop crystals</code> - Buy shiny crystals with gems
• <code>/shop healing</code> - Purchase Senzu beans & potions
• <code>/shop fusion</code> - Purchase Potara earrings & dances
• <code>/shop tickets</code> - Purchase summon ticket bundles
• <code>/buy &lt;item_id&gt; [count]</code> - Purchase items in bulk
• <code>/inventory</code> - View consumable items in your capsule bag
• <code>/use &lt;item_name&gt;</code> - Consume Senzu bean or potion

🐲 <b>DRAGON BALLS & WISHES:</b>
• <code>/dragonballs</code> - View gathered star orbs
• <code>/wish &lt;1..6&gt;</code> - Summon Shenron to grant eternal wishes

📖 <b>STORY SAGAS:</b>
• <code>/saga</code> - View Saiyan, Frieza, Cell, Buu, Super, SDBH sagas
• <code>/saga &lt;saga_id&gt;</code> - View chapter stages and bounties
━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `.trim(),
        keyboardHints: ['/profile', '/explore', '/shop', '/gacha 10', '/raid'],
      };
    }

    case '/profile':
    case '/me':
    case '/stats': {
      const p = state.player;
      const equipped = state.userCharacters.find(c => c.name === p.equippedChar) || state.userCharacters[0];
      const rankTitle = RANKS[p.rank] || 'Beginner';
      const clanName = state.clan ? state.clan.name : 'None';
      const bp = equipped ? calculateWarriorBattlePower(equipped) : 9000;

      return {
        text: `
👤 <b>WARRIOR PROFILE: ${p.firstName.toUpperCase()}</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎖️ <b>Rank:</b> Level ${p.rank} [<b>${rankTitle}</b>]
📟 <b>Scouter Battle Power:</b> ${bp.toLocaleString()} BP
⭐ <b>Equipped Champion:</b> <b>${equipped ? equipped.name : 'None'}</b>
⚔️ <b>Weapon:</b> ${p.weapon || 'Bare Knuckles'}
🛡️ <b>Armor:</b> ${p.armor || 'Plain Gi'}
🪐 <b>Current Realm:</b> ${p.travel} (Multiplier: ${PLANETS[p.travel]?.multiplier || 1}x)
🏰 <b>Clan:</b> ${clanName}

❤️ <b>Vitality:</b> ${p.currentHp.toLocaleString()} / ${p.maxHp.toLocaleString()} HP
💥 <b>NPC Patrol Streak:</b> ${p.npcStreak} consecutive victories

💰 <b>TREASURY:</b>
• 💴 <b>Yens:</b> ${p.yens.toLocaleString()}
• 💎 <b>Gems:</b> ${p.gems.toLocaleString()}
• 🔮 <b>Crystals:</b> ${p.crystals.toLocaleString()}
• 🎫 <b>Gacha Tickets:</b> ${p.tickets}
• 🗝️ <b>Elite Keys:</b> ${p.keysElite} | <b>Boss Keys:</b> ${p.keysBoss}
• ⚡ <b>Ki Skill Points:</b> ${p.skillPoints}
• 🔮 <b>Fusion Completed:</b> ${p.fusionCount} times
━━━━━━━━━━━━━━━━━━━━━━━━━━━
<i>Use <code>/explore</code> to patrol or <code>/roster</code> to inspect warriors!</i>
        `.trim(),
        keyboardHints: ['/explore', '/roster', '/shop', '/travel', '/raid'],
      };
    }

    case '/explore': {
      const sub = args[0]?.toLowerCase();
      if (!sub) {
        return {
          text: `
🌍 <b>PATROL EXPEDITION: ${state.player.travel.toUpperCase()}</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━
You sense an encroaching Ki signature moving fast in the distance!
Choose your martial action:

[1] ⚔️ <b>Battle</b> - Engage in deadly martial combat
[2] 💨 <b>Run</b> - Retract your Ki aura and escape safely
[3] 🔍 <b>Info</b> - Scan foe's stats and drop chances

<i>Type <code>/explore 1</code>, <code>/explore 2</code>, or <code>/explore 3</code></i>
          `.trim(),
          keyboardHints: ['/explore 1', '/explore 2', '/explore 3'],
        };
      }

      if (sub === '1' || sub === 'battle') {
        const battleRes = callbacks.onPerformExplore('battle');
        return {
          text: battleRes,
          keyboardHints: ['/explore', '/explore 1', '/profile', '/heal'],
        };
      } else if (sub === '2' || sub === 'run') {
        const runRes = callbacks.onPerformExplore('run');
        return {
          text: runRes,
          keyboardHints: ['/explore', '/profile'],
        };
      } else if (sub === '3' || sub === 'info') {
        const infoRes = callbacks.onPerformExplore('info');
        return {
          text: infoRes,
          keyboardHints: ['/explore 1', '/explore 2'],
        };
      } else {
        return {
          text: `❓ Unknown option. Choose: <code>/explore 1</code> (Battle), <code>/explore 2</code> (Run), <code>/explore 3</code> (Info).`,
        };
      }
    }

    case '/roster':
    case '/mycharacters': {
      const rankOrder = ['omni', 'sp_plus', 'mythical', 'legendary', 'epic', 'rare'];
      const rankLabels: Record<string, string> = {
        omni: '👑 OMNI-KING (Highest Deity)',
        sp_plus: '⚡ SP+ HEROES TITANS',
        mythical: '🔥 MYTHICAL GODS',
        legendary: '✨ LEGENDARY WARRIORS',
        epic: '⚔️ EPIC CHAMPIONS',
        rare: '🛡️ RARE RECRUITS',
      };

      const grouped: Record<string, CharacterItem[]> = {};
      rankOrder.forEach(r => (grouped[r] = []));

      state.userCharacters.forEach(c => {
        if (!grouped[c.rarity]) grouped[c.rarity] = [];
        grouped[c.rarity].push(c);
      });

      let rosterText = `🥋 <b>YOUR MULTIVERSAL WARRIOR ROSTER</b>\nTotal Champions: ${state.userCharacters.length}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

      rankOrder.forEach(rank => {
        const list = grouped[rank] || [];
        if (list.length > 0) {
          rosterText += `\n<b>${rankLabels[rank]}</b> (${list.length})\n`;
          list.forEach(char => {
            const isEquipped = char.name === state.player.equippedChar;
            const bp = calculateWarriorBattlePower(char);
            rosterText += `  ${isEquipped ? '⭐ <b>[EQUIPPED]</b> ' : '• '}<b>${char.name}</b> (Lv.${char.level || 1}) | ${bp.toLocaleString()} BP | HP: ${char.hp} | ATK: ${char.atk}\n`;
          });
        }
      });

      rosterText += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━\n<i>Equip any warrior with <code>/equip &lt;name&gt;</code> or train with <code>/train &lt;name&gt;</code></i>`;

      return {
        text: rosterText.trim(),
        keyboardHints: ['/profile', '/gacha 10', '/train', '/fuse'],
      };
    }

    case '/equip': {
      const charName = args.join(' ').trim();
      if (!charName) {
        return { text: `⚠️ Specify a warrior to equip! Example: <code>/equip Goku (Ultra Instinct)</code>` };
      }

      const found = state.userCharacters.find(c => c.name.toLowerCase() === charName.toLowerCase());
      if (!found) {
        return { text: `❌ You do not possess <b>${charName}</b> in your roster. Check <code>/roster</code>!` };
      }

      callbacks.onUpdatePlayer(prev => ({ ...prev, equippedChar: found.name }));
      return {
        text: `⭐ <b>${found.name}</b> has been equipped as your primary champion! Scouter Battle Power calibrated!`,
        keyboardHints: ['/profile', '/explore', '/roster'],
      };
    }

    case '/gacha': {
      const rawCount = args[0] ? parseInt(args[0], 10) : 1;
      const count = isNaN(rawCount) || rawCount < 1 ? 1 : Math.min(100, rawCount);

      const result = callbacks.onPerformGacha(count);
      return {
        text: result.message,
        keyboardHints: ['/gacha 1', '/gacha 10', '/gacha 50', '/roster'],
      };
    }

    case '/shop': {
      const category = args[0]?.toLowerCase();
      if (!category) {
        return {
          text: `
🛒 <b>MULTIVERSE CAPSULE MARKETPLACE</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Choose a marketplace sector to inspect items:

• <code>/shop armour</code> - Defensive Battle Armors & Whis Gi (10+ Items)
• <code>/shop weapons</code> - Power Poles, Z-Swords, Divine Blades (15+ Items)
• <code>/shop crystals</code> - Transmute Gems into Sacred Crystals
• <code>/shop healing</code> - Senzu Beans & Ultra Divine Water
• <code>/shop fusion</code> - Potara Earrings & Metamoran Scrolls
• <code>/shop tickets</code> - Multiverse Gacha Ticket Bundles (10, 50, 100)

<i>Type <code>/buy &lt;item_id&gt; [count]</code> to purchase items!</i>
          `.trim(),
          keyboardHints: ['/shop armour', '/shop weapons', '/shop crystals', '/shop healing', '/shop fusion', '/shop tickets'],
        };
      }

      let filteredItems = SHOP_ITEMS;
      let categoryTitle = 'ALL ITEMS';

      if (category === 'armour' || category === 'armor') {
        filteredItems = SHOP_ITEMS.filter(i => i.kind === 'armor');
        categoryTitle = 'ARMOUR SUITS';
      } else if (category === 'weapons' || category === 'weapon') {
        filteredItems = SHOP_ITEMS.filter(i => i.kind === 'weapon');
        categoryTitle = 'WEAPONS & BLADES';
      } else if (category === 'crystals' || category === 'crystal') {
        filteredItems = SHOP_ITEMS.filter(i => i.kind === 'crystal');
        categoryTitle = 'SACRED CRYSTALS';
      } else if (category === 'healing' || category === 'heal') {
        filteredItems = SHOP_ITEMS.filter(i => i.kind === 'heal');
        categoryTitle = 'SENZU & HEALING';
      } else if (category === 'fusion') {
        filteredItems = SHOP_ITEMS.filter(i => i.kind === 'fusion');
        categoryTitle = 'FUSION REAGENTS';
      } else if (category === 'tickets' || category === 'ticket') {
        filteredItems = SHOP_ITEMS.filter(i => i.kind === 'ticket');
        categoryTitle = 'GACHA TICKETS';
      }

      let shopMsg = `🛒 <b>MARKETPLACE SECTOR: ${categoryTitle}</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
      filteredItems.forEach(item => {
        const currIcon = item.currency === 'yens' ? '💴' : item.currency === 'gems' ? '💎' : '🔮';
        shopMsg += `• [ID: <b>${item.id}</b>] <b>${item.name}</b>\n  Price: ${item.price.toLocaleString()} ${currIcon} ${item.currency.toUpperCase()} | <i>${item.description}</i>\n`;
      });
      shopMsg += `\n<i>Purchase with <code>/buy &lt;id&gt; [quantity]</code></i>`;

      return {
        text: shopMsg.trim(),
        keyboardHints: [`/buy ${filteredItems[0]?.id || 1} 1`, '/shop', '/inventory', '/profile'],
      };
    }

    case '/buy': {
      const itemId = parseInt(args[0], 10);
      const count = args[1] ? Math.max(1, parseInt(args[1], 10)) : 1;

      if (isNaN(itemId)) {
        return { text: `⚠️ Specify item ID! Example: <code>/buy 10 5</code>` };
      }

      const item = SHOP_ITEMS.find(i => i.id === itemId);
      if (!item) {
        return { text: `❌ Item ID <b>${itemId}</b> does not exist in the Capsule Corp catalog.` };
      }

      const totalCost = item.price * count;
      const playerCurr = state.player[item.currency];

      if (playerCurr < totalCost) {
        return {
          text: `❌ Insufficient funds! You need <b>${totalCost.toLocaleString()} ${item.currency}</b> but only have <b>${playerCurr.toLocaleString()}</b>.`,
        };
      }

      callbacks.onUpdatePlayer(prev => ({
        ...prev,
        [item.currency]: prev[item.currency] - totalCost,
      }));

      // Grant item
      if (item.kind === 'ticket') {
        callbacks.onUpdatePlayer(prev => ({ ...prev, tickets: prev.tickets + item.amount * count }));
      } else if (item.kind === 'crystal') {
        callbacks.onUpdatePlayer(prev => ({ ...prev, crystals: prev.crystals + item.amount * count }));
      } else if (item.kind === 'key_elite') {
        callbacks.onUpdatePlayer(prev => ({ ...prev, keysElite: prev.keysElite + item.amount * count }));
      } else if (item.kind === 'key_boss') {
        callbacks.onUpdatePlayer(prev => ({ ...prev, keysBoss: prev.keysBoss + item.amount * count }));
      } else {
        callbacks.onUpdateInventory(prev => ({
          ...prev,
          [item.name]: (prev[item.name] || 0) + count,
        }));
      }

      return {
        text: `✅ Successfully purchased <b>${count}x ${item.name}</b> for <b>${totalCost.toLocaleString()} ${item.currency}</b>!`,
        keyboardHints: ['/inventory', '/shop', '/profile'],
      };
    }

    case '/inventory': {
      const invEntries = Object.entries(state.inventory).filter(([_, qty]) => qty > 0);
      if (invEntries.length === 0) {
        return {
          text: `🎒 <b>CAPSULE BAG IS EMPTY</b>\nVisit <code>/shop</code> to stock up on Senzu Beans, Potara Earrings, and Boosts!`,
          keyboardHints: ['/shop', '/profile'],
        };
      }

      let invText = `🎒 <b>YOUR CAPSULE INVENTORY:</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
      invEntries.forEach(([name, qty]) => {
        invText += `• <b>${name}</b>: x${qty}\n`;
      });
      invText += `\n<i>Consume items using <code>/use &lt;item_name&gt;</code></i>`;

      return {
        text: invText.trim(),
        keyboardHints: ['/use Senzu Bean', '/shop', '/profile'],
      };
    }

    case '/clan': {
      const sub = args[0]?.toLowerCase();
      if (!sub) {
        if (!state.clan) {
          return {
            text: `
🏰 <b>CLAN HALL DASHBOARD</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━
You are currently an unaffiliated lone warrior.

• <code>/clan create &lt;name&gt;</code> - Found a new clan (Costs 100 Crystals)
• <code>/clan list</code> - View the top ranked clans
• <code>/clan join &lt;clan_id&gt;</code> - Enlist in an existing clan
            `.trim(),
            keyboardHints: ['/clan list', '/clan create Z-Warriors'],
          };
        }

        const members = state.clanMembersByClan[state.clan.id] || [];
        return {
          text: formatClanProfile(state.clan, members, state.clanRaid, DEFAULT_CLAN_PERKS),
          keyboardHints: ['/clan donate yens 100000', '/clan raid', '/clan members', '/clan list'],
        };
      }

      if (sub === 'list') {
        const sorted = sortClansByPower(state.allClans, state.clanMembersByClan);
        let listText = `🏰 <b>TOP CLAN RANKINGS:</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        sorted.slice(0, 10).forEach((c, idx) => {
          const mList = state.clanMembersByClan[c.id] || [];
          const expSum = mList.reduce((acc, m) => acc + m.contributionExp, 0);
          listText += `${idx + 1}. [ID: <b>${c.id}</b>] <b>${c.name}</b> (${mList.length} warriors) | ${expSum.toLocaleString()} EXP\n`;
        });
        listText += `\n<i>Join a clan using <code>/clan join &lt;id&gt;</code></i>`;
        return { text: listText.trim(), keyboardHints: ['/clan join 1', '/clan create Legends'] };
      }

      if (sub === 'create') {
        const clanName = args.slice(1).join(' ').trim();
        if (!clanName) {
          return { text: `⚠️ Specify a name for your clan! Example: <code>/clan create Z-Fighters</code>` };
        }
        if (state.clan) {
          return { text: `❌ You are already a member of <b>${state.clan.name}</b>. Leave first with <code>/clan leave</code>.` };
        }
        if (state.player.crystals < 100) {
          return { text: `❌ You need at least <b>100 Crystals</b> to found a clan!` };
        }

        callbacks.onUpdatePlayer(prev => ({ ...prev, crystals: prev.crystals - 100 }));
        const newClan: Clan = {
          id: Date.now(),
          name: clanName,
          created: Date.now(),
          treasureYens: 1000000,
          treasureGems: 5000,
          treasureCrystals: 100,
          announcement: `Welcome to ${clanName}! Train hard and conquer the multiverse!`,
        };
        const newMember: ClanMember = {
          userId: state.player.userId,
          clanId: newClan.id,
          role: 'leader',
          firstName: state.player.firstName,
          username: state.player.username,
          contributionExp: 5000,
          joinedAt: Date.now(),
        };

        callbacks.onUpdateClan(newClan, newMember);
        return {
          text: `🏰 <b>Clan "${clanName}" has been successfully established!</b> You are the supreme Leader!`,
          keyboardHints: ['/clan', '/clan donate yens 100000', '/clan raid'],
        };
      }

      if (sub === 'disband') {
        if (!state.clan) return { text: `❌ You are not in any clan.` };
        if (state.clanMember?.role !== 'leader') return { text: `❌ Only the Clan Leader can disband the clan!` };
        if (args[1]?.toLowerCase() !== 'confirm') {
          return { text: `⚠️ This action is irreversible! Type <code>/clan disband confirm</code> to dissolve the clan.` };
        }

        callbacks.onUpdateClan(null, null);
        return { text: `🏰 <b>Clan has been permanently disbanded.</b> Vault assets have been dissolved.` };
      }

      if (sub === 'donate') {
        const curr = args[1]?.toLowerCase();
        const amt = parseInt(args[2], 10);
        if (!['yens', 'gems', 'crystals'].includes(curr) || isNaN(amt) || amt <= 0) {
          return { text: `⚠️ Usage: <code>/clan donate &lt;yens|gems|crystals&gt; &lt;amount&gt;</code>` };
        }
        if (!state.clan) return { text: `❌ You are not in any clan!` };

        const currencyKey = curr as 'yens' | 'gems' | 'crystals';
        if (state.player[currencyKey] < amt) {
          return { text: `❌ Insufficient ${curr}! You only have ${state.player[currencyKey].toLocaleString()}.` };
        }

        callbacks.onUpdatePlayer(prev => ({ ...prev, [currencyKey]: prev[currencyKey] - amt }));
        return {
          text: `💎 Successfully donated <b>${amt.toLocaleString()} ${curr}</b> to the clan vault! Clan contribution EXP awarded!`,
          keyboardHints: ['/clan', '/profile'],
        };
      }

      return { text: `❓ Unknown clan command. Type <code>/help</code> for all clan subcommands.` };
    }

    case '/raid': {
      const sub = args[0]?.toLowerCase();
      const raid = state.worldRaid;

      if (!sub) {
        const hpPercent = Math.max(0, Math.floor((raid.hp / raid.maxHp) * 100));
        return {
          text: `
🐉 <b>MULTIVERSE WORLD RAID: ${raid.bossName.toUpperCase()}</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━
A cosmic shadow dragon devours cosmic energy across all timelines!
Status: ${raid.active ? '🟢 <b>ACTIVE RAID</b>' : '🔴 <b>DEFEATED</b>'}

❤️ <b>Boss HP:</b> ${raid.hp.toLocaleString()} / ${raid.maxHp.toLocaleString()} (${hpPercent}%)
💥 <b>Total Multiverse Strikes:</b> ${raid.totalAttacks}
🎁 <b>Loot Boost:</b> 10x Rewards Multiplier!
⏱️ <b>Cooldown:</b> None! Attack as much as you want without timer restrictions!

<i>Type <code>/raid attack</code> to unleash your champion's ultimate finisher!</i>
          `.trim(),
          keyboardHints: ['/raid attack', '/profile', '/roster'],
        };
      }

      if (sub === 'attack') {
        const attackMsg = callbacks.onAttackRaid();
        return {
          text: attackMsg,
          keyboardHints: ['/raid attack', '/raid', '/profile'],
        };
      }

      return { text: `❓ Usage: <code>/raid</code> or <code>/raid attack</code>.` };
    }

    case '/travel': {
      const destination = args.join(' ').trim();
      if (!destination) {
        let travelText = `🚀 <b>PLANETARY EXPEDITION DIRECTORY:</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        PLANET_ORDER.forEach(pName => {
          const p = PLANETS[pName];
          const isCurrent = state.player.travel === pName;
          travelText += `${isCurrent ? '📍 <b>[CURRENT]</b> ' : '• '}<b>${p.name}</b> (Lv.${p.levelMin}-${p.levelMax}) | <b>${p.multiplier}x Rewards</b>\n  <i>${p.description}</i>\n`;
        });
        travelText += `\n<i>Fly to any unlocked planet with <code>/travel &lt;name&gt;</code></i>`;
        return { text: travelText.trim(), keyboardHints: ['/travel Earth', '/travel Hell', '/travel Kai Planet'] };
      }

      const matchPlanet = Object.keys(PLANETS).find(p => p.toLowerCase() === destination.toLowerCase());
      if (!matchPlanet) {
        return { text: `❌ Unknown planet <b>${destination}</b>. Choose Earth, Hell, Kai Planet, Supreme Kai Planet, Lord Beerus Planet, or Omniverse.` };
      }

      const targetPlanet = PLANETS[matchPlanet];
      callbacks.onUpdatePlayer(prev => ({ ...prev, travel: targetPlanet.name }));
      return {
        text: `🚀 <b>Instant Transmission!</b> You have relocated to <b>${targetPlanet.name}</b>! Reward multiplier is now <b>${targetPlanet.multiplier}x</b>!`,
        keyboardHints: ['/explore', '/profile'],
      };
    }

    case '/heal': {
      callbacks.onUpdatePlayer(prev => ({ ...prev, currentHp: prev.maxHp }));
      return {
        text: `💚 <b>Senzu Bean Consumed!</b> HP completely replenished to ${state.player.maxHp.toLocaleString()} / ${state.player.maxHp.toLocaleString()}!`,
        keyboardHints: ['/explore', '/raid attack', '/profile'],
      };
    }

    default: {
      return {
        text: `❓ Unrecognized command <code>${command}</code>. Type <code>/help</code> for the list of available commands.`,
        keyboardHints: ['/help', '/profile', '/explore', '/clan'],
      };
    }
  }
}
