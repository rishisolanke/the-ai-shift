import { useEffect, useRef, useCallback } from 'react';

/*
  WorkforceGridScrolly — Full-viewport Canvas visualization for Employment section.

  Driven by currentStep prop (0-4) from ScrollySection:
    0: The scale — 260 human icons, 92 turn red (displaced)
    1: But also — 170 turn green (created), net counter: +78M
    2: The divergence — diverging bar chart (WEF roles)
    3: The timeline — layoffs timeline with red dots
    4: Who gets hit — education risk circles (22%, 12%, 2%)
*/

function lerp(a, b, t) {
  return a + (b - a) * Math.min(1, Math.max(0, t));
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
}

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const WEF_TOP = [
  { role: 'Big Data Specialists', change: 75 },
  { role: 'AI & ML Specialists', change: 72 },
  { role: 'Software Developers', change: 68 },
  { role: 'Security Management', change: 65 },
  { role: 'Data Analysts', change: 52 },
  { role: 'DevOps Engineers', change: 42 },
  { role: 'Cashiers & Clerks', change: -73 },
  { role: 'Admin Assistants', change: -69 },
  { role: 'Building Cleaners', change: -54 },
  { role: 'Printing Workers', change: -51 },
  { role: 'Accounting Clerks', change: -49 },
  { role: 'Bank Tellers', change: -45 },
];

const LAYOFFS = [
  { year: 2020, count: 80998 },
  { year: 2021, count: 15823 },
  { year: 2022, count: 159684 },
  { year: 2023, count: 262735 },
  { year: 2024, count: 152028 },
  { year: 2025, count: 54694 },
];

