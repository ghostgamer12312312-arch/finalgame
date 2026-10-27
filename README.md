# Dragon Battle RPG (Web Edition)

A full-featured Dragon Ball RPG web application rewritten in React, TypeScript, Vite, and Tailwind CSS, preserving and enhancing all core features and business logic from the original Telegram bot `ghostgamer12312312-arch/dragon`.

## Features
- **Stat Growth Engine (`src/data/characterStats.ts`)**: Mathematical level-up formulas for HP, Attack, Speed, and Critical Hit rate for all ranks.
- **SP+ Rank (Super Dragon Ball Heroes 2)**: Added SP+ rank featuring Vegito Xeno SSJ4 Limit Breaker, Gogeta Xeno SSJ4 Limit Breaker, Goku Grand Priest, Mechikabura, Aeos, Cumber, and more.
- **Multiverse Warrior Summon (Gacha)**: 90+ warriors across 7 ranks: 15 Omni Kings, 10 SP+ SDBH Titans, 26 Mythical, 27 Legendary, 28 Epic, 21 Rare, and recruits.
- **Explore System with 3 Options**: 1. Battle enemy, 2. Run away, 3. Inspect drops and zone intel.
- **Planetary Combat & Patrol**: 6 Worlds with scaled reward multipliers (Earth, Hell, Kai's Planet, Supreme Kai's Planet, Lord Beerus's Planet, Omniverse).
- **Persistent World Raid Boss**: Zero-cooldown attacks on Multiverse Omega Dragon with persistent boss health across defeats.
- **Marketplace with 6 Distinct Categories**: 1. Armours, 2. Weapons, 3. Crystals, 4. Healing Potions & Senzu Beans, 5. Fusion Materials, 6. Tickets & Boss Keys, with bulk purchasing (1x, 10x, 50x, 100x).
- **Metamoran Fusion Chamber**: Combine any two unlocked warriors with Potara or Fusion Catalysts to ascend tiers through SP+ to Omni.
- **Clan System & Raids**: Full 9-command clan management (create, join, leave, disband, promote, demote, transfer, kick, announcement) plus Clan Raids.
- **Shenron Altar**: Gather 1★ to 7★ Dragon Balls to summon Shenron for wishes.
- **Telegram Bot CLI Simulator**: Retro terminal supporting all slash commands (`/profile`, `/explore`, `/gacha`, `/mycharacters`, `/heal`, `/travel`, `/fusion`, etc.).

## Tech Stack
- **Framework**: React 18 with TypeScript
- **Bundler**: Vite 6
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Effects**: Canvas Confetti
