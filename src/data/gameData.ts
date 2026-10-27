import { NPC, PlanetInfo, ShopItem, Rarity, CharacterItem, EquipmentItem, BossSummonData } from '../types/game';

export const STARTING_RESOURCES = {
  yens: 500000,
  gems: 20000,
  crystals: 5555,
  tickets: 130,
  skillPoints: 120,
  keysElite: 10,
  keysBoss: 10,
  exp: 0,
};

// -----------------------------------------------------------
// 6 PLANET REALMS (With Level Gates & Reward Multipliers)
// -----------------------------------------------------------
export const PLANETS: Record<string, PlanetInfo> = {
  "Earth": {
    id: 1,
    name: "Earth",
    levelMin: 1,
    levelMax: 20,
    multiplier: 1.0,
    description: "Starter planet of the Dragon Team. Balanced gravity and fundamental martial arts encounters.",
    lore: "Mount Paozu and Kame House sector. Bandits, rogue ninjas, and Red Ribbon remnants wander the wilderness.",
  },
  "Hell": {
    id: 2,
    name: "Hell",
    levelMin: 21,
    levelMax: 39,
    multiplier: 2.0,
    description: "The underworld abyss inhabited by cosmic convicts, demons, and restless souls.",
    lore: "Enma Daioh's judgment depths. Enemies yield 2x experience, gold, and drops.",
  },
  "Kai Planet": {
    id: 3,
    name: "Kai Planet",
    levelMin: 40,
    levelMax: 59,
    multiplier: 3.0,
    description: "North King Kai's sacred orb featuring 10x dense gravity.",
    lore: "A compact planetoid at the end of Snake Way. Brutal gravity training yielding 3x rewards.",
  },
  "Supreme Kai Planet": {
    id: 4,
    name: "Supreme Kai Planet",
    levelMin: 60,
    levelMax: 79,
    multiplier: 4.0,
    description: "Holy sanctum of the Supreme Kais where the Z Sword rests.",
    lore: "Sacred realm untouched by mortals for eons. Dense divine energy grants 4x rewards.",
  },
  "Lord Beerus Planet": {
    id: 5,
    name: "Lord Beerus Planet",
    levelMin: 80,
    levelMax: 99,
    multiplier: 5.0,
    description: "Domain of Lord Beerus and Whis. Tremendous God Ki density.",
    lore: "An upside-down pyramid planet surrounded by floating stardust. God Ki training yielding 5x rewards.",
  },
  "Omniverse": {
    id: 6,
    name: "Omniverse",
    levelMin: 100,
    levelMax: 999,
    multiplier: 7.0,
    description: "The multiversal pinnacle of all creation! Face omni-beings and universe champions.",
    lore: "The World of Void and the Grand Minister's palace. Rewards are amplified by an astounding 7x multiplier.",
  },
};

export const PLANET_ORDER = [
  "Earth",
  "Hell",
  "Kai Planet",
  "Supreme Kai Planet",
  "Lord Beerus Planet",
  "Omniverse",
];

// -----------------------------------------------------------
// 13 PATROL NPCS
// -----------------------------------------------------------
export const NPCS: NPC[] = [
  { name: "Bandit Rookie", hp: 70, dmg: 8, speed: 10, reward: 140, description: "Desert scoundrel hunting traveler capsules" },
  { name: "Wild Wolf", hp: 100, dmg: 12, speed: 15, reward: 220, description: "Ferocious mountain beast infused with low Ki" },
  { name: "Rogue Ninja", hp: 150, dmg: 16, speed: 20, reward: 360, description: "Murasaki clan deserter using smoke clones" },
  { name: "Iron Golem", hp: 210, dmg: 20, speed: 8, reward: 520, description: "Red Ribbon battle automaton with heavy armor" },
  { name: "Shadow Sorcerer", hp: 270, dmg: 24, speed: 22, reward: 720, description: "Dark sorcerer channeling cursed underworld magic" },
  { name: "Dark Knight", hp: 350, dmg: 30, speed: 25, reward: 980, description: "Heavy demon mercenary wielding a cursed greatsword" },
  { name: "Storm Samurai", hp: 420, dmg: 36, speed: 30, reward: 1500, description: "Lightning blade master slicing through Ki barriers" },
  { name: "Void Hunter", hp: 500, dmg: 44, speed: 32, reward: 1850, description: "Alien bounty tracker wielding energy nets" },
  { name: "Planetary Raider", hp: 620, dmg: 52, speed: 35, reward: 2300, description: "Frieza Force vanguard conqueror" },
  { name: "Cosmic Assassin", hp: 760, dmg: 62, speed: 42, reward: 2900, description: "Silent killer capable of micro time-leaps" },
  { name: "Galaxy Thug", hp: 860, dmg: 70, speed: 40, reward: 3400, description: "Brutal space pirate with cybernetic arm cannons" },
  { name: "Planet Breaker", hp: 980, dmg: 80, speed: 45, reward: 4200, description: "Colossal barbarian capable of shattering tectonic plates" },
  { name: "Star Dragon Raider", hp: 1100, dmg: 90, speed: 50, reward: 4700, description: "Elite cosmic invader wearing forged meteorite plate" },
];

export const NPC_STREAK_FOR_BOSS = 15;

export const BOSS = {
  name: "Frieza Force Commander",
  hp: 1800,
  dmg: 65,
  speed: 40,
  yens: 9000,
  gems: 900,
  crystals: 60,
  tickets: 5,
  skillPoints: 20,
  description: "Elite vanguard commander clad in Saiyan Battle Armor with a deadly death beam cannon.",
};

