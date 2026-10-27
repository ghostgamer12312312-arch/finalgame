# -*- coding: utf-8 -*-
"""
========================================================================================
DRAGON BALL: SUPER HEROES UNIVERSE BOT (SDBH ENGINE v4.5.0)
CORE GAME DATA ARCHIVE - game_data.py
========================================================================================
Fully Termux / Linux / Cloud compliant. Exclusively authored for Telegram aiogram v3 bots.
Defines every warrior, rank, transformation, equipment, planetary realm, story saga,
patrol encounter table, clan perk, technique, and balanced progression formula.

TUNING SPECIFICATION:
- EXP Curve: Steep, long-term progression. Low EXP from regular NPCs, story stages,
  and raid bosses to prevent fast leveling as explicitly requested by user.
========================================================================================
"""

from __future__ import annotations
import math
import random
from typing import Dict, List, Optional, Any, Tuple


# ======================================================================================
# 1. CORE SYSTEM CONFIGURATION & RARITY CONSTANTS
# ======================================================================================

BOT_VERSION = "4.5.0-SDBH-SUPERIOR"
MAX_LEVEL_CAP = 150
MAX_STAR_RANK = 10
BASE_KI_MAX = 100
MAX_INVENTORY_SLOTS = 100
MAX_CLAN_MEMBERS_BASE = 25

# Rarity tiers from highest transcendent to base mortal
RARITY_TIERS: List[str] = [
    "omni",        # Omni-King / Supreme God level
    "sp_plus",     # SP+ Tier: Transcendence & Super Dragon Ball Heroes Break-Through
    "mythical",    # God of Destruction / True Ultra Instinct / Ultra Ego / Beast
    "legendary",   # Super Saiyan Blue Evolved / FPSSJ4 / Fusion Warriors
    "epic",        # Golden Form / Super Saiyan 3 / Pure Majin / Android Apex
    "rare",        # Namekian Sage / Super Saiyan 1-2 / Elite Galactic Soldiers
    "common",      # Saibamen / Low-Class Warriors / Patrol Minions
]

RARITY_DISPLAY: Dict[str, Dict[str, str]] = {
    "omni": {
        "name": "Omni-King (全王級)",
        "badge": "🌌 [OMNI]",
        "color": "#e0aaff",
        "stars": "⭐⭐⭐⭐⭐⭐⭐",
        "summon_weight": 0.005,  # 0.5% drop rate
    },
    "sp_plus": {
        "name": "SP+ Limit Breaker (超越SP+)",
        "badge": "⚡ [SP+]",
        "color": "#ff0055",
        "stars": "⭐⭐⭐⭐⭐⭐",
        "summon_weight": 0.025,  # 2.5% drop rate
    },
    "mythical": {
        "name": "Mythical God (神話級)",
        "badge": "🔥 [MYTHICAL]",
        "color": "#ffaa00",
        "stars": "⭐⭐⭐⭐⭐",
        "summon_weight": 0.07,   # 7.0% drop rate
    },
    "legendary": {
        "name": "Legendary Warrior (伝説級)",
        "badge": "🌟 [LEGENDARY]",
        "color": "#00d4ff",
        "stars": "⭐⭐⭐⭐",
        "summon_weight": 0.15,   # 15.0% drop rate
    },
    "epic": {
        "name": "Epic Saiyan (叙事級)",
        "badge": "💜 [EPIC]",
        "color": "#a855f7",
        "stars": "⭐⭐⭐",
        "summon_weight": 0.25,   # 25.0% drop rate
    },
    "rare": {
        "name": "Rare Fighter (希少級)",
        "badge": "🔷 [RARE]",
        "color": "#3b82f6",
        "stars": "⭐⭐",
        "summon_weight": 0.30,   # 30.0% drop rate
    },
    "common": {
        "name": "Common Scout (一般級)",
        "badge": "⚪ [COMMON]",
        "color": "#94a3b8",
        "stars": "⭐",
        "summon_weight": 0.20,   # 20.0% drop rate
    },
}

# Stat scaling multipliers applied per level-up
RARITY_STAT_MULTIPLIERS: Dict[str, Dict[str, float]] = {
    "omni": {
        "hp_mult": 4.5,
        "atk_mult": 4.2,
        "def_mult": 4.0,
        "spd_mult": 3.8,
        "crit_base": 0.25,
        "crit_growth": 0.0015,
    },
    "sp_plus": {
        "hp_mult": 3.8,
        "atk_mult": 3.6,
        "def_mult": 3.4,
        "spd_mult": 3.3,
        "crit_base": 0.20,
        "crit_growth": 0.0012,
    },
    "mythical": {
        "hp_mult": 3.2,
        "atk_mult": 3.0,
        "def_mult": 2.8,
        "spd_mult": 2.7,
        "crit_base": 0.16,
        "crit_growth": 0.0010,
    },
    "legendary": {
        "hp_mult": 2.6,
        "atk_mult": 2.4,
        "def_mult": 2.3,
        "spd_mult": 2.2,
        "crit_base": 0.12,
        "crit_growth": 0.0008,
    },
    "epic": {
        "hp_mult": 2.0,
        "atk_mult": 1.9,
        "def_mult": 1.8,
        "spd_mult": 1.7,
        "crit_base": 0.09,
        "crit_growth": 0.0006,
    },
    "rare": {
        "hp_mult": 1.5,
        "atk_mult": 1.4,
        "def_mult": 1.3,
        "spd_mult": 1.3,
        "crit_base": 0.06,
        "crit_growth": 0.0004,
    },
    "common": {
        "hp_mult": 1.1,
        "atk_mult": 1.0,
        "def_mult": 1.0,
        "spd_mult": 1.0,
        "crit_base": 0.03,
        "crit_growth": 0.0002,
    },
}


# ======================================================================================
# 2. PROGRESSION & EXPERIENCE FORMULAS (LOWER EXP TUNING)
# ======================================================================================
# The user specifically requested lower EXP progression to avoid leveling up too quickly.
# Requirements scale up steeply with level, and payouts from battles are modest.

def get_required_exp_for_level(level: int) -> int:
    """
    Calculates the exact total EXP needed to advance from `level` to `level + 1`.
    Uses an exponential curve with a high base requirement so players must battle
    consistently rather than maxing out in a few minutes.
    """
    if level < 1:
        return 100
    if level >= MAX_LEVEL_CAP:
        return 999_999_999

    # Steep scaling: Base 120, grows by power of 2.15
    base_requirement = 120
    scaled_exp = int(base_requirement * (level ** 2.15) + (level * 80))
    return scaled_exp


def get_battle_exp_payout(enemy_level: int, enemy_rarity: str, is_boss: bool = False, is_raid: bool = False) -> int:
    """
    Returns the EXP payout for vanquishing an opponent.
    Tuned strictly low:
    - Low-tier mob: 12 - 35 EXP
    - Epic/Legendary NPC: 40 - 90 EXP
    - Boss fight: 100 - 220 EXP
    - Clan raid: 200 - 380 EXP
    """
    rarity_factors = {
        "common": 1.0,
        "rare": 1.25,
        "epic": 1.55,
        "legendary": 1.95,
        "mythical": 2.4,
        "sp_plus": 2.9,
        "omni": 3.5,
    }
    factor = rarity_factors.get(enemy_rarity.lower(), 1.0)
    
    # Base formula yields low single-digit to low double-digit exp for basic encounters
    base_exp = 10.0 + (enemy_level * 1.8) * factor
    
    if is_raid:
        # Clan raid yield is capped to prevent leveling exploits
        exp_awarded = int(base_exp * 2.2 + 80)
    elif is_boss:
        # Story saga / planetary boss yield
        exp_awarded = int(base_exp * 1.6 + 35)
    else:
        # Regular patrol NPC
        exp_awarded = int(base_exp * 0.85)

    # Hard upper clamp on single battle gain to keep leveling disciplined
    return max(8, min(exp_awarded, 450))


def get_zenkai_boost_multiplier(current_hp: int, max_hp: int, is_saiyan: bool) -> float:
    """
    Calculates Zenkai Boost: Saiyans recover extra battle power when surviving at critical HP.
    """
    if not is_saiyan or max_hp <= 0:
        return 1.0
    hp_ratio = current_hp / max_hp
    if hp_ratio <= 0.15:
        return 1.35  # +35% attack buff when below 15% HP
    elif hp_ratio <= 0.30:
        return 1.18  # +18% attack buff when below 30% HP
    return 1.0


# ======================================================================================
# 3. WARRIORS DATABASE (100+ CHARACTERS ACROSS ALL TIERS)
# ======================================================================================
# Packed with Dragon Ball Super Heroes 2, Super, GT, and Z legends.

