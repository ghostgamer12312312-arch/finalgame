import React, { useRef, useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { getArtwork, ArtworkData } from '../data/characterArtwork';
import {
  Swords,
  Skull,
  Zap,
  Flame,
  Volume2,
  VolumeX,
  X,
  Trophy,
  Crosshair,
  Sparkles,
} from 'lucide-react';

interface ArenaCombatModalProps {
  isOpen: boolean;
  onClose: () => void;
  enemyName: string;
  isBoss: boolean;
  bossHpMax?: number;
  bossAtkVal?: number;
  onVictory: (rewards: string[]) => void;
  onDefeat: () => void;
}

interface Projectile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  isPlayer: boolean;
  damage: number;
  isBeam?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
}

interface FloatingText {
  id: number;
  text: string;
  x: number;
  y: number;
  alpha: number;
  color: string;
  isCrit?: boolean;
}

class SoundFX {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  constructor() {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    } catch {
      // Audio not supported
    }
  }

  private initCtx() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playKiBlast() {
    if (!this.enabled || !this.ctx) return;
    this.initCtx();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.16);
    } catch {
      // ignore
    }
  }

  public playHit() {
    if (!this.enabled || !this.ctx) return;
    this.initCtx();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.13);
    } catch {
      // ignore
    }
  }

  public playKamehameha() {
    if (!this.enabled || !this.ctx) return;
    this.initCtx();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(300, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(1200, this.ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.45);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.46);
    } catch {
      // ignore
    }
  }
}

const sfx = new SoundFX();