// -----------------------------------------------------------
// 70+ DRAGON BALL WARRIORS (Extensively Expanded)
// -----------------------------------------------------------
export const CHARACTERS: CharacterItem[] = [
  // 10 OMNI KINGS (God-Tier Pinnacles)
  { name: "Omni King Zeno", rarity: "omni", hp: 1800, atk: 520, speed: 100, critRate: 35, series: "Dragon Ball Super", description: "The supreme ruler of all multiverse universes. Capable of erasing entire timelines in an instant." },
  { name: "Omni King Future Zeno", rarity: "omni", hp: 1750, atk: 510, speed: 98, critRate: 34, series: "Dragon Ball Super", description: "Zeno from Future Trunks timeline with absolute destructive authority." },
  { name: "Omni King Vegeks", rarity: "omni", hp: 1650, atk: 490, speed: 95, critRate: 32, series: "Super Dragon Ball Heroes", description: "Ascended god-fusion wielding infinite spatial energy." },
  { name: "Omni King Cereal", rarity: "omni", hp: 1600, atk: 480, speed: 94, critRate: 30, series: "Granolah Arc", description: "Cerelian omni-sniper with unerring divine precision." },
  { name: "Omni King Yemma", rarity: "omni", hp: 1550, atk: 470, speed: 90, critRate: 28, series: "Other World", description: "Emperor of the Dead whose judgment stamps decide all souls." },
  { name: "Omni King Constellation", rarity: "omni", hp: 1580, atk: 475, speed: 92, critRate: 30, series: "Universal Conflict", description: "Celestial avatar channeling stellar galaxies into raw Ki." },
  { name: "Omni King Universe 11", rarity: "omni", hp: 1620, atk: 485, speed: 96, critRate: 32, series: "Tournament of Power", description: "Divine arbiter of the highest mortal level universe." },
  { name: "Omni King Time", rarity: "omni", hp: 1700, atk: 500, speed: 100, critRate: 33, series: "Xenoverse", description: "Master of temporal scrolls and chronological dimensions." },
  { name: "Omni King Zalama", rarity: "omni", hp: 1900, atk: 540, speed: 95, critRate: 38, series: "Dragon Ball Super", description: "The legendary Dragon God who created the Super Dragon Balls size of planets." },
  { name: "Omni King Super Shenron", rarity: "omni", hp: 2000, atk: 550, speed: 90, critRate: 40, series: "Dragon Ball Super", description: "Golden cosmic dragon spanning entire galaxies whose wishes know no limits." },

  // 20 MYTHICAL WARRIORS (10 Original + 10 New)
  { name: "Beerus", rarity: "mythical", hp: 1200, atk: 360, speed: 85, critRate: 26, series: "Universe 7", description: "God of Destruction of Universe 7 wielding Hakai energy." },
  { name: "Whis", rarity: "mythical", hp: 1300, atk: 370, speed: 95, critRate: 28, series: "Angel Attendant", description: "Ultra Instinct Angel master of time manipulation and martial arts." },
  { name: "Goku Black (Super Saiyan Rosé)", rarity: "mythical", hp: 1100, atk: 350, speed: 80, critRate: 25, series: "Future Trunks Arc", description: "Zamasu possessing Goku's body wielding the divine God Split Cut blade." },
  { name: "Broly (Full Power Super Saiyan)", rarity: "mythical", hp: 1400, atk: 380, speed: 75, critRate: 28, series: "DBS Broly", description: "Legendary mutant Saiyan whose boundless rage tears through dimensions." },
  { name: "Golden Frieza", rarity: "mythical", hp: 1050, atk: 340, speed: 82, critRate: 24, series: "Resurrection 'F'", description: "Frieza's gleaming transformation honed through intense mental torture." },
  { name: "Super Saiyan 4 Gogeta", rarity: "mythical", hp: 1350, atk: 390, speed: 88, critRate: 30, series: "Dragon Ball GT", description: "The pinnacle fusion warrior of GT unleashing 100x Big Bang Kamehameha." },
  { name: "Vegito Blue (SSGSS)", rarity: "mythical", hp: 1320, atk: 385, speed: 90, critRate: 30, series: "Dragon Ball Super", description: "Potara fusion of Goku and Vegeta combining God Ki into Final Kamehameha." },
  { name: "Fusion Zamasu (Corrupted)", rarity: "mythical", hp: 1250, atk: 355, speed: 78, critRate: 25, series: "Future Trunks Arc", description: "Immortal hybrid deity wielding Lightning of Absolution and Blades of Judgment." },
  { name: "Omega Shenron", rarity: "mythical", hp: 1280, atk: 365, speed: 80, critRate: 26, series: "Dragon Ball GT", description: "Ultimate Shadow Dragon empowered by all seven corrupted negative Dragon Balls." },
  { name: "Grand Zeno Guard", rarity: "mythical", hp: 1220, atk: 360, speed: 88, critRate: 27, series: "Zen-Oh Realm", description: "Silent towering attendants capable of intercepting any mortal or god." },
  { name: "Ultra Instinct Goku", rarity: "mythical", hp: 1280, atk: 410, speed: 98, critRate: 32, series: "Tournament of Power", description: "Silver-haired state where body reacts autonomously without thought." },
  { name: "Ultra Ego Vegeta", rarity: "mythical", hp: 1350, atk: 420, speed: 85, critRate: 30, series: "Granolah Arc", description: "Destruction god technique converting incoming damage directly into battle power." },
  { name: "Gohan Beast", rarity: "mythical", hp: 1260, atk: 405, speed: 92, critRate: 31, series: "Super Hero", description: "Gohan's ultimate awakened primal rage unleashing the Special Beam Cannon." },
  { name: "Orange Piccolo", rarity: "mythical", hp: 1450, atk: 375, speed: 75, critRate: 24, series: "Super Hero", description: "Shenron-blessed transformation imbuing the Namekian giant with titanic resilience." },
  { name: "Black Frieza", rarity: "mythical", hp: 1420, atk: 430, speed: 96, critRate: 35, series: "Granolah Arc", description: "Trained 10 years in a Room of Spirit and Time; one-shot both UI Goku and UE Vegeta." },
  { name: "Grand Minister (Daishinkan)", rarity: "mythical", hp: 1500, atk: 450, speed: 100, critRate: 36, series: "Zen-Oh Realm", description: "Father of all Angels; ranked among top 5 battle powers across all realities." },
  { name: "Vados", rarity: "mythical", hp: 1280, atk: 370, speed: 94, critRate: 28, series: "Universe 6", description: "Whis's older sister and martial arts instructor to Lord Champa." },
  { name: "Super Janemba", rarity: "mythical", hp: 1180, atk: 360, speed: 86, critRate: 27, series: "Fusion Reborn", description: "Living embodiment of underworld evil manipulating reality and dimensional glass." },
  { name: "Golden Cooler", rarity: "mythical", hp: 1200, atk: 365, speed: 84, critRate: 26, series: "Heroes", description: "Cooler's golden evolved battle form combining ruthlessness with blinding speed." },
  { name: "Super 17", rarity: "mythical", hp: 1240, atk: 350, speed: 88, critRate: 25, series: "Dragon Ball GT", description: "Ultimate android combining Earth and Hell 17, absorbing unlimited energy blasts." },

  // 20 LEGENDARY WARRIORS (10 Original + 10 New)
  { name: "Goku (Super Saiyan Blue)", rarity: "legendary", hp: 850, atk: 220, speed: 65, critRate: 18, series: "Dragon Ball Super", description: "Super Saiyan God Super Saiyan with immaculate Ki control." },
  { name: "Vegeta (Super Saiyan Blue)", rarity: "legendary", hp: 840, atk: 225, speed: 64, critRate: 20, series: "Dragon Ball Super", description: "Prince of all Saiyans channeling royal god aura." },
  { name: "Jiren (Full Power)", rarity: "legendary", hp: 980, atk: 240, speed: 70, critRate: 22, series: "Universe 11", description: "Pride Trooper whose lone solitary strength surpasses Gods of Destruction." },
  { name: "Majin Buu (Pure Evil / Kid Buu)", rarity: "legendary", hp: 920, atk: 215, speed: 72, critRate: 19, series: "Buu Saga", description: "Unpredictable chaotic menace with instantaneous cellular regeneration." },
  { name: "Vegeta Blue Evolution", rarity: "legendary", hp: 880, atk: 235, speed: 68, critRate: 22, series: "Tournament of Power", description: "Broken limits transformation honoring his promise to Cabba." },
  { name: "King Vegeta", rarity: "legendary", hp: 780, atk: 205, speed: 55, critRate: 16, series: "Saiyan Lore", description: "Fierce Saiyan monarch commander of the Great Ape legions." },
  { name: "Caulifla (SSJ2)", rarity: "legendary", hp: 760, atk: 210, speed: 75, critRate: 20, series: "Universe 6", description: "Prodigy gang leader Saiyan with explosive battle intuition." },
  { name: "Moro (Planet Eater)", rarity: "legendary", hp: 890, atk: 230, speed: 65, critRate: 20, series: "Galactic Patrol", description: "Ancient warlock who consumes the life force of planetary ecosystems." },
  { name: "Gogeta (Super Saiyan)", rarity: "legendary", hp: 860, atk: 225, speed: 68, critRate: 20, series: "Fusion Reborn", description: "The Stardust Breaker warrior cleansed of all negative karma." },
  { name: "Super Buu (Gohan Absorbed)", rarity: "legendary", hp: 950, atk: 235, speed: 70, critRate: 21, series: "Buu Saga", description: "Apex Buu form wielding Gohan's intellect, power, and kamehameha." },
  { name: "Goku (Super Saiyan 3)", rarity: "legendary", hp: 830, atk: 228, speed: 66, critRate: 22, series: "Z Buu Saga", description: "Long-haired golden warrior who shakes the terrestrial foundations of Earth." },
  { name: "Majin Vegeta", rarity: "legendary", hp: 850, atk: 232, speed: 67, critRate: 24, series: "Z Buu Saga", description: "Reawakened ruthless prince unleashing Final Explosion to protect family." },
  { name: "Future Gohan (One Arm SSJ)", rarity: "legendary", hp: 810, atk: 215, speed: 65, critRate: 20, series: "History of Trunks", description: "Tragic protector of the future timeline fighting through unending rainfall." },
  { name: "Super Vegito", rarity: "legendary", hp: 890, atk: 230, speed: 72, critRate: 22, series: "Z Buu Saga", description: "The invincible Potara fusion mocking Super Buu with Spirit Sword." },
  { name: "Kefla (Super Saiyan 2)", rarity: "legendary", hp: 840, atk: 226, speed: 76, critRate: 22, series: "Universe 6", description: "Potara fusion of Kale and Caulifla unleashing Gigantic Burst rays." },
  { name: "Android 17 (MVP of Universe 7)", rarity: "legendary", hp: 870, atk: 220, speed: 74, critRate: 20, series: "Tournament of Power", description: "Infinite stamina park ranger with unbreakable green barriers." },
  { name: "Hit (Time-Skip Master)", rarity: "legendary", hp: 820, atk: 225, speed: 85, critRate: 26, series: "Universe 6", description: "Legendary 1,000-year-old assassin stopping time with Flash Fist." },
  { name: "Toppo (God of Destruction Mode)", rarity: "legendary", hp: 960, atk: 238, speed: 64, critRate: 22, series: "Universe 11", description: "Candidate of Destruction clad in Hakai aura discarding justice for power." },
  { name: "Metal Cooler", rarity: "legendary", hp: 890, atk: 218, speed: 70, critRate: 18, series: "Big Gete Star", description: "Infinite mechanized clones repaired instantly by the Big Gete Star core." },
  { name: "Broly (Z Legendary Super Saiyan)", rarity: "legendary", hp: 970, atk: 236, speed: 62, critRate: 24, series: "DBZ Movie 8", description: "Uncontrollable demon whose Ki is overflowing and endlessly rising." },

  // 20 EPIC WARRIORS (10 Original + 10 New)
  { name: "Gohan (Super Saiyan 2)", rarity: "epic", hp: 620, atk: 155, speed: 50, critRate: 15, series: "Cell Games", description: "Boy warrior whose tears ignited the Father-Son Kamehameha." },
  { name: "Piccolo (Fused with Kami)", rarity: "epic", hp: 640, atk: 148, speed: 48, critRate: 14, series: "Android Saga", description: "The Super Namekian who stood toe-to-toe with Android 17." },
  { name: "Frieza (Final Form 100%)", rarity: "epic", hp: 590, atk: 150, speed: 52, critRate: 14, series: "Namek Saga", description: "Emperor of the Universe swollen with maximum muscle and death disks." },
  { name: "Perfect Cell", rarity: "epic", hp: 630, atk: 152, speed: 50, critRate: 15, series: "Cell Saga", description: "Biochemical android synthesized from all greatest warrior DNA." },
  { name: "Future Trunks (Super Saiyan)", rarity: "epic", hp: 600, atk: 154, speed: 54, critRate: 16, series: "Z Androids", description: "Sword-bearing warrior who cleaved Mecha Frieza into pieces." },
  { name: "Bardock (Super Saiyan)", rarity: "epic", hp: 610, atk: 156, speed: 48, critRate: 16, series: "Episode of Bardock", description: "Goku's father who defied the destiny of Planet Vegeta's doom." },
  { name: "Cabba (Super Saiyan)", rarity: "epic", hp: 570, atk: 144, speed: 56, critRate: 14, series: "Universe 6", description: "Polite young Saiyan warrior from Planet Sadala." },
  { name: "King Cold", rarity: "epic", hp: 660, atk: 142, speed: 42, critRate: 12, series: "Mecha Frieza Saga", description: "Giant emperor patriarch of the Cold Clan galactic empire." },
  { name: "Buu (Innocent Fat Buu)", rarity: "epic", hp: 690, atk: 140, speed: 44, critRate: 12, series: "Buu Saga", description: "Childlike pink majin turning enemies into chocolate cookies." },
  { name: "Basil (Universe 9 Dog)", rarity: "epic", hp: 580, atk: 146, speed: 58, critRate: 15, series: "Universe 9", description: "Trio of Danger kicking specialist utilizing drug-enhanced Ki." },
  { name: "Ultimate Gohan", rarity: "epic", hp: 650, atk: 158, speed: 52, critRate: 16, series: "Z Buu Saga", description: "Potential unlocked by Elder Kai without needing to transform." },
  { name: "King Piccolo (Demon)", rarity: "epic", hp: 590, atk: 145, speed: 46, critRate: 14, series: "Dragon Ball OG", description: "Ancient demon king who restored his youth with the Dragon Balls." },
  { name: "Android 16", rarity: "epic", hp: 710, atk: 138, speed: 40, critRate: 12, series: "Cell Saga", description: "Gentle nature-loving giant android with Rocket Punch and Hell's Flash." },
  { name: "Android 18 (Z)", rarity: "epic", hp: 580, atk: 152, speed: 54, critRate: 15, series: "Android Saga", description: "Cyborg sister who shattered Super Saiyan Vegeta's arm." },
  { name: "Captain Ginyu (Body Change)", rarity: "epic", hp: 610, atk: 148, speed: 50, critRate: 14, series: "Namek Saga", description: "Commander of the Ginyu Special Squad who steals opponent bodies." },
  { name: "Zarbon (Transformed Monster)", rarity: "epic", hp: 600, atk: 146, speed: 48, critRate: 14, series: "Namek Saga", description: "Frieza's pretty attendant who transforms into a ferocious beast." },
  { name: "Dodoria", rarity: "epic", hp: 620, atk: 142, speed: 42, critRate: 12, series: "Namek Saga", description: "Ruthless spiked warrior executing Frieza's purges." },
  { name: "Dabura (Demon Realm King)", rarity: "epic", hp: 640, atk: 150, speed: 48, critRate: 15, series: "Buu Saga", description: "Lord of the Demon Realm whose stone spit turns targets into statues." },
  { name: "Master Roshi (Max Power Kamehameha)", rarity: "epic", hp: 560, atk: 152, speed: 44, critRate: 18, series: "Tournament of Power", description: "Martial arts master who wiped the moon and stood proud in the ToP." },
  { name: "Tien Shinhan (Neo Tri-Beam)", rarity: "epic", hp: 590, atk: 155, speed: 48, critRate: 16, series: "Cell Saga", description: "Three-eyed master who locked Semi-Perfect Cell in an endless crater." },

  // 12 RARE WARRIORS
  { name: "Trunks (Youth)", rarity: "rare", hp: 420, atk: 95, speed: 38, critRate: 10, series: "Z Buu Saga", description: "Vegeta's son already capable of turning Super Saiyan at 8 years old." },
  { name: "Krillin (Destructo Disk)", rarity: "rare", hp: 410, atk: 98, speed: 36, critRate: 12, series: "Z Namek", description: "Earth's bravest warrior whose razor energy disks slice anything." },
  { name: "Nappa", rarity: "rare", hp: 470, atk: 92, speed: 28, critRate: 9, series: "Saiyan Saga", description: "Saiyan elite juggernaut who pulverized the Earth defense corps." },
  { name: "Raditz", rarity: "rare", hp: 430, atk: 90, speed: 34, critRate: 10, series: "Saiyan Saga", description: "Goku's older brother whose arrival initiated the Dragon Ball Z era." },
  { name: "Yamcha (Wolf Fang Fist)", rarity: "rare", hp: 390, atk: 88, speed: 36, critRate: 10, series: "Dragon Ball OG", description: "Desert rogue master of rapid clawing martial arts." },
  { name: "Chiaotzu", rarity: "rare", hp: 360, atk: 92, speed: 32, critRate: 12, series: "Crane School", description: "Telekinetic martial artist capable of freezing enemy movement." },
  { name: "Pan", rarity: "rare", hp: 380, atk: 90, speed: 40, critRate: 11, series: "Dragon Ball GT", description: "Gohan and Videl's spirited daughter with quarter-Saiyan blood." },
  { name: "Videl", rarity: "rare", hp: 370, atk: 85, speed: 36, critRate: 10, series: "Z Buu Saga", description: "Hercule's daughter who mastered Ki flight under Gohan's tutelage." },
  { name: "Yajirobe (Katana)", rarity: "rare", hp: 440, atk: 88, speed: 25, critRate: 14, series: "Saiyan Saga", description: "Hermit swordsman who severed Great Ape Vegeta's tail." },
  { name: "Recoome", rarity: "rare", hp: 480, atk: 92, speed: 28, critRate: 9, series: "Ginyu Force", description: "Extravagant Ginyu wrestler with Recoome Eraser Gun." },
  { name: "Burter (Blue Hurricane)", rarity: "rare", hp: 400, atk: 94, speed: 50, critRate: 11, series: "Ginyu Force", description: "Fastest warrior in the universe before Goku arrived on Namek." },
  { name: "Jeice (Red Magma)", rarity: "rare", hp: 420, atk: 92, speed: 36, critRate: 10, series: "Ginyu Force", description: "Crusher Ball specialist and Ginyu squad sub-leader." },

  // 10 SP+ RANK WARRIORS (Dragon Ball Super Heroes 2 / Ultra God Mission)
  { name: "Vegito Xeno (Limit Breaker SSJ4)", rarity: "sp_plus", hp: 1650, atk: 470, speed: 96, critRate: 33, series: "Super Dragon Ball Heroes 2", description: "Ascended Xeno warrior overflowing with crimson god Ki shattering dark temporal space." },
  { name: "Gogeta Xeno (Limit Breaker SSJ4)", rarity: "sp_plus", hp: 1680, atk: 475, speed: 97, critRate: 34, series: "Super Dragon Ball Heroes 2", description: "Limit Breaker Metamoran fusion unleashing Stardust Explosion across time corridors." },
  { name: "Goku (Grand Priest Gi - Ultra Instinct)", rarity: "sp_plus", hp: 1620, atk: 480, speed: 99, critRate: 35, series: "Super Dragon Ball Heroes 2", description: "Goku trained directly under Daishinkan wearing divine angelic high vestments." },
  { name: "Mechikabura (Time God Unleashed)", rarity: "sp_plus", hp: 1720, atk: 465, speed: 92, critRate: 31, series: "Super Dragon Ball Heroes 2", description: "Dark Empire supreme emperor consuming temporal history into eternal black holes." },
  { name: "Demigra (Dark King of Time)", rarity: "sp_plus", hp: 1640, atk: 460, speed: 93, critRate: 30, series: "Super Dragon Ball Heroes 2", description: "Lord of the Demon Realm wielding the Staff of Time and dark mirage illusions." },
  { name: "Fu (Shinzanka / Demon God Origin)", rarity: "sp_plus", hp: 1600, atk: 470, speed: 95, critRate: 32, series: "Super Dragon Ball Heroes 2", description: "Prodigy scientist absorbing the Universe Tree to rewrite reality and the timeline." },
  { name: "Aeos (Former Supreme Kai of Time)", rarity: "sp_plus", hp: 1590, atk: 475, speed: 98, critRate: 34, series: "Super Dragon Ball Heroes 2", description: "Ancient Supreme Kai of Time commanding the Space-Time Tournament." },
  { name: "Cumber (Evil Saiyan SSJ3)", rarity: "sp_plus", hp: 1740, atk: 468, speed: 90, critRate: 32, series: "Super Dragon Ball Heroes 2", description: "Beast warrior whose corrupting shadowy aura turns allies into berserkers." },
  { name: "Hearts (God Slayer Ultimate Form)", rarity: "sp_plus", hp: 1630, atk: 472, speed: 94, critRate: 32, series: "Super Dragon Ball Heroes 2", description: "Fused with the Universe Seed seeking to liberate mortals from the Omni Kings." },
  { name: "Broly Dark (Masked Nightmare SSJ4)", rarity: "sp_plus", hp: 1750, atk: 485, speed: 88, critRate: 35, series: "Super Dragon Ball Heroes 2", description: "Time Breaker masked titan radiating infinite dark rage." },

  // 5 ADDITIONAL OMNI KINGS (Total 15 Omni Kings)
  { name: "Omni King Grand Dragon Zalama", rarity: "omni", hp: 2100, atk: 560, speed: 95, critRate: 40, series: "Omni Mythos", description: "The ancient primordial creator whose breath formed the Super Dragon Balls." },
  { name: "Omni King Epoch Chronos", rarity: "omni", hp: 1950, atk: 535, speed: 100, critRate: 36, series: "Omni Realm", description: "Master of temporal chronos regulating beginning and end of multiverses." },
  { name: "Omni King Infinity Void", rarity: "omni", hp: 1980, atk: 540, speed: 98, critRate: 37, series: "Omni Realm", description: "Embodiment of the World of Void where space and time cease to exist." },
  { name: "Omni King Genesis Prime", rarity: "omni", hp: 2050, atk: 550, speed: 96, critRate: 38, series: "Omni Realm", description: "First deity to emerge from the cosmic egg igniting the 18 original universes." },
  { name: "Omni King Absolute Zeno Supreme", rarity: "omni", hp: 2200, atk: 575, speed: 100, critRate: 42, series: "Omni Realm", description: "Unshakable omnipotent sovereign whose will cannot be resisted by any existence." },

  // 6 ADDITIONAL MYTHICAL WARRIORS (Total 26 Mythicals)
  { name: "Gohan Beast (Full Awakening)", rarity: "mythical", hp: 1380, atk: 425, speed: 94, critRate: 33, series: "Super Hero", description: "Primal rage unleashed against Cell Max with piercing red eyes and silver mane." },
  { name: "Cell Max (Uncontrolled Nightmare)", rarity: "mythical", hp: 1520, atk: 415, speed: 82, critRate: 29, series: "Super Hero", description: "Colossal bio-android monster whose explosive sphere could vaporize planets." },
  { name: "Bardock (SSJ4 Limit Breaker)", rarity: "mythical", hp: 1340, atk: 405, speed: 89, critRate: 30, series: "SDBH Heroes", description: "Father of Goku breaking all primal limits to protect his family destiny." },
  { name: "Vegito (SSGSS Kaioken x20)", rarity: "mythical", hp: 1360, atk: 430, speed: 96, critRate: 34, series: "Prison Planet Arc", description: "Potara god warrior stacking Kaioken on Super Saiyan Blue against Cumber." },
  { name: "Goku (True Ultra Instinct / Silver Flare)", rarity: "mythical", hp: 1350, atk: 435, speed: 100, critRate: 36, series: "Granolah Arc", description: "Applying UI to his natural emotional state for frictionless evasion." },
  { name: "Broly (Super Saiyan 4 Dark Limit)", rarity: "mythical", hp: 1480, atk: 420, speed: 84, critRate: 31, series: "Dark Empire", description: "Dark dragon ball embedded into Broly's chest causing boundless berserk eruptions." },

  // 7 ADDITIONAL LEGENDARY WARRIORS (Total 27 Legendaries)
  { name: "Gohan (Great Saiyaman Unmasked SSJ2)", rarity: "legendary", hp: 860, atk: 228, speed: 68, critRate: 21, series: "World Tournament", description: "Hero of justice shedding his cape to unleash righteous golden electricity." },
  { name: "Trunks Xeno (SSJ God)", rarity: "legendary", hp: 890, atk: 235, speed: 74, critRate: 23, series: "Dark Empire", description: "Time patrol swordsman imbued with divine crimson god ritual energy." },
  { name: "Android 21 (Transformed Evil)", rarity: "legendary", hp: 920, atk: 230, speed: 70, critRate: 22, series: "FighterZ", description: "Majin-hybrid scientist devouring warrior souls to sate unending hunger." },
  { name: "Janemba (Corrupted Evil Blade)", rarity: "legendary", hp: 880, atk: 226, speed: 72, critRate: 21, series: "Fusion Reborn", description: "Demon sword master slashing spatial cubes through reality." },
  { name: "Bojack (Full Power Galactic Tyrant)", rarity: "legendary", hp: 940, atk: 232, speed: 64, critRate: 20, series: "Bojack Unbound", description: "Hera clan warlord breaking free from the King Kai star seal." },
  { name: "Cooler (Final Form Supernova)", rarity: "legendary", hp: 910, atk: 228, speed: 68, critRate: 19, series: "Cooler's Revenge", description: "Armored face-plate transformation crushing mountains with supernova blasts." },
  { name: "Goku (Super Saiyan 4 Xeno)", rarity: "legendary", hp: 890, atk: 234, speed: 72, critRate: 22, series: "Time Patrol", description: "Veteran Time Patroller channeling primal Great Ape power." },

  // 8 ADDITIONAL EPIC WARRIORS (Total 28 Epics)
  { name: "Tapion (Flute of Sealing)", rarity: "epic", hp: 610, atk: 150, speed: 52, critRate: 15, series: "Wrath of the Dragon", description: "Konatsian hero playing the enchanted ocarina to hold back the phantom beast." },
  { name: "Android 13 (Super Fusion)", rarity: "epic", hp: 680, atk: 154, speed: 46, critRate: 14, series: "Super Android 13", description: "Blue hulking android forged from parts of 14 and 15 with S.S. Deadly Bomber." },
  { name: "Turles (Tree of Might Fruit)", rarity: "epic", hp: 630, atk: 156, speed: 50, critRate: 16, series: "Tree of Might", description: "Saiyan deserter consuming divine fruit to surpass low-class limits." },
  { name: "Lord Slug (Giant Super Namekian)", rarity: "epic", hp: 710, atk: 146, speed: 40, critRate: 13, series: "Lord Slug", description: "Ancient Super Namekian mutated with dark demonic instincts." },
  { name: "Pikkon (Thunder Flash)", rarity: "epic", hp: 640, atk: 152, speed: 54, critRate: 16, series: "Other World", description: "West Galaxy's greatest warrior rivaling Goku in the Underworld Tournament." },
  { name: "Garlic Jr. (Super Transformed)", rarity: "epic", hp: 670, atk: 144, speed: 42, critRate: 13, series: "Dead Zone", description: "Makyan demon granted eternal life opening the dimensional Dead Zone." },
  { name: "Salza (Armored Squadron Leader)", rarity: "epic", hp: 590, atk: 148, speed: 56, critRate: 15, series: "Cooler's Armored Squad", description: "Brench-seijin swordsman wielding the Ki blade Salza Blade." },
  { name: "Dr. Wheelo (Bio-Mechanical Colossus)", rarity: "epic", hp: 720, atk: 140, speed: 38, critRate: 12, series: "World's Strongest", description: "Brilliant scientist encased in an armored robotic dreadnought." },

  // 9 ADDITIONAL RARE WARRIORS (Total 21 Rares)
  { name: "King Vegeta (Great Ape Royal)", rarity: "rare", hp: 490, atk: 94, speed: 26, critRate: 11, series: "Saiyan History", description: "Colossal royal ape crushing rival planetary battalions underfoot." },
  { name: "Gohan (Kid Namek Potential)", rarity: "rare", hp: 410, atk: 96, speed: 38, critRate: 13, series: "Namek Saga", description: "Guru-awakened youth fighting alongside Krillin against the Ginyu Squad." },
  { name: "Vegeta (Scouter Saiyan Saga)", rarity: "rare", hp: 450, atk: 95, speed: 36, critRate: 12, series: "Saiyan Saga", description: "Ruthless elite invader calculating power levels with green scouter." },
  { name: "Goku (Kaio-ken x4 Saiyan Saga)", rarity: "rare", hp: 440, atk: 98, speed: 42, critRate: 14, series: "Saiyan Saga", description: "Red fiery aura pushed beyond mortal limits to deflect the Galick Gun." },
  { name: "Guldo (Time Freeze Specialist)", rarity: "rare", hp: 380, atk: 88, speed: 24, critRate: 10, series: "Ginyu Force", description: "Four-eyed telekinetic freezing time for as long as he holds his breath." },
  { name: "Spopovich (Majin Enhanced)", rarity: "rare", hp: 460, atk: 90, speed: 30, critRate: 9, series: "World Tournament", description: "Brutal possessed brawler enduring fatal blows without feeling pain." },
  { name: "Yamu (Majin Energy Drainer)", rarity: "rare", hp: 430, atk: 89, speed: 32, critRate: 10, series: "World Tournament", description: "Carrying Babidi's energy siphon device to collect pure warrior Ki." },
  { name: "Cui (Dragon Radar Tracker)", rarity: "rare", hp: 410, atk: 91, speed: 34, critRate: 10, series: "Namek Saga", description: "Scouting Namekian villages with Frieza Force surveillance tech." },
  { name: "Bora (Sacred Land Protector)", rarity: "rare", hp: 450, atk: 88, speed: 28, critRate: 11, series: "Karin Tower", description: "Chieftain who deflects standard military bullets with sheer muscle." },

  // 8 COMMON WARRIORS
  { name: "Saibaman", rarity: "common", hp: 280, atk: 55, speed: 20, critRate: 6, series: "Saiyan Saga", description: "Cultivated green goblin capable of acid spray and kamikaze grab." },
  { name: "Frieza Soldier", rarity: "common", hp: 260, atk: 52, speed: 22, critRate: 5, series: "Frieza Force", description: "Generic intergalactic soldier with wrist laser blaster." },
  { name: "Red Ribbon Soldier", rarity: "common", hp: 240, atk: 48, speed: 18, critRate: 5, series: "Red Ribbon Army", description: "Military conscript carrying assault rifles and grenades." },
  { name: "Cell Junior", rarity: "common", hp: 320, atk: 62, speed: 26, critRate: 8, series: "Cell Saga", description: "Miniature blue offspring of Cell mimicking all Z-fighter skills." },
  { name: "Appule", rarity: "common", hp: 250, atk: 50, speed: 20, critRate: 5, series: "Namek Saga", description: "Frieza's medical and communication attendant." },
  { name: "Cui", rarity: "common", hp: 290, atk: 56, speed: 24, critRate: 6, series: "Saiyan Rivalry", description: "Vegeta's old rival who blew up in terror on Namek." },
  { name: "Spopovich", rarity: "common", hp: 310, atk: 54, speed: 18, critRate: 6, series: "Babidi's Minions", description: "Majin-controlled zombie fighter carrying an energy drain bucket." },
  { name: "Mr. Satan (World Champ)", rarity: "common", hp: 300, atk: 45, speed: 22, critRate: 10, series: "Cell & Buu", description: "Martial arts trickster and genuine hero who united Earth's Genki Dama." },
];