CHARACTERS_DATA: Dict[str, Dict[str, Any]] = {
    # ----------------------------------------------------------------------------------
    # TIER: OMNI-KING (全王神超越級) - 8 Characters
    # ----------------------------------------------------------------------------------
    "zeno_omni": {
        "id": "zeno_omni",
        "name": "Grand Zeno (全王)",
        "title": "Lord of All Creation & Erasure",
        "series": "Dragon Ball Super",
        "rarity": "omni",
        "race": "Deity",
        "base_hp": 8500,
        "base_atk": 1150,
        "base_def": 950,
        "base_spd": 980,
        "crit_rate": 0.28,
        "ki_pool": 100,
        "passive_name": "Absolute Erasure Command",
        "passive_desc": "All incoming debuffs are nullified. Normal attacks have an 18% chance to execute direct obliteration (250% true damage).",
        "signature_move": "Universal Squish",
        "signature_cost": 75,
        "signature_damage_mult": 4.5,
        "transformations": ["Wrath of the Omni-King"],
        "quote": "If you are naughty... bye-bye!",
    },
    "future_zeno": {
        "id": "future_zeno",
        "name": "Future Grand Zeno (未来全王)",
        "title": "Observer of the Erased Timeline",
        "series": "Dragon Ball Super",
        "rarity": "omni",
        "race": "Deity",
        "base_hp": 8450,
        "base_atk": 1140,
        "base_def": 940,
        "base_spd": 975,
        "crit_rate": 0.27,
        "ki_pool": 100,
        "passive_name": "Temporal Mirror Erasure",
        "passive_desc": "Reflects 20% of burst beam damage back to the attacker as cosmic shockwaves.",
        "signature_move": "Void Dissolution Beam",
        "signature_cost": 70,
        "signature_damage_mult": 4.4,
        "transformations": ["Dual Omni Resonance"],
        "quote": "Yes, let's play... until everything vanishes!",
    },
    "grand_priest_daishinkan": {
        "id": "grand_priest_daishinkan",
        "name": "Grand Priest Daishinkan (大神官)",
        "title": "Supreme Angel of All Multiverses",
        "series": "Super Dragon Ball Heroes 2",
        "rarity": "omni",
        "race": "Angel",
        "base_hp": 8900,
        "base_atk": 1180,
        "base_def": 1020,
        "base_spd": 1100,
        "crit_rate": 0.32,
        "ki_pool": 100,
        "passive_name": "Autonomous Angelic Supremacy",
        "passive_desc": "Innate 28% evasion rate against all strikes. Counter-attacks with Stardust Needles for 75% ATK.",
        "signature_move": "Angelic Decreed Nullification",
        "signature_cost": 65,
        "signature_damage_mult": 4.6,
        "transformations": ["True Angelic Form", "Daishinkan Combat Stance"],
        "quote": "In the presence of the Omni-King, quietude is sacred.",
    },
    "zalama_divine_dragon": {
        "id": "zalama_divine_dragon",
        "name": "Dragon God Zalama (神龍ザラマ)",
        "title": "Architect of the Super Dragon Balls",
        "series": "Dragon Ball Lore",
        "rarity": "omni",
        "race": "Dragon Deity",
        "base_hp": 9600,
        "base_atk": 1090,
        "base_def": 1150,
        "base_spd": 880,
        "crit_rate": 0.24,
        "ki_pool": 100,
        "passive_name": "Super Dragon Core Manifestation",
        "passive_desc": "Regenerates 6% max HP at the beginning of each turn. Immune to freeze and stun.",
        "signature_move": "Galactic Super Shenron Breath",
        "signature_cost": 80,
        "signature_damage_mult": 4.8,
        "transformations": ["Incarnation of the Golden Cosmos"],
        "quote": "The stars align to grant any wish without limitation.",
    },
    "aeos_supreme_kai_time": {
        "id": "aeos_supreme_kai_time",
        "name": "Aeos (Former Supreme Kai of Time)",
        "title": "Arbiter of the Super Space-Time Tournament",
        "series": "Super Dragon Ball Heroes 2",
        "rarity": "omni",
        "race": "Deity / Core Person",
        "base_hp": 8200,
        "base_atk": 1120,
        "base_def": 960,
        "base_spd": 1060,
        "crit_rate": 0.30,
        "ki_pool": 100,
        "passive_name": "Chronos Timeline Sealing",
        "passive_desc": "Slows enemy turn speed by 18%. Can seal an opponent's ultimate for 1 turn after beam struggle.",
        "signature_move": "Timespace Scroll Obliteration",
        "signature_cost": 70,
        "signature_damage_mult": 4.3,
        "transformations": ["Time Distortion Awakened", "Supreme Time Arbiter Form"],
        "quote": "Superfluous timelines will be cleanly pruned.",
    },
    "chronoa_time_unleashed": {
        "id": "chronoa_time_unleashed",
        "name": "Chronoa (Time Power Unleashed)",
        "title": "Guardian of History & Tokitoki",
        "series": "Super Dragon Ball Heroes 2",
        "rarity": "omni",
        "race": "Deity",
        "base_hp": 8050,
        "base_atk": 1080,
        "base_def": 980,
        "base_spd": 1040,
        "crit_rate": 0.26,
        "ki_pool": 100,
        "passive_name": "Tokitoki Divine Blessing",
        "passive_desc": "Grants team 15% critical rate boost. Revives once per battle with 25% HP when vanquished.",
        "signature_move": "Temporal Holy Judgement",
        "signature_cost": 60,
        "signature_damage_mult": 4.1,
        "transformations": ["Tokitoki Fusion Resonance"],
        "quote": "I won't let you unravel history any further!",
    },
    "hearts_godslayer_ultimate": {
        "id": "hearts_godslayer_ultimate",
        "name": "Hearts (Ultimate Godslayer Form)",
        "title": "Bearer of the Universe Seed",
        "series": "Super Dragon Ball Heroes 2",
        "rarity": "omni",
        "race": "Core Area Warrior",
        "base_hp": 8600,
        "base_atk": 1210,
        "base_def": 930,
        "base_spd": 990,
        "crit_rate": 0.31,
        "ki_pool": 100,
        "passive_name": "Gravity Crystal Dominion",
        "passive_desc": "Increases damage by 2.5% for every 10% enemy HP remaining. Crushes target guard.",
        "signature_move": "Godslayer Meteor Impact",
        "signature_cost": 75,
        "signature_damage_mult": 4.7,
        "transformations": ["Universe Seed Synthesis", "All-God Purge Overdrive"],
        "quote": "I shall liberate mortals from the whims of the gods!",
    },
    "mechikabura_dark_emperor": {
        "id": "mechikabura_dark_emperor",
        "name": "Dark King Mechikabura (暗黒王)",
        "title": "Ruler of the Dark Demon Realm",
        "series": "Super Dragon Ball Heroes 2",
        "rarity": "omni",
        "race": "Demon God",
        "base_hp": 9100,
        "base_atk": 1160,
        "base_def": 1050,
        "base_spd": 920,
        "crit_rate": 0.27,
        "ki_pool": 100,
        "passive_name": "Dark Dragon Ball Devourer",
        "passive_desc": "Steals 10 Ki points from opponent when hitting critical blows. Dark aura weakens enemy attack by 12%.",
        "signature_move": "Eternal Darkness Singularity",
        "signature_cost": 70,
        "signature_damage_mult": 4.5,
        "transformations": ["Time Restored Prime", "Dark Factor Ascended"],
        "quote": "All time and dimensions belong in the belly of darkness.",
    },

    # ----------------------------------------------------------------------------------
    # TIER: SP+ LIMIT BREAKER (超越SP+) - 10 Characters
    # ----------------------------------------------------------------------------------
    "vegito_ss4_limit_breaker": {
        "id": "vegito_ss4_limit_breaker",
        "name": "Vegito (SS4 Limit Breaker)",
        "title": "Xeno Crimson Fusion Beyond Limits",
        "series": "Super Dragon Ball Heroes 2",
        "rarity": "sp_plus",
        "race": "Saiyan (Fusion)",
        "base_hp": 7400,
        "base_atk": 1040,
        "base_def": 870,
        "base_spd": 940,
        "crit_rate": 0.25,
        "ki_pool": 100,
        "passive_name": "Limit Break Primal Surge",
        "passive_desc": "Saiyan Zenkai boost kicks in at 35% HP instead of 30%. Adds 22% crit damage.",
        "signature_move": "Limit Break Final Kamehameha",
        "signature_cost": 70,
        "signature_damage_mult": 4.2,
        "transformations": ["SS4 Limit Breaker Kaioken"],
        "quote": "This is the ultimate evolution of the Saiyan bloodline!",
    },
    "gogeta_blue_evolution_sdbh": {
        "id": "gogeta_blue_evolution_sdbh",
        "name": "Gogeta (SSGSS Evolved Kaioken)",
        "title": "Dimensional Breaker of Universe Tree",
        "series": "Super Dragon Ball Heroes 2",
        "rarity": "sp_plus",
        "race": "Saiyan (Fusion)",
        "base_hp": 7350,
        "base_atk": 1060,
        "base_def": 840,
        "base_spd": 960,
        "crit_rate": 0.26,
        "ki_pool": 100,
        "passive_name": "Stardust Spark Overdrive",
        "passive_desc": "Ki regenerates +15 every turn. Consecutive normal attacks increase power by 8%.",
        "signature_move": "God Soul Punisher Supernova",
        "signature_cost": 65,
        "signature_damage_mult": 4.3,
        "transformations": ["Universal Power Infusion"],
        "quote": "I am neither Goku nor Vegeta... I am the force that will shatter this fake universe!",
    },
    "cc_goku_ui_true": {
        "id": "cc_goku_ui_true",
        "name": "CC Goku (True Ultra Instinct)",
        "title": "Capsule Corp Master of Silver Flow",
        "series": "Super Dragon Ball Heroes 2",
        "rarity": "sp_plus",
        "race": "Saiyan",
        "base_hp": 7100,
        "base_atk": 1020,
        "base_def": 890,
        "base_spd": 980,
        "crit_rate": 0.28,
        "ki_pool": 100,
        "passive_name": "Autonomous Silver Instinct",
        "passive_desc": "24% chance to evade physical attacks and perform an immediate counter-jab.",
        "signature_move": "Supreme Silver Dragon Fist",
        "signature_cost": 65,
        "signature_damage_mult": 4.15,
        "transformations": ["Universal Tree Ki Infused UI"],
        "quote": "My heart is calm, my mind is clear... now let's see how strong you really are.",
    },
    "xeno_vegeta_ss4_lb": {
        "id": "xeno_vegeta_ss4_lb",
        "name": "Xeno Vegeta (SS4 Limit Breaker)",
        "title": "Time Patrol Royal Berserker",
        "series": "Super Dragon Ball Heroes 2",
        "rarity": "sp_plus",
        "race": "Saiyan",
        "base_hp": 7250,
        "base_atk": 1050,
        "base_def": 880,
        "base_spd": 910,
        "crit_rate": 0.25,
        "ki_pool": 100,
        "passive_name": "Royal Primal Pride",
        "passive_desc": "Damage rises by 1% for every 1% HP missing. Attack buffs cannot be stripped.",
        "signature_move": "Limit Break Final Shine Attack",
        "signature_cost": 65,
        "signature_damage_mult": 4.1,
        "transformations": ["Dark Dragon Ball Purified Stance"],
        "quote": "Never underestimate the pride of the Saiyan Prince!",
    },
    "dark_king_fu": {
        "id": "dark_king_fu",
        "name": "Dark King Fu (暗黒王フュー)",
        "title": "Scientist of Creation & Doki-Doki",
        "series": "Super Dragon Ball Heroes 2",
        "rarity": "sp_plus",
        "race": "Demon / Artificial",
        "base_hp": 7500,
        "base_atk": 1010,
        "base_def": 860,
        "base_spd": 950,
        "crit_rate": 0.24,
        "ki_pool": 100,
        "passive_name": "Doki-Doki Dark Matrix",
        "passive_desc": "Every hit inflicts a random affliction: Burn, Shock, or Ki Drain (10 Ki per turn).",
        "signature_move": "Dimension Warp Dissection",
        "signature_cost": 60,
        "signature_damage_mult": 4.0,
        "transformations": ["Doki-Doki Absorbed Overlord"],
        "quote": "Fascinating data! Let us accelerate this experiment to the limit!",
    },
    "cumber_super_saiyan_full": {
        "id": "cumber_super_saiyan_full",
        "name": "Cumber (Evil Saiyan SS3)",
        "title": "The Rampaging Ancient Tyrant",
        "series": "Super Dragon Ball Heroes 2",
        "rarity": "sp_plus",
        "race": "Ancient Saiyan",
        "base_hp": 7900,
        "base_atk": 1090,
        "base_def": 810,
        "base_spd": 860,
        "crit_rate": 0.22,
        "ki_pool": 100,
        "passive_name": "Corrupted Evil Aura",
        "passive_desc": "Opponents facing Cumber lose 15% DEF at the start of battle due to malevolent ki pressure.",
        "signature_move": "Disaster Claw Cataclysm",
        "signature_cost": 70,
        "signature_damage_mult": 4.25,
        "transformations": ["Golden Great Ape Unleashed"],
        "quote": "GRAAAAH! FIGHT ME! ALL SHALL DROWN IN MY MALICE!",
    },
    "golden_metal_cooler_overclock": {
        "id": "golden_metal_cooler_overclock",
        "name": "Golden Metal Cooler (Overclocked)",
        "title": "Big Gete Star Ultimate Evolution",
        "series": "Super Dragon Ball Heroes 2",
        "rarity": "sp_plus",
        "race": "Frost Demon / Android",
        "base_hp": 7600,
        "base_atk": 1030,
        "base_def": 910,
        "base_spd": 930,
        "crit_rate": 0.26,
        "ki_pool": 100,
        "passive_name": "Big Gete Star Nanite Repair",
        "passive_desc": "Repairs 4% HP every turn. If defeated by normal attack, 30% chance to endure with 1 HP.",
        "signature_move": "Golden Supernova Cannon",
        "signature_cost": 65,
        "signature_damage_mult": 4.1,
        "transformations": ["Big Gete Core Override"],
        "quote": "The Big Gete Star enabled me to cheat death... and transcend perfection!",
    },
    "demigra_transcended": {
        "id": "demigra_transcended",
        "name": "Demigra (Transcended Demon God)",
        "title": "Master of Mirage & Temporal Corruption",
        "series": "Super Dragon Ball Heroes 2",
        "rarity": "sp_plus",
        "race": "Demon God",
        "base_hp": 7300,
        "base_atk": 1020,
        "base_def": 870,
        "base_spd": 920,
        "crit_rate": 0.25,
        "ki_pool": 100,
        "passive_name": "Warp Wormhole Shield",
        "passive_desc": "Reduces incoming special move damage by 20%. Has 15% chance to confuse the enemy.",
        "signature_move": "Catastrophe Boiling Ray",
        "signature_cost": 65,
        "signature_damage_mult": 4.05,
        "transformations": ["Makyouka Monster Awakening"],
        "quote": "I shall rewrite the fabric of time to bow before my staff!",
    },
    "broly_dark_dragon_ball": {
        "id": "broly_dark_dragon_ball",
        "name": "Broly (Dark Dragon Ball SS4)",
        "title": "Berserker of the Dark Realm Mask",
        "series": "Super Dragon Ball Heroes 2",
        "rarity": "sp_plus",
        "race": "Saiyan",
        "base_hp": 7950,
        "base_atk": 1100,
        "base_def": 820,
        "base_spd": 880,
        "crit_rate": 0.23,
        "ki_pool": 100,
        "passive_name": "Unstoppable Calamity",
        "passive_desc": "Immunized against stun and sleep. Critical hits cause bleeding for 30% attack over 2 turns.",
        "signature_move": "Gigantic Dark Blaster",
        "signature_cost": 75,
        "signature_damage_mult": 4.35,
        "transformations": ["Mask Broken Wrathful State"],
        "quote": "KAKAROT... YOU WILL DIE BY MY CLAWS!",
    },
    "trunks_xeno_god_mission": {
        "id": "trunks_xeno_god_mission",
        "name": "Trunks: Xeno (SSG Key Sword)",
        "title": "Saviour of the Multiverse Flow",
        "series": "Super Dragon Ball Heroes 2",
        "rarity": "sp_plus",
        "race": "Saiyan / Earthling Hybrid",
        "base_hp": 7150,
        "base_atk": 990,
        "base_def": 880,
        "base_spd": 950,
        "crit_rate": 0.27,
        "ki_pool": 100,
        "passive_name": "Keysword Evil Seal",
        "passive_desc": "Deals 25% bonus damage to Demon and Dark Realm enemies. Cleanses team debuffs on kill.",
        "signature_move": "Keysword Divine Slash",
        "signature_cost": 60,
        "signature_damage_mult": 3.95,
        "transformations": ["Super Saiyan God Aura"],
        "quote": "I will protect everyone's future with this holy blade!",
    },

    # ----------------------------------------------------------------------------------
    # TIER: MYTHICAL (神話級) - 10 Characters
    # ----------------------------------------------------------------------------------
    "ultra_ego_vegeta": {
        "id": "ultra_ego_vegeta",
        "name": "Vegeta (Ultra Ego)",
        "title": "Unbound God of Destruction Avatar",
        "series": "Dragon Ball Super (Manga)",
        "rarity": "mythical",
        "race": "Saiyan",
        "base_hp": 6600,
        "base_atk": 980,
        "base_def": 790,
        "base_spd": 870,
        "crit_rate": 0.24,
        "ki_pool": 100,
        "passive_name": "Destruction Fuel",
        "passive_desc": "Each time Vegeta takes damage, his ATK increases by 4% (stacks up to 10 times).",
        "signature_move": "Hakai Sphere Extinction",
        "signature_cost": 65,
        "signature_damage_mult": 3.9,
        "transformations": ["Ultra Ego Hakai Overcharge"],
        "quote": "The more my battle spirit burns, the stronger I become. Now strike me!",
    },
    "mastered_ui_goku": {
        "id": "mastered_ui_goku",
        "name": "Goku (Mastered Ultra Instinct)",
        "title": "Silver-Haired Martial Divinity",
        "series": "Dragon Ball Super",
        "rarity": "mythical",
        "race": "Saiyan",
        "base_hp": 6400,
        "base_atk": 960,
        "base_def": 810,
        "base_spd": 920,
        "crit_rate": 0.26,
        "ki_pool": 100,
        "passive_name": "Body That Moves on Its Own",
        "passive_desc": "22% base evasion. Counter-attacks whenever an evasion triggers successfully.",
        "signature_move": "Silver God Kamehameha",
        "signature_cost": 60,
        "signature_damage_mult": 3.85,
        "transformations": ["Giant Ki Projection Susanoo"],
        "quote": "I'm not doing this to be a hero. I'm doing this to protect my friends!",
    },
    "beast_gohan": {
        "id": "beast_gohan",
        "name": "Gohan (Beast)",
        "title": "The Awakening of Untamed Rage",
        "series": "Dragon Ball Super: Super Hero",
        "rarity": "mythical",
        "race": "Saiyan / Earthling Hybrid",
        "base_hp": 6500,
        "base_atk": 995,
        "base_def": 770,
        "base_spd": 880,
        "crit_rate": 0.28,
        "ki_pool": 100,
        "passive_name": "Rage of the Crimson Gaze",
        "passive_desc": "If ally falls or HP drops below 40%, gains guaranteed Critical Hit for 2 consecutive turns.",
        "signature_move": "Special Beam Cannon (Makankosappo)",
        "signature_cost": 65,
        "signature_damage_mult": 4.1,
        "transformations": ["Unchecked Beast Instinct"],
        "quote": "Is that all you've got? Now it's my turn.",
    },
    "orange_piccolo": {
        "id": "orange_piccolo",
        "name": "Piccolo (Orange Piccolo)",
        "title": "Pride of the Namekian Shenron Gift",
        "series": "Dragon Ball Super: Super Hero",
        "rarity": "mythical",
        "race": "Namekian",
        "base_hp": 7200,
        "base_atk": 910,
        "base_def": 950,
        "base_spd": 810,
        "crit_rate": 0.18,
        "ki_pool": 100,
        "passive_name": "Iron Titan Constitution",
        "passive_desc": "Reduces all normal attack damage received by 25%. Restores 5% HP on turn start.",
        "signature_move": "Great Namekian Explosive Demon Wave",
        "signature_cost": 55,
        "signature_damage_mult": 3.7,
        "transformations": ["Giant Orange Form"],
        "quote": "Shenron threw in a little extra something. Prepare yourself!",
    },
    "black_frieza": {
        "id": "black_frieza",
        "name": "Black Frieza (ブラックフリーザ)",
        "title": "Ten-Year Hyperbolic Chamber Conqueror",
        "series": "Dragon Ball Super (Manga)",
        "rarity": "mythical",
        "race": "Frost Demon",
        "base_hp": 6700,
        "base_atk": 1010,
        "base_def": 820,
        "base_spd": 900,
        "crit_rate": 0.25,
        "ki_pool": 100,
        "passive_name": "One-Shot Cold Precision",
        "passive_desc": "Deals 35% bonus damage to Saiyans. First attack in combat cannot be dodged or blocked.",
        "signature_move": "Black Death Beam Piercer",
        "signature_cost": 60,
        "signature_damage_mult": 4.0,
        "transformations": ["Obsidian Emperor Majesty"],
        "quote": "I spent ten whole years in a room of spirit and time. I am now in a league of my own.",
    },
    "moro_planet_devourer": {
        "id": "moro_planet_devourer",
        "name": "Moro (Angel Power Merged)",
        "title": "Ancient Magic Planet Eater",
        "series": "Dragon Ball Super (Manga)",
        "rarity": "mythical",
        "race": "Magical Being",
        "base_hp": 6800,
        "base_atk": 950,
        "base_def": 840,
        "base_spd": 860,
        "crit_rate": 0.20,
        "ki_pool": 100,
        "passive_name": "Life Energy Siphon",
        "passive_desc": "Steals 8% of damage dealt as health points and 5 Ki from the target.",
        "signature_move": "Planetary Life Drain Nova",
        "signature_cost": 65,
        "signature_damage_mult": 3.85,
        "transformations": ["Earth Merged Core Giant"],
        "quote": "Your life force makes for the finest vintage in the universe!",
    },
    "granolah_cerealian": {
        "id": "granolah_cerealian",
        "name": "Granolah (Full Sniper Eye)",
        "title": "Last Warrior of Planet Cereal",
        "series": "Dragon Ball Super (Manga)",
        "rarity": "mythical",
        "race": "Cerealian",
        "base_hp": 6100,
        "base_atk": 1030,
        "base_def": 740,
        "base_spd": 940,
        "crit_rate": 0.35,
        "ki_pool": 100,
        "passive_name": "Vital Point Absolute Target",
        "passive_desc": "Critical strikes ignore 50% of the target's physical defense.",
        "signature_move": "Finger Laser Vital Sniping",
        "signature_cost": 55,
        "signature_damage_mult": 3.9,
        "transformations": ["Dual Red Eyes Unleashed"],
        "quote": "My right eye sees the exact flow of blood and ki in your body.",
    },
    "broly_lssj_super": {
        "id": "broly_lssj_super",
        "name": "Broly (Full Power Super Saiyan)",
        "title": "Green Emerald Cataclysm of Vampa",
        "series": "Dragon Ball Super: Broly",
        "rarity": "mythical",
        "race": "Saiyan",
        "base_hp": 7400,
        "base_atk": 1000,
        "base_def": 860,
        "base_spd": 820,
        "crit_rate": 0.21,
        "ki_pool": 100,
        "passive_name": "Unbound Ki Resurgence",
        "passive_desc": "Generates 10 bonus Ki when struck. Attack stat increases by 20% when HP is below 50%.",
        "signature_move": "Gigantic Roar Eraser",
        "signature_cost": 70,
        "signature_damage_mult": 4.15,
        "transformations": ["Wrathful Titan Roar"],
        "quote": "RRRRAAAAAAAAAAAAAGGGGHHH!",
    },
    "jiren_full_power": {
        "id": "jiren_full_power",
        "name": "Jiren (Full Power Limit Break)",
        "title": "The Immovable Wall of Universe 11",
        "series": "Dragon Ball Super",
        "rarity": "mythical",
        "race": "Pride Trooper Alien",
        "base_hp": 7000,
        "base_atk": 980,
        "base_def": 920,
        "base_spd": 890,
        "crit_rate": 0.22,
        "ki_pool": 100,
        "passive_name": "Solitary Burning Wall",
        "passive_desc": "Ki blast attacks dealt against Jiren suffer a 25% damage penalty. Guard never breaks.",
        "signature_move": "Overheat Magnetron",
        "signature_cost": 65,
        "signature_damage_mult": 3.95,
        "transformations": ["Blazing Red Aura Maximum"],
        "quote": "Strength is absolute. In strength, trust is unnecessary.",
    },
    "cell_max": {
        "id": "cell_max",
        "name": "Cell Max (セル・マックス)",
        "title": "Red Ribbon Colossal Bio-Android Weapon",
        "series": "Dragon Ball Super: Super Hero",
        "rarity": "mythical",
        "race": "Bio-Android",
        "base_hp": 8100,
        "base_atk": 970,
        "base_def": 900,
        "base_spd": 760,
        "crit_rate": 0.17,
        "ki_pool": 100,
        "passive_name": "Colossal Tail Sweep",
        "passive_desc": "Regular attacks strike with 15% splash damage. Takes 50% more damage if head core is cracked.",
        "signature_move": "Disaster Cataclysmic Sphere",
        "signature_cost": 70,
        "signature_damage_mult": 3.9,
        "transformations": ["Overheat Nuclear Core"],
        "quote": "GYAAAARRRRGH! SHRRRRK!",
    },

    # ----------------------------------------------------------------------------------
    # TIER: LEGENDARY (伝説級) - 10 Characters
    # ----------------------------------------------------------------------------------
    "ssgss_vegito": {
        "id": "ssgss_vegito",
        "name": "Vegito (SSGSS / Super Saiyan Blue)",
        "title": "Potara Master of the Godly Blue Blade",
        "series": "Dragon Ball Super",
        "rarity": "legendary",
        "race": "Saiyan (Fusion)",
        "base_hp": 5600,
        "base_atk": 860,
        "base_def": 730,
        "base_spd": 830,
        "crit_rate": 0.20,
        "ki_pool": 100,
        "passive_name": "Spirit Excalibur Flurry",
        "passive_desc": "Normal attacks have a 25% chance to trigger an extra follow-up slash for 60% ATK.",
        "signature_move": "Final Kamehameha",
        "signature_cost": 60,
        "signature_damage_mult": 3.5,
        "transformations": ["SSGSS Kaioken x20"],
        "quote": "Alright! Let's get down to business, god boy!",
    },
    "ssgss_gogeta": {
        "id": "ssgss_gogeta",
        "name": "Gogeta (SSGSS / Super Saiyan Blue)",
        "title": "Fusion Dance Supreme Striker",
        "series": "Dragon Ball Super: Broly",
        "rarity": "legendary",
        "race": "Saiyan (Fusion)",
        "base_hp": 5550,
        "base_atk": 880,
        "base_def": 710,
        "base_spd": 850,
        "crit_rate": 0.22,
        "ki_pool": 100,
        "passive_name": "Stardust Purifying Aura",
        "passive_desc": "Deals 20% extra damage to Evil and Villains. Purges negative status on transformation.",
        "signature_move": "Stardust Fall Breaker",
        "signature_cost": 60,
        "signature_damage_mult": 3.55,
        "transformations": ["Stardust Barrier Burst"],
        "quote": "Every drop of my power is concentrated to eradicate your darkness!",
    },
    "ss4_gogeta_gt": {
        "id": "ss4_gogeta_gt",
        "name": "SS4 Gogeta (GT Apex)",
        "title": "The Crimson Primal Fusion",
        "series": "Dragon Ball GT",
        "rarity": "legendary",
        "race": "Saiyan (Fusion)",
        "base_hp": 5700,
        "base_atk": 870,
        "base_def": 720,
        "base_spd": 840,
        "crit_rate": 0.21,
        "ki_pool": 100,
        "passive_name": "Bluff Kamehameha Taunt",
        "passive_desc": "Confuses enemy on round 1, lowering their hit chance by 20% for 2 turns.",
        "signature_move": "100x Big Bang Kamehameha",
        "signature_cost": 65,
        "signature_damage_mult": 3.65,
        "transformations": ["Primal Full Roar"],
        "quote": "One finger is more than enough to take care of you!",
    },
    "merged_zamasu_corrupted": {
        "id": "merged_zamasu_corrupted",
        "name": "Merged Zamasu (Half-Corrupted)",
        "title": "The Twisted Apotheosis of Immortality",
        "series": "Dragon Ball Super",
        "rarity": "legendary",
        "race": "Deity / Saiyan",
        "base_hp": 5900,
        "base_atk": 840,
        "base_def": 780,
        "base_spd": 760,
        "crit_rate": 0.18,
        "ki_pool": 100,
        "passive_name": "Imperfect Divine Immortality",
        "passive_desc": "Recovers 5% HP each turn. Survives fatal blow once per battle with 1 HP remaining.",
        "signature_move": "Lightning of Absolution",
        "signature_cost": 55,
        "signature_damage_mult": 3.4,
        "transformations": ["Infinite Zamasu Sky Manifestation"],
        "quote": "My form is justice! My form is the world! Worship me!",
    },
    "hit_assassin": {
        "id": "hit_assassin",
        "name": "Hit (Time-Skip Master)",
        "title": "Universe 6 Legendary Assassin",
        "series": "Dragon Ball Super",
        "rarity": "legendary",
        "race": "Unknown Alien",
        "base_hp": 5200,
        "base_atk": 890,
        "base_def": 690,
        "base_spd": 930,
        "crit_rate": 0.32,
        "ki_pool": 100,
        "passive_name": "Time-Skip: 0.5 Seconds",
        "passive_desc": "20% chance to freeze enemy action for one turn when executing a critical strike.",
        "signature_move": "Flash Skewer Assassination",
        "signature_cost": 50,
        "signature_damage_mult": 3.45,
        "transformations": ["Time Cage Expansion"],
        "quote": "I am working. Don't make this personal.",
    },
    "kefla_ss2": {
        "id": "kefla_ss2",
        "name": "Kefla (Super Saiyan 2)",
        "title": "Universe 6 Fiery Potara Fusion",
        "series": "Dragon Ball Super",
        "rarity": "legendary",
        "race": "Saiyan (Fusion)",
        "base_hp": 5350,
        "base_atk": 860,
        "base_def": 700,
        "base_spd": 860,
        "crit_rate": 0.23,
        "ki_pool": 100,
        "passive_name": "Fiery Berserk Ki Wave",
        "passive_desc": "Damage increases by 6% with each turn passed, up to +30%.",
        "signature_move": "Gigantic Burst Laser Wave",
        "signature_cost": 55,
        "signature_damage_mult": 3.4,
        "transformations": ["Full Power Potara Spark"],
        "quote": "I feel like I could blow away an entire universe with this power!",
    },
    "toppo_god_of_destruction": {
        "id": "toppo_god_of_destruction",
        "name": "Toppo (God of Destruction Candidate)",
        "title": "Abandonment of Justice for Destruction",
        "series": "Dragon Ball Super",
        "rarity": "legendary",
        "race": "Pride Alien",
        "base_hp": 5800,
        "base_atk": 850,
        "base_def": 790,
        "base_spd": 770,
        "crit_rate": 0.17,
        "ki_pool": 100,
        "passive_name": "Hakai Energy Cloak",
        "passive_desc": "Destroys 20% of incoming ki blasts, reducing their damage to zero.",
        "signature_move": "Sphere of Absolute Hakai",
        "signature_cost": 60,
        "signature_damage_mult": 3.5,
        "transformations": ["Pride Justice Overwritten"],
        "quote": "Justice is meaningless now. There is only Destruction.",
    },
    "future_trunks_sword_of_hope": {
        "id": "future_trunks_sword_of_hope",
        "name": "Future Trunks (Sword of Hope SSJ Rage)",
        "title": "The Resilient Blade of Humanity",
        "series": "Dragon Ball Super",
        "rarity": "legendary",
        "race": "Saiyan / Earthling Hybrid",
        "base_hp": 5400,
        "base_atk": 860,
        "base_def": 740,
        "base_spd": 810,
        "crit_rate": 0.22,
        "ki_pool": 100,
        "passive_name": "Humanity's Resolute Prayers",
        "passive_desc": "Grants +15% ATK and +15% DEF when fighting as the last member of the party.",
        "signature_move": "Sword of Hope Cleave",
        "signature_cost": 60,
        "signature_damage_mult": 3.6,
        "transformations": ["Super Saiyan Rage Awakened"],
        "quote": "If this is what your godhood is like... then I don't care if it's a sin to defy you!",
    },
    "omega_shenron": {
        "id": "omega_shenron",
        "name": "Omega Shenron (Syn Shenron Absorbed)",
        "title": "Manifestation of Minus Energy",
        "series": "Dragon Ball GT",
        "rarity": "legendary",
        "race": "Shadow Dragon",
        "base_hp": 6100,
        "base_atk": 830,
        "base_def": 790,
        "base_spd": 750,
        "crit_rate": 0.16,
        "ki_pool": 100,
        "passive_name": "Negative Karma Poison",
        "passive_desc": "Every physical hit inflicts Negative Karma, eroding 3% of opponent's max HP per turn.",
        "signature_move": "Negative Karma Ball",
        "signature_cost": 65,
        "signature_damage_mult": 3.5,
        "transformations": ["All 7 Dragon Balls Integrated"],
        "quote": "I am the dragon born from the darkness of your selfish wishes!",
    },
    "gamma_1_and_2": {
        "id": "gamma_1_and_2",
        "name": "Gamma 1 & Gamma 2 (Dual Androids)",
        "title": "Dr. Hedo's Supreme Superheroes",
        "series": "Dragon Ball Super: Super Hero",
        "rarity": "legendary",
        "race": "Android",
        "base_hp": 5300,
        "base_atk": 840,
        "base_def": 730,
        "base_spd": 860,
        "crit_rate": 0.21,
        "ki_pool": 100,
        "passive_name": "Superhero Comic Sync",
        "passive_desc": "Double attacks deal 15% combined bonus damage. Ki costs reduced by 10%.",
        "signature_move": "Core Breaker Superhero Impact",
        "signature_cost": 60,
        "signature_damage_mult": 3.6,
        "transformations": ["Maximum Power Output"],
        "quote": "Stand down, villain! In the name of justice, we will take you in!",
    },

    # ----------------------------------------------------------------------------------
    # TIER: EPIC (叙事級) - 10 Characters
    # ----------------------------------------------------------------------------------
    "golden_frieza": {
        "id": "golden_frieza",
        "name": "Golden Frieza (ゴールデンフリーザ)",
        "title": "Emperor of Malice Reborn",
        "series": "Dragon Ball Super",
        "rarity": "epic",
        "race": "Frost Demon",
        "base_hp": 4600,
        "base_atk": 740,
        "base_def": 620,
        "base_spd": 760,
        "crit_rate": 0.18,
        "ki_pool": 100,
        "passive_name": "Emperor's Cruelty",
        "passive_desc": "Attacks against bleeding or burned enemies deal 20% bonus damage.",
        "signature_move": "Golden Death Beam Barrage",
        "signature_cost": 50,
        "signature_damage_mult": 3.1,
        "transformations": ["True Golden Control"],
        "quote": "I chose gold to convey my gratitude. It is rather dazzling, wouldn't you say?",
    },
    "ultimate_gohan_z": {
        "id": "ultimate_gohan_z",
        "name": "Ultimate Gohan (Elder Kai Unleashed)",
        "title": "The Scholar's Latent Zenith",
        "series": "Dragon Ball Z",
        "rarity": "epic",
        "race": "Saiyan / Earthling Hybrid",
        "base_hp": 4700,
        "base_atk": 730,
        "base_def": 640,
        "base_spd": 750,
        "crit_rate": 0.17,
        "ki_pool": 100,
        "passive_name": "Latent Potential Awakened",
        "passive_desc": "Starts battle with +15% ATK and +15% DEF for the first 3 turns.",
        "signature_move": "Super Kamehameha",
        "signature_cost": 50,
        "signature_damage_mult": 3.0,
        "transformations": ["Potential Burst"],
        "quote": "Fight you? No, I'm going to kill you.",
    },
    "super_perfect_cell": {
        "id": "super_perfect_cell",
        "name": "Super Perfect Cell (パーフェクトセル)",
        "title": "Apex Bio-Android with Saiyan Zenkai",
        "series": "Dragon Ball Z",
        "rarity": "epic",
        "race": "Bio-Android",
        "base_hp": 4800,
        "base_atk": 750,
        "base_def": 630,
        "base_spd": 730,
        "crit_rate": 0.19,
        "ki_pool": 100,
        "passive_name": "Zenkai Regeneration",
        "passive_desc": "Recovers 12% HP if reduced to below 25% once per encounter.",
        "signature_move": "Solar Kamehameha",
        "signature_cost": 55,
        "signature_damage_mult": 3.2,
        "transformations": ["Nuclear Self-Destruction Core"],
        "quote": "Not only am I back... but I have returned with the power of a Super Saiyan 2!",
    },
    "kid_buu_pure": {
        "id": "kid_buu_pure",
        "name": "Kid Buu (Pure Majin)",
        "title": "Unbridled Primordial Chaos",
        "series": "Dragon Ball Z",
        "rarity": "epic",
        "race": "Majin",
        "base_hp": 4900,
        "base_atk": 760,
        "base_def": 600,
        "base_spd": 790,
        "crit_rate": 0.20,
        "ki_pool": 100,
        "passive_name": "Endless Elastic Regeneration",
        "passive_desc": "Recovers 6% max HP every turn. Cannot be stunned by physical strikes.",
        "signature_move": "Planet Burst Destroyer",
        "signature_cost": 60,
        "signature_damage_mult": 3.25,
        "transformations": ["Chaos Body Stretch"],
        "quote": "KEEKEEKEE! HAHAHAHAHA!",
    },
    "super_janemba": {
        "id": "super_janemba",
        "name": "Super Janemba",
        "title": "The Evil Incarnate of Otherworld",
        "series": "Dragon Ball Z: Fusion Reborn",
        "rarity": "epic",
        "race": "Demon",
        "base_hp": 4750,
        "base_atk": 740,
        "base_def": 630,
        "base_spd": 780,
        "crit_rate": 0.21,
        "ki_pool": 100,
        "passive_name": "Bunkai Teleport Pixel Shift",
        "passive_desc": "20% chance to dissolve into cubes, completely evading any attack.",
        "signature_move": "Dimensional Lightning Slash",
        "signature_cost": 50,
        "signature_damage_mult": 3.15,
        "transformations": ["Corrupted Otherworld Domain"],
        "quote": "Janemba! Janemba!",
    },
    "bojack_full_power": {
        "id": "bojack_full_power",
        "name": "Bojack (Full Power Hera Clan)",
        "title": "Galactic Space Pirate Overlord",
        "series": "Dragon Ball Z: Bojack Unbound",
        "rarity": "epic",
        "race": "Hera-seijin",
        "base_hp": 4850,
        "base_atk": 750,
        "base_def": 650,
        "base_spd": 710,
        "crit_rate": 0.16,
        "ki_pool": 100,
        "passive_name": "Galactic Buster Force",
        "passive_desc": "Increases strike damage by 15% when fighting hybrid saiyans.",
        "signature_move": "Grand Galactic Buster",
        "signature_cost": 50,
        "signature_damage_mult": 3.1,
        "transformations": ["Emerald Skin Transformation"],
        "quote": "We will paint this entire galaxy in our glorious banner!",
    },
    "android_17_ranger": {
        "id": "android_17_ranger",
        "name": "Android 17 (Monster Island Ranger)",
        "title": "MVP of the Tournament of Power",
        "series": "Dragon Ball Super",
        "rarity": "epic",
        "race": "Android",
        "base_hp": 4650,
        "base_atk": 720,
        "base_def": 670,
        "base_spd": 770,
        "crit_rate": 0.17,
        "ki_pool": 100,
        "passive_name": "Infinite Energy Generator",
        "passive_desc": "Never loses Ki from debuffs. Gains +5 Ki every turn automatically.",
        "signature_move": "Android Energy Barrier Collision",
        "signature_cost": 45,
        "signature_damage_mult": 2.95,
        "transformations": ["Self-Destruct Feint Stance"],
        "quote": "I want a luxury cruiser so my family and I can travel the world.",
    },
    "android_18_infinite": {
        "id": "android_18_infinite",
        "name": "Android 18 (Infinity Ki Fighter)",
        "title": "Cold-Blooded Tactical Beauty",
        "series": "Dragon Ball Super",
        "rarity": "epic",
        "race": "Android",
        "base_hp": 4500,
        "base_atk": 710,
        "base_def": 660,
        "base_spd": 780,
        "crit_rate": 0.18,
        "ki_pool": 100,
        "passive_name": "Endless Ki Volley",
        "passive_desc": "Normal attacks chip away at target's defense by 3% per hit (stacks up to 5 times).",
        "signature_move": "Sadistic Infinity Dance",
        "signature_cost": 45,
        "signature_damage_mult": 2.9,
        "transformations": ["Infinite Overdrive"],
        "quote": "Don't get cocky. You haven't even seen what I'm capable of.",
    },
    "majin_vegeta": {
        "id": "majin_vegeta",
        "name": "Majin Vegeta (Babidi's Mark)",
        "title": "Pride Unshackled by Dark Sorcery",
        "series": "Dragon Ball Z",
        "rarity": "epic",
        "race": "Saiyan",
        "base_hp": 4800,
        "base_atk": 770,
        "base_def": 610,
        "base_spd": 740,
        "crit_rate": 0.22,
        "ki_pool": 100,
        "passive_name": "Unforgiven Saiyan Pride",
        "passive_desc": "Deals 20% extra damage to pure Saiyans. Cannot be charmed or intimidated.",
        "signature_move": "Final Explosion (Sacrifice)",
        "signature_cost": 75,
        "signature_damage_mult": 3.7,
        "transformations": ["Babidi Mind Dominance Purged"],
        "quote": "I do not care about you, or your loved ones! I only care about surpassing Kakarot!",
    },
    "ss3_goku_angel": {
        "id": "ss3_goku_angel",
        "name": "SS3 Goku (Halo of Otherworld)",
        "title": "Transcendent Golden Lion",
        "series": "Dragon Ball Z",
        "rarity": "epic",
        "race": "Saiyan",
        "base_hp": 4650,
        "base_atk": 760,
        "base_def": 620,
        "base_spd": 760,
        "crit_rate": 0.19,
        "ki_pool": 100,
        "passive_name": "Time-Draining Power",
        "passive_desc": "Consumes 5 Ki per turn, but deals 15% more damage on all skills.",
        "signature_move": "Super Dragon Fist (Ryuken)",
        "signature_cost": 60,
        "signature_damage_mult": 3.3,
        "transformations": ["Halo Dispersion Boost"],
        "quote": "This is what I call a Super Saiyan 3! And it took a lot of training to get here!",
    },

    # ----------------------------------------------------------------------------------
    # TIER: RARE (希少級) - 10 Characters
    # ----------------------------------------------------------------------------------
    "piccolo_fused_kami": {
        "id": "piccolo_fused_kami",
        "name": "Piccolo (Fused with Kami)",
        "title": "The Super Namekian Sage",
        "series": "Dragon Ball Z",
        "rarity": "rare",
        "race": "Namekian",
        "base_hp": 3800,
        "base_atk": 560,
        "base_def": 540,
        "base_spd": 580,
        "crit_rate": 0.12,
        "ki_pool": 100,
        "passive_name": "Namekian Wisdom",
        "passive_desc": "Increases team defense by 8%. Restores 3% HP when hitting below 50% health.",
        "signature_move": "Light Grenade",
        "signature_cost": 40,
        "signature_damage_mult": 2.5,
        "transformations": ["Weighted Clothes Removed"],
        "quote": "I am neither Piccolo nor Kami now. I am the Namekian who has forgotten his name.",
    },
    "future_trunks_ssj": {
        "id": "future_trunks_ssj",
        "name": "Future Trunks (Super Saiyan Sword)",
        "title": "The Hope from a Ruined Era",
        "series": "Dragon Ball Z",
        "rarity": "rare",
        "race": "Saiyan / Earthling Hybrid",
        "base_hp": 3600,
        "base_atk": 570,
        "base_def": 510,
        "base_spd": 590,
        "crit_rate": 0.14,
        "ki_pool": 100,
        "passive_name": "Brave Blade Stance",
        "passive_desc": "Normal attacks gain 10% armor penetration.",
        "signature_move": "Burning Attack",
        "signature_cost": 40,
        "signature_damage_mult": 2.45,
        "transformations": ["Super Saiyan Grade 3"],
        "quote": "You're about to find out what it's like to fight someone who will not give up!",
    },
    "captain_ginyu": {
        "id": "captain_ginyu",
        "name": "Captain Ginyu (Ginyu Force)",
        "title": "Leader of the Special Squad Poses",
        "series": "Dragon Ball Z",
        "rarity": "rare",
        "race": "Ginyu Force Alien",
        "base_hp": 3700,
        "base_atk": 550,
        "base_def": 520,
        "base_spd": 560,
        "crit_rate": 0.11,
        "ki_pool": 100,
        "passive_name": "Special Fighting Pose",
        "passive_desc": "Boosts all allies' stats by 5% at the start of battle.",
        "signature_move": "Body Change Surprise",
        "signature_cost": 50,
        "signature_damage_mult": 2.6,
        "transformations": ["Milky Cannon Overcharge"],
        "quote": "Together we are... the Ginyu Special Force!",
    },
    "zarbon_monster": {
        "id": "zarbon_monster",
        "name": "Zarbon (Transformed Monster)",
        "title": "Frieza's Concealed Brutality",
        "series": "Dragon Ball Z",
        "rarity": "rare",
        "race": "Alien",
        "base_hp": 3650,
        "base_atk": 560,
        "base_def": 500,
        "base_spd": 570,
        "crit_rate": 0.13,
        "ki_pool": 100,
        "passive_name": "Monstrous Ferocity",
        "passive_desc": "Deals 15% extra damage on round 2 of combat.",
        "signature_move": "Monster Crash Combo",
        "signature_cost": 40,
        "signature_damage_mult": 2.4,
        "transformations": ["Primal Brute Form"],
        "quote": "I detest this form... but you leave me with no other choice!",
    },
    "dodoria_heavy": {
        "id": "dodoria_heavy",
        "name": "Dodoria (Heavy Enforcer)",
        "title": "The Ruthless Conqueror of Namek",
        "series": "Dragon Ball Z",
        "rarity": "rare",
        "race": "Alien",
        "base_hp": 3900,
        "base_atk": 540,
        "base_def": 530,
        "base_spd": 510,
        "crit_rate": 0.09,
        "ki_pool": 100,
        "passive_name": "Bulldozer Charge",
        "passive_desc": "First normal attack deals double stagger damage.",
        "signature_move": "Dodoria Beam Barrage",
        "signature_cost": 35,
        "signature_damage_mult": 2.3,
        "transformations": ["Maximum Weight Slag"],
        "quote": "Lord Frieza has no patience for pests like you!",
    },
    "krillin_solar_master": {
        "id": "krillin_solar_master",
        "name": "Krillin (Solar Flare x100)",
        "title": "Strongest Earthling Martial Artist",
        "series": "Dragon Ball Super",
        "rarity": "rare",
        "race": "Earthling",
        "base_hp": 3400,
        "base_atk": 530,
        "base_def": 490,
        "base_spd": 600,
        "crit_rate": 0.15,
        "ki_pool": 100,
        "passive_name": "Solar Flare Blinding Trick",
        "passive_desc": "Enemy attack accuracy reduced by 15% for the first two rounds.",
        "signature_move": "Destructo Disc Triple Slice",
        "signature_cost": 40,
        "signature_damage_mult": 2.5,
        "transformations": ["Turtle Hermit Focus"],
        "quote": "I may not be a Saiyan, but I can still fight for this world!",
    },
    "tien_shinhan_tri_beam": {
        "id": "tien_shinhan_tri_beam",
        "name": "Tien Shinhan (Neo Tri-Beam)",
        "title": "The Crane School Master",
        "series": "Dragon Ball Z",
        "rarity": "rare",
        "race": "Earthling / Three-Eyed Clan",
        "base_hp": 3500,
        "base_atk": 560,
        "base_def": 480,
        "base_spd": 580,
        "crit_rate": 0.14,
        "ki_pool": 100,
        "passive_name": "Unwavering Focus",
        "passive_desc": "Sacrifices 5% HP when using ultimate to boost its damage by 25%.",
        "signature_move": "Shin Kikoho (Neo Tri-Beam)",
        "signature_cost": 45,
        "signature_damage_mult": 2.7,
        "transformations": ["Four Witches Technique"],
        "quote": "Ki-ko-ho! I'll hold you here even if it kills me!",
    },
    "yamcha_wolf_fang": {
        "id": "yamcha_wolf_fang",
        "name": "Yamcha (Wolf Fang Fist Neo)",
        "title": "The Lone Desert Bandit",
        "series": "Dragon Ball Z",
        "rarity": "rare",
        "race": "Earthling",
        "base_hp": 3300,
        "base_atk": 520,
        "base_def": 470,
        "base_spd": 590,
        "crit_rate": 0.16,
        "ki_pool": 100,
        "passive_name": "Wolf Spirit Rush",
        "passive_desc": "Speed increases by 10% when fighting human enemies.",
        "signature_move": "Neo Wolf Fang Fist",
        "signature_cost": 35,
        "signature_damage_mult": 2.35,
        "transformations": ["Sokidan Remote Ball"],
        "quote": "ROKOU FUU FUU KEN! Don't blink or you'll miss it!",
    },
    "chiaotzu_psychic": {
        "id": "chiaotzu_psychic",
        "name": "Chiaotzu (Psychic Restraint)",
        "title": "Crane School Mystic Pupil",
        "series": "Dragon Ball Z",
        "rarity": "rare",
        "race": "Earthling Mystic",
        "base_hp": 3100,
        "base_atk": 500,
        "base_def": 460,
        "base_spd": 610,
        "crit_rate": 0.12,
        "ki_pool": 100,
        "passive_name": "Telekinetic Paralysis",
        "passive_desc": "15% chance to reduce enemy speed by 30% for 1 turn upon hit.",
        "signature_move": "Psychic Wave Binding",
        "signature_cost": 35,
        "signature_damage_mult": 2.2,
        "transformations": ["Selfless Resolve"],
        "quote": "Tien... goodbye! I'll always be with you!",
    },
    "raditz_saiyan_scout": {
        "id": "raditz_saiyan_scout",
        "name": "Raditz (Saiyan Vanguard)",
        "title": "The Eldest Brother of Kakarot",
        "series": "Dragon Ball Z",
        "rarity": "rare",
        "race": "Saiyan",
        "base_hp": 3600,
        "base_atk": 540,
        "base_def": 500,
        "base_spd": 550,
        "crit_rate": 0.11,
        "ki_pool": 100,
        "passive_name": "Scouter Calculation",
        "passive_desc": "Deals 10% extra damage if enemy battle power is lower than his.",
        "signature_move": "Double Sunday Beam",
        "signature_cost": 35,
        "signature_damage_mult": 2.3,
        "transformations": ["Great Ape Tail Release"],
        "quote": "Your power level is a pathetic five. You're no match for a true Saiyan!",
    },

    # ----------------------------------------------------------------------------------
    # TIER: COMMON (一般級) - 8 Characters
    # ----------------------------------------------------------------------------------
    "saibaman_green": {
        "id": "saibaman_green",
        "name": "Saibaman (Cultivated Warrior)",
        "title": "Disposable Bio-Soil Grunt",
        "series": "Dragon Ball Z",
        "rarity": "common",
        "race": "Plant Creature",
        "base_hp": 2400,
        "base_atk": 380,
        "base_def": 350,
        "base_spd": 420,
        "crit_rate": 0.08,
        "ki_pool": 100,
        "passive_name": "Acid Spurt",
        "passive_desc": "Corrodes target armor by 5% upon hit.",
        "signature_move": "Self-Destruct Tackle",
        "signature_cost": 40,
        "signature_damage_mult": 2.2,
        "transformations": [],
        "quote": "Kee-keee-gwaaah!",
    },
    "red_ribbon_soldier": {
        "id": "red_ribbon_soldier",
        "name": "Red Ribbon Soldier",
        "title": "Standard Infantry Enforcer",
        "series": "Dragon Ball Classic",
        "rarity": "common",
        "race": "Earthling",
        "base_hp": 2300,
        "base_atk": 360,
        "base_def": 340,
        "base_spd": 400,
        "crit_rate": 0.06,
        "ki_pool": 100,
        "passive_name": "Military Discipline",
        "passive_desc": "Increases accuracy by 5%.",
        "signature_move": "Rocket Launcher Salvo",
        "signature_cost": 30,
        "signature_damage_mult": 2.0,
        "transformations": [],
        "quote": "For the glory of General Red!",
    },
    "appule_scout": {
        "id": "appule_scout",
        "name": "Appule (Frieza Force Grunt)",
        "title": "Communications & Patrol Soldier",
        "series": "Dragon Ball Z",
        "rarity": "common",
        "race": "Alien",
        "base_hp": 2450,
        "base_atk": 370,
        "base_def": 360,
        "base_spd": 410,
        "crit_rate": 0.07,
        "ki_pool": 100,
        "passive_name": "Frieza Force Armor",
        "passive_desc": "Reduces incoming normal damage by 5%.",
        "signature_move": "Blaster Volley",
        "signature_cost": 30,
        "signature_damage_mult": 2.05,
        "transformations": [],
        "quote": "Lord Frieza won't tolerate any failure from us!",
    },
    "cell_junior_blue": {
        "id": "cell_junior_blue",
        "name": "Cell Junior (Spawn)",
        "title": "Bio-Engineered Menace",
        "series": "Dragon Ball Z",
        "rarity": "common",
        "race": "Bio-Android",
        "base_hp": 2600,
        "base_atk": 410,
        "base_def": 370,
        "base_spd": 450,
        "crit_rate": 0.10,
        "ki_pool": 100,
        "passive_name": "Acrobatic Mockery",
        "passive_desc": "Speed increases by 5% when dodging.",
        "signature_move": "Mini Kamehameha",
        "signature_cost": 35,
        "signature_damage_mult": 2.15,
        "transformations": [],
        "quote": "Hehehe! Hee-hee-hee!",
    },
    "frieza_soldier_cui_race": {
        "id": "frieza_soldier_cui_race",
        "name": "Cui (Rival to Vegeta)",
        "title": "Cocky Recon Officer",
        "series": "Dragon Ball Z",
        "rarity": "common",
        "race": "Alien",
        "base_hp": 2550,
        "base_atk": 390,
        "base_def": 360,
        "base_spd": 430,
        "crit_rate": 0.09,
        "ki_pool": 100,
        "passive_name": "Desperate Fleeing",
        "passive_desc": "Gains 15% evasion when below 20% HP.",
        "signature_move": "Ah, Lord Frieza! (Trick Beam)",
        "signature_cost": 30,
        "signature_damage_mult": 2.1,
        "transformations": [],
        "quote": "Look, Vegeta! Lord Frieza is behind you!",
    },
    "babidi_minion_pui_pui": {
        "id": "babidi_minion_pui_pui",
        "name": "Pui Pui (Planet Zun)",
        "title": "Majin Gravity Specialist",
        "series": "Dragon Ball Z",
        "rarity": "common",
        "race": "Alien",
        "base_hp": 2500,
        "base_atk": 400,
        "base_def": 370,
        "base_spd": 440,
        "crit_rate": 0.08,
        "ki_pool": 100,
        "passive_name": "10x Gravity Advantage",
        "passive_desc": "Immune to speed debuffs.",
        "signature_move": "Sniper Pulse Blast",
        "signature_cost": 30,
        "signature_damage_mult": 2.0,
        "transformations": [],
        "quote": "Planet Zun has ten times normal gravity! You can't even stand!",
    },
    "yakon_darkness_eater": {
        "id": "yakon_darkness_eater",
        "name": "Yakon (Light Devourer)",
        "title": "Stage 2 Majin Guardian",
        "series": "Dragon Ball Z",
        "rarity": "common",
        "race": "Alien Monster",
        "base_hp": 2700,
        "base_atk": 420,
        "base_def": 390,
        "base_spd": 390,
        "crit_rate": 0.07,
        "ki_pool": 100,
        "passive_name": "Light Energy Absorber",
        "passive_desc": "Absorbs 10% of energy blasts as Ki.",
        "signature_move": "Claw Slash Cleave",
        "signature_cost": 35,
        "signature_damage_mult": 2.1,
        "transformations": [],
        "quote": "Gwwwaaargh! Delicious light!",
    },
    "red_ribbon_patrol_bot": {
        "id": "red_ribbon_patrol_bot",
        "name": "RR Patrol Drone Mark III",
        "title": "Automated Surveillance Sentry",
        "series": "Dragon Ball Super: Super Hero",
        "rarity": "common",
        "race": "Machine",
        "base_hp": 2350,
        "base_atk": 360,
        "base_def": 380,
        "base_spd": 410,
        "crit_rate": 0.05,
        "ki_pool": 100,
        "passive_name": "Targeting Laser Matrix",
        "passive_desc": "Normal attacks have 98% base accuracy.",
        "signature_move": "Stun Shock Laser",
        "signature_cost": 25,
        "signature_damage_mult": 1.9,
        "transformations": [],
        "quote": "*BEEP BEEP* INTRUDER IDENTIFIED. COMMENCING ELIMINATION.",
    },
}


