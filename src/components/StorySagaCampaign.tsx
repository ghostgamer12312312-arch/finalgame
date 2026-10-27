import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { STORY_SAGAS, StorySaga, StoryStage } from '../logic/storySagas';
import { simulateFullBattle } from '../logic/combatEngine';
import { BattleLogEntry, CharacterItem } from '../types/game';
import { BookOpen, Star, Trophy, Sparkles, ChevronRight, Swords, Shield, AlertTriangle, CheckCircle2, Play } from 'lucide-react';
import confetti from 'canvas-confetti';

export const StorySagaCampaign: React.FC = () => {
  const { player, characters, equipWarrior, rewardPlayer, addEquipment } = useGame();
  const [selectedSaga, setSelectedSaga] = useState<StorySaga>(STORY_SAGAS[0]);
  const [activeStage, setActiveStage] = useState<StoryStage | null>(null);
  const [clearedStages, setClearedStages] = useState<Record<string, boolean>>({});
  const [battleReport, setBattleReport] = useState<{
    stage: StoryStage;
    won: boolean;
    logs: BattleLogEntry[];
    playerHpLeft: number;
  } | null>(null);
  const [isFighting, setIsFighting] = useState(false);

  // Active equipped warrior
  const equippedChar: CharacterItem =
    characters.find(c => c.name === player.equippedChar) || characters[0];

  const handleStartBattle = (stage: StoryStage) => {
    setActiveStage(stage);
    setIsFighting(true);
    setBattleReport(null);

    // Simulate multi-round Dragon Ball combat
    setTimeout(() => {
      const outcome = simulateFullBattle(
        equippedChar,
        {
          weapon: player.weapon ? { name: player.weapon, kind: 'weapon', statBonus: 150, description: '', tier: 'Epic' } : null,
          armor: player.armor ? { name: player.armor, kind: 'armor', statBonus: 300, description: '', tier: 'Epic' } : null,
        },
        player.rank * 10,
        {
          name: stage.enemyName,
          hp: stage.enemyHp,
          dmg: stage.enemyDmg,
          speed: stage.enemySpeed,
        }
      );

      const isFirstClear = !clearedStages[stage.id];

      if (outcome.victory) {
        setClearedStages(prev => ({ ...prev, [stage.id]: true }));
        rewardPlayer({
          yens: stage.rewardYens,
          gems: stage.rewardGems,
          crystals: stage.rewardCrystals,
          tickets: stage.rewardTickets,
          exp: Math.floor(stage.rewardYens / 4),
        });

        if (isFirstClear && stage.firstClearReward) {
          if (stage.firstClearReward.type === 'weapon' || stage.firstClearReward.type === 'armor') {
            addEquipment({
              name: stage.firstClearReward.name,
              kind: stage.firstClearReward.type,
              statBonus: stage.firstClearReward.type === 'weapon' ? 350 : 650,
              description: stage.firstClearReward.details,
              tier: 'Mythical',
            });
          }
        }
        confetti({ particleCount: 80, spread: 75 });
      }

      setBattleReport({
        stage,
        won: outcome.victory,
        logs: outcome.rounds,
        playerHpLeft: outcome.playerHpRemaining,
      });
      setIsFighting(false);
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Campaign Banner Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-amber-950/60 to-slate-900 border border-amber-500/30 p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Multiverse Chronicles & Canonical Sagas</span>
            </div>
            <h2 className="text-2xl font-black font-heading text-white mt-1">
              Dragon Ball Epic Story Campaign
            </h2>
            <p className="text-xs text-slate-400 max-w-xl">
              Relive iconic conflicts from the Saiyan Invasion, Namek Tyranny, Cell Games, Majin Awakening, God of Destruction arrival, and SDBH Space-Time War! Earn exclusive divine relics and Dragon Balls.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 p-3 rounded-xl text-xs">
            <Shield className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-slate-400 text-[10px] uppercase font-bold">Current Vanguard</div>
              <div className="font-heading font-bold text-slate-200">
                {equippedChar ? equippedChar.name : 'No warrior'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Saga Selector Carousel */}
      <div className="overflow-x-auto scrollbar-none pb-2">
        <div className="flex items-center gap-3 min-w-max">
          {STORY_SAGAS.map(saga => {
            const isSelected = selectedSaga.id === saga.id;
            const completedCount = saga.stages.filter(s => clearedStages[s.id]).length;
            const totalCount = saga.stages.length;

            return (
              <button
                key={saga.id}
                onClick={() => {
                  setSelectedSaga(saga);
                  setBattleReport(null);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                }`}
              >
                <span className="text-2xl">{saga.icon}</span>
                <div className="text-left">
                  <div className="text-[10px] uppercase font-bold text-amber-400/90">{saga.era}</div>
                  <div className="text-xs font-bold font-heading">{saga.title}</div>
                  <div className="text-[10px] text-slate-400">
                    {completedCount} / {totalCount} Stages Cleared
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Saga Details & Stages */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Stages List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-amber-400 font-heading">{selectedSaga.era}</span>
              <h3 className="text-lg font-black font-heading text-white">{selectedSaga.title}</h3>
              <p className="text-xs text-slate-400">{selectedSaga.description}</p>
            </div>
          </div>

          <div className="space-y-3">
            {selectedSaga.stages.map((stage, idx) => {
              const isCleared = clearedStages[stage.id];
              const isLevelMet = player.rank * 10 >= stage.reqLevel;

              return (
                <div
                  key={stage.id}
                  className={`p-4 rounded-xl border transition ${
                    isCleared
                      ? 'bg-slate-900/80 border-emerald-500/30'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-amber-400 font-bold">
                          STAGE {stage.stageNumber}
                        </span>
                        {isCleared && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                            <CheckCircle2 className="w-3 h-3" /> Cleared
                          </span>
                        )}
                        {!isLevelMet && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                            <AlertTriangle className="w-3 h-3" /> Req Lv.{stage.reqLevel}
                          </span>
                        )}
                      </div>
                      <h4 className="font-heading font-bold text-sm text-slate-100">{stage.name}</h4>
                      <p className="text-xs text-slate-400">
                        Opponent: <b className="text-rose-400">{stage.enemyName}</b> (HP: {stage.enemyHp.toLocaleString()} | DMG: {stage.enemyDmg.toLocaleString()})
                      </p>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => handleStartBattle(stage)}
                        disabled={isFighting || !isLevelMet}
                        className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-heading transition cursor-pointer ${
                          isFighting
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : isCleared
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                            : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                        }`}
                      >
                        <Swords className="w-3.5 h-3.5" />
                        <span>{isFighting ? 'Battling...' : isCleared ? 'Replay' : 'Fight'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Stage Rewards Info */}
                  <div className="mt-3 pt-3 border-t border-slate-850 flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                    <span>💴 {stage.rewardYens.toLocaleString()} Yens</span>
                    <span>💎 {stage.rewardGems.toLocaleString()} Gems</span>
                    <span>🔮 {stage.rewardCrystals} Crystals</span>
                    <span>🎫 {stage.rewardTickets} Tickets</span>
                    {stage.firstClearReward && !isCleared && (
                      <span className="text-amber-400 font-semibold flex items-center gap-1 ml-auto">
                        <Sparkles className="w-3 h-3" /> First Clear: {stage.firstClearReward.name}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Battle Logs & Narrative Dialogue */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold font-heading text-amber-400 uppercase">
              <Swords className="w-4 h-4" />
              <span>Combat Scouter & Dialogue</span>
            </div>

            {battleReport ? (
              <div className="space-y-4">
                <div
                  className={`p-3 rounded-xl border text-xs font-bold ${
                    battleReport.won
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                  }`}
                >
                  <div className="text-sm font-heading">
                    {battleReport.won ? '🏆 STAGE VICTORY!' : '💀 STAGE DEFEAT!'}
                  </div>
                  <div className="text-[11px] font-normal mt-1">
                    {battleReport.won
                      ? battleReport.stage.victoryDialogue
                      : 'Your warrior was pushed beyond stamina limits! Level up or chew a Senzu Bean!'}
                  </div>
                </div>

                <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1 text-xs">
                  <div className="text-[11px] text-slate-400 font-mono">
                    "{battleReport.stage.introDialogue}"
                  </div>
                  {battleReport.logs.map((log, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-slate-950 border border-slate-850 text-[11px] font-mono text-slate-300"
                    >
                      <div className="text-amber-400/90 font-bold mb-0.5">Round {log.round}</div>
                      <div>{log.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-500 space-y-2">
                <Play className="w-8 h-8 mx-auto text-slate-700" />
                <p>Select any campaign stage to engage the enemy in battle!</p>
                <p className="text-[11px] text-slate-600">
                  Ensure your champion is properly equipped with weapons and armors before entering high-level sagas.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