export const RARITY_ORDER: Record<Rarity, number> = {
  common: 1,
  rare: 2,
  epic: 3,
  legendary: 4,
  mythical: 5,
  sp_plus: 6,
  omni: 7,
};

export const RARITY_COLORS: Record<Rarity, { text: string; bg: string; border: string; glow: string }> = {
  common: { text: "text-slate-300", bg: "bg-slate-900/90", border: "border-slate-700", glow: "shadow-slate-500/20" },
  rare: { text: "text-blue-400", bg: "bg-blue-950/90", border: "border-blue-600", glow: "shadow-blue-500/30" },
  epic: { text: "text-purple-400", bg: "bg-purple-950/90", border: "border-purple-600", glow: "shadow-purple-500/40" },
  legendary: { text: "text-amber-400", bg: "bg-amber-950/90", border: "border-amber-500", glow: "shadow-amber-500/50" },
  mythical: { text: "text-rose-400", bg: "bg-rose-950/90", border: "border-rose-500", glow: "shadow-rose-500/60" },
  sp_plus: { text: "text-amber-300", bg: "bg-gradient-to-r from-red-950/95 via-purple-950/95 to-amber-950/95", border: "border-amber-400", glow: "shadow-amber-400/80" },
  omni: { text: "text-cyan-300", bg: "bg-cyan-950/95", border: "border-cyan-400", glow: "shadow-cyan-400/80" },
};