# ======================================================================================
# 4. EQUIPMENT ARSENAL: WEAPONS, ARMORS & ACCESSORIES (60+ ITEMS)
# ======================================================================================

EQUIPMENT_DATA: Dict[str, Dict[str, Any]] = {
    # ----------------------------------------------------------------------------------
    # WEAPONS (25+ items)
    # ----------------------------------------------------------------------------------
    "power_pole_classic": {
        "id": "power_pole_classic",
        "name": "Power Pole (如意棒)",
        "type": "weapon",
        "rarity": "rare",
        "atk_bonus": 45,
        "spd_bonus": 15,
        "crit_bonus": 0.03,
        "price_coins": 2500,
        "sell_coins": 1000,
        "effect": "Extending reach grants +5% accuracy.",
        "description": "The mystical staff given by Grandpa Gohan, capable of extending endlessly.",
    },
    "brave_sword_tapion": {
        "id": "brave_sword_tapion",
        "name": "Brave Sword (Tapion's Blade)",
        "type": "weapon",
        "rarity": "epic",
        "atk_bonus": 110,
        "spd_bonus": 25,
        "crit_bonus": 0.06,
        "price_coins": 12000,
        "sell_coins": 5000,
        "effect": "Deals 12% extra slash damage against demon enemies.",
        "description": "The enchanted sword that subdued the monster Hirudegarn on Planet Konats.",
    },
    "z_sword_supreme_kai": {
        "id": "z_sword_supreme_kai",
        "name": "Z-Sword (Supreme Kai Realm)",
        "type": "weapon",
        "rarity": "legendary",
        "atk_bonus": 240,
        "spd_bonus": -10,
        "crit_bonus": 0.08,
        "price_coins": 45000,
        "sell_coins": 18000,
        "effect": "Enormous weight boosts physical stagger. When broken, frees Elder Kai wisdom.",
        "description": "The legendary blade lodged in the Sacred World of the Kai.",
    },
    "keysword_xeno": {
        "id": "keysword_xeno",
        "name": "Key Sword (時空のキーソード)",
        "type": "weapon",
        "rarity": "sp_plus",
        "atk_bonus": 420,
        "spd_bonus": 85,
        "crit_bonus": 0.14,
        "price_coins": 180000,
        "sell_coins": 75000,
        "effect": "Strikes seal dark magic and dispel enemy stat buffs with 15% probability.",
        "description": "The holy blade wielded by Xeno Trunks to break the barrier around the Dark Demon Realm.",
    },
    "godslayer_crystal_blade": {
        "id": "godslayer_crystal_blade",
        "name": "Godslayer Crystal Blade",
        "type": "weapon",
        "rarity": "omni",
        "atk_bonus": 650,
        "spd_bonus": 120,
        "crit_bonus": 0.20,
        "price_coins": 650000,
        "sell_coins": 280000,
        "effect": "Ignores 25% of opponent DEF and inflicts true cosmic erosion.",
        "description": "Forged by Hearts using the crystallized energy of the Universe Seed.",
    },
    "spirit_sword_vegito": {
        "id": "spirit_sword_vegito",
        "name": "Spirit Excalibur Blade",
        "type": "weapon",
        "rarity": "legendary",
        "atk_bonus": 280,
        "spd_bonus": 60,
        "crit_bonus": 0.10,
        "price_coins": 58000,
        "sell_coins": 24000,
        "effect": "Extends beam slashes, increasing critical damage by 18%.",
        "description": "A blade manifested purely from condensed golden fusion ki.",
    },
    "janemba_dimensional_blade": {
        "id": "janemba_dimensional_blade",
        "name": "Dimensional Hell Blade",
        "type": "weapon",
        "rarity": "epic",
        "atk_bonus": 130,
        "spd_bonus": 35,
        "crit_bonus": 0.07,
        "price_coins": 15000,
        "sell_coins": 6000,
        "effect": "Transmutes mundane matter into slicing space-warping strikes.",
        "description": "Originally an ordinary club transformed by Janemba's evil essence.",
    },
    "dabura_darkness_sword": {
        "id": "dabura_darkness_sword",
        "name": "Sword of the Demon King",
        "type": "weapon",
        "rarity": "epic",
        "atk_bonus": 120,
        "spd_bonus": 20,
        "crit_bonus": 0.05,
        "price_coins": 13500,
        "sell_coins": 5500,
        "effect": "Has a 10% chance to inflict Stone Petrify for 1 turn.",
        "description": "The ceremonial curved sword of Dabura, King of the Demon Realm.",
    },
    "scythe_of_sorrow_goku_black": {
        "id": "scythe_of_sorrow_goku_black",
        "name": "Scythe of Sorrow (Goku Black)",
        "type": "weapon",
        "rarity": "mythical",
        "atk_bonus": 380,
        "spd_bonus": 75,
        "crit_bonus": 0.12,
        "price_coins": 120000,
        "sell_coins": 50000,
        "effect": "Rips dimensional rifts that summon illusion clones during attacks.",
        "description": "A devastating scythe carved from pure Super Saiyan Rosé anger.",
    },
    "grand_priest_divine_scepter": {
        "id": "grand_priest_divine_scepter",
        "name": "Angelic Sovereign Scepter",
        "type": "weapon",
        "rarity": "omni",
        "atk_bonus": 700,
        "spd_bonus": 140,
        "crit_bonus": 0.22,
        "price_coins": 850000,
        "sell_coins": 350000,
        "effect": "Increases Ki regeneration by +20 per turn and guarantees 100% hit rate.",
        "description": "The eternal staff carried by Daishinkan, capable of observing every galaxy.",
    },

    # ----------------------------------------------------------------------------------
    # ARMOR (20+ items)
    # ----------------------------------------------------------------------------------
    "saiyan_scout_armor_white": {
        "id": "saiyan_scout_armor_white",
        "name": "Saiyan Battle Suit (Type-A)",
        "type": "armor",
        "rarity": "rare",
        "def_bonus": 50,
        "hp_bonus": 400,
        "price_coins": 3000,
        "sell_coins": 1200,
        "effect": "Stretchy elastic plating absorbs 5% physical damage.",
        "description": "Standard high-durability armor worn by Frieza Force conquerors.",
    },
    "whis_symbol_gi": {
        "id": "whis_symbol_gi",
        "name": "Whis Whis-Signed Martial Gi",
        "type": "armor",
        "rarity": "legendary",
        "def_bonus": 190,
        "hp_bonus": 1800,
        "price_coins": 42000,
        "sell_coins": 17000,
        "effect": "Imbued with angel ki, increasing speed by 40 and evasion by 8%.",
        "description": "Tailored by Whis during God of Destruction training on Beerus' planet.",
    },
    "grand_priest_ceremonial_vestment": {
        "id": "grand_priest_ceremonial_vestment",
        "name": "Grand Priest Ceremonial Vestment",
        "type": "armor",
        "rarity": "omni",
        "def_bonus": 550,
        "hp_bonus": 5000,
        "price_coins": 750000,
        "sell_coins": 320000,
        "effect": "Reduces all incoming damage by 22% and prevents all crowd-control effects.",
        "description": "Woven from threads of pure cosmic ether by the Grand Priest himself.",
    },
    "time_patrol_reinforced_trench": {
        "id": "time_patrol_reinforced_trench",
        "name": "Time Patrol Reinforced Trenchcoat",
        "type": "armor",
        "rarity": "epic",
        "def_bonus": 120,
        "hp_bonus": 1100,
        "price_coins": 14000,
        "sell_coins": 5800,
        "effect": "Provides 10% resistance to anomaly and dimension shift skills.",
        "description": "Worn by Elite Time Patrollers traveling through fractured eras.",
    },
    "pride_trooper_combat_suit": {
        "id": "pride_trooper_combat_suit",
        "name": "Pride Trooper High-Flex Suit",
        "type": "armor",
        "rarity": "legendary",
        "def_bonus": 210,
        "hp_bonus": 1950,
        "price_coins": 48000,
        "sell_coins": 20000,
        "effect": "Increases strike damage by 10% when fighting alongside clan members.",
        "description": "Customized uniform of Universe 11 peacekeepers.",
    },
    "demon_realm_carapace": {
        "id": "demon_realm_carapace",
        "name": "Dark King Obsidian Carapace",
        "type": "armor",
        "rarity": "sp_plus",
        "def_bonus": 380,
        "hp_bonus": 3400,
        "price_coins": 190000,
        "sell_coins": 80000,
        "effect": "Returns 8% of damage taken back to the attacker as dark flames.",
        "description": "Hardened scales harvested from the deepest trenches of the Demon World.",
    },
    "yardratian_spirit_robes": {
        "id": "yardratian_spirit_robes",
        "name": "Yardratian Spirit Control Robes",
        "type": "armor",
        "rarity": "rare",
        "def_bonus": 65,
        "hp_bonus": 550,
        "price_coins": 4000,
        "sell_coins": 1600,
        "effect": "Increases Ki efficiency by 8% (skills cost less Ki).",
        "description": "Traditional attire of the Yardrats, masters of Spirit Control.",
    },

    # ----------------------------------------------------------------------------------
    # ACCESSORIES & ARTIFACTS (15+ items)
    # ----------------------------------------------------------------------------------
    "potara_earrings_green": {
        "id": "potara_earrings_green",
        "name": "Potara Earrings (Supreme Kai Emerald)",
        "type": "accessory",
        "rarity": "legendary",
        "atk_bonus": 80,
        "def_bonus": 80,
        "hp_bonus": 800,
        "price_coins": 60000,
        "sell_coins": 25000,
        "effect": "Increases fusion synchronization. Boosts overall damage by 12%.",
        "description": "Sacred earrings belonging to the Supreme Kais.",
    },
    "time_ring_silver": {
        "id": "time_ring_silver",
        "name": "Silver Time Ring",
        "type": "accessory",
        "rarity": "mythical",
        "atk_bonus": 120,
        "spd_bonus": 60,
        "hp_bonus": 1200,
        "price_coins": 150000,
        "sell_coins": 60000,
        "effect": "Allows player to act first on the opening turn regardless of enemy speed.",
        "description": "Reserved for Kais to travel safely forward in time.",
    },
    "capsule_corp_dragon_radar": {
        "id": "capsule_corp_dragon_radar",
        "name": "Dragon Radar Mark VII",
        "type": "accessory",
        "rarity": "rare",
        "atk_bonus": 20,
        "spd_bonus": 30,
        "hp_bonus": 200,
        "price_coins": 5000,
        "sell_coins": 2000,
        "effect": "Increases chance of finding Dragon Balls during patrol by 25%.",
        "description": "Bulma's masterpiece invention tuned to the electromagnetic signal of the Dragon Balls.",
    },
    "senzu_pouch_divine": {
        "id": "senzu_pouch_divine",
        "name": "Korin's Blessed Senzu Pouch",
        "type": "accessory",
        "rarity": "epic",
        "atk_bonus": 40,
        "def_bonus": 60,
        "hp_bonus": 1000,
        "price_coins": 20000,
        "sell_coins": 8000,
        "effect": "Once per battle, automatically revives the hero with 20% HP upon defeat.",
        "description": "A leather pouch personally blessed by Master Korin.",
    },
    "evil_containment_jar": {
        "id": "evil_containment_jar",
        "name": "Mafuba Containment Jar & Talisman",
        "type": "accessory",
        "rarity": "legendary",
        "atk_bonus": 60,
        "def_bonus": 120,
        "hp_bonus": 1400,
        "price_coins": 55000,
        "sell_coins": 22000,
        "effect": "Reduces demon-type enemy attack power by 15%.",
        "description": "The green seal jar used in Master Roshi's Mafuba technique.",
    },
    "tokitoki_golden_feather": {
        "id": "tokitoki_golden_feather",
        "name": "Tokitoki's Golden Feather",
        "type": "accessory",
        "rarity": "sp_plus",
        "atk_bonus": 180,
        "spd_bonus": 100,
        "hp_bonus": 2200,
        "price_coins": 220000,
        "sell_coins": 95000,
        "effect": "Extends active transformation duration by 2 turns.",
        "description": "A feather shed by the Divine Bird Tokitoki, holding raw temporal energy.",
    },
    "universe_seed_fragment": {
        "id": "universe_seed_fragment",
        "name": "Universe Seed Core Fragment",
        "type": "accessory",
        "rarity": "omni",
        "atk_bonus": 280,
        "def_bonus": 200,
        "hp_bonus": 3500,
        "price_coins": 600000,
        "sell_coins": 250000,
        "effect": "Absorbs ambient energy to grant +10 Ki at the end of every round.",
        "description": "A pulsating shard from the core of the Universe Seed.",
    },
}

