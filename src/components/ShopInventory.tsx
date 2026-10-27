import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { SHOP_ITEMS, EQUIPMENT, WEAPONS_CATALOG, ARMORS_CATALOG } from '../data/gameData';
import { ShopItem } from '../types/game';
import { ShoppingBag, Swords, Shield, Key, Sparkles, Check, Package, Coins, Gem, Heart, Flame } from 'lucide-react';

export const ShopInventory: React.FC = () => {
  const { player, inventory, buyShopItem, equipItem, healPlayer } = useGame();
  const [activeTab, setActiveTab] = useState<'shop' | 'inventory'>('shop');
  const [selectedCategory, setSelectedCategory] = useState<number>(1);
  const [buyMultiplier, setBuyMultiplier] = useState<number>(1);
  const [feedback, setFeedback] = useState<string | null>(null);

  const shopCategories = [
    { id: 1, label: '1. Armours', kind: 'armor', icon: Shield },
    { id: 2, label: '2. Weapons', kind: 'weapon', icon: Swords },
    { id: 3, label: '3. Crystals', kind: 'crystal', icon: Sparkles },
    { id: 4, label: '4. Healing & Senzu', kind: 'heal', icon: Heart },
    { id: 5, label: '5. Fusion Materials', kind: 'fusion', icon: Flame },
    { id: 6, label: '6. Tickets & Keys', kind: 'keys', icon: Key },
  ];

  const handleBuy = (item: ShopItem) => {
    const res = buyShopItem(item.id, buyMultiplier);
    setFeedback(res.message);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleEquip = (itemName: string) => {
    const res = equipItem(itemName);
    setFeedback(res.message);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleUseHeal = (itemName: 'Senzu Bean' | 'Mega Potion' | 'Potion' | 'Revive') => {
    const res = healPlayer(itemName);
    setFeedback(res.message);
    setTimeout(() => setFeedback(null), 3500);
  };

  const filteredShop = SHOP_ITEMS.filter(item => {
    if (selectedCategory === 1) return item.kind === 'armor';
    if (selectedCategory === 2) return item.kind === 'weapon';
    if (selectedCategory === 3) return item.kind === 'crystal';
    if (selectedCategory === 4) return item.kind === 'heal';
    if (selectedCategory === 5) return item.kind === 'fusion';
    if (selectedCategory === 6) return item.kind === 'ticket' || item.kind === 'key_elite' || item.kind === 'key_boss';
    return true;
  });

  const ownedItems = Object.entries(inventory).filter(([, qty]) => qty > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border border-slate-800">
        <div>
          <h2 className="text-2xl font-black font-heading text-white">
            Marketplace & Equipment Armory
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            6 specialized departments featuring Dragon Ball weapons, deity armors, Senzu Beans, fusion catalysts, and keys.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800">
          <button
            onClick={() => setActiveTab('shop')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'shop'
                ? "bg-amber-500 text-slate-950 shadow-md font-black"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Marketplace</span>
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'inventory'
                ? "bg-amber-500 text-slate-950 shadow-md font-black"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Bag ({ownedItems.length})</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-indigo-300 text-xs font-semibold">
          {feedback}
        </div>
      )}

      {/* SHOP VIEW WITH 6 SPECIFIC OPTIONS */}
      {activeTab === 'shop' && (
        <div className="space-y-5">
          {/* 6 Categories Toolbar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {shopCategories.map(cat => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition cursor-pointer ${
                    isSelected
                      ? "bg-amber-500/20 border-amber-400 text-amber-300 shadow-md"
                      : "bg-slate-900/80 hover:bg-slate-850 border-slate-800 text-slate-400"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? "text-amber-400" : "text-slate-500"}`} />
                  <span className="text-xs font-bold font-heading truncate">{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Bulk Purchase Multiplier Toolbar */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-400 font-semibold">
              Select Purchase Multiplier:
            </span>
            <div className="flex items-center gap-1.5">
              {[1, 5, 10, 50, 100].map(qty => (
                <button
                  key={qty}
                  onClick={() => setBuyMultiplier(qty)}
                  className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                    buyMultiplier === qty
                      ? "bg-amber-500 text-slate-950 font-black shadow-sm"
                      : "bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800"
                  }`}
                >
                  {qty}x
                </button>
              ))}
            </div>
          </div>

          {/* Shop Item Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredShop.map(item => {
              const ownedCount = inventory[item.name] || 0;
              const isWeapon = item.kind === 'weapon';
              const isArmor = item.kind === 'armor';
              const isEquipped = (isWeapon && player.weapon === item.name) || (isArmor && player.armor === item.name);
              const totalCost = item.price * buyMultiplier;
              const canAfford = player[item.currency] >= totalCost;

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800 uppercase">
                        {item.kind.replace('_', ' ')}
                      </span>
                      {ownedCount > 0 && (
                        <span className="text-[10px] font-semibold text-emerald-400">
                          Owned: {ownedCount}
                        </span>
                      )}
                    </div>

                    <h3 className="font-heading font-black text-base text-white mt-2 leading-tight">
                      {item.name}
                    </h3>

                    <p className="text-xs text-slate-400 mt-1 min-h-[32px] line-clamp-2">
                      {item.description}
                    </p>

                    <div className="mt-3 flex items-center gap-1.5 font-bold text-xs">
                      {item.currency === 'yens' ? (
                        <Coins className="w-3.5 h-3.5 text-yellow-400" />
                      ) : (
                        <Gem className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                      <span className={item.currency === 'yens' ? "text-yellow-300" : "text-emerald-300"}>
                        {totalCost.toLocaleString()} {item.currency.toUpperCase()}
                      </span>
                      {buyMultiplier > 1 && (
                        <span className="text-slate-500 text-[10px]">({buyMultiplier}x)</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2">
                    <button
                      onClick={() => handleBuy(item)}
                      disabled={!canAfford}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                        canAfford
                          ? "bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-sm"
                          : "bg-slate-950 text-slate-600 border border-slate-850 cursor-not-allowed"
                      }`}
                    >
                      Buy {buyMultiplier}x
                    </button>

                    {(isWeapon || isArmor) && ownedCount > 0 && (
                      <button
                        onClick={() => handleEquip(item.name)}
                        disabled={isEquipped}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                          isEquipped
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-500/40 cursor-default"
                            : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer"
                        }`}
                      >
                        {isEquipped ? "Worn" : "Equip"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* INVENTORY / BAG VIEW */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          {ownedItems.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-500 text-sm">
              Your bag is empty. Explore planets or visit the shop to acquire items.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
              {ownedItems.map(([name, qty]) => {
                const equipData = EQUIPMENT[name];
                const isEquipped = equipData && ((equipData[0] === 'weapon' && player.weapon === name) || (equipData[0] === 'armor' && player.armor === name));
                const isHeal = name === 'Senzu Bean' || name === 'Mega Potion' || name === 'Potion' || name === 'Revive';

                return (
                  <div
                    key={name}
                    className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-400 font-heading">
                          x{qty}
                        </span>
                        {isEquipped && (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                            EQUIPPED
                          </span>
                        )}
                      </div>

                      <h4 className="font-heading font-black text-base text-white mt-1.5">
                        {name}
                      </h4>

                      {equipData && (
                        <div className="mt-1 text-xs text-slate-400">
                          {equipData[0] === 'weapon' ? `+${equipData[1]} ATK` : `+${equipData[1] * 2} HP`}
                        </div>
                      )}

                      {isHeal && (
                        <div className="mt-1 text-xs text-emerald-400">
                          {name === 'Senzu Bean' ? "Restores 100% full health!" : name === 'Revive' ? "Restores 80% health" : name === 'Mega Potion' ? "Restores 60% health" : "Restores 30% health"}
                        </div>
                      )}
                    </div>

                    <div className="mt-3">
                      {equipData && (
                        <button
                          onClick={() => handleEquip(name)}
                          disabled={isEquipped}
                          className={`w-full py-1.5 text-xs font-bold rounded-lg transition ${
                            isEquipped
                              ? "bg-slate-950 text-slate-600 cursor-default"
                              : "bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 cursor-pointer"
                          }`}
                        >
                          {isEquipped ? "Currently Worn" : "Equip"}
                        </button>
                      )}

                      {isHeal && (
                        <button
                          onClick={() => handleUseHeal(name as any)}
                          className="w-full py-1.5 text-xs font-bold rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition cursor-pointer"
                        >
                          Consume / Heal Now
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