export const RARITY_ATK: Record<Rarity, number> = {
  common: 100,
  rare: 135,
  epic: 163,
  legendary: 199,
  mythical: 255,
  sp_plus: 310,
  omni: 342,
};

export const RARITY_HP: Record<Rarity, number> = {
  common: 150,
  rare: 250,
  epic: 321,
  legendary: 431,
  mythical: 555,
  sp_plus: 680,
  omni: 780,
};

export const GACHA_RATES: [Rarity, number][] = [
  ["common", 35],
  ["rare", 26],
  ["epic", 16],
  ["legendary", 11],
  ["mythical", 6],
  ["sp_plus", 4],
  ["omni", 2],
];

// -----------------------------------------------------------
// 18 DRAGON BALL WEAPONS
// -----------------------------------------------------------
export const WEAPONS_CATALOG: EquipmentItem[] = [
  { name: "Power Pole", kind: "weapon", statBonus: 95, speedBonus: 10, critBonus: 5, tier: "Rare", description: "Mystic red staff given by Grandpa Gohan that extends at will to reach the moon." },
  { name: "Wooden Sword", kind: "weapon", statBonus: 108, speedBonus: 5, critBonus: 2, tier: "Common", description: "Sturdy wooden practice blade for early martial arts training." },
  { name: "Iron Sword", kind: "weapon", statBonus: 112, speedBonus: 6, critBonus: 3, tier: "Common", description: "Hardened steel broadsword forged by Capital weapon-smiths." },
  { name: "Saiyan Blade", kind: "weapon", statBonus: 125, speedBonus: 8, critBonus: 4, tier: "Rare", description: "Compact battle blade carried by Saiyan infiltrator scouts." },
  { name: "Ultra Sword", kind: "weapon", statBonus: 160, speedBonus: 12, critBonus: 6, tier: "Epic", description: "Vibrating energy blade cutting through heavy armor plates." },
  { name: "God Breaker", kind: "weapon", statBonus: 180, speedBonus: 14, critBonus: 7, tier: "Epic", description: "Heavy cleaver forged from fallen celestial comet ore." },
  { name: "Black Hole Blade", kind: "weapon", statBonus: 220, speedBonus: 15, critBonus: 8, tier: "Legendary", description: "Blade compressing miniature gravitational singularity fields." },
  { name: "Destructo Blade", kind: "weapon", statBonus: 221, speedBonus: 18, critBonus: 10, tier: "Legendary", description: "Razor-sharp disk edge capable of cutting through planetary mantle." },
  { name: "Z Sword", kind: "weapon", statBonus: 240, speedBonus: 10, critBonus: 8, tier: "Legendary", description: "Sacred blade embedded in the plateau of the Supreme Kai's sacred world." },
  { name: "Galaxy Cutter", kind: "weapon", statBonus: 250, speedBonus: 20, critBonus: 9, tier: "Legendary", description: "Crystalline broadsword woven with spiral galaxy plasma." },
  { name: "Brave Sword (Tapion)", kind: "weapon", statBonus: 270, speedBonus: 22, critBonus: 11, tier: "Legendary", description: "Enchanted hero blade given to Future Trunks by Tapion to seal Hirudegarn." },
  { name: "Crusher Edge", kind: "weapon", statBonus: 285, speedBonus: 16, critBonus: 10, tier: "Legendary", description: "Crushing greatsword that shatters shockwaves upon impact." },
  { name: "Supernova Blade", kind: "weapon", statBonus: 320, speedBonus: 24, critBonus: 12, tier: "Mythical", description: "Radiant flame edge imbued with the thermonuclear energy of a dying star." },
  { name: "Janemba Dimension Sword", kind: "weapon", statBonus: 340, speedBonus: 28, critBonus: 14, tier: "Mythical", description: "Transmuted club slicing dimensional rifts across spatial coordinates." },
  { name: "Deadly Divine Sword", kind: "weapon", statBonus: 360, speedBonus: 30, critBonus: 15, tier: "Mythical", description: "Sacred god-slaying blade forged in the center of the multiversal vortex." },
  { name: "Vegito Spirit Sword", kind: "weapon", statBonus: 390, speedBonus: 35, critBonus: 18, tier: "Mythical", description: "Pure condensed Ki blade capable of skewering immortals from dozens of meters." },
  { name: "Kamehameha Blade", kind: "weapon", statBonus: 412, speedBonus: 32, critBonus: 16, tier: "Mythical", description: "Concentrated blue wave plasma forged into an unbreakable divine katana." },
  { name: "Zalama's Dragon Cleaver", kind: "weapon", statBonus: 460, speedBonus: 40, critBonus: 20, tier: "Omni", description: "Divine greatsword crafted by the Dragon God with infinite sharpness." },
];