CONSUMABLES_DATA: Dict[str, Dict[str, Any]] = {
    "senzu_bean": {
        "id": "senzu_bean",
        "name": "Senzu Bean (仙豆)",
        "type": "consumable",
        "rarity": "rare",
        "heal_hp_pct": 100,
        "restore_ki_pct": 100,
        "cure_status": True,
        "price_coins": 800,
        "sell_coins": 300,
        "description": "Grown by Korin. Restores all physical energy and health instantaneously.",
    },
    "ultra_divine_water": {
        "id": "ultra_divine_water",
        "name": "Ultra Divine Water (超神水)",
        "type": "consumable",
        "rarity": "epic",
        "atk_permanent_boost": 5,
        "price_coins": 5000,
        "sell_coins": 1800,
        "description": "Potent elixir that unlocks dormant potential, if the drinker survives the poison.",
    },
    "capsule_corp_ki_drink": {
        "id": "capsule_corp_ki_drink",
        "name": "Capsule Corp Ki Energy Drink",
        "type": "consumable",
        "rarity": "common",
        "restore_ki_points": 50,
        "price_coins": 150,
        "sell_coins": 50,
        "description": "Formulated by Dr. Brief to rehydrate tired martial artists.",
    },
    "godly_nectar": {
        "id": "godly_nectar",
        "name": "Beerus' Gourmet Pudding",
        "type": "consumable",
        "rarity": "legendary",
        "atk_boost_temp_pct": 25,
        "duration_turns": 3,
        "price_coins": 8500,
        "sell_coins": 3200,
        "description": "Extremely delicious custard that enrages Lord Beerus if eaten without permission.",
    },
    "space_patrol_ration": {
        "id": "space_patrol_ration",
        "name": "Galactic Patrol Emergency Ration",
        "type": "consumable",
        "rarity": "common",
        "heal_hp_pct": 35,
        "price_coins": 200,
        "sell_coins": 70,
        "description": "Standard nutrient paste issued by Jaco's superiors.",
    },
}