export const ArenaCombatModal: React.FC<ArenaCombatModalProps> = ({
  isOpen,
  onClose,
  enemyName,
  isBoss,
  bossHpMax = 50000,
  bossAtkVal = 650,
  onVictory,
  onDefeat,
}) => {
  const { player, stats } = useGame();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [soundOn, setSoundOn] = useState(true);
  const [playerHp, setPlayerHp] = useState<number>(player.currentHp || stats.hp);
  const [playerMaxHp] = useState<number>(stats.hp);
  const [playerKi, setPlayerKi] = useState<number>(100);
  const [bossHp, setBossHp] = useState<number>(bossHpMax);
  const [combatOutcome, setCombatOutcome] = useState<'playing' | 'victory' | 'defeat'>('playing');
  const [rewardList, setRewardList] = useState<string[]>([]);

  const enemyArtwork: ArtworkData = getArtwork(enemyName, isBoss ? 'boss' : 'npc');
  const playerArtwork: ArtworkData = getArtwork(player.equippedChar || 'Ultra Instinct Goku', 'warrior');

  const joystickBaseRef = useRef<HTMLDivElement | null>(null);
  const [joystickActive, setJoystickActive] = useState(false);
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });

  const keysPressed = useRef<Record<string, boolean>>({});

  const playerState = useRef({
    x: 120,
    y: 190,
    radius: 20,
    speed: 4.5,
    aimAngle: 0,
    dashCooldown: 0,
  });

  const bossState = useRef({
    x: 480,
    y: 190,
    radius: 32,
    vx: 1.2,
    vy: 1.5,
    attackTimer: 0,
  });

  const projectiles = useRef<Projectile[]>([]);
  const particles = useRef<Particle[]>([]);
  const floatingTexts = useRef<FloatingText[]>([]);
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPlayerHp(player.currentHp || stats.hp);
      setPlayerKi(100);
      setBossHp(bossHpMax);
      setCombatOutcome('playing');
      setRewardList([]);

      playerState.current.x = 100;
      playerState.current.y = 190;
      bossState.current.x = 480;
      bossState.current.y = 190;
      projectiles.current = [];
      particles.current = [];
      floatingTexts.current = [];
    }
  }, [isOpen, enemyName, bossHpMax, stats.hp, player.currentHp]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = true;
      if (e.code === 'Space') {
        e.preventDefault();
        fireKiBlast();
      }
      if (e.key.toLowerCase() === 'e') {
        fireKamehameha();
      }
      if (e.key.toLowerCase() === 'q') {
        performDash();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [playerKi, combatOutcome]);

  const addFloatingText = (text: string, x: number, y: number, color: string, isCrit = false) => {
    floatingTexts.current.push({
      id: Math.random(),
      text,
      x,
      y,
      alpha: 1.0,
      color,
      isCrit,
    });
  };

  const spawnHitParticles = (x: number, y: number, color: string, count = 8) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 1;
      particles.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1.0,
        color,
        size: Math.random() * 3 + 2,
      });
    }
  };

  const fireKiBlast = () => {
    if (combatOutcome !== 'playing' || playerKi < 10) return;
    setPlayerKi(prev => Math.max(0, prev - 10));
    sfx.playKiBlast();

    const p = playerState.current;
    const b = bossState.current;
    const angle = Math.atan2(b.y - p.y, b.x - p.x);
    const speed = 9;

    projectiles.current.push({
      x: p.x + Math.cos(angle) * 22,
      y: p.y + Math.sin(angle) * 22,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: 6,
      color: playerArtwork.energyColor || '#38bdf8',
      isPlayer: true,
      damage: Math.floor(stats.atk * 0.45) + Math.floor(Math.random() * 50),
    });
  };

  const fireKamehameha = () => {
    if (combatOutcome !== 'playing' || playerKi < 45) return;
    setPlayerKi(prev => Math.max(0, prev - 45));
    sfx.playKamehameha();

    const p = playerState.current;
    const b = bossState.current;
    const angle = Math.atan2(b.y - p.y, b.x - p.x);
    const speed = 14;

    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        projectiles.current.push({
          x: p.x + Math.cos(angle) * (20 + i * 15),
          y: p.y + Math.sin(angle) * (20 + i * 15),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: 12,
          color: '#67e8f9',
          isPlayer: true,
          damage: Math.floor(stats.atk * 0.95),
          isBeam: true,
        });
      }, i * 60);
    }
  };

  const chargeKi = () => {
    if (combatOutcome !== 'playing') return;
    setPlayerKi(prev => Math.min(100, prev + 25));
    spawnHitParticles(playerState.current.x, playerState.current.y, '#38bdf8', 12);
  };

  const performDash = () => {
    if (combatOutcome !== 'playing' || playerState.current.dashCooldown > 0) return;
    playerState.current.dashCooldown = 40;
    const p = playerState.current;
    p.x += Math.cos(p.aimAngle) * 55;
    p.y += Math.sin(p.aimAngle) * 55;
    spawnHitParticles(p.x, p.y, '#f59e0b', 14);
  };

  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let running = true;

    const gameLoop = () => {
      if (!running) return;

      const width = canvas.width;
      const height = canvas.height;

      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const p = playerState.current;
      const b = bossState.current;

      if (combatOutcome === 'playing') {
        let moveX = 0;
        let moveY = 0;

        if (joystickActive) {
          moveX = joystickPos.x;
          moveY = joystickPos.y;
        }

        if (keysPressed.current['w'] || keysPressed.current['arrowup']) moveY -= 1;
        if (keysPressed.current['s'] || keysPressed.current['arrowdown']) moveY += 1;
        if (keysPressed.current['a'] || keysPressed.current['arrowleft']) moveX -= 1;
        if (keysPressed.current['d'] || keysPressed.current['arrowright']) moveX += 1;

        const len = Math.hypot(moveX, moveY);
        if (len > 0) {
          p.x += (moveX / len) * p.speed;
          p.y += (moveY / len) * p.speed;
        }

        p.x = Math.max(p.radius, Math.min(width - p.radius, p.x));
        p.y = Math.max(p.radius, Math.min(height - p.radius, p.y));

        p.aimAngle = Math.atan2(b.y - p.y, b.x - p.x);

        if (p.dashCooldown > 0) p.dashCooldown--;

        setPlayerKi(prev => Math.min(100, prev + 0.12));

        b.x += b.vx;
        b.y += b.vy;
        if (b.x < width * 0.45 || b.x > width - b.radius) b.vx *= -1;
        if (b.y < b.radius || b.y > height - b.radius) b.vy *= -1;

        b.attackTimer++;
        if (b.attackTimer > 55) {
          b.attackTimer = 0;
          const bAngle = Math.atan2(p.y - b.y, p.x - b.x);
          projectiles.current.push({
            x: b.x,
            y: b.y,
            vx: Math.cos(bAngle) * 5.2,
            vy: Math.sin(bAngle) * 5.2,
            radius: 8,
            color: enemyArtwork.auraColor || '#ef4444',
            isPlayer: false,
            damage: Math.floor(bossAtkVal * (0.8 + Math.random() * 0.4)),
          });
        }
      }

      ctx.save();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
      ctx.restore();

      for (let i = projectiles.current.length - 1; i >= 0; i--) {
        const proj = projectiles.current[i];
        proj.x += proj.vx;
        proj.y += proj.vy;

        ctx.save();
        ctx.shadowColor = proj.color;
        ctx.shadowBlur = proj.isBeam ? 18 : 10;
        ctx.fillStyle = proj.color;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (proj.isPlayer) {
          const dist = Math.hypot(proj.x - b.x, proj.y - b.y);
          if (dist < proj.radius + b.radius) {
            sfx.playHit();
            spawnHitParticles(proj.x, proj.y, proj.color, 8);
            const isCrit = Math.random() > 0.75;
            const finalDmg = isCrit ? Math.floor(proj.damage * 1.5) : proj.damage;
            addFloatingText(`-${finalDmg}`, b.x + (Math.random() * 30 - 15), b.y - 20, isCrit ? '#ef4444' : '#fbbf24', isCrit);

            setBossHp(prev => {
              const next = Math.max(0, prev - finalDmg);
              if (next <= 0 && combatOutcome === 'playing') {
                setCombatOutcome('victory');
                const yenGain = Math.floor(25000 + (stats.level * 400));
                const expGain = Math.floor(250 + (stats.level * 10));
                const gemGain = isBoss ? 20 : 5;
                const crystalGain = isBoss ? 15 : 2;
                const victoryRewards = [
                  `+${yenGain.toLocaleString()} Yen`,
                  `+${expGain.toLocaleString()} EXP`,
                  `+${gemGain} Gems`,
                  `+${crystalGain} Crystals`,
                  ...(isBoss ? ['+1 Dragon Radar Token', '+1 Rare Capsule'] : ['+1 Combat Token'])
                ];
                setRewardList(victoryRewards);
                onVictory(victoryRewards);
              }
              return next;
            });

            projectiles.current.splice(i, 1);
            continue;
          }
        } else {
          const dist = Math.hypot(proj.x - p.x, proj.y - p.y);
          if (dist < proj.radius + p.radius) {
            sfx.playHit();
            spawnHitParticles(proj.x, proj.y, '#ef4444', 10);
            addFloatingText(`-${proj.damage}`, p.x + (Math.random() * 20 - 10), p.y - 20, '#f87171');

            setPlayerHp(prev => {
              const next = Math.max(0, prev - proj.damage);
              if (next <= 0 && combatOutcome === 'playing') {
                setCombatOutcome('defeat');
                onDefeat();
              }
              return next;
            });

            projectiles.current.splice(i, 1);
            continue;
          }
        }

        if (proj.x < -20 || proj.x > width + 20 || proj.y < -20 || proj.y > height + 20) {
          projectiles.current.splice(i, 1);
        }
      }

      for (let i = particles.current.length - 1; i >= 0; i--) {
        const pt = particles.current[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.alpha -= 0.04;
        if (pt.alpha <= 0) {
          particles.current.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = pt.alpha;
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.save();
      const bossPulse = Math.sin(Date.now() / 180) * 4;
      ctx.shadowColor = enemyArtwork.auraColor || '#ef4444';
      ctx.shadowBlur = 24 + bossPulse;
      ctx.fillStyle = enemyArtwork.spriteColor || '#7e22ce';
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = enemyArtwork.hairColor || '#ffffff';
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius * 0.55, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(enemyName, b.x, b.y - b.radius - 8);
      ctx.restore();

      ctx.save();
      const pPulse = Math.sin(Date.now() / 150) * 3;
      ctx.shadowColor = playerArtwork.auraColor || '#38bdf8';
      ctx.shadowBlur = 20 + pPulse;
      ctx.fillStyle = playerArtwork.spriteColor || '#0284c7';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = playerArtwork.hairColor || '#fbbf24';
      ctx.beginPath();
      ctx.arc(p.x, p.y - 4, p.radius * 0.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 11px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(player.firstName || 'Saiyan', p.x, p.y - p.radius - 8);
      ctx.restore();

      for (let i = floatingTexts.current.length - 1; i >= 0; i--) {
        const ft = floatingTexts.current[i];
        ft.y -= 0.9;
        ft.alpha -= 0.025;
        if (ft.alpha <= 0) {
          floatingTexts.current.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = ft.alpha;
        ctx.fillStyle = ft.color;
        ctx.font = ft.isCrit ? 'bold 16px monospace' : 'bold 13px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      }

      animFrameId.current = requestAnimationFrame(gameLoop);
    };

    animFrameId.current = requestAnimationFrame(gameLoop);

    return () => {
      running = false;
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isOpen, combatOutcome, enemyName, bossAtkVal, stats.atk, stats.level, playerArtwork, enemyArtwork, joystickActive, joystickPos]);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setJoystickActive(true);
    handleTouchMove(e);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!joystickBaseRef.current) return;
    const rect = joystickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const touch = e.touches[0];
    const dx = touch.clientX - centerX;
    const dy = touch.clientY - centerY;
    const maxRadius = rect.width / 2;

    const distance = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx);
    const clampedDist = Math.min(distance, maxRadius);

    const nx = (Math.cos(angle) * clampedDist) / maxRadius;
    const ny = (Math.sin(angle) * clampedDist) / maxRadius;

    setJoystickPos({ x: nx, y: ny });
  };

  const handleTouchEnd = () => {
    setJoystickActive(false);
    setJoystickPos({ x: 0, y: 0 });
  };

  if (!isOpen) return null;

  const playerHpPct = Math.max(0, Math.min(100, Math.floor((playerHp / playerMaxHp) * 100)));
  const bossHpPct = Math.max(0, Math.min(100, Math.floor((bossHp / bossHpMax) * 100)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-amber-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[96vh]">
        
        <div className="bg-slate-950/95 border-b border-slate-800 p-3 sm:p-4">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Swords className="w-4 h-4" />
              </span>
              <span className="font-heading font-black text-sm sm:text-base text-amber-300 tracking-wider">
                REAL-TIME MULTIVERSE ARENA
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sfx.enabled = !soundOn;
                  setSoundOn(!soundOn);
                }}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition cursor-pointer"
                title="Toggle SFX"
              >
                {soundOn ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-400 text-xs transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
            <div className="bg-slate-900/90 rounded-2xl p-2.5 border border-cyan-500/30 flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-cyan-400 shrink-0 bg-slate-950">
                <img
                  src={playerArtwork.avatarUrl}
                  alt={player.firstName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="text-cyan-300 truncate">{player.firstName} ({player.equippedChar || 'Saiyan'})</span>
                  <span className="text-slate-400 font-mono text-[11px]">{playerHp.toLocaleString()} / {playerMaxHp.toLocaleString()} HP</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full transition-all duration-200 ${playerHpPct > 30 ? 'bg-gradient-to-r from-emerald-500 to-cyan-400' : 'bg-red-500 animate-pulse'}`}
                    style={{ width: `${playerHpPct}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-cyan-400 font-mono mt-1">
                  <span>Ki Energy</span>
                  <span>{Math.floor(playerKi)}%</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-150"
                    style={{ width: `${playerKi}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-900/90 rounded-2xl p-2.5 border border-rose-500/30 flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-rose-400 shrink-0 bg-slate-950">
                <img
                  src={enemyArtwork.avatarUrl}
                  alt={enemyName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="text-rose-300 truncate">{enemyName}</span>
                  <span className="text-slate-400 font-mono text-[11px]">{bossHp.toLocaleString()} / {bossHpMax.toLocaleString()} HP</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-red-600 transition-all duration-200"
                    style={{ width: `${bossHpPct}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                  <span className="italic text-slate-400 truncate">"{enemyArtwork.quote}"</span>
                  <span className="text-rose-400 font-mono shrink-0">ATK {bossAtkVal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex-1 bg-slate-950 overflow-hidden flex items-center justify-center min-h-[300px] sm:min-h-[380px]">
          <canvas
            ref={canvasRef}
            width={640}
            height={380}
            className="w-full h-full max-h-[420px] object-contain touch-none"
          />

          {combatOutcome !== 'playing' && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-200">
              {combatOutcome === 'victory' ? (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mb-3">
                    <Trophy className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black font-heading text-amber-400 tracking-wide mb-1">
                    VICTORY ACHIEVED!
                  </h3>
                  <p className="text-xs text-slate-300 mb-4 max-w-sm">
                    {enemyName} has been vanquished! Your Saiyan battle instincts grow ever sharper.
                  </p>

                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 mb-5 max-w-xs w-full text-xs space-y-1">
                    <span className="font-bold text-amber-300 block mb-1">Earned Spoils:</span>
                    {rewardList.map((r, idx) => (
                      <div key={idx} className="text-slate-200 font-mono">{r}</div>
                    ))}
                  </div>

                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wider transition cursor-pointer shadow-lg shadow-amber-500/30"
                  >
                    CLAIM & RETURN
                  </button>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center mb-3">
                    <Skull className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black font-heading text-rose-400 tracking-wide mb-1">
                    DEFEATED IN MORTAL COMBAT
                  </h3>
                  <p className="text-xs text-slate-300 mb-5 max-w-sm">
                    You were overpowered by {enemyName}. Consume a Senzu Bean or train your warriors to ascend higher!
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs tracking-wider border border-slate-700 transition cursor-pointer"
                  >
                    RETURN TO SAFETY
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <div className="bg-slate-950 border-t border-slate-800 p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <div
                ref={joystickBaseRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="relative w-24 h-24 rounded-full bg-slate-900 border-2 border-cyan-500/40 flex items-center justify-center select-none cursor-pointer shadow-inner shadow-cyan-950"
              >
                <div
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 shadow-md shadow-cyan-500/50 pointer-events-none transition-transform duration-75"
                  style={{
                    transform: `translate(${joystickPos.x * 24}px, ${joystickPos.y * 24}px)`,
                  }}
                />
              </div>
              <div className="text-[11px] text-slate-400 space-y-0.5">
                <span className="font-bold text-cyan-400 block">Touch Joystick</span>
                <span>Drag to run / WASD</span>
                <span className="block text-slate-500">Auto-aim active</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={fireKiBlast}
                disabled={playerKi < 10 || combatOutcome !== 'playing'}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs transition cursor-pointer shadow-md shadow-cyan-500/20"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Ki Blast (10 Ki)</span>
              </button>

              <button
                onClick={fireKamehameha}
                disabled={playerKi < 45 || combatOutcome !== 'playing'}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-40 text-slate-950 font-black text-xs transition cursor-pointer shadow-md shadow-orange-500/20"
              >
                <Flame className="w-4 h-4 fill-current" />
                <span>Kamehameha (45 Ki)</span>
              </button>

              <button
                onClick={performDash}
                disabled={playerState.current.dashCooldown > 0 || combatOutcome !== 'playing'}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 border border-slate-700 text-xs font-semibold transition cursor-pointer"
              >
                <Crosshair className="w-4 h-4 text-amber-400" />
                <span>Dodge Dash [Q]</span>
              </button>

              <button
                onClick={chargeKi}
                disabled={playerKi >= 100 || combatOutcome !== 'playing'}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-blue-950/60 disabled:opacity-40 text-blue-300 border border-slate-700 hover:border-blue-500/40 text-xs font-semibold transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>Charge Ki</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