// -----------------------------------------------------------
// 18 DRAGON BALL ARMORS
// -----------------------------------------------------------
export const ARMORS_CATALOG: EquipmentItem[] = [
  { name: "Turtle School Gi", kind: "armor", statBonus: 180, speedBonus: 10, tier: "Rare", description: "Classic orange and blue martial arts dogi worn by Master Roshi's students." },
  { name: "Demon Clan Gi", kind: "armor", statBonus: 210, speedBonus: 8, tier: "Rare", description: "Heavy weighted purple tunic with white cowl worn by Piccolo and Gohan." },
  { name: "Leather Vest", kind: "armor", statBonus: 228, speedBonus: 5, tier: "Common", description: "Flexible reinforced beast hide vest protecting vital organs." },
  { name: "Steel Armor", kind: "armor", statBonus: 252, speedBonus: 2, tier: "Common", description: "Heavy polished plate mail shielding against kinetic rifle rounds." },
  { name: "Saiyan Armor", kind: "armor", statBonus: 288, speedBonus: 12, tier: "Rare", description: "Elastic high-tech chestplate capable of expanding with Great Ape transformation." },
  { name: "Yardrat Armor", kind: "armor", statBonus: 310, speedBonus: 20, tier: "Epic", description: "Traditional garb of the Spirit Control masters on Planet Yardrat." },
  { name: "God Armor", kind: "armor", statBonus: 340, speedBonus: 14, tier: "Epic", description: "Blessed mail woven with deity incantations against dark magic." },
  { name: "Whis Symbol Gi", kind: "armor", statBonus: 365, speedBonus: 25, tier: "Epic", description: "Advanced training suit inscribed with Whis's personal angelic sigil." },
  { name: "Battle Armor", kind: "armor", statBonus: 384, speedBonus: 15, tier: "Epic", description: "Elite planetary vanguard armor with shock-absorbent shoulder flares." },
  { name: "Celestial Armor", kind: "armor", statBonus: 440, speedBonus: 22, tier: "Legendary", description: "Woven from starlight threads and floating nebular silk." },
  { name: "Doom Armor", kind: "armor", statBonus: 500, speedBonus: 18, tier: "Legendary", description: "Heavy dark matter plating forged in the gravitational crush of Hell." },
  { name: "Ultra Guard", kind: "armor", statBonus: 560, speedBonus: 28, tier: "Legendary", description: "Autonomous reactive weave shifting instinctively before blows land." },
  { name: "Katchin Armor", kind: "armor", statBonus: 640, speedBonus: 10, tier: "Legendary", description: "Forged from Katchin, the hardest metal in the entire universe that snapped the Z Sword." },
  { name: "Grand Priest Suit", kind: "armor", statBonus: 640, speedBonus: 35, tier: "Mythical", description: "Ceremonial vestment worn by the angelic High Minister of the Omniverse." },
  { name: "Mystic Guard", kind: "armor", statBonus: 720, speedBonus: 26, tier: "Mythical", description: "Imbued with the ancient unlocked potential rites of the Supreme Kais." },
  { name: "Divine Battle Suit", kind: "armor", statBonus: 760, speedBonus: 30, tier: "Mythical", description: "Supreme deity armor shielding the wearer against solar flares and galaxy blasts." },
  { name: "Heavenly Guardian Suit", kind: "armor", statBonus: 860, speedBonus: 32, tier: "Mythical", description: "Holy mantle woven in the Kaioshin realm to endure multiversal friction." },
  { name: "Kaio Suit", kind: "armor", statBonus: 1000, speedBonus: 40, tier: "Omni", description: "Supreme garb imbued with supreme universal authority and infinite resistance." },
];

