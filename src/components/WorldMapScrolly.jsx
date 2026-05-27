import { useEffect, useRef } from 'react';

/*
  WorldMapScrolly — Full-viewport Canvas visualization for Country Adoption section.

  Driven by currentStep prop (0-3) from ScrollySection:
    0: The landscape — markers fade in sized by adoption
    1: The surprise — UAE 70% vs USA 34% callouts
    2: The leapfrog — growth rate overlay, South Korea +43.2%
    3: The money trail — investment circles, US $285.9B vs China $12.4B
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

// Country positions on a simplified world projection (0-1 range)
const COUNTRIES = [
  { name: 'UAE', adoption: 70, growth: 32.1, investment: 0.4, x: 0.58, y: 0.48 },
  { name: 'Singapore', adoption: 63, growth: 24.3, investment: 0.3, x: 0.72, y: 0.57 },
  { name: 'South Korea', adoption: 52, growth: 43.2, investment: 0.8, x: 0.78, y: 0.38 },
  { name: 'Denmark', adoption: 48, growth: 12.0, investment: 0.3, x: 0.50, y: 0.25 },
  { name: 'Finland', adoption: 46, growth: 10.5, investment: 0.2, x: 0.53, y: 0.2 },
  { name: 'UK', adoption: 42, growth: 11.0, investment: 4.5, x: 0.47, y: 0.28 },
  { name: 'India', adoption: 40, growth: 28.7, investment: 1.8, x: 0.65, y: 0.47 },
  { name: 'Philippines', adoption: 38, growth: 38.5, investment: 0.2, x: 0.78, y: 0.52 },
  { name: 'Germany', adoption: 36, growth: 9.5, investment: 2.8, x: 0.50, y: 0.28 },
  { name: 'USA', adoption: 34, growth: 8.2, investment: 285.9, x: 0.22, y: 0.35 },
  { name: 'Canada', adoption: 33, growth: 7.5, investment: 2.4, x: 0.20, y: 0.25 },
  { name: 'France', adoption: 30, growth: 8.0, investment: 2.1, x: 0.48, y: 0.32 },
  { name: 'Japan', adoption: 28, growth: 6.5, investment: 1.2, x: 0.82, y: 0.37 },
  { name: 'China', adoption: 25, growth: 15.0, investment: 12.4, x: 0.73, y: 0.4 },
  { name: 'Brazil', adoption: 22, growth: 17.2, investment: 0.5, x: 0.32, y: 0.62 },
  { name: 'Israel', adoption: 45, growth: 14.0, investment: 1.6, x: 0.56, y: 0.42 },
];

export default function WorldMapScrolly({ currentStep = 0 }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animRef = useRef(null);
  const stepRef = useRef(currentStep);
  const prevStepRef = useRef(-1);
  const stepStartRef = useRef(null);
  const startTimeRef = useRef(null);
  // transitionRef removed — using stepAge for entrance animations

  useEffect(() => {
    stepRef.current = currentStep;
  }, [currentStep]);

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
    };

    resize();
    const ctx = canvas.getContext('2d');

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
      const entrance = easeOutCubic(Math.min(1, stepAge / 0.8));

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // Map area with padding
      const mapPad = 40;
      const mapW = w - mapPad * 2;
      const mapH = h - mapPad * 2;

      // Subtle grid (longitude/latitude lines)
      ctx.strokeStyle = 'rgba(255,255,255,0.02)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 10; i++) {
        const lx = mapPad + (i / 10) * mapW;
        ctx.beginPath(); ctx.moveTo(lx, mapPad); ctx.lineTo(lx, mapPad + mapH); ctx.stroke();
      }
      for (let i = 0; i <= 6; i++) {
        const ly = mapPad + (i / 6) * mapH;
        ctx.beginPath(); ctx.moveTo(mapPad, ly); ctx.lineTo(mapPad + mapW, ly); ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(mapPad, mapPad + mapH * 0.5);
      ctx.lineTo(mapPad + mapW, mapPad + mapH * 0.5);
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.stroke();

      // ====== MARKERS — always shown, styled per current step ======
      COUNTRIES.forEach((c, i) => {
        const cx = mapPad + c.x * mapW;
        const cy = mapPad + c.y * mapH;
        const delay = i * 0.03;
        const appear = step === 0 ? easeOutCubic(Math.max(0, Math.min(1, (stepAge - delay) * 3))) : 1;
        if (appear <= 0) return;

        let r, color, alpha;

        if (step === 0) {
          // Sized by adoption rate
          r = (c.adoption / 70) * Math.min(25, w * 0.025) * appear;
          color = c.adoption >= 50 ? '0, 230, 118' : c.adoption >= 35 ? '255, 215, 64' : '100, 100, 140';
          alpha = 0.5;
        } else if (step === 1) {
          // UAE and USA highlighted
          r = (c.adoption / 70) * Math.min(25, w * 0.025);
          if (c.name === 'UAE') {
            r *= 1.8;
            color = '0, 230, 118';
            alpha = 0.9;
          } else if (c.name === 'USA') {
            r *= 1.3;
            color = '255, 215, 64';
            alpha = 0.8;
          } else {
            color = '60, 60, 80';
            alpha = 0.2;
          }
        } else if (step === 2) {
          // Growth rates — high growers pulse
          r = (c.adoption / 70) * Math.min(25, w * 0.025);
          if (c.growth > 20) {
            const pulse = 1 + Math.sin(elapsed * 2 + i) * 0.15;
            r *= pulse;
            color = '160, 120, 255';
            alpha = 0.7;
          } else {
            color = '60, 60, 80';
            alpha = 0.2;
          }
        } else {
          // Step 3: Investment — sized by investment
          const investR = Math.sqrt(c.investment) * Math.min(6, w * 0.006);
          r = Math.max(4, investR);
          if (c.investment > 100) {
            color = '79, 125, 242';
            alpha = 0.7;
          } else if (c.investment > 5) {
            color = '160, 120, 255';
            alpha = 0.5;
          } else {
            color = '80, 80, 100';
            alpha = 0.3;
          }
        }

        // Glow
        ctx.beginPath();
        ctx.arc(cx, cy, r + 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${alpha * appear * 0.15})`;
        ctx.fill();

        // Circle
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${alpha * appear * 0.25})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(${color}, ${alpha * appear * 0.6})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Country name
        ctx.font = "500 9px 'Plus Jakarta Sans', sans-serif";
        ctx.textAlign = 'center';
        ctx.fillStyle = `rgba(200, 200, 200, ${alpha * appear * 0.8})`;
        ctx.fillText(c.name, cx, cy + r + 13);
      });

      // ====== STEP 1 CALLOUTS: UAE vs USA (exclusive) ======
      if (step === 1) {
        const callAlpha = entrance;

        if (callAlpha > 0.01) {
          const uae = COUNTRIES.find(c => c.name === 'UAE');
          const usa = COUNTRIES.find(c => c.name === 'USA');

          const uaeX = mapPad + uae.x * mapW;
          const uaeY = mapPad + uae.y * mapH;
          ctx.save();
          ctx.font = `800 ${Math.min(32, w * 0.035)}px 'JetBrains Mono', monospace`;
          ctx.textAlign = 'center';
          ctx.fillStyle = `rgba(0, 230, 118, ${callAlpha * 0.9})`;
          ctx.shadowColor = 'rgba(0, 230, 118, 0.3)';
          ctx.shadowBlur = 10;
          ctx.fillText('70%', uaeX, uaeY - 35);
          ctx.shadowBlur = 0;
          ctx.font = "500 11px 'Plus Jakarta Sans', sans-serif";
          ctx.fillStyle = `rgba(200, 200, 200, ${callAlpha * 0.7})`;
          ctx.fillText('UAE - Global #1', uaeX, uaeY - 18);

          const usaX = mapPad + usa.x * mapW;
          const usaY = mapPad + usa.y * mapH;
          ctx.font = `800 ${Math.min(28, w * 0.03)}px 'JetBrains Mono', monospace`;
          ctx.fillStyle = `rgba(255, 215, 64, ${callAlpha * 0.8})`;
          ctx.fillText('34%', usaX, usaY - 35);
          ctx.font = "500 11px 'Plus Jakarta Sans', sans-serif";
          ctx.fillStyle = `rgba(200, 200, 200, ${callAlpha * 0.6})`;
          ctx.fillText('USA - Outside top 20', usaX, usaY - 18);

          ctx.restore();
        }
      }

      // ====== STEP 2 CALLOUTS: Growth rates (exclusive) ======
      if (step === 2) {
        const growAlpha = entrance;

        if (growAlpha > 0.01) {
          const highGrowers = COUNTRIES.filter(c => c.growth > 20).sort((a, b) => b.growth - a.growth);
          highGrowers.forEach((c) => {
            const cx = mapPad + c.x * mapW;
            const cy = mapPad + c.y * mapH;

            ctx.save();
            ctx.font = "700 12px 'JetBrains Mono', monospace";
            ctx.textAlign = 'center';
            ctx.fillStyle = `rgba(160, 120, 255, ${growAlpha * 0.9})`;
            ctx.fillText(`+${c.growth}%`, cx, cy - 20);
            ctx.restore();
          });

          ctx.save();
          ctx.font = "600 13px 'Plus Jakarta Sans', sans-serif";
          ctx.textAlign = 'center';
          ctx.fillStyle = `rgba(160, 120, 255, ${growAlpha * 0.7})`;
          ctx.fillText('6-Month Growth Rate (H1 2025 → Q1 2026)', w / 2, h * 0.9);
          ctx.restore();
        }
      }

      // ====== STEP 3 CALLOUTS: Investment (exclusive) ======
      if (step === 3) {
        const invAlpha = entrance;

        if (invAlpha > 0.01) {
          const usa = COUNTRIES.find(c => c.name === 'USA');
          const chn = COUNTRIES.find(c => c.name === 'China');

          const usaX = mapPad + usa.x * mapW;
          const usaY = mapPad + usa.y * mapH;
          const chnX = mapPad + chn.x * mapW;
          const chnY = mapPad + chn.y * mapH;

          ctx.save();
          ctx.font = `800 ${Math.min(30, w * 0.032)}px 'JetBrains Mono', monospace`;
          ctx.textAlign = 'center';
          ctx.fillStyle = `rgba(79, 125, 242, ${invAlpha * 0.95})`;
          ctx.shadowColor = 'rgba(79, 125, 242, 0.3)';
          ctx.shadowBlur = 10;
          ctx.fillText('$285.9B', usaX, usaY - 40);
          ctx.shadowBlur = 0;
          ctx.font = "500 11px 'Plus Jakarta Sans', sans-serif";
          ctx.fillStyle = `rgba(200, 200, 200, ${invAlpha * 0.7})`;
          ctx.fillText('US Private AI Investment', usaX, usaY - 22);

          ctx.font = `700 ${Math.min(20, w * 0.022)}px 'JetBrains Mono', monospace`;
          ctx.fillStyle = `rgba(160, 120, 255, ${invAlpha * 0.8})`;
          ctx.fillText('$12.4B', chnX, chnY - 30);
          ctx.font = "500 10px 'Plus Jakarta Sans', sans-serif";
          ctx.fillStyle = `rgba(160, 160, 180, ${invAlpha * 0.6})`;
          ctx.fillText('China', chnX, chnY - 16);

          // 23:1 ratio connector
          ctx.beginPath();
          ctx.setLineDash([4, 4]);
          ctx.moveTo(usaX + 60, usaY);
          ctx.lineTo(chnX - 20, chnY);
          ctx.strokeStyle = `rgba(255, 255, 255, ${invAlpha * 0.12})`;
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.setLineDash([]);

          const midX = (usaX + chnX) / 2;
          const midY = (usaY + chnY) / 2;
          ctx.font = "800 18px 'JetBrains Mono', monospace";
          ctx.fillStyle = `rgba(255, 215, 64, ${invAlpha * 0.85})`;
          ctx.fillText('23:1', midX, midY - 6);
          ctx.font = "400 10px 'Plus Jakarta Sans', sans-serif";
          ctx.fillStyle = `rgba(180, 180, 180, ${invAlpha * 0.55})`;
          ctx.fillText('investment ratio', midX, midY + 10);

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
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