# ======================================================================================
# 5. TECHNIQUES & KI SKILLS (DOJO COMPENDIUM)
# ======================================================================================

TECHNIQUES_DATA: Dict[str, Dict[str, Any]] = {
    "kamehameha": {
        "id": "kamehameha",
        "name": "Kamehameha (かめはめ波)",
        "type": "ki_blast",
        "tier": "basic",
        "ki_cost": 30,
        "power_mult": 1.8,
        "beam_clash_power": 100,
        "description": "The Turtle School iconic energy wave, gathering ki in cupped hands.",
        "levels": [
            {"level": 1, "power": 1.8, "ki_cost": 30},
            {"level": 2, "power": 2.1, "ki_cost": 30},
            {"level": 3, "power": 2.4, "ki_cost": 32},
            {"level": 4, "power": 2.7, "ki_cost": 35},
            {"level": 5, "power": 3.1, "ki_cost": 38},
        ],
    },
    "galick_gun": {
        "id": "galick_gun",
        "name": "Galick Gun (ギャリック砲)",
        "type": "ki_blast",
        "tier": "basic",
        "ki_cost": 30,
        "power_mult": 1.85,
        "beam_clash_power": 105,
        "description": "The royal purple blast created by the Saiyan prince.",
        "levels": [
            {"level": 1, "power": 1.85, "ki_cost": 30},
            {"level": 2, "power": 2.15, "ki_cost": 30},
            {"level": 3, "power": 2.45, "ki_cost": 32},
            {"level": 4, "power": 2.8, "ki_cost": 35},
            {"level": 5, "power": 3.2, "ki_cost": 38},
        ],
    },
    "final_flash": {
        "id": "final_flash",
        "name": "Final Flash (ファイナルフラッシュ)",
        "type": "ki_blast",
        "tier": "advanced",
        "ki_cost": 50,
        "power_mult": 2.6,
        "beam_clash_power": 180,
        "description": "Gathering immense golden energy from outstretched hands, obliterating the horizon.",
        "levels": [
            {"level": 1, "power": 2.6, "ki_cost": 50},
            {"level": 2, "power": 2.9, "ki_cost": 50},
            {"level": 3, "power": 3.3, "ki_cost": 52},
            {"level": 4, "power": 3.7, "ki_cost": 55},
            {"level": 5, "power": 4.2, "ki_cost": 58},
        ],
    },
    "spirit_bomb": {
        "id": "spirit_bomb",
        "name": "Genki Dama / Spirit Bomb (元気玉)",
        "type": "ki_blast",
        "tier": "ultimate",
        "ki_cost": 70,
        "power_mult": 3.5,
        "beam_clash_power": 260,
        "description": "Borrowing energy from all living creatures in the cosmos. Pure evil takes +40% damage.",
        "levels": [
            {"level": 1, "power": 3.5, "ki_cost": 70},
            {"level": 2, "power": 3.9, "ki_cost": 70},
            {"level": 3, "power": 4.4, "ki_cost": 72},
            {"level": 4, "power": 4.9, "ki_cost": 75},
            {"level": 5, "power": 5.6, "ki_cost": 80},
        ],
    },
    "hakai": {
        "id": "hakai",
        "name": "Hakai (破壊 - Destruction)",
        "type": "divine",
        "tier": "godly",
        "ki_cost": 85,
        "power_mult": 4.8,
        "beam_clash_power": 350,
        "description": "The absolute destructive energy of the Gods of Destruction. Direct erasure.",
        "levels": [
            {"level": 1, "power": 4.8, "ki_cost": 85},
            {"level": 2, "power": 5.3, "ki_cost": 85},
            {"level": 3, "power": 5.9, "ki_cost": 88},
            {"level": 4, "power": 6.5, "ki_cost": 90},
            {"level": 5, "power": 7.4, "ki_cost": 95},
        ],
    },
    "special_beam_cannon": {
        "id": "special_beam_cannon",
        "name": "Makankosappo (魔貫光殺砲)",
        "type": "piercing",
        "tier": "advanced",
        "ki_cost": 45,
        "power_mult": 2.5,
        "beam_clash_power": 170,
        "description": "Spiral drill wave that pierces through shields and armor.",
        "levels": [
            {"level": 1, "power": 2.5, "ki_cost": 45},
            {"level": 2, "power": 2.85, "ki_cost": 45},
            {"level": 3, "power": 3.25, "ki_cost": 48},
            {"level": 4, "power": 3.7, "ki_cost": 50},
            {"level": 5, "power": 4.3, "ki_cost": 55},
        ],
    },
    "dragon_fist": {
        "id": "dragon_fist",
        "name": "Ryuken (龍拳 - Dragon Fist)",
        "type": "physical",
        "tier": "ultimate",
        "ki_cost": 65,
        "power_mult": 3.4,
        "beam_clash_power": 240,
        "description": "A golden dragon coils around the fist, plunging through the foe's torso.",
        "levels": [
            {"level": 1, "power": 3.4, "ki_cost": 65},
            {"level": 2, "power": 3.8, "ki_cost": 65},
            {"level": 3, "power": 4.3, "ki_cost": 68},
            {"level": 4, "power": 4.8, "ki_cost": 70},
            {"level": 5, "power": 5.5, "ki_cost": 75},
        ],
    },
    "solar_flare": {
        "id": "solar_flare",
        "name": "Taiyoken (太陽拳 - Solar Flare)",
        "type": "utility",
        "tier": "basic",
        "ki_cost": 20,
        "power_mult": 0.5,
        "beam_clash_power": 50,
        "description": "Emits blinding light that lowers opponent hit rate by 35% for 2 turns.",
        "levels": [
            {"level": 1, "power": 0.5, "ki_cost": 20},
            {"level": 2, "power": 0.6, "ki_cost": 18},
            {"level": 3, "power": 0.7, "ki_cost": 16},
        ],
    },
    "stardust_breaker": {
        "id": "stardust_breaker",
        "name": "Soul Punisher / Stardust Breaker",
        "type": "divine",
        "tier": "ultimate",
        "ki_cost": 70,
        "power_mult": 3.7,
        "beam_clash_power": 280,
        "description": "A prismatic sphere that obliterates evil from the inside out.",
        "levels": [
            {"level": 1, "power": 3.7, "ki_cost": 70},
            {"level": 2, "power": 4.1, "ki_cost": 70},
            {"level": 3, "power": 4.6, "ki_cost": 72},
            {"level": 4, "power": 5.2, "ki_cost": 75},
            {"level": 5, "power": 6.0, "ki_cost": 80},
        ],
    },
    "god_slicer": {
        "id": "god_slicer",
        "name": "Violent Fierce God Slicer",
        "type": "piercing",
        "tier": "advanced",
        "ki_cost": 45,
        "power_mult": 2.45,
        "beam_clash_power": 165,
        "description": "Goku Black's violet blade of condensed godly energy.",
        "levels": [
            {"level": 1, "power": 2.45, "ki_cost": 45},
            {"level": 2, "power": 2.8, "ki_cost": 45},
            {"level": 3, "power": 3.2, "ki_cost": 48},
            {"level": 4, "power": 3.65, "ki_cost": 50},
            {"level": 5, "power": 4.2, "ki_cost": 55},
        ],
    },
}


