// Character, Boss, NPC, and Raid Boss Visual Artwork & Sprite Configuration

export interface ArtworkData {
  name: string;
  avatarUrl: string;
  bannerUrl?: string;
  auraColor: string;
  glowClass: string;
  spriteColor: string;
  hairColor: string;
  energyColor: string;
  category: 'warrior' | 'boss' | 'npc' | 'summon' | 'raid';
  quote: string;
}

export const ARTWORK_REGISTRY: Record<string, ArtworkData> = {
  "Grand Priest (Daishinkan)": {
    name: "Grand Priest (Daishinkan)",
    avatarUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=80",
    auraColor: "#38bdf8",
    glowClass: "shadow-cyan-400/80 ring-cyan-400",
    spriteColor: "#0284c7",
    hairColor: "#e0f2fe",
    energyColor: "#38bdf8",
    category: "warrior",
    quote: "All multiverses reside beneath the sovereign will of Lord Zeno."
  },
  "Omni King Absolute Zeno Supreme": {
    name: "Omni King Absolute Zeno Supreme",
    avatarUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80",
    auraColor: "#06b6d4",
    glowClass: "shadow-cyan-300 ring-cyan-300",
    spriteColor: "#06b6d4",
    hairColor: "#f0fdf4",
    energyColor: "#67e8f9",
    category: "warrior",
    quote: "Squish! Everything is gone now!"
  },
  "Ultra Instinct Goku": {
    name: "Ultra Instinct Goku",
    avatarUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80",
    auraColor: "#e2e8f0",
    glowClass: "shadow-slate-100 ring-slate-200",
    spriteColor: "#e2e8f0",
    hairColor: "#f8fafc",
    energyColor: "#93c5fd",
    category: "warrior",
    quote: "My body is moving on its own... this is Ultra Instinct!"
  },
  "Ultra Ego Vegeta": {
    name: "Ultra Ego Vegeta",
    avatarUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80",
    auraColor: "#c084fc",
    glowClass: "shadow-purple-500 ring-purple-400",
    spriteColor: "#9333ea",
    hairColor: "#581c87",
    energyColor: "#c084fc",
    category: "warrior",
    quote: "Damage is the fuel that burns within my destruction soul!"
  },
  "Gohan Beast": {
    name: "Gohan Beast",
    avatarUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?w=500&auto=format&fit=crop&q=80",
    auraColor: "#f43f5e",
    glowClass: "shadow-rose-500 ring-rose-400",
    spriteColor: "#e11d48",
    hairColor: "#f1f5f9",
    energyColor: "#fb7185",
    category: "warrior",
    quote: "It is my turn now... Makankosappo!"
  },
  "Beerus": {
    name: "Beerus",
    avatarUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=80",
    auraColor: "#a855f7",
    glowClass: "shadow-purple-500/80 ring-purple-500",
    spriteColor: "#7e22ce",
    hairColor: "#581c87",
    energyColor: "#d946ef",
    category: "boss",
    quote: "Before creation... comes destruction!"
  },
  "Whis": {
    name: "Whis",
    avatarUrl: "https://images.unsplash.com/photo-1507499739999-097706ad8914?w=500&auto=format&fit=crop&q=80",
    auraColor: "#38bdf8",
    glowClass: "shadow-cyan-400 ring-cyan-300",
    spriteColor: "#0284c7",
    hairColor: "#ffffff",
    energyColor: "#7dd3fc",
    category: "warrior",
    quote: "Oh my, you are still thinking before you strike."
  },
  "Golden Frieza": {
    name: "Golden Frieza",
    avatarUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80",
    auraColor: "#eab308",
    glowClass: "shadow-yellow-500 ring-yellow-400",
    spriteColor: "#ca8a04",
    hairColor: "#a855f7",
    energyColor: "#fde047",
    category: "boss",
    quote: "Shall we call this... Golden Frieza?"
  },
  "Black Frieza": {
    name: "Black Frieza",
    avatarUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=500&auto=format&fit=crop&q=80",
    auraColor: "#1e1b4b",
    glowClass: "shadow-indigo-900 ring-purple-600",
    spriteColor: "#0f172a",
    hairColor: "#312e81",
    energyColor: "#a855f7",
    category: "warrior",
    quote: "Ten years in a Room of Spirit and Time have birthed my darkest form."
  },
  "Vegito Blue (SSGSS)": {
    name: "Vegito Blue (SSGSS)",
    avatarUrl: "https://images.unsplash.com/photo-1569701814234-97992cbbe48a?w=500&auto=format&fit=crop&q=80",
    auraColor: "#0ea5e9",
    glowClass: "shadow-sky-400 ring-sky-400",
    spriteColor: "#0284c7",
    hairColor: "#38bdf8",
    energyColor: "#38bdf8",
    category: "warrior",
    quote: "This is the ultimate combination! Final Kamehameha!"
  },
  "Super Saiyan 4 Gogeta": {
    name: "Super Saiyan 4 Gogeta",
    avatarUrl: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=500&auto=format&fit=crop&q=80",
    auraColor: "#dc2626",
    glowClass: "shadow-red-500 ring-red-400",
    spriteColor: "#b91c1c",
    hairColor: "#dc2626",
    energyColor: "#fbbf24",
    category: "warrior",
    quote: "Every second you waste is another 100x Big Bang Kamehameha!"
  },
  "Frieza (Final Form 100%)": {
    name: "Frieza (Final Form 100%)",
    avatarUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80",
    auraColor: "#a855f7",
    glowClass: "shadow-purple-500 ring-purple-400",
    spriteColor: "#7e22ce",
    hairColor: "#a855f7",
    energyColor: "#d946ef",
    category: "boss",
    quote: "You will die by my hand, filthy Saiyan monkey!"
  },
  "Perfect Cell": {
    name: "Perfect Cell",
    avatarUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80",
    auraColor: "#22c55e",
    glowClass: "shadow-emerald-500 ring-emerald-400",
    spriteColor: "#15803d",
    hairColor: "#14532d",
    energyColor: "#4ade80",
    category: "boss",
    quote: "Perfection has finally arrived in this mortal universe."
  },
  "Majin Buu (Pure Evil / Kid Buu)": {
    name: "Majin Buu (Pure Evil / Kid Buu)",
    avatarUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?w=500&auto=format&fit=crop&q=80",
    auraColor: "#ec4899",
    glowClass: "shadow-pink-500 ring-pink-400",
    spriteColor: "#db2777",
    hairColor: "#f472b6",
    energyColor: "#f472b6",
    category: "boss",
    quote: "Hehehe! *Pounds chest in manic destruction*"
  },
  "Jiren (Full Power)": {
    name: "Jiren (Full Power)",
    avatarUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80",
    auraColor: "#ef4444",
    glowClass: "shadow-red-500 ring-red-500",
    spriteColor: "#b91c1c",
    hairColor: "#9ca3af",
    energyColor: "#f87171",
    category: "boss",
    quote: "Strength is absolute. Trust is an illusion."
  },
  "Jiren: Beyond Limits": {
    name: "Jiren: Beyond Limits",
    avatarUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80",
    auraColor: "#ef4444",
    glowClass: "shadow-red-500 ring-red-500",
    spriteColor: "#b91c1c",
    hairColor: "#9ca3af",
    energyColor: "#f87171",
    category: "summon",
    quote: "My heat will incinerate every warrior in this arena!"
  },
  "Elite Ginyu Force": {
    name: "Elite Ginyu Force",
    avatarUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=80",
    auraColor: "#eab308",
    glowClass: "shadow-yellow-500 ring-amber-400",
    spriteColor: "#854d0e",
    hairColor: "#ca8a04",
    energyColor: "#fde047",
    category: "summon",
    quote: "Special Pose! Tokusentai! Change now!"
  },
  "Mythical Perfect Cell": {
    name: "Mythical Perfect Cell",
    avatarUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80",
    auraColor: "#10b981",
    glowClass: "shadow-emerald-500 ring-emerald-400",
    spriteColor: "#047857",
    hairColor: "#065f46",
    energyColor: "#34d399",
    category: "summon",
    quote: "Not even a single cell of mine can be extinguished!"
  },
  "God of Destruction": {
    name: "God of Destruction",
    avatarUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=80",
    auraColor: "#a855f7",
    glowClass: "shadow-purple-500 ring-purple-400",
    spriteColor: "#7e22ce",
    hairColor: "#581c87",
    energyColor: "#c084fc",
    category: "summon",
    quote: "Hakai! Disappear into stardust."
  },
  "Multiverse Omega Dragon": {
    name: "Multiverse Omega Dragon",
    avatarUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80",
    auraColor: "#6366f1",
    glowClass: "shadow-indigo-500 ring-indigo-400",
    spriteColor: "#4338ca",
    hairColor: "#312e81",
    energyColor: "#818cf8",
    category: "raid",
    quote: "The negative karma of 18 universes shall swallow all reality!"
  },
  "Saibaman": {
    name: "Saibaman",
    avatarUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=500&auto=format&fit=crop&q=80",
    auraColor: "#84cc16",
    glowClass: "shadow-lime-500 ring-lime-400",
    spriteColor: "#4d7c0f",
    hairColor: "#65a30d",
    energyColor: "#bef264",
    category: "npc",
    quote: "Ki-ki-ki! *Hisses acidic venom*"
  },
  "Frieza Soldier": {
    name: "Frieza Soldier",
    avatarUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=80",
    auraColor: "#0ea5e9",
    glowClass: "shadow-sky-500 ring-sky-400",
    spriteColor: "#0369a1",
    hairColor: "#0284c7",
    energyColor: "#38bdf8",
    category: "npc",
    quote: "Surrender by order of Lord Frieza's planetary armada!"
  },
  "Red Ribbon Soldier": {
    name: "Red Ribbon Soldier",
    avatarUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80",
    auraColor: "#ef4444",
    glowClass: "shadow-red-500 ring-red-400",
    spriteColor: "#b91c1c",
    hairColor: "#991b1b",
    energyColor: "#f87171",
    category: "npc",
    quote: "All hail the Red Ribbon Army! Fire rockets!"
  },
  "Cell Junior": {
    name: "Cell Junior",
    avatarUrl: "https://images.unsplash.com/photo-1569701814234-97992cbbe48a?w=500&auto=format&fit=crop&q=80",
    auraColor: "#3b82f6",
    glowClass: "shadow-blue-500 ring-blue-400",
    spriteColor: "#1d4ed8",
    hairColor: "#1e40af",
    energyColor: "#60a5fa",
    category: "npc",
    quote: "Ehehehe! Kamehameha!"
  },
  "Appule": {
    name: "Appule",
    avatarUrl: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=500&auto=format&fit=crop&q=80",
    auraColor: "#d946ef",
    glowClass: "shadow-fuchsia-500 ring-fuchsia-400",
    spriteColor: "#a21caf",
    hairColor: "#86198f",
    energyColor: "#e879f9",
    category: "npc",
    quote: "Checking scouter power levels... danger detected!"
  },
  "Mr. Satan (World Champ)": {
    name: "Mr. Satan (World Champ)",
    avatarUrl: "https://images.unsplash.com/photo-1507499739999-097706ad8914?w=500&auto=format&fit=crop&q=80",
    auraColor: "#f59e0b",
    glowClass: "shadow-amber-500 ring-amber-400",
    spriteColor: "#b45309",
    hairColor: "#1c1917",
    energyColor: "#fbbf24",
    category: "warrior",
    quote: "Dynamite Kick! Earth's people, raise your hands for Goku!"
  }
};

export function getArtwork(name: string, defaultCategory: ArtworkData['category'] = 'warrior'): ArtworkData {
  if (ARTWORK_REGISTRY[name]) {
    return ARTWORK_REGISTRY[name];
  }
  const hash = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const hues = ['#ef4444', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];
  const hairColors = ['#fde047', '#000000', '#dc2626', '#38bdf8', '#c084fc', '#f8fafc'];
  const hue = hues[hash % hues.length];
  const hair = hairColors[hash % hairColors.length];

  return {
    name,
    avatarUrl: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=500&auto=format&fit=crop&q=80",
    auraColor: hue,
    glowClass: 'shadow-amber-500/50 ring-amber-400',
    spriteColor: hue,
    hairColor: hair,
    energyColor: hue,
    category: defaultCategory,
    quote: "Let us fight with honor across all realms!"
  };
}