export default function WorkforceGridScrolly({ currentStep = 0 }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animRef = useRef(null);
  const stepRef = useRef(currentStep);
  const prevStepRef = useRef(-1);
  const stepStartRef = useRef(null);
  const startTimeRef = useRef(null);
  const iconsRef = useRef([]);

  useEffect(() => {
    stepRef.current = currentStep;
  }, [currentStep]);

  const initIcons = useCallback((w, h) => {
    const rng = seededRandom(55);
    const icons = [];
    const cols = Math.min(26, Math.floor(w / 28));
    const rows = Math.ceil(260 / cols);
    const gridW = cols * 26;
    const gridH = rows * 30;
    const startX = (w - gridW) / 2;
    const startY = (h - gridH) / 2 - 20;

    for (let i = 0; i < 260; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      icons.push({
        gridX: startX + col * 26 + 13,
        gridY: startY + row * 30 + 15,
        phase: rng() * Math.PI * 2,
      });
    }
    iconsRef.current = icons;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const dpr = window.devicePixelRatio || 1;
    let w, h;

    const resize = () => {
      w = container.offsetWidth;
      h = container.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      initIcons(w, h);
    };

    resize();
    const ctx = canvas.getContext('2d');

    function drawPerson(x, y, size, color, alpha) {
      ctx.fillStyle = `rgba(${color}, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y - size * 0.55, size * 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x - size * 0.35, y + size * 0.5);
      ctx.lineTo(x - size * 0.2, y - size * 0.15);
      ctx.lineTo(x + size * 0.2, y - size * 0.15);
      ctx.lineTo(x + size * 0.35, y + size * 0.5);
      ctx.closePath();
      ctx.fill();
    }

    const draw = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = (timestamp - startTimeRef.current) / 1000;
      const step = stepRef.current;

      // Track step transitions for entrance animations
      if (step !== prevStepRef.current) {
        prevStepRef.current = step;
        stepStartRef.current = timestamp;
      }
      const stepAge = (timestamp - (stepStartRef.current || startTimeRef.current)) / 1000;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const icons = iconsRef.current;
      if (icons.length === 0) {
        animRef.current = requestAnimationFrame(draw);
        return;
      }

      // Entrance progress for current step (0->1 over 0.8s)
      const entrance = easeOutCubic(Math.min(1, stepAge / 0.8));

      // ====== STEPS 0-1: HUMAN ICON GRID ======
      if (step <= 1) {
        icons.forEach((icon, i) => {
          let color = '80, 80, 100';
          let alpha = 0.3;

          if (step === 0) {
            // Red displacement: 92 icons turn red during entrance
            const redCount = Math.floor(entrance * 92);
            if (i < redCount) {
              color = '255, 82, 82';
              alpha = 0.7;
            }
          } else {
            // Green creation: 170 icons turn green during entrance
            const greenCount = Math.floor(entrance * 170);
            if (i < greenCount) {
              color = '0, 230, 118';
              alpha = 0.65;
            } else {
              color = '80, 80, 100';
              alpha = 0.2;
            }
          }

          const wobble = Math.sin(elapsed * 1.5 + icon.phase) * 1;
          drawPerson(icon.gridX, icon.gridY + wobble, 7, color, alpha);
        });

        // Counter — exclusive per step
        ctx.save();
        ctx.textAlign = 'center';

        if (step === 0) {
          const displaced = Math.round(lerp(0, 92, entrance));
          ctx.font = `800 ${Math.min(42, w * 0.045)}px 'JetBrains Mono', monospace`;
          ctx.fillStyle = `rgba(255, 82, 82, ${entrance * 0.9})`;
          ctx.fillText(`${displaced}M`, w * 0.5, h * 0.12);
          ctx.font = "500 14px 'Plus Jakarta Sans', sans-serif";
          ctx.fillStyle = `rgba(200, 200, 200, ${entrance * 0.6})`;
          ctx.fillText('jobs displaced by 2030', w * 0.5, h * 0.12 + 28);
        } else {
          const created = Math.round(lerp(0, 170, entrance));
          const net = created - 92;
          ctx.font = `800 ${Math.min(42, w * 0.045)}px 'JetBrains Mono', monospace`;
          ctx.fillStyle = `rgba(0, 230, 118, ${entrance * 0.9})`;
          ctx.fillText(`+${Math.max(0, net)}M`, w * 0.5, h * 0.12);
          ctx.font = "500 14px 'Plus Jakarta Sans', sans-serif";
          ctx.fillStyle = `rgba(200, 200, 200, ${entrance * 0.6})`;
          ctx.fillText(`${created}M created, 92M displaced`, w * 0.5, h * 0.12 + 28);
        }

        ctx.restore();
      }

      // ====== STEP 2: DIVERGING BAR CHART ======
      else if (step === 2) {
        if (entrance > 0.01) {
          const centerX = w * 0.48;
          const chartTop = h * 0.1;
          const barH = 22;
          const gap = 6;
          const maxBarW = w * 0.28;

          const growing = WEF_TOP.filter(r => r.change > 0).sort((a, b) => b.change - a.change);
          const declining = WEF_TOP.filter(r => r.change < 0).sort((a, b) => a.change - b.change);
          const sorted = [...growing, ...declining];

          ctx.save();
          ctx.font = "600 13px 'Plus Jakarta Sans', sans-serif";
          ctx.textAlign = 'center';
          ctx.fillStyle = `rgba(200, 200, 200, ${entrance * 0.7})`;
          ctx.fillText('WEF: Roles Growing vs Declining by 2030', w * 0.5, chartTop - 10);

          ctx.beginPath();
          ctx.moveTo(centerX, chartTop + 10);
          ctx.lineTo(centerX, chartTop + sorted.length * (barH + gap));
          ctx.strokeStyle = `rgba(255,255,255, ${entrance * 0.15})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Bars grow in
          const barGrowth = easeOutCubic(Math.min(1, stepAge / 1.0));

          sorted.forEach((role, i) => {
            const y = chartTop + 14 + i * (barH + gap);
            const isGrowing = role.change > 0;
            const barW = (Math.abs(role.change) / 80) * maxBarW * barGrowth;

            if (isGrowing) {
              ctx.fillStyle = `rgba(0, 230, 118, ${entrance * 0.55})`;
              ctx.fillRect(centerX, y, barW, barH);
            } else {
              ctx.fillStyle = `rgba(255, 82, 82, ${entrance * 0.55})`;
              ctx.fillRect(centerX - barW, y, barW, barH);
            }

            ctx.font = "400 10px 'Plus Jakarta Sans', sans-serif";
            ctx.textBaseline = 'middle';
            if (isGrowing) {
              ctx.textAlign = 'right';
              ctx.fillStyle = `rgba(200, 200, 200, ${entrance * 0.7})`;
              ctx.fillText(role.role, centerX - 8, y + barH / 2);
            } else {
              ctx.textAlign = 'left';
              ctx.fillStyle = `rgba(200, 200, 200, ${entrance * 0.7})`;
              ctx.fillText(role.role, centerX + 8, y + barH / 2);
            }

            ctx.font = "700 9px 'JetBrains Mono', monospace";
            if (isGrowing) {
              ctx.textAlign = 'left';
              ctx.fillStyle = `rgba(0, 230, 118, ${entrance * 0.8})`;
              ctx.fillText(`+${role.change}%`, centerX + barW + 6, y + barH / 2);
            } else {
              ctx.textAlign = 'right';
              ctx.fillStyle = `rgba(255, 82, 82, ${entrance * 0.8})`;
              ctx.fillText(`${role.change}%`, centerX - barW - 6, y + barH / 2);
            }
          });

          ctx.restore();
        }
      }

      // ====== STEP 3: LAYOFFS TIMELINE ======
      else if (step === 3) {
        if (entrance > 0.01) {
          const tlLeft = w * 0.12;
          const tlRight = w * 0.88;
          const tlTop = h * 0.2;
          const tlBottom = h * 0.75;
          const tlW = tlRight - tlLeft;

          ctx.save();
          ctx.font = "600 13px 'Plus Jakarta Sans', sans-serif";
          ctx.textAlign = 'center';
          ctx.fillStyle = `rgba(200, 200, 200, ${entrance * 0.7})`;
          ctx.fillText('Tech Layoffs Timeline (2020-2025)', w * 0.5, tlTop - 20);

          ctx.beginPath();
          ctx.moveTo(tlLeft, tlBottom);
          ctx.lineTo(tlRight, tlBottom);
          ctx.strokeStyle = `rgba(255,255,255, ${entrance * 0.15})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          const maxCount = 262735;
          const dotGrowth = easeOutCubic(Math.min(1, stepAge / 1.0));

          LAYOFFS.forEach((d, i) => {
            const x = tlLeft + (i / (LAYOFFS.length - 1)) * tlW;
            const bH = (d.count / maxCount) * (tlBottom - tlTop - 30) * dotGrowth;
            const y = tlBottom - bH;

            const isAI = d.year === 2025;
            const barColor = isAI ? '255, 171, 64' : '255, 82, 82';
            ctx.fillStyle = `rgba(${barColor}, ${entrance * 0.4})`;
            const bW = Math.min(40, tlW / 8);
            ctx.fillRect(x - bW / 2, y, bW, bH);

            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${barColor}, ${entrance * 0.8})`;
            ctx.fill();

            ctx.font = "700 11px 'JetBrains Mono', monospace";
            ctx.textAlign = 'center';
            ctx.fillStyle = `rgba(${barColor}, ${entrance * 0.85})`;
            ctx.fillText(d.count >= 1000 ? `${(d.count / 1000).toFixed(0)}K` : d.count, x, y - 14);

            ctx.font = "400 11px 'JetBrains Mono', monospace";
            ctx.fillStyle = `rgba(160, 160, 170, ${entrance * 0.6})`;
            ctx.fillText(d.year, x, tlBottom + 18);

            if (d.year === 2023 && dotGrowth > 0.5) {
              ctx.font = "500 10px 'Plus Jakarta Sans', sans-serif";
              ctx.fillStyle = `rgba(255, 82, 82, ${entrance * 0.65})`;
              ctx.fillText('Peak: 262K layoffs', x, y - 30);
            }

            if (isAI && dotGrowth > 0.5) {
              ctx.font = "500 10px 'Plus Jakarta Sans', sans-serif";
              ctx.fillStyle = `rgba(255, 171, 64, ${entrance * 0.65})`;
              ctx.fillText('AI-cited', x, y - 28);
            }
          });

          ctx.restore();
        }
      }

      // ====== STEP 4: EDUCATION RISK CIRCLES ======
      else {
        if (entrance > 0.01) {
          const centerY = h * 0.45;
          const maxR = Math.min(w * 0.12, 90);

          const tiers = [
            { label: 'No degree', risk: 22, color: '255, 82, 82', x: w * 0.25 },
            { label: 'Bachelor\'s', risk: 12, color: '255, 215, 64', x: w * 0.5 },
            { label: 'Graduate+', risk: 2, color: '0, 230, 118', x: w * 0.75 },
          ];

          ctx.save();
          ctx.font = "600 13px 'Plus Jakarta Sans', sans-serif";
          ctx.textAlign = 'center';
          ctx.fillStyle = `rgba(200, 200, 200, ${entrance * 0.7})`;
          ctx.fillText('AI Displacement Risk by Education Level', w * 0.5, h * 0.15);

          const grow = easeOutCubic(Math.min(1, stepAge / 0.8));

          tiers.forEach((tier) => {
            const r = (tier.risk / 22) * maxR * grow;
            const pulse = 1 + Math.sin(elapsed * 1.5 + tier.x * 0.01) * 0.03;

            ctx.beginPath();
            ctx.arc(tier.x, centerY, r * pulse + 4, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${tier.color}, ${entrance * 0.06})`;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(tier.x, centerY, r * pulse, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${tier.color}, ${entrance * 0.12})`;
            ctx.fill();
            ctx.strokeStyle = `rgba(${tier.color}, ${entrance * 0.5})`;
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.font = `800 ${Math.max(16, r * 0.5)}px 'JetBrains Mono', monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = `rgba(${tier.color}, ${entrance * 0.9})`;
            ctx.fillText(`${tier.risk}%`, tier.x, centerY);

            ctx.font = "500 12px 'Plus Jakarta Sans', sans-serif";
            ctx.textBaseline = 'alphabetic';
            ctx.fillStyle = `rgba(200, 200, 200, ${entrance * 0.7})`;
            ctx.fillText(tier.label, tier.x, centerY + r + 26);
          });

          if (grow > 0.5) {
            const connAlpha = entrance * easeOutCubic((grow - 0.5) * 2);
            const r1 = (22 / 22) * maxR * grow;
            const r3 = (2 / 22) * maxR * grow;

            ctx.beginPath();
            ctx.setLineDash([4, 4]);
            ctx.moveTo(tiers[0].x + r1 + 8, centerY);
            ctx.lineTo(tiers[2].x - r3 - 8, centerY);
            ctx.strokeStyle = `rgba(255, 255, 255, ${connAlpha * 0.2})`;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.font = "800 20px 'JetBrains Mono', monospace";
            ctx.textAlign = 'center';
            ctx.textBaseline = 'alphabetic';
            ctx.fillStyle = `rgba(255, 215, 64, ${connAlpha * 0.8})`;
            ctx.fillText('11×', w * 0.5, centerY - 10);
            ctx.font = "400 10px 'Plus Jakarta Sans', sans-serif";
            ctx.fillStyle = `rgba(180, 180, 180, ${connAlpha * 0.6})`;
            ctx.fillText('higher risk', w * 0.5, centerY + 6);
          }

          ctx.restore();
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    window.addEventListener('resize', resize);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [initIcons]);

  return (
    <div ref={containerRef} className="absolute inset-0">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