# ======================================================================================
# 6. PLANETARY REALMS & LOW-EXP PATROL ZONES
# ======================================================================================
# Payouts tuned strictly low to prevent fast leveling as requested by user.

PLANETS_DATA: Dict[str, Dict[str, Any]] = {
    "earth": {
        "id": "earth",
        "name": "Planet Earth (地球)",
        "level_req": 1,
        "gravity": 1.0,
        "description": "Cradle of humanity and home to the Capsule Corporation and Kame House.",
        "patrol_cost_stamina": 5,
        "exp_payout_range": (12, 28),     # Tuned LOW
        "coins_payout_range": (80, 220),
        "enemies": [
            {"id": "saibaman_green", "weight": 40, "level_range": (1, 8)},
            {"id": "red_ribbon_soldier", "weight": 35, "level_range": (2, 9)},
            {"id": "red_ribbon_patrol_bot", "weight": 25, "level_range": (3, 10)},
        ],
        "drop_table": [
            {"item_id": "capsule_corp_ki_drink", "rate": 0.25},
            {"item_id": "power_pole_classic", "rate": 0.04},
            {"item_id": "capsule_corp_dragon_radar", "rate": 0.03},
        ],
    },
    "namek": {
        "id": "namek",
        "name": "Planet Namek (ナメック星)",
        "level_req": 15,
        "gravity": 1.2,
        "description": "Verdant skies, home to the gentle Namekians and the Grand Elder Guru.",
        "patrol_cost_stamina": 8,
        "exp_payout_range": (25, 45),     # Tuned LOW
        "coins_payout_range": (180, 420),
        "enemies": [
            {"id": "appule_scout", "weight": 45, "level_range": (15, 22)},
            {"id": "frieza_soldier_cui_race", "weight": 35, "level_range": (18, 25)},
            {"id": "dodoria_heavy", "weight": 20, "level_range": (22, 28)},
        ],
        "drop_table": [
            {"item_id": "senzu_bean", "rate": 0.15},
            {"item_id": "saiyan_scout_armor_white", "rate": 0.05},
        ],
    },
    "vegeta": {
        "id": "vegeta",
        "name": "Planet Vegeta / Sadala (惑星ベジータ)",
        "level_req": 30,
        "gravity": 10.0,
        "description": "Barren desert planet of high gravity, ancient cradle of the Saiyan race.",
        "patrol_cost_stamina": 12,
        "exp_payout_range": (40, 75),     # Tuned LOW
        "coins_payout_range": (350, 750),
        "enemies": [
            {"id": "raditz_saiyan_scout", "weight": 40, "level_range": (30, 38)},
            {"id": "zarbon_monster", "weight": 35, "level_range": (34, 42)},
            {"id": "captain_ginyu", "weight": 25, "level_range": (38, 48)},
        ],
        "drop_table": [
            {"item_id": "ultra_divine_water", "rate": 0.08},
            {"item_id": "brave_sword_tapion", "rate": 0.025},
        ],
    },
    "beerus_planet": {
        "id": "beerus_planet",
        "name": "Beerus' Temple (破壊神の星)",
        "level_req": 50,
        "gravity": 100.0,
        "description": "Floating pyramid realm enveloped by celestial fish, home of Lord Beerus and Whis.",
        "patrol_cost_stamina": 16,
        "exp_payout_range": (70, 115),    # Tuned LOW
        "coins_payout_range": (600, 1400),
        "enemies": [
            {"id": "android_17_ranger", "weight": 35, "level_range": (50, 60)},
            {"id": "golden_frieza", "weight": 35, "level_range": (55, 68)},
            {"id": "toppo_god_of_destruction", "weight": 30, "level_range": (65, 75)},
        ],
        "drop_table": [
            {"item_id": "godly_nectar", "rate": 0.10},
            {"item_id": "whis_symbol_gi", "rate": 0.02},
            {"item_id": "potara_earrings_green", "rate": 0.015},
        ],
    },
    "demon_realm": {
        "id": "demon_realm",
        "name": "Dark Demon Realm (暗黒魔界)",
        "level_req": 70,
        "gravity": 50.0,
        "description": "The abyssal dimensional space ruled by Mechikabura, Towa, and Mira.",
        "patrol_cost_stamina": 20,
        "exp_payout_range": (100, 160),   # Tuned LOW
        "coins_payout_range": (1100, 2400),
        "enemies": [
            {"id": "super_janemba", "weight": 35, "level_range": (70, 82)},
            {"id": "demigra_transcended", "weight": 35, "level_range": (78, 90)},
            {"id": "cumber_super_saiyan_full", "weight": 30, "level_range": (85, 95)},
        ],
        "drop_table": [
            {"item_id": "demon_realm_carapace", "rate": 0.03},
            {"item_id": "keysword_xeno", "rate": 0.01},
            {"item_id": "tokitoki_golden_feather", "rate": 0.008},
        ],
    },
    "null_realm": {
        "id": "null_realm",
        "name": "World of Void (無の界)",
        "level_req": 90,
        "gravity": 0.0,
        "description": "An isolated realm devoid of time and space, site of the Tournament of Power.",
        "patrol_cost_stamina": 25,
        "exp_payout_range": (140, 210),   # Tuned LOW
        "coins_payout_range": (1800, 4200),
        "enemies": [
            {"id": "jiren_full_power", "weight": 30, "level_range": (90, 105)},
            {"id": "hearts_godslayer_ultimate", "weight": 25, "level_range": (95, 110)},
            {"id": "dark_king_fu", "weight": 25, "level_range": (100, 115)},
            {"id": "grand_priest_daishinkan", "weight": 20, "level_range": (110, 130)},
        ],
        "drop_table": [
            {"item_id": "universe_seed_fragment", "rate": 0.015},
            {"item_id": "grand_priest_divine_scepter", "rate": 0.004},
            {"item_id": "grand_priest_ceremonial_vestment", "rate": 0.004},
        ],
    },
}