export const EQUIPMENT: Record<string, [ 'weapon' | 'armor', number ]> = {};
WEAPONS_CATALOG.forEach(w => {
  EQUIPMENT[w.name] = ['weapon', w.statBonus];
});
ARMORS_CATALOG.forEach(a => {
  // Armor statBonus is HP value, equipment dictionary stored as stat/2
  EQUIPMENT[a.name] = ['armor', Math.floor(a.statBonus / 2)];
});

// -----------------------------------------------------------
// 6 DISTINCT SHOP CATEGORIES WITH BULK PURCHASING
// -----------------------------------------------------------
export const SHOP_ITEMS: ShopItem[] = [
  // CATEGORY 1: ARMOURS
  { id: 1, name: "Turtle School Gi", price: 800, currency: "yens", kind: "armor", amount: 1, statValue: 180, description: "+180 HP classic Master Roshi orange dogi" },
  { id: 2, name: "Demon Clan Gi", price: 1500, currency: "yens", kind: "armor", amount: 1, statValue: 210, description: "+210 HP heavy weighted purple gi" },
  { id: 3, name: "Leather Vest", price: 600, currency: "yens", kind: "armor", amount: 1, statValue: 228, description: "+228 HP light beast hide chestplate" },
  { id: 4, name: "Steel Armor", price: 2200, currency: "yens", kind: "armor", amount: 1, statValue: 252, description: "+252 HP heavy steel plating" },
  { id: 5, name: "Saiyan Armor", price: 13000, currency: "yens", kind: "armor", amount: 1, statValue: 288, description: "+288 HP stretchable Saiyan vanguard armor" },
  { id: 6, name: "Yardrat Armor", price: 30000, currency: "yens", kind: "armor", amount: 1, statValue: 310, description: "+310 HP spirit control master robes" },
  { id: 7, name: "God Armor", price: 50000, currency: "yens", kind: "armor", amount: 1, statValue: 340, description: "+340 HP blessed divine battle armor" },
  { id: 8, name: "Whis Symbol Gi", price: 65000, currency: "yens", kind: "armor", amount: 1, statValue: 365, description: "+365 HP angelic signature gi" },
  { id: 9, name: "Battle Armor", price: 80000, currency: "yens", kind: "armor", amount: 1, statValue: 384, description: "+384 HP elite planetary commander plate" },
  { id: 10, name: "Celestial Armor", price: 120000, currency: "yens", kind: "armor", amount: 1, statValue: 440, description: "+440 HP starlight woven cuirass" },
  { id: 11, name: "Doom Armor", price: 180000, currency: "yens", kind: "armor", amount: 1, statValue: 500, description: "+500 HP dark underworld forged armor" },
  { id: 12, name: "Ultra Guard", price: 220000, currency: "yens", kind: "armor", amount: 1, statValue: 560, description: "+560 HP instinct reactive shield" },
  { id: 13, name: "Katchin Armor", price: 260000, currency: "yens", kind: "armor", amount: 1, statValue: 640, description: "+640 HP forged from hardest metal in universe" },
  { id: 14, name: "Grand Priest Suit", price: 300000, currency: "yens", kind: "armor", amount: 1, statValue: 640, description: "+640 HP angelic high minister attire" },
  { id: 15, name: "Divine Battle Suit", price: 420000, currency: "yens", kind: "armor", amount: 1, statValue: 760, description: "+760 HP supreme cosmic armor" },
  { id: 16, name: "Heavenly Guardian Suit", price: 600000, currency: "yens", kind: "armor", amount: 1, statValue: 860, description: "+860 HP holy Kaioshin realm mantle" },
  { id: 17, name: "Kaio Suit", price: 950000, currency: "yens", kind: "armor", amount: 1, statValue: 1000, description: "+1000 HP supreme universal garb" },

  // CATEGORY 2: WEAPONS
  { id: 20, name: "Power Pole", price: 1200, currency: "yens", kind: "weapon", amount: 1, statValue: 95, description: "+95 ATK magical extending pole" },
  { id: 21, name: "Wooden Sword", price: 500, currency: "yens", kind: "weapon", amount: 1, statValue: 108, description: "+108 ATK basic practice wooden blade" },
  { id: 22, name: "Iron Sword", price: 2000, currency: "yens", kind: "weapon", amount: 1, statValue: 112, description: "+112 ATK sharpened iron sword" },
  { id: 23, name: "Saiyan Blade", price: 12000, currency: "yens", kind: "weapon", amount: 1, statValue: 125, description: "+125 ATK forged Saiyan scout blade" },
  { id: 24, name: "Ultra Sword", price: 22000, currency: "yens", kind: "weapon", amount: 1, statValue: 160, description: "+160 ATK vibrating Ki edge" },
  { id: 25, name: "God Breaker", price: 35000, currency: "yens", kind: "weapon", amount: 1, statValue: 180, description: "+180 ATK celestial comet cleaver" },
  { id: 26, name: "Destructo Blade", price: 40000, currency: "yens", kind: "weapon", amount: 1, statValue: 221, description: "+221 ATK spinning razor-sharp energy disk sword" },
  { id: 27, name: "Black Hole Blade", price: 68000, currency: "yens", kind: "weapon", amount: 1, statValue: 220, description: "+220 ATK gravity compressing sword" },
  { id: 28, name: "Z Sword", price: 85000, currency: "yens", kind: "weapon", amount: 1, statValue: 240, description: "+240 ATK heavy sacred blade of the Kais" },
  { id: 29, name: "Galaxy Cutter", price: 98000, currency: "yens", kind: "weapon", amount: 1, statValue: 250, description: "+250 ATK cosmic edge" },
  { id: 30, name: "Brave Sword (Tapion)", price: 115000, currency: "yens", kind: "weapon", amount: 1, statValue: 270, description: "+270 ATK enchanted hero blade" },
  { id: 31, name: "Crusher Edge", price: 130000, currency: "yens", kind: "weapon", amount: 1, statValue: 285, description: "+285 ATK brutal physical power" },
  { id: 32, name: "Supernova Blade", price: 180000, currency: "yens", kind: "weapon", amount: 1, statValue: 320, description: "+320 ATK stellar burning plasma" },
  { id: 33, name: "Janemba Dimension Sword", price: 220000, currency: "yens", kind: "weapon", amount: 1, statValue: 340, description: "+340 ATK dimensional rift slicer" },
  { id: 34, name: "Deadly Divine Sword", price: 260000, currency: "yens", kind: "weapon", amount: 1, statValue: 360, description: "+360 ATK divine god killing sword" },
  { id: 35, name: "Vegito Spirit Sword", price: 320000, currency: "yens", kind: "weapon", amount: 1, statValue: 390, description: "+390 ATK concentrated Ki piercing blade" },
  { id: 36, name: "Kamehameha Blade", price: 380000, currency: "yens", kind: "weapon", amount: 1, statValue: 412, description: "+412 ATK charged with pure turtle wave energy" },

  // CATEGORY 3: CRYSTALS
  { id: 40, name: "Crystal Pack (1x)", price: 30, currency: "gems", kind: "crystal", amount: 1, description: "Essential gem for ranking up and founding clans" },
  { id: 41, name: "Crystal Chest (10x)", price: 280, currency: "gems", kind: "crystal", amount: 10, description: "Bulk bundle of 10 crystals at a discount" },
  { id: 42, name: "Crystal Vault (50x)", price: 1350, currency: "gems", kind: "crystal", amount: 50, description: "Mega bundle of 50 crystals for high rank ascension" },
  { id: 43, name: "Crystal Treasury (100x)", price: 2600, currency: "gems", kind: "crystal", amount: 100, description: "Imperial crate of 100 crystals" },

  // CATEGORY 4: HEALING & SENZU BEANS
  { id: 50, name: "Potion", price: 100, currency: "yens", kind: "heal", amount: 1, healValue: 30, description: "Restores 30% of your maximum battle health" },
  { id: 51, name: "Mega Potion", price: 250, currency: "yens", kind: "heal", amount: 1, healValue: 60, description: "Restores 60% of your maximum battle health" },
  { id: 52, name: "Revive", price: 350, currency: "yens", kind: "heal", amount: 1, healValue: 80, description: "Restores 80% HP and revives fallen stamina" },
  { id: 53, name: "Senzu Bean", price: 800, currency: "yens", kind: "heal", amount: 1, healValue: 100, description: "Karin Tower mystical bean that instantly restores 100% full health!" },
  { id: 54, name: "Senzu Pouch (5x)", price: 3600, currency: "yens", kind: "heal", amount: 5, healValue: 100, description: "Bundle of 5 Senzu Beans ready for tough raids" },

  // CATEGORY 5: FUSION MATERIALS
  { id: 60, name: "Fusion Material", price: 250, currency: "gems", kind: "fusion", amount: 1, description: "Basic metamoran fusion catalyst" },
  { id: 61, name: "Fusion Core", price: 500, currency: "gems", kind: "fusion", amount: 1, description: "Concentrated core of fusion dance energy" },
  { id: 62, name: "Fusion Crystal", price: 1200, currency: "gems", kind: "fusion", amount: 1, description: "Potala-grade crystalline catalyst" },
  { id: 63, name: "Fusion Catalyst", price: 2500, currency: "gems", kind: "fusion", amount: 1, description: "Supreme catalyst guaranteed seamless fusion" },
  { id: 64, name: "Potara Earrings", price: 5000, currency: "gems", kind: "fusion", amount: 1, description: "Sacred Kaioshin earrings for ultimate fusion synthesis" },

  // CATEGORY 6: KEYS & TICKETS
  { id: 70, name: "Gacha Ticket (1x)", price: 60, currency: "gems", kind: "ticket", amount: 1, description: "Single ticket for summoning warrior characters" },
  { id: 71, name: "Gacha Bundle (10x)", price: 550, currency: "gems", kind: "ticket", amount: 10, description: "10 Gacha Tickets discounted for multi-summons" },
  { id: 72, name: "Gacha Mega (50x)", price: 2600, currency: "gems", kind: "ticket", amount: 50, description: "50 Gacha Tickets for massive portal summons" },
  { id: 73, name: "Gacha Ultra (100x)", price: 5000, currency: "gems", kind: "ticket", amount: 100, description: "100 Gacha Tickets for guaranteed high tiers" },
  { id: 74, name: "Elite Key", price: 1200, currency: "yens", kind: "key_elite", amount: 1, description: "Key to summon the Elite Ginyu Force" },
  { id: 75, name: "Boss Key", price: 2600, currency: "yens", kind: "key_boss", amount: 1, description: "Key to summon Mythical Cell & God of Destruction" },
  { id: 76, name: "Boss Key Crate (5x)", price: 12000, currency: "yens", kind: "key_boss", amount: 5, description: "Bundle of 5 Boss Keys for raid marathons" },
];

