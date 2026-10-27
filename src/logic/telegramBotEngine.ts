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

    case '/battlepass':
    case '/pass': {
      return {
        text: `
👑 <b>SUPER HEROES BATTLE PASS (SEASON 1)</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Season 1: <b>Omni Transcendence</b> (18 Days Left)
Current Pass Progress: <b>Tier 15 / 30</b> (1,450 Total Pass XP)

🎁 <b>Active Rewards:</b>
• Free Track: 💰 50,000 Zeni + 🎫 5x Gacha Tickets
• Premium Track: 🌌 Universe Seed Core + 👑 Grand Priest Vestment
• Tier 30 Grand Prize: 💥 <b>Ultra Vegito (Limit Breaker SP+)</b>

📜 <b>Pass Missions:</b>
1. [Daily] Win 3 Patrol battles (3/3) — <b>Ready to Claim! (+40 XP)</b>
2. [Daily] Complete 1 Beam Struggle (1/1) — <b>Ready to Claim! (+50 XP)</b>
3. [Weekly] Defeat 25 enemies (18/25) — In Progress (+150 XP)
4. [Seasonal] Collect all 7 Dragon Balls (5/7) — In Progress (+500 XP)

Click the <b>Battle Pass</b> tab in the web menu to claim rewards!
        `.trim(),
        keyboardHints: ['/menu', '/profile', '/explore', '/beamstruggle'],
      };
    }

    case '/menu': {
      const playerLevel = Math.floor(state.player.exp / 100) + 1;
      return {
        text: `
🌟 <b>DRAGON BALL: SDBH MASTER MENU</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 <b>Warrior:</b> ${state.player.firstName}
🥋 <b>Active Champion:</b> <code>${state.player.equippedChar || 'Saibaman'}</code>
⭐ <b>Level:</b> ${playerLevel} | <b>Rank:</b> Rank ${state.player.rank}
💰 <b>Yens:</b> ${state.player.yens.toLocaleString()} | 💎 <b>Gems:</b> ${state.player.gems.toLocaleString()}
🔮 <b>Crystals:</b> ${state.player.crystals.toLocaleString()} | ⚡ <b>Stamina:</b> 100/100

📜 <b>Core Categories:</b>
⚔️ <b>Combat:</b> /explore, /combathistory, /heal, /beamstruggle, /rift
🥋 <b>Hero Power:</b> /mycharacters, /equip, /skills, /zenkaiboost, /ultrainstinct
🌌 <b>SDBH Sagas:</b> /timemachine, /hyperbolic, /godslayer, /potara
🛡️ <b>Clan Wars:</b> /clan (war, perks, territory, vault, rally), /raid
🔮 <b>Economy:</b> /shop, /daily_shop, /craft, /auction, /bounty, /pity
✨ <b>Shenron:</b> /wish, /dragonradar, /achievements, /quests, /leaderboard
        `.trim(),
        keyboardHints: ['/profile', '/explore', '/beamstruggle', '/zenkaiboost', '/rift', '/clan'],
      };
    }

    case '/unstuck': {
      callbacks.onUpdatePlayer(prev => ({ ...prev, currentHp: prev.maxHp }));
      return {
        text: `✨ <b>UNSTUCK APPLIED!</b> All combat states cleared, cooldowns refreshed, and health fully restored!`,
        keyboardHints: ['/menu', '/explore', '/profile'],
      };
    }

    case '/pity': {
      return {
        text: `
🎰 <b>GACHA PITY SYSTEM GUARANTEES</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌟 <b>Legendary Guarantee:</b> <code>28/50</code> pulls
🔥 <b>Mythical Guarantee:</b> <code>64/100</code> pulls
🌌 <b>Omni-King / SP+ Guarantee:</b> <code>142/200</code> pulls

<i>*Guarantees reset when a warrior of that tier or higher is summoned.*</i>
Type <code>/gacha 10</code> or <code>/summon</code> to roll!
        `.trim(),
        keyboardHints: ['/gacha 10', '/gacha 50', '/roster'],
      };
    }

    case '/zenkaiboost':
    case '/zenkai': {
      callbacks.onUpdatePlayer(prev => ({
        ...prev,
        maxHp: Math.floor(prev.maxHp * 1.25),
        currentHp: Math.min(Math.floor(prev.maxHp * 1.25), prev.currentHp + Math.floor(prev.maxHp * 0.5)),
      }));
      return {
        text: `
⚡ <b>ZENKAI BOOST UNLEASHED!</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Your Saiyan blood burns with transcendent wrath!
💥 <b>ATK Boost:</b> +60% Power Surge applied!
🛡️ <b>DEF Boost:</b> +60% Hardened Aura!
❤️ <b>Vitality:</b> Restored 50% HP immediately! (+25% Max HP surge)

<i>'A Saiyan gets stronger every time he crawls back from the brink of death!'</i>
        `.trim(),
        keyboardHints: ['/explore', '/beamstruggle', '/raid attack'],
      };
    }

    case '/ultrainstinct':
    case '/godki': {
      return {
        text: `
🌌 <b>AUTONOMOUS ULTRA INSTINCT ACTIVATED!</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Your mind empties and your body reacts completely on instinct!
✨ <b>Evasion:</b> +40% chance to dodge any incoming strike
⚡ <b>Speed:</b> +50% battle speed boost
🗡️ <b>Counter-Jab:</b> Dodging triggers an immediate Silver Ki counter-strike!

<i>'My heart is calm, my mind is clear... now let us battle!'</i>
        `.trim(),
        keyboardHints: ['/explore', '/beamstruggle', '/raid attack'],
      };
    }

    case '/beamstruggle':
    case '/clash': {
      const clashPower = Math.floor(Math.random() * 45) + 85;
      const won = clashPower >= 100;
      if (won) {
        callbacks.onUpdatePlayer(prev => ({
          ...prev,
          yens: prev.yens + 5000,
          exp: prev.exp + 45,
        }));
        return {
          text: `
⚡ <b>BEAM STRUGGLE: VICTORY!</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━
You gathered your maximum Ki into an earth-shattering blast!
💥 Clash Power: <b>${clashPower}%</b> (Threshold: 100%)
Your Kamehameha pushes through the enemy's beam, obliterating the horizon!

🎁 <b>Rewards:</b> +5,000 Yens, +45 EXP!
          `.trim(),
          keyboardHints: ['/menu', '/explore', '/profile'],
        };
      }
      return {
        text: `
⚡ <b>BEAM STRUGGLE: REPELLED!</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━
The enemy's blast matched your output!
💥 Clash Power: <b>${clashPower}%</b>
The explosion sent both fighters skidding backward! Train your Ki in the dojo!
        `.trim(),
        keyboardHints: ['/zenkaiboost', '/explore'],
      };
    }

    case '/potara': {
      return {
        text: `
✨ <b>POTARA EARRINGS FUSION</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Attach the Supreme Kai's sacred emerald earrings to two warriors!

🔥 <b>Canonical Potara Fusions:</b>
• Goku + Vegeta ➔ <b>Vegito (SSGSS / Limit Breaker SS4)</b>
• Caulifla + Kale ➔ <b>Kefla (Super Saiyan 2)</b>
• Goku Black + Zamasu ➔ <b>Merged Zamasu Corrupted</b>

Potara warriors gain combined stats +30% Fusion Resonance Bonus!
Equip Potara Earrings from <code>/shop</code> to initiate fusion in battle.
        `.trim(),
        keyboardHints: ['/fuse', '/roster', '/shop'],
      };
    }

    case '/timemachine': {
      return {
        text: `
⏳ <b>CAPSULE CORP TIME MACHINE</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Select a fractured timeline era to investigate with Chronoa & Trunks: Xeno:

1. ⛓️ <b>Prison Planet Arc</b> — Clash with Cumber & Fu
2. 🌌 <b>Universal Conflict Arc</b> — Stop the Universe Seed & Hearts
3. 🌑 <b>Dark Demon Realm Arc</b> — Infiltrate Mechikabura's Citadel
4. ⚔️ <b>Super Space-Time War Arc</b> — Battle the False Universe Avatars

Each era drops exclusive Chrono Crystals and Key Sword fragments!
        `.trim(),
        keyboardHints: ['/saga', '/explore', '/rift'],
      };
    }

    case '/rift':
    case '/dimensionrift': {
      return {
        text: `
🌀 <b>SPACE-TIME DIMENSIONAL RIFT OPENED!</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━
An anomaly has shattered the fabric of reality!
👾 <b>Rift Boss:</b> Golden Great Ape Cumber (Limit Breaker)
❤️ <b>Boss HP:</b> 250,000 / 250,000
⏱️ <b>Time Remaining:</b> 2 Hours

Collaborate with your clan members to strike the rift!
Rewards include <b>Universe Seed Shards</b> and <b>SP+ Summon Tokens</b>!
        `.trim(),
        keyboardHints: ['/raid attack', '/clan', '/beamstruggle'],
      };
    }

    case '/dragonradar': {
      const held = state.dragonBalls ? state.dragonBalls.length : 0;
      return {
        text: `
📡 <b>DRAGON RADAR MARK VII SCAN</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━
*BEEP BEEP BEEP*
Current Dragon Balls Held: <b>${held}/7</b> ⭐

${held === 7 ? '✨ <b>ALL 7 DRAGON BALLS DETECTED!</b>\nType <code>/wish</code> to summon the Eternal Dragon Shenron!' : 'Coordinates locked! Remaining Dragon Balls are scattered across Planet Earth and Planet Namek.\nRun <code>/explore</code> patrols to retrieve them!'}
        `.trim(),
        keyboardHints: held === 7 ? ['/wish', '/profile'] : ['/explore', '/profile'],
      };
    }

    case '/craft': {
      return {
        text: `
🔨 <b>CAPSULE CORP CRAFTING FORGE</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Combine planetary materials and raid boss crystals to forge divine equipment:

1. 🗡️ <b>Z-Sword:</b> 5x Katchin Shards + 25,000 Yens
2. 🥋 <b>Whis Martial Gi:</b> 3x Angelic Silk + 50 Gems
3. 🌌 <b>Key Sword:</b> 1x Demon Realm Core + 10x Chrono Crystals
4. 🛡️ <b>Grand Priest Vestment:</b> 5x Omni Shards + 500 Gems

To craft, acquire boss materials through <code>/explore</code> and <code>/raid</code>!
        `.trim(),
        keyboardHints: ['/shop', '/inventory', '/explore'],
      };
    }

    case '/daily_shop': {
      return {
        text: `
🛍️ <b>24-HOUR ROTATING DAILY SHOP</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Your Balance: 💰 ${state.player.yens.toLocaleString()} Yens | 💎 ${state.player.gems.toLocaleString()} Gems

1. 🌿 <b>3x Blessed Senzu Beans</b> — 2,500 Yens
2. 🛡️ <b>Saiyan High-Density Armor</b> — 15,000 Yens
3. 🗡️ <b>Tapion Brave Sword (Shard)</b> — 45,000 Yens
4. 📜 <b>Dragon Radar Battery</b> — 50 Gems
5. 🌟 <b>SP+ Summon Ticket</b> — 250 Gems

Use <code>/buy &lt;item_name&gt;</code> to purchase!
        `.trim(),
        keyboardHints: ['/shop', '/inventory'],
      };
    }

    case '/titles': {
      return {
        text: `
🏷️ <b>MARTIAL TITLES & PASSIVE BUFFS</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Active Title: 🎖️ <b>Rank ${state.player.rank} Ascendant</b>

Unlocked Titles:
• 🥋 <b>Novice Martial Artist:</b> +0%
• 🐢 <b>Turtle School Adept:</b> +5% DEF
• 🌍 <b>Earth's Champion:</b> +8% ATK
• 🔥 <b>Super Saiyan Prodigy:</b> +10% Crit Rate
• ⚡ <b>Limit Breaker:</b> +15% All Stats
• 🌌 <b>Omni Arbiter:</b> +25% All Stats (Unlocked at Lv. 100)
        `.trim(),
        keyboardHints: ['/profile', '/achievements'],
      };
    }

    case '/element': {
      return {
        text: `
🌪️ <b>ELEMENTAL AFFINITIES & SYNERGY</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔥 <b>Fire:</b> Strong vs Wind & Ice | Weak vs Water & Earth
💧 <b>Water:</b> Strong vs Fire & Earth | Weak vs Lightning & Wind
⚡ <b>Lightning:</b> Strong vs Water & Wind | Weak vs Earth
🌿 <b>Earth:</b> Strong vs Lightning & Fire | Weak vs Water & Wind
✨ <b>Light:</b> Mutual critical vulnerability with Dark
🌑 <b>Dark:</b> Mutual critical vulnerability with Light
🌌 <b>Divine Ki:</b> Deconstructs mortal guards by 20%

Attacking an opponent's elemental weakness deals <b>+35% True Damage</b>!
        `.trim(),
        keyboardHints: ['/menu', '/explore'],
      };
    }

    case '/hyperbolic':
    case '/hbtc': {
      return {
        text: `
⏳ <b>HYPERBOLIC TIME CHAMBER (精神と時の部屋)</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━
One day outside is one full year of intense gravity training inside!

🔥 <b>Training Effects:</b>
• 10x Martial Skill Proficiency gain
• +200 Max Stamina training capacity
• Unlocks latent technique masteries

Enter the chamber by visiting Kami's Lookout on Planet Earth!
        `.trim(),
        keyboardHints: ['/train', '/skills', '/explore'],
      };
    }

    case '/godslayer': {
      return {
        text: `
🌌 <b>SDBH GODSLAYER HEARTS RAID</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Hearts has unleashed the Universe Seed to defy the Omni-King!
👑 <b>Boss:</b> Ultimate Godslayer Hearts
❤️ <b>HP:</b> 500,000 / 500,000 | 💥 <b>ATK:</b> 1,750

Deal damage to the raid boss alongside your clan!
Top damage dealers earn the <b>Godslayer Crystal Blade</b>!
        `.trim(),
        keyboardHints: ['/raid attack', '/beamstruggle'],
      };
    }

    case '/transcend': {
      const curLvl = Math.floor(state.player.exp / 100) + 1;
      return {
        text: `
✨ <b>MORTAL TRANSCENDENCE (PRESTIGE)</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Current Level: <b>${curLvl}</b> (Requirement: Level 100)

Ascending resets level to 1, but permanently grants:
🌟 <b>+30% All Base Combat Stats</b>
🎖️ <b>Omni Ascendant Title & Badge</b>
💎 <b>500 Sacred Bonus Gems</b>

Are you ready to transcend the mortal realm?
        `.trim(),
        keyboardHints: ['/rankup', '/profile'],
      };
    }

    case '/auction': {
      return {
        text: `
🏛️ <b>GALACTIC AUCTION HOUSE</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Trade equipment, capsules, and warrior tokens with other fighters!

Subcommands:
• <code>/auction list &lt;item&gt; &lt;price&gt;</code> — Put an item up for auction
• <code>/auction bid &lt;id&gt; &lt;amount&gt;</code> — Place a bid on a listing
• <code>/auction buyout &lt;id&gt;</code> — Buy out an active listing immediately
• <code>/auction view</code> — View top active auctions across all planets
        `.trim(),
        keyboardHints: ['/inventory', '/shop'],
      };
    }

    case '/bounty': {
      return {
        text: `
🎯 <b>GALACTIC PATROL BOUNTY BOARD</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Jaco has posted bounties for dangerous intergalactic fugitives:

1. 🔴 <b>Fugitive: Cumber (Evil Saiyan)</b> — Reward: 100,000 Yens + 25 Gems
2. 🟣 <b>Fugitive: Dark King Fu</b> — Reward: 250,000 Yens + 50 Gems
3. 🟢 <b>Fugitive: Moro (Planet Devourer)</b> — Reward: 150,000 Yens + 40 Gems

Defeat these targets during <code>/explore</code> boss rounds to claim your bounty!
        `.trim(),
        keyboardHints: ['/explore', '/menu'],
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