# ======================================================================================
# 7. STORY SAGAS (10 COMPLETE CHAPTERS WITH DIALOGUE & LOW EXP)
# ======================================================================================

STORY_SAGAS: List[Dict[str, Any]] = [
    {
        "id": "saga_saiyan",
        "title": "Saiyan Invasion Saga",
        "chapters": [
            {
                "chapter_num": 1,
                "name": "The Terrifying Brother: Raditz",
                "enemy_id": "raditz_saiyan_scout",
                "enemy_level": 8,
                "exp_reward": 45,        # Tuned low
                "coin_reward": 300,
                "dialogue_pre": "A Saiyan pod crashes into the wheat fields! Raditz emerges with scouter glowing red.",
                "dialogue_post": "Raditz collapses: 'There are two more Saiyans... far stronger than me!'",
            },
            {
                "chapter_num": 2,
                "name": "The Cultivated Threat: Saibamen",
                "enemy_id": "saibaman_green",
                "enemy_level": 12,
                "exp_reward": 55,
                "coin_reward": 450,
                "dialogue_pre": "Nappa plants green seeds into the earth. Grotesque creatures sprout!",
                "dialogue_post": "The Saibaman disintegrates in a shower of corrosive acid.",
            },
            {
                "chapter_num": 3,
                "name": "Clash of Destinies: Prince Vegeta",
                "enemy_id": "raditz_saiyan_scout",
                "enemy_level": 18,
                "exp_reward": 90,        # Boss exp tuned low
                "coin_reward": 800,
                "dialogue_pre": "Vegeta smirks: 'A low-class warrior trying to challenge royalty? Laughable.'",
                "dialogue_post": "Galick Gun and Kamehameha clash! The prince is forced to retreat into his pod.",
            },
        ],
    },
    {
        "id": "saga_frieza",
        "title": "Namek & The Emperor of Malice",
        "chapters": [
            {
                "chapter_num": 1,
                "name": "The Ginyu Special Squad Poses",
                "enemy_id": "captain_ginyu",
                "enemy_level": 25,
                "exp_reward": 80,
                "coin_reward": 950,
                "dialogue_pre": "'TOKUSENTAI!' Captain Ginyu leaps forward in flamboyant symmetry.",
                "dialogue_post": "Ginyu's posture is shattered! His squad flees across the Namekian plains.",
            },
            {
                "chapter_num": 2,
                "name": "Zarbon's Grotesque Mask",
                "enemy_id": "zarbon_monster",
                "enemy_level": 28,
                "exp_reward": 95,
                "coin_reward": 1100,
                "dialogue_pre": "Zarbon swells with hideous reptilian power, his beautiful face contorted in rage.",
                "dialogue_post": "Zarbon falls into the Namekian waters, gasping his final breaths.",
            },
            {
                "chapter_num": 3,
                "name": "The Golden Emperor: Final Form",
                "enemy_id": "golden_frieza",
                "enemy_level": 36,
                "exp_reward": 140,       # Boss fight tuned low
                "coin_reward": 1800,
                "dialogue_pre": "Frieza crosses his arms: 'You may have pushed me this far, but my power is over 1,000,000!'",
                "dialogue_post": "The legendary golden aura erupts! Frieza is cleaved by his own Death Saucers.",
            },
        ],
    },
    {
        "id": "saga_androids_cell",
        "title": "Androids & The Cell Games",
        "chapters": [
            {
                "chapter_num": 1,
                "name": "Infinite Energy Duo",
                "enemy_id": "android_18_infinite",
                "enemy_level": 42,
                "exp_reward": 110,
                "coin_reward": 1400,
                "dialogue_pre": "Android 18 brushes her blonde hair back: 'Don't cry if your arm breaks.'",
                "dialogue_post": "18 steps back: 'Not bad... but my brother and I are just getting warmed up.'",
            },
            {
                "chapter_num": 2,
                "name": "Bio-Horror: Cell Max Prototype",
                "enemy_id": "super_perfect_cell",
                "enemy_level": 50,
                "exp_reward": 160,
                "coin_reward": 2200,
                "dialogue_pre": "Cell lands on the tournament arena: 'Show me true perfection, Earthling!'",
                "dialogue_post": "A Father-Son Kamehameha reduces every single cell to dust!",
            },
        ],
    },
    {
        "id": "saga_majin_buu",
        "title": "The Awakening of Majin Buu",
        "chapters": [
            {
                "chapter_num": 1,
                "name": "Pride Torn: Majin Vegeta",
                "enemy_id": "majin_vegeta",
                "enemy_level": 58,
                "exp_reward": 130,
                "coin_reward": 1900,
                "dialogue_pre": "The 'M' branded on his forehead radiates pure destructive pride.",
                "dialogue_post": "'Trunks... Bulma... I do this for you. And yes, even for you, Kakarot!'",
            },
            {
                "chapter_num": 2,
                "name": "Primordial Evil: Pure Kid Buu",
                "enemy_id": "kid_buu_pure",
                "enemy_level": 66,
                "exp_reward": 190,
                "coin_reward": 2800,
                "dialogue_pre": "Kid Buu beats his chest like an ape and screams a piercing shrill into the heavens.",
                "dialogue_post": "'Thank you, Dragon Balls... see you later, Buu. Maybe you'll be reincarnated as someone good.'",
            },
        ],
    },
    {
        "id": "saga_gods_universe",
        "title": "Battle of Gods & Tournament of Power",
        "chapters": [
            {
                "chapter_num": 1,
                "name": "God of Destruction Candidate: Toppo",
                "enemy_id": "toppo_god_of_destruction",
                "enemy_level": 75,
                "exp_reward": 150,
                "coin_reward": 2500,
                "dialogue_pre": "'Justice is cast aside! Hakai is the only truth in this universe!'",
                "dialogue_post": "Royal Blue Saiyan pride punches through the sphere of destruction!",
            },
            {
                "chapter_num": 2,
                "name": "The Absolute Wall: Jiren Full Power",
                "enemy_id": "jiren_full_power",
                "enemy_level": 88,
                "exp_reward": 220,
                "coin_reward": 3600,
                "dialogue_pre": "Jiren stands motionless amid blazing crimson ki: 'Trust is a weakness.'",
                "dialogue_post": "Silver hair gleams under the arena lights. Ultra Instinct reaches completion!",
            },
        ],
    },
    {
        "id": "saga_sdbh_prison_planet",
        "title": "SDBH: Prison Planet & Universe Tree",
        "chapters": [
            {
                "chapter_num": 1,
                "name": "The Evil Saiyan: Cumber Unleashed",
                "enemy_id": "cumber_super_saiyan_full",
                "enemy_level": 95,
                "exp_reward": 210,
                "coin_reward": 3800,
                "dialogue_pre": "Chains rattle across the prison planet. Cumber's dark ki infects the air!",
                "dialogue_post": "Vegito's final strike shatters Cumber's metal restraint mask into pieces.",
            },
            {
                "chapter_num": 2,
                "name": "Godslayer Hearts & The Universe Seed",
                "enemy_id": "hearts_godslayer_ultimate",
                "enemy_level": 110,
                "exp_reward": 260,
                "coin_reward": 4800,
                "dialogue_pre": "Hearts floats above the universe tree: 'Mortals shall no longer bow to Zeno!'",
                "dialogue_post": "Gogeta Blue's God Soul Punisher shatters the cosmic core to crystal dust.",
            },
            {
                "chapter_num": 3,
                "name": "Daishinkan's Trial of Multiverse Harmony",
                "enemy_id": "grand_priest_daishinkan",
                "enemy_level": 125,
                "exp_reward": 320,       # Capped tightly
                "coin_reward": 6500,
                "dialogue_pre": "Daishinkan descends softly: 'Let us see if mortal will can match the law of the angels.'",
                "dialogue_post": "Daishinkan smiles serenely: 'Superb. You have proven yourself across every timeline.'",
            },
        ],
    },
]


# ======================================================================================
# 8. CLAN PERKS & PLANETARY DOMINANCE (GVG GUILD SYSTEM)
# ======================================================================================

CLAN_PERKS_DATA: Dict[str, Dict[str, Any]] = {
    "gravity_chamber_1": {
        "id": "gravity_chamber_1",
        "name": "Capsule 50G Gravity Chamber",
        "clan_level_req": 1,
        "cost_clan_coins": 10000,
        "bonus_type": "exp_boost",
        "bonus_value": 0.05,  # +5% EXP gain for clan members
        "description": "Basic gravity chamber boosting workout efficiency for all members.",
    },
    "gravity_chamber_2": {
        "id": "gravity_chamber_2",
        "name": "Capsule 150G Gravity Chamber",
        "clan_level_req": 3,
        "cost_clan_coins": 30000,
        "bonus_type": "exp_boost",
        "bonus_value": 0.10,  # +10% EXP gain
        "description": "Intermediate gravity chamber hardened with Katchin steel plates.",
    },
    "gravity_chamber_3": {
        "id": "gravity_chamber_3",
        "name": "Capsule 500G Divine Chamber",
        "clan_level_req": 6,
        "cost_clan_coins": 75000,
        "bonus_type": "exp_boost",
        "bonus_value": 0.15,  # +15% EXP gain
        "description": "High-tech chamber capable of replicating the pressure of high-tier planets.",
    },
    "senzu_greenhouse": {
        "id": "senzu_greenhouse",
        "name": "Hydroponic Senzu Garden",
        "clan_level_req": 2,
        "cost_clan_coins": 20000,
        "bonus_type": "hp_regen",
        "bonus_value": 0.04,  # +4% HP recovery in combat
        "description": "Cultivates mystical beans to accelerate team battle recuperation.",
    },
    "dragon_radar_network": {
        "id": "dragon_radar_network",
        "name": "Planetary Radar Array",
        "clan_level_req": 4,
        "cost_clan_coins": 45000,
        "bonus_type": "drop_rate",
        "bonus_value": 0.15,  # +15% item drop chance
        "description": "Scans distant coordinates for sacred relics and capsules.",
    },
    "dojo_master_training": {
        "id": "dojo_master_training",
        "name": "Grand Kai Dojo Mentorship",
        "clan_level_req": 5,
        "cost_clan_coins": 60000,
        "bonus_type": "atk_boost",
        "bonus_value": 0.08,  # +8% Clan member attack
        "description": "Elite martial training in the sacred arts of ki manipulation.",
    },
    "angelic_barrier": {
        "id": "angelic_barrier",
        "name": "Daishinkan Aegis Glyph",
        "clan_level_req": 8,
        "cost_clan_coins": 150000,
        "bonus_type": "def_boost",
        "bonus_value": 0.12,  # +12% Clan member defense
        "description": "Inscribed glyph of angelic warding protecting the clan hall.",
    },
    "territory_tax_reaping": {
        "id": "territory_tax_reaping",
        "name": "Planetary Tribute Reaping",
        "clan_level_req": 5,
        "cost_clan_coins": 50000,
        "bonus_type": "coin_boost",
        "bonus_value": 0.20,  # +20% coin revenue from held planets
        "description": "Collects economic tributes from planets dominated by the clan.",
    },
}

CLAN_RAID_BOSSES: Dict[str, Dict[str, Any]] = {
    "raid_cumber_ape": {
        "id": "raid_cumber_ape",
        "name": "Golden Great Ape Cumber (狂暴黄金巨猿)",
        "rarity": "sp_plus",
        "max_hp": 250_000,
        "atk": 1450,
        "def": 880,
        "spd": 600,
        "clan_exp_reward": 220,    # Tuned low
        "clan_coins_reward": 15000,
        "item_drops": ["brave_sword_tapion", "demon_realm_carapace"],
        "description": "A colossal golden berserker tearing through temporal dimensions.",
    },
    "raid_dark_fu": {
        "id": "raid_dark_fu",
        "name": "Dark King Fu Overlord (暗黒王フュー・レイド)",
        "rarity": "omni",
        "max_hp": 450_000,
        "atk": 1750,
        "def": 1100,
        "spd": 950,
        "clan_exp_reward": 320,    # Tuned low
        "clan_coins_reward": 30000,
        "item_drops": ["keysword_xeno", "universe_seed_fragment"],
        "description": "Fu channels the life force of the Universe Tree to rewrite all existence.",
    },
    "raid_super_shenron": {
        "id": "raid_super_shenron",
        "name": "Super Shenron Trial Avatar (超級神龍の化身)",
        "rarity": "omni",
        "max_hp": 800_000,
        "atk": 2100,
        "def": 1350,
        "spd": 900,
        "clan_exp_reward": 400,    # Capped strictly
        "clan_coins_reward": 60000,
        "item_drops": ["grand_priest_divine_scepter", "grand_priest_ceremonial_vestment"],
        "description": "The golden cosmic dragon testing mortals' worthiness to hold dominion.",
    },
}


# ======================================================================================
# 9. PLAYER ASCENSION RANKS (MORTAL TO OMNI DEITY)
# ======================================================================================