// -----------------------------------------------------------
// 20 KI SKILLS
// -----------------------------------------------------------
export const SKILLS: Record<string, number> = {
  "Ki Blast": 9,
  "Kaioken": 6,
  "Instant Transmission": 10,
  "Spirit Bomb": 18,
  "Solar Flare": 12,
  "Destructo Disk": 16,
  "Ultra Instinct": 22,
  "Final Flash": 20,
  "God Kamehameha": 25,
  "Big Bang Attack": 28,
  "Black Hole Attack": 32,
  "Time Skip": 20,
  "Nova Burst": 26,
  "Dragon Fist": 30,
  "Final Explosion": 35,
  "Kamehameha Wave": 38,
  "Heavenly Rush": 42,
  "Universe Breaker": 48,
  "Halo Blast": 50,
  "Godly Burst": 54,
};

export const SKILL_ATK: Record<string, number> = {
  "Ki Blast": 100,
  "Kaioken": 116,
  "Instant Transmission": 114,
  "Spirit Bomb": 192,
  "Solar Flare": 171,
  "Destructo Disk": 190,
  "Ultra Instinct": 215,
  "Final Flash": 128,
  "God Kamehameha": 222,
  "Big Bang Attack": 214,
  "Black Hole Attack": 224,
  "Time Skip": 132,
  "Nova Burst": 220,
  "Dragon Fist": 198,
  "Final Explosion": 292,
  "Kamehameha Wave": 225,
  "Heavenly Rush": 390,
  "Universe Breaker": 344,
  "Halo Blast": 368,
  "Godly Burst": 465,
};

