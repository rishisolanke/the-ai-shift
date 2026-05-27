import { useEffect, useRef, useCallback } from 'react';

/*
  AtmosphereScrolly — Full-viewport Canvas + SVG visualization for Environmental section.

  Driven by currentStep prop (0-4) from ScrollySection:
    0: Energy growth story — data centers multiply, energy counter rises
    1: The emissions — grey particles fill 3.1% of atmosphere
    2: The reduction potential — green particles flood to 100%
    3: The 32x ratio — large counter with connecting lines
    4: The catch — green fades, metrics appear
*/

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function lerp(a, b, t) {
  return a + (b - a) * Math.min(1, Math.max(0, t));
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
}

export default function AtmosphereScrolly({ currentStep = 0 }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const stepRef = useRef(currentStep);
  const prevStepRef = useRef(-1);
  const stepStartRef = useRef(null);
  const startTimeRef = useRef(null);
  const particlesRef = useRef([]);
  const dataCentersRef = useRef([]);
  const metricsRef = useRef([]);

  // Keep stepRef in sync
  useEffect(() => {
    stepRef.current = currentStep;
  }, [currentStep]);

  const initParticles = useCallback((w, h) => {
    const rng = seededRandom(42);
    const landscapeY = h * 0.82; // ground level
    const particles = [];

    // Emission particles (grey/red) — rise from data centers
    for (let i = 0; i < 200; i++) {
      particles.push({
        type: 'emission',
        x: w * 0.1 + rng() * w * 0.8,
        baseY: landscapeY - rng() * h * 0.03,
        y: landscapeY,
        targetY: landscapeY - h * 0.031 * (rng() * 0.9 + 0.1), // 3.1% of atmosphere
        r: rng() * 2.5 + 0.6,
        opacity: rng() * 0.5 + 0.2,
        phase: rng() * Math.PI * 2,
        speed: rng() * 0.4 + 0.2,
        drift: (rng() - 0.5) * 0.5,
      });
    }

    // Reduction particles (green) — flood the entire atmosphere
    for (let i = 0; i < 500; i++) {
      const targetY = h * 0.05 + rng() * (landscapeY - h * 0.05);
      particles.push({
        type: 'reduction',
        x: rng() * w,
        baseY: landscapeY,
        y: landscapeY,
        targetY,
        r: rng() * 2.2 + 0.4,
        opacity: rng() * 0.5 + 0.15,
        phase: rng() * Math.PI * 2,
        speed: rng() * 0.3 + 0.15,
        drift: (rng() - 0.5) * 0.3,
      });
    }

    particlesRef.current = particles;

    // Data center positions
    const rng2 = seededRandom(99);
    const centers = [];
    for (let i = 0; i < 12; i++) {
      centers.push({
        x: w * 0.08 + rng2() * w * 0.84,
        y: landscapeY + rng2() * h * 0.04,
        w: 6 + rng2() * 14,
        h: 8 + rng2() * 16,
        delay: rng2() * 0.5,
        glow: rng2() * 0.5 + 0.2,
      });
    }
    dataCentersRef.current = centers;

    // Metrics for step 4
    metricsRef.current = [
      { label: 'Fossil fuel share of new DC power', value: '60%', color: '255,82,82' },
      { label: 'Google GHG emissions YoY', value: '+13%', color: '255,82,82' },
      { label: 'Water consumption by 2030', value: '731-1,125M m³', color: '255,215,64' },
      { label: 'Global electricity share (2024)', value: '1.5%', color: '255,215,64' },
    ];
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
      initParticles(w, h);
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

      const landscapeY = h * 0.82;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // ====== BACKGROUND: Sky gradient ======
      const skyGrad = ctx.createLinearGradient(0, 0, 0, landscapeY);
      skyGrad.addColorStop(0, '#000');
      if (step >= 2) {
        // Green tint when reduction particles are active
        const greenAmount = step === 2 ? entrance : 1;
        skyGrad.addColorStop(0.3, `rgba(0, 20, 8, ${greenAmount * 0.3})`);
        skyGrad.addColorStop(0.8, `rgba(0, 40, 15, ${greenAmount * 0.2})`);
      }
      skyGrad.addColorStop(1, '#050505');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, landscapeY);

      // Ground
      const groundGrad = ctx.createLinearGradient(0, landscapeY, 0, h);
      groundGrad.addColorStop(0, '#0a0a0a');
      groundGrad.addColorStop(1, '#000');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, landscapeY, w, h - landscapeY);

      // Ground line
      ctx.beginPath();
      ctx.moveTo(0, landscapeY);
      ctx.lineTo(w, landscapeY);
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // ====== DATA CENTERS (persist from step 0 onward) ======
      const dcAlpha = step === 0 ? entrance : 1;
      dataCentersRef.current.forEach((dc, i) => {
        const showFraction = Math.min(1, dcAlpha - dc.delay);
        if (showFraction <= 0) return;

        const alpha = showFraction * 0.7;
        const scaleY = showFraction;

        // Building silhouette
        ctx.fillStyle = `rgba(30, 30, 40, ${alpha})`;
        ctx.fillRect(
          dc.x - dc.w / 2,
          dc.y - dc.h * scaleY,
          dc.w,
          dc.h * scaleY
        );

        // Glowing window dots
        const windowCount = Math.floor(dc.w / 4);
        const windowRows = Math.floor(dc.h * scaleY / 5);
        for (let row = 0; row < windowRows; row++) {
          for (let col = 0; col < windowCount; col++) {
            const wx = dc.x - dc.w / 2 + 2 + col * 4;
            const wy = dc.y - dc.h * scaleY + 3 + row * 5;
            const flicker = Math.sin(elapsed * 2 + i + col * 0.5 + row) * 0.3 + 0.7;
            ctx.fillStyle = `rgba(100, 200, 255, ${alpha * dc.glow * flicker * 0.6})`;
            ctx.fillRect(wx, wy, 2, 2);
          }
        }

        // Glow beneath (from step 1+)
        if (step >= 1) {
          const glowAlpha = alpha * 0.15;
          ctx.beginPath();
          ctx.arc(dc.x, dc.y, dc.w * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 100, 100, ${glowAlpha})`;
          ctx.fill();
        }
      });

      // ====== PARTICLES (progressive: emission from step 1, reduction from step 2) ======
      particlesRef.current.forEach((p) => {
        let alpha = 0;
        let px = p.x;
        let py = p.y;

        if (p.type === 'emission') {
          // Visible from step 1 onward
          if (step < 1) return;
          const emissionProgress = step === 1 ? entrance : 1;

          alpha = p.opacity * emissionProgress;
          // Rise from base to target (3.1% of atmosphere height)
          py = lerp(p.baseY, p.targetY, emissionProgress);
          py += Math.sin(elapsed * p.speed + p.phase) * 3;
          px = p.x + Math.sin(elapsed * 0.3 + p.phase) * 5 + p.drift * Math.sin(elapsed * 0.15);

          // Grey particles slightly brighter in step 4
          if (step >= 4) {
            alpha *= 1.2;
          }
        }

        if (p.type === 'reduction') {
          // Visible from step 2 onward
          if (step < 2) return;
          const reductionProgress = step === 2 ? entrance : 1;

          alpha = p.opacity * reductionProgress;
          py = lerp(p.baseY, p.targetY, reductionProgress);
          py += Math.cos(elapsed * p.speed + p.phase) * 2;
          px = p.x + Math.sin(elapsed * 0.2 + p.phase) * 4 + p.drift * Math.cos(elapsed * 0.1);

          // In step 4, green partially fades (~60% of particles)
          if (step >= 4) {
            const fadeChance = (p.phase % Math.PI) / Math.PI;
            if (fadeChance < 0.6) {
              alpha *= 0.15;
            }
          }
        }

        if (alpha <= 0.01) return;

        // Mouse repulsion
        const dmx = px - mx;
        const dmy = py - my;
        const dm = Math.sqrt(dmx * dmx + dmy * dmy);
        if (dm < 80 && dm > 0) {
          const force = ((80 - dm) / 80) * 6;
          px += (dmx / dm) * force;
          py += (dmy / dm) * force;
        }

        const color = p.type === 'emission' ? '140, 140, 150' : '0, 230, 118';
        ctx.beginPath();
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${alpha})`;
        ctx.fill();
      });

      // ====== STEP 0: ENERGY COUNTER + THERMOMETER ======
      if (step === 0) {
        const counterAlpha = entrance;
        if (counterAlpha > 0.01) {
          const energyValue = Math.round(lerp(260, 945, entrance));
          ctx.save();
          ctx.font = "800 48px 'JetBrains Mono', monospace";
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = `rgba(255, 215, 64, ${counterAlpha * 0.9})`;
          ctx.fillText(`${energyValue} TWh`, w / 2, h * 0.35);

          ctx.font = "500 14px 'Plus Jakarta Sans', sans-serif";
          ctx.fillStyle = `rgba(160, 160, 160, ${counterAlpha * 0.7})`;
          ctx.fillText('Data center electricity consumption', w / 2, h * 0.35 + 38);
          if (energyValue > 900) {
            ctx.fillStyle = `rgba(255, 82, 82, ${counterAlpha * 0.6})`;
            ctx.fillText('More than Japan\'s entire consumption', w / 2, h * 0.35 + 58);
          }
          ctx.restore();

          // Thermometer bar (left edge)
          const barX = 20;
          const barW = 6;
          const barTop = h * 0.1;
          const barBottom = landscapeY;
          const barH = barBottom - barTop;
          const fillFraction = entrance;
          const fillH = barH * fillFraction;

          // Background bar
          ctx.fillStyle = `rgba(255,255,255, ${counterAlpha * 0.05})`;
          ctx.fillRect(barX, barTop, barW, barH);

          // Fill
          const fillGrad = ctx.createLinearGradient(0, barBottom - fillH, 0, barBottom);
          fillGrad.addColorStop(0, `rgba(255, 215, 64, ${counterAlpha * 0.8})`);
          fillGrad.addColorStop(1, `rgba(255, 82, 82, ${counterAlpha * 0.6})`);
          ctx.fillStyle = fillGrad;
          ctx.fillRect(barX, barBottom - fillH, barW, fillH);

          // Tick marks
          const ticks = [
            { val: 260, label: '260' },
            { val: 415, label: '415' },
            { val: 945, label: '945' },
          ];
          ticks.forEach((t) => {
            const frac = (t.val - 260) / (945 - 260);
            const tickY = barBottom - barH * frac;
            ctx.fillStyle = `rgba(160,160,160, ${counterAlpha * 0.5})`;
            ctx.font = "500 9px 'JetBrains Mono', monospace";
            ctx.textAlign = 'left';
            ctx.fillText(t.label, barX + barW + 4, tickY + 3);

            ctx.beginPath();
            ctx.moveTo(barX + barW, tickY);
            ctx.lineTo(barX + barW + 3, tickY);
            ctx.strokeStyle = `rgba(160,160,160, ${counterAlpha * 0.3})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          });
        }
      }

      // ====== STEP 1: EMISSION LABEL ======
      if (step === 1) {
        const labelAlpha = entrance;
        if (labelAlpha > 0.01) {
          // "3.1% fill" indicator line at emission height
          const emissionTopY = landscapeY - (landscapeY - h * 0.05) * 0.031;

          // Dashed line across
          ctx.beginPath();
          ctx.moveTo(w * 0.15, emissionTopY);
          ctx.lineTo(w * 0.85, emissionTopY);
          ctx.strokeStyle = `rgba(255, 82, 82, ${labelAlpha * 0.3})`;
          ctx.setLineDash([6, 6]);
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.setLineDash([]);

          // Arrow pointing down to the sliver
          ctx.save();
          ctx.font = "700 20px 'JetBrains Mono', monospace";
          ctx.textAlign = 'center';
          ctx.fillStyle = `rgba(255, 82, 82, ${labelAlpha * 0.9})`;
          ctx.fillText('44 Mt CO₂/yr', w / 2, emissionTopY - 30);

          ctx.font = "500 13px 'Plus Jakarta Sans', sans-serif";
          ctx.fillStyle = `rgba(180, 180, 180, ${labelAlpha * 0.7})`;
          ctx.fillText('↓ This is all the CO₂ AI adds ↓', w / 2, emissionTopY - 10);
          ctx.restore();
        }
      }

      // ====== STEP 3: 32x COUNTER ======
      if (step === 3) {
        const counterAlpha = entrance;
        const pulse = 0.85 + Math.sin(elapsed * 1.5) * 0.15;

        if (counterAlpha > 0.01) {
          ctx.save();
          ctx.font = `800 ${64 * pulse}px 'JetBrains Mono', monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = `rgba(0, 230, 118, ${counterAlpha * 0.95})`;

          // Glow effect
          ctx.shadowColor = 'rgba(0, 230, 118, 0.5)';
          ctx.shadowBlur = 20;
          ctx.fillText('32×', w / 2, h * 0.38);
          ctx.shadowBlur = 0;

          ctx.font = "500 15px 'Plus Jakarta Sans', sans-serif";
          ctx.fillStyle = `rgba(200, 200, 200, ${counterAlpha * 0.75})`;
          ctx.fillText('For every ton AI creates,', w / 2, h * 0.38 + 42);
          ctx.fillText('it can eliminate 32 tons', w / 2, h * 0.38 + 62);
          ctx.restore();

          // Connecting dashed lines from emission zone to green atmosphere
          const emissionTopY = landscapeY - (landscapeY - h * 0.05) * 0.031;

          // Red dashed line (small emissions)
          ctx.beginPath();
          ctx.moveTo(w * 0.2, emissionTopY);
          ctx.lineTo(w * 0.2, h * 0.38);
          ctx.strokeStyle = `rgba(255, 82, 82, ${counterAlpha * 0.25})`;
          ctx.setLineDash([4, 6]);
          ctx.lineWidth = 1;
          ctx.stroke();

          // Green dashed line (full atmosphere)
          ctx.beginPath();
          ctx.moveTo(w * 0.8, h * 0.1);
          ctx.lineTo(w * 0.8, h * 0.38);
          ctx.strokeStyle = `rgba(0, 230, 118, ${counterAlpha * 0.25})`;
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // ====== STEP 4: METRICS TABLE ======
      if (step === 4) {
        const metricsAlpha = entrance;
        if (metricsAlpha > 0.01) {
          const metrics = metricsRef.current;
          const tableX = w * 0.55;
          const tableY = h * 0.2;
          const rowH = 36;

          // Semi-transparent background card
          ctx.fillStyle = `rgba(0, 0, 0, ${metricsAlpha * 0.7})`;
          ctx.beginPath();
          const cardW = Math.min(320, w * 0.4);
          const cardH = metrics.length * rowH + 40;
          const cardX = tableX - 15;
          const cardY = tableY - 15;
          const cr = 12;
          ctx.moveTo(cardX + cr, cardY);
          ctx.lineTo(cardX + cardW + 15, cardY);
          ctx.arcTo(cardX + cardW + 15 + cr, cardY, cardX + cardW + 15 + cr, cardY + cr, cr);
          ctx.lineTo(cardX + cardW + 15 + cr, cardY + cardH);
          ctx.arcTo(cardX + cardW + 15 + cr, cardY + cardH + cr, cardX + cardW + 15, cardY + cardH + cr, cr);
          ctx.lineTo(cardX + cr, cardY + cardH + cr);
          ctx.arcTo(cardX, cardY + cardH + cr, cardX, cardY + cardH, cr);
          ctx.lineTo(cardX, cardY + cr);
          ctx.arcTo(cardX, cardY, cardX + cr, cardY, cr);
          ctx.closePath();
          ctx.fill();

          // Border
          ctx.strokeStyle = `rgba(255,255,255, ${metricsAlpha * 0.08})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Title
          ctx.font = "600 13px 'Plus Jakarta Sans', sans-serif";
          ctx.textAlign = 'left';
          ctx.fillStyle = `rgba(255, 82, 82, ${metricsAlpha * 0.8})`;
          ctx.fillText('The Cost (If AI Isn\'t Used for Climate)', tableX, tableY + 5);

          // Metrics rows
          metrics.forEach((m, i) => {
            const rowY = tableY + 28 + i * rowH;
            const stagger = easeOutCubic(Math.max(0, entrance - i * 0.1));

            ctx.font = "400 12px 'Plus Jakarta Sans', sans-serif";
            ctx.fillStyle = `rgba(160, 160, 160, ${stagger * 0.8})`;
            ctx.fillText(m.label, tableX, rowY);

            ctx.font = "700 14px 'JetBrains Mono', monospace";
            ctx.fillStyle = `rgba(${m.color}, ${stagger * 0.9})`;
            ctx.fillText(m.value, tableX, rowY + 18);
          });
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    const handleMouse = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    canvas.addEventListener('mousemove', handleMouse);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', resize);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      canvas.removeEventListener('mousemove', handleMouse);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', resize);
    };
  }, [initParticles]);

  return (
    <div ref={containerRef} className="absolute inset-0">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
      />
    </div>
  );
}