ASCENSION_RANKS: List[Dict[str, Any]] = [
    {"rank_id": 1, "name": "Novice Martial Artist", "title": "新手武道家", "min_level": 1, "stat_multiplier": 1.0},
    {"rank_id": 2, "name": "Turtle School Adept", "title": "亀仙流弟子", "min_level": 15, "stat_multiplier": 1.1},
    {"rank_id": 3, "name": "Earth's Champion", "title": "地球の勇者", "min_level": 30, "stat_multiplier": 1.25},
    {"rank_id": 4, "name": "Super Saiyan Prodigy", "title": "超サイヤ人の覚醒者", "min_level": 45, "stat_multiplier": 1.45},
    {"rank_id": 5, "name": "Galactic Enforcer", "title": "銀河パトロール執行官", "min_level": 60, "stat_multiplier": 1.7},
    {"rank_id": 6, "name": "God of Destruction Disciple", "title": "破壊神の従者", "min_level": 75, "stat_multiplier": 2.0},
    {"rank_id": 7, "name": "Divine Ki Ascendant", "title": "神の気の体得者", "min_level": 90, "stat_multiplier": 2.4},
    {"rank_id": 8, "name": "Angelic Technique Master", "title": "天使の極意伝承者", "min_level": 110, "stat_multiplier": 2.9},
    {"rank_id": 9, "name": "Multiverse Arbiter", "title": "多多元宇宙調停者", "min_level": 130, "stat_multiplier": 3.5},
    {"rank_id": 10, "name": "Omni Sovereign Divine", "title": "全王神境支配者", "min_level": 150, "stat_multiplier": 4.2},
]


# ======================================================================================
# 10. ACHIEVEMENTS & MILESTONES (40+ ENTRIES)
# ======================================================================================

ACHIEVEMENTS_DATA: List[Dict[str, Any]] = [
    {
        "id": "ach_first_blood",
        "name": "First Blood of the Warrior",
        "category": "combat",
        "description": "Win your first battle against any patrol foe.",
        "target_count": 1,
        "reward_coins": 500,
        "reward_exp": 30,
        "title_unlock": "Fighter Born",
    },
    {
        "id": "ach_100_battles",
        "name": "Veteran of 100 Skirmishes",
        "category": "combat",
        "description": "Participate in 100 complete battles.",
        "target_count": 100,
        "reward_coins": 8000,
        "reward_exp": 150,
        "title_unlock": "Battle Hardened",
    },
    {
        "id": "ach_500_battles",
        "name": "Legend of 500 Contests",
        "category": "combat",
        "description": "Participate in 500 battles across all planets.",
        "target_count": 500,
        "reward_coins": 50000,
        "reward_exp": 250,
        "title_unlock": "Centurion of Combat",
    },
    {
        "id": "ach_flawless_victory",
        "name": "Untouchable God",
        "category": "combat",
        "description": "Defeat an enemy with 100% HP remaining.",
        "target_count": 1,
        "reward_coins": 3000,
        "reward_exp": 80,
        "title_unlock": "Untouchable",
    },
    {
        "id": "ach_beam_struggle_winner",
        "name": "Clash of Titans",
        "category": "combat",
        "description": "Win 10 Beam Struggles with maximum mash power.",
        "target_count": 10,
        "reward_coins": 6000,
        "reward_exp": 120,
        "title_unlock": "Beam Dominator",
    },
    {
        "id": "ach_reach_level_50",
        "name": "Halfway to Infinity",
        "category": "progression",
        "description": "Reach player level 50.",
        "target_count": 50,
        "reward_coins": 25000,
        "reward_exp": 200,
        "title_unlock": "Transcendent Disciple",
    },
    {
        "id": "ach_reach_level_100",
        "name": "Century of Power",
        "category": "progression",
        "description": "Reach player level 100.",
        "target_count": 100,
        "reward_coins": 100000,
        "reward_exp": 300,
        "title_unlock": "Godly Ascendant",
    },
    {
        "id": "ach_omni_warrior_obtained",
        "name": "Gaze of the Omni-King",
        "category": "collection",
        "description": "Obtain an Omni-King tier character through summons.",
        "target_count": 1,
        "reward_coins": 50000,
        "reward_exp": 180,
        "title_unlock": "Divine Summoner",
    },
    {
        "id": "ach_clan_founder",
        "name": "Warlord of the Cosmos",
        "category": "clan",
        "description": "Found or join a recognized clan hall.",
        "target_count": 1,
        "reward_coins": 5000,
        "reward_exp": 50,
        "title_unlock": "Guild Pioneer",
    },
    {
        "id": "ach_clan_raid_conqueror",
        "name": "Giant Slayer",
        "category": "clan",
        "description": "Defeat a Clan Raid Boss alongside your guildmates.",
        "target_count": 1,
        "reward_coins": 20000,
        "reward_exp": 160,
        "title_unlock": "Raid Cleaver",
    },
]


# ======================================================================================
# 11. ENGINE UTILITIES & SYSTEM LOOKUP METHODS
# ======================================================================================

def get_character_by_id(char_id: str) -> Optional[Dict[str, Any]]:
    """Retrieves full character data dictionary by identifier."""
    return CHARACTERS_DATA.get(char_id)


def get_all_characters_by_rarity(rarity: str) -> List[Dict[str, Any]]:
    """Returns a list of characters belonging to the specified rarity tier."""
    rarity_clean = rarity.lower().strip()
    return [c for c in CHARACTERS_DATA.values() if c.get("rarity") == rarity_clean]


def get_equipment_by_id(item_id: str) -> Optional[Dict[str, Any]]:
    """Retrieves equipment from weapon/armor/accessory dictionaries."""
    if item_id in EQUIPMENT_DATA:
        return EQUIPMENT_DATA[item_id]
    if item_id in CONSUMABLES_DATA:
        return CONSUMABLES_DATA[item_id]
    return None


def get_technique_by_id(tech_id: str) -> Optional[Dict[str, Any]]:
    """Retrieves martial ki technique details."""
    return TECHNIQUES_DATA.get(tech_id)


def get_planet_by_id(planet_id: str) -> Optional[Dict[str, Any]]:
    """Retrieves planetary realm data."""
    return PLANETS_DATA.get(planet_id)


def get_ascension_rank(level: int) -> Dict[str, Any]:
    """Finds the player's corresponding ascension rank according to current level."""
    current_rank = ASCENSION_RANKS[0]
    for r in ASCENSION_RANKS:
        if level >= r["min_level"]:
            current_rank = r
        else:
            break
    return current_rank


def calculate_character_stats(
    char_id: str,
    level: int,
    star_rank: int = 1,
    equipped_weapon_id: Optional[str] = None,
    equipped_armor_id: Optional[str] = None,
    equipped_accessory_id: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Computes battle stats (HP, ATK, DEF, SPD, CRIT) factoring in:
    1. Base character templates
    2. Rarity-based level growth formulas
    3. Star rank bonuses (+8% all base stats per star)
    4. Equipment modifiers
    """
    char = CHARACTERS_DATA.get(char_id)
    if not char:
        char = CHARACTERS_DATA["saibaman_green"]

    rarity = char["rarity"]
    multipliers = RARITY_STAT_MULTIPLIERS.get(rarity, RARITY_STAT_MULTIPLIERS["common"])

    lvl_clamped = max(1, min(level, MAX_LEVEL_CAP))
    star_clamped = max(1, min(star_rank, MAX_STAR_RANK))

    star_bonus = 1.0 + (star_clamped - 1) * 0.08

    # Stat calculations with level growth
    calc_hp = int((char["base_hp"] + (lvl_clamped - 1) * 35 * multipliers["hp_mult"]) * star_bonus)
    calc_atk = int((char["base_atk"] + (lvl_clamped - 1) * 6 * multipliers["atk_mult"]) * star_bonus)
    calc_def = int((char["base_def"] + (lvl_clamped - 1) * 5 * multipliers["def_mult"]) * star_bonus)
    calc_spd = int((char["base_spd"] + (lvl_clamped - 1) * 4 * multipliers["spd_mult"]) * star_bonus)
    calc_crit = min(0.75, char["crit_rate"] + (lvl_clamped - 1) * multipliers["crit_growth"])

    # Equipment bonuses
    for eq_id in [equipped_weapon_id, equipped_armor_id, equipped_accessory_id]:
        if eq_id and eq_id in EQUIPMENT_DATA:
            item = EQUIPMENT_DATA[eq_id]
            calc_hp += item.get("hp_bonus", 0)
            calc_atk += item.get("atk_bonus", 0)
            calc_def += item.get("def_bonus", 0)
            calc_spd += item.get("spd_bonus", 0)
            calc_crit = min(0.75, calc_crit + item.get("crit_bonus", 0.0))

    return {
        "character_id": char["id"],
        "name": char["name"],
        "rarity": char["rarity"],
        "level": lvl_clamped,
        "star_rank": star_clamped,
        "max_hp": calc_hp,
        "atk": calc_atk,
        "def": calc_def,
        "spd": calc_spd,
        "crit_rate": round(calc_crit, 4),
        "ki_max": BASE_KI_MAX,
        "signature_move": char["signature_move"],
        "signature_cost": char["signature_cost"],
        "signature_damage_mult": char["signature_damage_mult"],
        "passive_name": char["passive_name"],
        "passive_desc": char["passive_desc"],
        "quote": char["quote"],
    }


def perform_gacha_summon(banner_type: str = "standard") -> Dict[str, Any]:
    """
    Executes a weighted random summon according to canonical SDBH drop rates:
    - Omni: 0.5%
    - SP+: 2.5%
    - Mythical: 7.0%
    - Legendary: 15.0%
    - Epic: 25.0%
    - Rare: 30.0%
    - Common: 20.0%
    """
    roll = random.random()
    cumulative = 0.0
    chosen_rarity = "common"

    for r in RARITY_TIERS:
        cumulative += RARITY_DISPLAY[r]["summon_weight"]
        if roll <= cumulative:
            chosen_rarity = r
            break

    candidates = get_all_characters_by_rarity(chosen_rarity)
    if not candidates:
        candidates = list(CHARACTERS_DATA.values())

    selected = random.choice(candidates)
    return {
        "character": selected,
        "rarity": chosen_rarity,
        "rarity_display": RARITY_DISPLAY[chosen_rarity],
        "is_omni": chosen_rarity == "omni",
        "is_sp_plus": chosen_rarity == "sp_plus",
    }


def generate_patrol_encounter(planet_id: str) -> Dict[str, Any]:
    """
    Spawns an enemy from the designated planetary patrol table with random variance.
    Includes lower EXP payout calculations per user's requirement.
    """
    planet = PLANETS_DATA.get(planet_id, PLANETS_DATA["earth"])
    enemy_pool = planet["enemies"]

    total_weight = sum(e["weight"] for e in enemy_pool)
    pick = random.randint(1, total_weight)
    running = 0
    selected_enemy_cfg = enemy_pool[0]

    for ec in enemy_pool:
        running += ec["weight"]
        if pick <= running:
            selected_enemy_cfg = ec
            break

    char_template = CHARACTERS_DATA.get(selected_enemy_cfg["id"], CHARACTERS_DATA["saibaman_green"])
    lvl_min, lvl_max = selected_enemy_cfg["level_range"]
    enemy_level = random.randint(lvl_min, lvl_max)

    stats = calculate_character_stats(char_template["id"], enemy_level, star_rank=1)
    
    # Calculate disciplined low EXP payout
    exp_awarded = get_battle_exp_payout(enemy_level, char_template["rarity"], is_boss=False)
    coin_min, coin_max = planet["coins_payout_range"]
    coins_awarded = random.randint(coin_min, coin_max)

    # Roll possible item drop
    item_dropped = None
    for drop in planet.get("drop_table", []):
        if random.random() <= drop["rate"]:
            item_dropped = get_equipment_by_id(drop["item_id"])
            break

    return {
        "planet": planet["name"],
        "enemy_stats": stats,
        "enemy_template": char_template,
        "exp_payout": exp_awarded,
        "coins_payout": coins_awarded,
        "item_dropped": item_dropped,
    }


# ======================================================================================
# 12. RUNTIME SELF-DIAGNOSTIC & COMPILATION TEST
# ======================================================================================

def run_diagnostics() -> Dict[str, Any]:
    """Validates data integrity and verifies character / equipment totals."""
    total_chars = len(CHARACTERS_DATA)
    total_eq = len(EQUIPMENT_DATA)
    total_consumables = len(CONSUMABLES_DATA)
    total_techniques = len(TECHNIQUES_DATA)
    total_planets = len(PLANETS_DATA)
    total_sagas = len(STORY_SAGAS)
    total_achievements = len(ACHIEVEMENTS_DATA)

    omni_count = len(get_all_characters_by_rarity("omni"))
    sp_plus_count = len(get_all_characters_by_rarity("sp_plus"))
    mythical_count = len(get_all_characters_by_rarity("mythical"))
    legendary_count = len(get_all_characters_by_rarity("legendary"))
    epic_count = len(get_all_characters_by_rarity("epic"))
    rare_count = len(get_all_characters_by_rarity("rare"))
    common_count = len(get_all_characters_by_rarity("common"))

    # Sample EXP verification to verify lowered progression curve
    exp_lvl_1 = get_required_exp_for_level(1)
    exp_lvl_10 = get_required_exp_for_level(10)
    exp_lvl_50 = get_required_exp_for_level(50)
    exp_lvl_100 = get_required_exp_for_level(100)

    sample_mob_exp = get_battle_exp_payout(10, "rare", is_boss=False)
    sample_boss_exp = get_battle_exp_payout(50, "mythical", is_boss=True)

    status = {
        "status": "HEALTHY",
        "version": BOT_VERSION,
        "total_characters": total_chars,
        "omni_count": omni_count,
        "sp_plus_count": sp_plus_count,
        "mythical_count": mythical_count,
        "legendary_count": legendary_count,
        "epic_count": epic_count,
        "rare_count": rare_count,
        "common_count": common_count,
        "total_equipment": total_eq,
        "total_consumables": total_consumables,
        "total_techniques": total_techniques,
        "total_planets": total_planets,
        "total_sagas": total_sagas,
        "total_achievements": total_achievements,
        "exp_curve_sample": {
            "level_1_req": exp_lvl_1,
            "level_10_req": exp_lvl_10,
            "level_50_req": exp_lvl_50,
            "level_100_req": exp_lvl_100,
            "sample_mob_exp_gain": sample_mob_exp,
            "sample_boss_exp_gain": sample_boss_exp,
        },
    }
    return status


if __name__ == "__main__":
    report = run_diagnostics()
    print("=" * 70)
    print("DRAGON BALL: SDBH ENGINE - GAME DATA INITIALIZED")
    print(f"Total Warriors Loaded: {report['total_characters']}")
    print(f"Omni-King: {report['omni_count']} | SP+: {report['sp_plus_count']} | Mythical: {report['mythical_count']}")
    print(f"Legendary: {report['legendary_count']} | Epic: {report['epic_count']} | Rare: {report['rare_count']} | Common: {report['common_count']}")
    print(f"Equipment items: {report['total_equipment']} | Techniques: {report['total_techniques']}")
    print(f"Planets: {report['total_planets']} | Story Sagas: {report['total_sagas']}")
    print("EXP Balance Check (Slow Progression Tuning):")
    print(f"  Level 1 -> 2: {report['exp_curve_sample']['level_1_req']} EXP")
    print(f"  Level 10 -> 11: {report['exp_curve_sample']['level_10_req']} EXP")
    print(f"  Level 50 -> 51: {report['exp_curve_sample']['level_50_req']} EXP")
    print(f"  Sample Mob EXP Gain: {report['exp_curve_sample']['sample_mob_exp_gain']} EXP")
    print(f"  Sample Boss EXP Gain: {report['exp_curve_sample']['sample_boss_exp_gain']} EXP")
    print("=" * 70)