export const DRAGON_BALL_STARS = [1, 2, 3, 4, 5, 6, 7];

// -----------------------------------------------------------
// 4 BOSS SUMMONS (5x REWARDS)
// -----------------------------------------------------------
export const SUMMONS: Record<string, BossSummonData> = {
  "elite": {
    id: "elite",
    name: "Elite Ginyu Force",
    hp: 260000,
    dmg: 11000,
    rewardMult: 3000,
    keyType: "keysElite",
    keyLabel: "Elite Key",
    description: "The entire five-man Ginyu Squad striking coordinated poses and combo death streams.",
  },
  "mythical": {
    id: "mythical",
    name: "Mythical Perfect Cell",
    hp: 700000,
    dmg: 18000,
    rewardMult: 1116,
    keyType: "keysBoss",
    keyLabel: "Boss Key",
    description: "Super Perfect Cell resurrected with golden aura and infinite cellular regeneration.",
  },
  "legendary": {
    id: "legendary",
    name: "God of Destruction",
    hp: 1100000,
    dmg: 2600,
    rewardMult: 1000,
    keyType: "keysBoss",
    keyLabel: "Boss Key",
    description: "Lord Beerus sparring at full deity output surrounded by spheres of Hakai destruction.",
  },
  "jiren": {
    id: "jiren",
    name: "Jiren: Beyond Limits",
    hp: 1450000,
    dmg: 3200,
    rewardMult: 1400,
    keyType: "keysBoss",
    keyLabel: "Boss Key",
    description: "The burning gray titan discarding meditation to ignite burning red aura across reality.",
  },
};

// -----------------------------------------------------------
// 4 CLAN RAID BOSSES
// -----------------------------------------------------------
export const CLAN_RAIDS: Record<string, { hp: number; dmg: number; rewardYens: number; rewardGems: number; rewardCrystals: number; rewardTickets: number; rewardSkillPoints: number; description: string }> = {
  "Perfect Cell": {
    hp: 40000,
    dmg: 399,
    rewardYens: 25000000,
    rewardGems: 50000,
    rewardCrystals: 3000,
    rewardTickets: 50,
    rewardSkillPoints: 100,
    description: "Biochemical apex android testing the clan's synchronized teamwork.",
  },
  "Frieza": {
    hp: 70000,
    dmg: 1200,
    rewardYens: 500000000,
    rewardGems: 90000,
    rewardCrystals: 6000,
    rewardTickets: 70,
    rewardSkillPoints: 120,
    description: "Emperor of the universe firing death beams at all clan participants.",
  },
  "Majin Buu": {
    hp: 95000,
    dmg: 1700,
    rewardYens: 80000000,
    rewardGems: 120000,
    rewardCrystals: 8000,
    rewardTickets: 100,
    rewardSkillPoints: 150,
    description: "Ancient chaotic menace regenerating after every hit until vaporized.",
  },
  "Beerus": {
    hp: 140000,
    dmg: 2400,
    rewardYens: 120000000,
    rewardGems: 180000,
    rewardCrystals: 10000,
    rewardTickets: 150,
    rewardSkillPoints: 190,
    description: "The Destroyer testing if the mortal clan possesses god-tier resolve.",
  },
};

// -----------------------------------------------------------
// WORLD RAID (10x REWARDS, NO COUNTDOWN, PERSISTENT HP)
// -----------------------------------------------------------
export const WORLD_RAID = {
  name: "Multiverse Omega Dragon",
  hp: 120000,
  dmg: 500,
  rewardMult: 10000, // 10x multiplier requested
  attackCooldownS: 0, // No countdown timer as requested!
  description: "Colossal shadow dragon devouring cosmic energy across universes. HP persists between all your battles until defeated!",
};

// -----------------------------------------------------------
// 10 ASCENSION RANKS (Beginner to God)
// -----------------------------------------------------------
export const RANKS: Record<number, string> = {
  1: "Beginner",
  2: "Novice",
  3: "King",
  4: "Emperor",
  5: "Demigod",
  6: "Immortal",
  7: "Titan",
  8: "Oracle",
  9: "Celestial",
  10: "God",
};

export const RANKUP_CRYSTALS: Record<number, number> = {
  1: 500,
  2: 4000,
  3: 20000,
  4: 70000,
  5: 150000,
  6: 300000,
  7: 600000,
  8: 1000000,
  9: 2000000,
};

export const CLAN_CREATE_CRYSTALS = 100;

export const WEAPONS = WEAPONS_CATALOG;
export const ARMORS = ARMORS_CATALOG;
export const DOJO_SKILLS = SKILLS;
