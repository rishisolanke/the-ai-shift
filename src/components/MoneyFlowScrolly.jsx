import { useEffect, useRef, useCallback } from 'react';

/*
  MoneyFlowScrolly — Full-viewport Canvas visualization for Economic Paradox section.

  Driven by currentStep prop (0-4) from ScrollySection:
    0: The investment — dollar bucket fills, counter ticks $68B->$660B
    1: Where does it go? — flow pipes appear, split at junction. 75% branch wider
    2: The leakage — particles flood to Taiwan/Korea bucket. "$380B+ overseas"
    3: The zero — US Economy bucket nearly empty, large "~0%" GDP
    4: The wage divide — two silhouettes with diverging salary lines
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

export default function MoneyFlowScrolly({ currentStep = 0 }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animRef = useRef(null);
  const stepRef = useRef(currentStep);
  const startTimeRef = useRef(null);
  const prevStepRef = useRef(-1);
  const stepStartRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    stepRef.current = currentStep;
  }, [currentStep]);

  const initParticles = useCallback((w, h) => {
    const rng = seededRandom(77);
    const particles = [];

    for (let i = 0; i < 40; i++) {
      particles.push({
        path: 'overseas',
        t: rng(),
        speed: rng() * 0.003 + 0.001,
        size: rng() * 4 + 8,
        opacity: rng() * 0.4 + 0.3,
        offset: (rng() - 0.5) * 16,
      });
    }

    for (let i = 0; i < 10; i++) {
      particles.push({
        path: 'domestic',
        t: rng(),
        speed: rng() * 0.002 + 0.0008,
        size: rng() * 3 + 6,
        opacity: rng() * 0.3 + 0.15,
        offset: (rng() - 0.5) * 10,
      });
    }

    particlesRef.current = particles;
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

    function bezierPoint(p0, p1, p2, p3, t) {
      const u = 1 - t;
      return {
        x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
        y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
      };
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
      const entrance = easeOutCubic(Math.min(1, stepAge / 0.8));

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // === LAYOUT ===
      const bucketW = Math.min(140, w * 0.14);
      const bucketH = Math.min(200, h * 0.3);
      const srcX = w * 0.12;
      const srcY = h * 0.48;
      const junctionX = w * 0.42;
      const junctionY = h * 0.48;
      const overseasX = w * 0.78;
      const overseasY = h * 0.28;
      const domesticX = w * 0.78;
      const domesticY = h * 0.7;

      const overseasPath = {
        p0: { x: srcX + bucketW / 2, y: srcY },
        p1: { x: junctionX - 30, y: srcY },
        p2: { x: junctionX + 30, y: overseasY },
        p3: { x: overseasX - bucketW / 2, y: overseasY },
      };

      const domesticPath = {
        p0: { x: srcX + bucketW / 2, y: srcY },
        p1: { x: junctionX - 30, y: srcY },
        p2: { x: junctionX + 30, y: domesticY },
        p3: { x: domesticX - bucketW / 2, y: domesticY },
      };

      // ====== STEP 4 IS EXCLUSIVE — only wage divide ======
      if (step === 4) {
        const wageAlpha = entrance;

        if (wageAlpha > 0.01) {
          const centerX = w * 0.45;
          const baseY = h * 0.5;

          // Card background
          ctx.fillStyle = `rgba(15, 15, 20, ${wageAlpha * 0.9})`;
          const cardX = centerX - 180;
          const cardY = baseY - 110;
          const cardW = 360;
          const cardH = 220;
          ctx.beginPath();
          ctx.moveTo(cardX + 12, cardY);
          ctx.lineTo(cardX + cardW - 12, cardY);
          ctx.arcTo(cardX + cardW, cardY, cardX + cardW, cardY + 12, 12);
          ctx.lineTo(cardX + cardW, cardY + cardH - 12);
          ctx.arcTo(cardX + cardW, cardY + cardH, cardX + cardW - 12, cardY + cardH, 12);
          ctx.lineTo(cardX + 12, cardY + cardH);
          ctx.arcTo(cardX, cardY + cardH, cardX, cardY + cardH - 12, 12);
          ctx.lineTo(cardX, cardY + 12);
          ctx.arcTo(cardX, cardY, cardX + 12, cardY, 12);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = `rgba(255,255,255, ${wageAlpha * 0.08})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Title
          ctx.save();
          ctx.font = "600 14px 'Plus Jakarta Sans', sans-serif";
          ctx.textAlign = 'center';
          ctx.fillStyle = `rgba(0, 230, 118, ${wageAlpha * 0.85})`;
          ctx.fillText('The AI Skills Wage Premium', centerX, baseY - 78);

          // Diverging lines
          const years = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'];
          const premiums = [12, 15, 18, 22, 25, 35, 45, 56];
          const lineStartX = centerX - 130;
          const lineEndX = centerX + 130;
          const lineTopY = baseY - 50;
          const lineBottomY = baseY + 55;

          // Base wage line (flat)
          ctx.beginPath();
          ctx.moveTo(lineStartX, lineBottomY);
          ctx.lineTo(lineEndX, lineBottomY);
          ctx.strokeStyle = `rgba(100, 100, 120, ${wageAlpha * 0.4})`;
          ctx.lineWidth = 2;
          ctx.stroke();

          // AI wage line (rising)
          const lineGrow = easeOutCubic(Math.min(1, stepAge / 0.8));
          ctx.beginPath();
          const visibleCount = Math.ceil(lineGrow * premiums.length);
          premiums.slice(0, visibleCount).forEach((p, i) => {
            const x = lineStartX + (i / (premiums.length - 1)) * (lineEndX - lineStartX);
            const y = lineBottomY - (p / 56) * (lineBottomY - lineTopY);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          });
          ctx.strokeStyle = `rgba(0, 230, 118, ${wageAlpha * 0.7})`;
          ctx.lineWidth = 2.5;
          ctx.stroke();

          // End labels
          if (lineGrow > 0.9) {
            ctx.font = "700 16px 'JetBrains Mono', monospace";
            ctx.textAlign = 'left';
            ctx.fillStyle = `rgba(0, 230, 118, ${wageAlpha * 0.9})`;
            ctx.fillText('+56%', lineEndX + 8, lineTopY + 4);

            ctx.fillStyle = `rgba(100, 100, 120, ${wageAlpha * 0.6})`;
            ctx.font = "700 12px 'JetBrains Mono', monospace";
            ctx.fillText('base', lineEndX + 8, lineBottomY + 4);

            ctx.textAlign = 'right';
            ctx.font = "700 12px 'JetBrains Mono', monospace";
            ctx.fillStyle = `rgba(0, 230, 118, ${wageAlpha * 0.6})`;
            ctx.fillText('+12%', lineStartX - 8, lineBottomY - 18);
          }

          // Year labels
          ctx.font = "400 9px 'JetBrains Mono', monospace";
          ctx.textAlign = 'center';
          [0, 3, 7].forEach((idx) => {
            const x = lineStartX + (idx / (premiums.length - 1)) * (lineEndX - lineStartX);
            ctx.fillStyle = `rgba(140, 140, 160, ${wageAlpha * 0.5})`;
            ctx.fillText(years[idx], x, lineBottomY + 18);
          });

          // Summary text
          ctx.font = "500 12px 'Plus Jakarta Sans', sans-serif";
          ctx.textAlign = 'center';
          ctx.fillStyle = `rgba(180, 180, 180, ${wageAlpha * 0.65})`;
          ctx.fillText('Workers with AI skills earn 56% more than peers', centerX, baseY + 88);

          ctx.restore();
        }

        animRef.current = requestAnimationFrame(draw);
        return; // Skip all Sankey elements for step 4
      }

      // ====== STEPS 0-3: SANKEY FLOW (builds progressively) ======

      // Background grid
      ctx.strokeStyle = 'rgba(255,255,255,0.015)';
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let gx = 0; gx < w; gx += gridSize) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke();
      }
      for (let gy = 0; gy < h; gy += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
      }

      // Source bucket — use entrance for step 0 visibility
      const bucketAlpha = step === 0 ? entrance : 1;

      if (bucketAlpha > 0.01) {
        ctx.strokeStyle = `rgba(0, 230, 118, ${bucketAlpha * 0.5})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        const bx = srcX - bucketW / 2;
        const by = srcY - bucketH / 2;
        const br = 10;
        ctx.moveTo(bx + br, by);
        ctx.lineTo(bx + bucketW - br, by);
        ctx.arcTo(bx + bucketW, by, bx + bucketW, by + br, br);
        ctx.lineTo(bx + bucketW, by + bucketH - br);
        ctx.arcTo(bx + bucketW, by + bucketH, bx + bucketW - br, by + bucketH, br);
        ctx.lineTo(bx + br, by + bucketH);
        ctx.arcTo(bx, by + bucketH, bx, by + bucketH - br, br);
        ctx.lineTo(bx, by + br);
        ctx.arcTo(bx, by, bx + br, by, br);
        ctx.closePath();
        ctx.stroke();

        const fillFrac = step === 0 ? entrance : 1;
        const fillH = bucketH * fillFrac * 0.85;
        const fillGrad = ctx.createLinearGradient(0, by + bucketH - fillH, 0, by + bucketH);
        fillGrad.addColorStop(0, `rgba(0, 230, 118, ${bucketAlpha * 0.12})`);
        fillGrad.addColorStop(1, `rgba(0, 230, 118, ${bucketAlpha * 0.04})`);
        ctx.fillStyle = fillGrad;
        ctx.fillRect(bx + 2, by + bucketH - fillH - 2, bucketW - 4, fillH);

        const waveY = by + bucketH - fillH - 2;
        ctx.beginPath();
        ctx.moveTo(bx + 2, waveY);
        for (let wx = 0; wx < bucketW - 4; wx += 2) {
          ctx.lineTo(bx + 2 + wx, waveY + Math.sin(elapsed * 2 + wx * 0.08) * 2);
        }
        ctx.strokeStyle = `rgba(0, 230, 118, ${bucketAlpha * 0.3})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        const investValue = Math.round(lerp(68, 660, step === 0 ? entrance : 1));
        ctx.save();
        ctx.font = `800 ${Math.min(36, w * 0.04)}px 'JetBrains Mono', monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = `rgba(0, 230, 118, ${bucketAlpha * 0.95})`;
        ctx.fillText(`$${investValue}B`, srcX, srcY - 6);
        ctx.font = "500 12px 'Plus Jakarta Sans', sans-serif";
        ctx.fillStyle = `rgba(160, 160, 160, ${bucketAlpha * 0.7})`;
        ctx.fillText('AI Capex', srcX, srcY + 18);
        ctx.fillText(investValue >= 600 ? '(2026)' : '(2020)', srcX, srcY + 34);
        ctx.restore();

        ctx.font = "600 11px 'Plus Jakarta Sans', sans-serif";
        ctx.textAlign = 'center';
        ctx.fillStyle = `rgba(200, 200, 200, ${bucketAlpha * 0.6})`;
        ctx.fillText('US COMPANIES', srcX, srcY + bucketH / 2 + 24);
      }

      // Flow pipes (step 1+)
      if (step >= 1) {
        const pipeAlpha = step === 1 ? entrance : 1;

        if (pipeAlpha > 0.01) {
          ctx.beginPath();
          ctx.moveTo(overseasPath.p0.x, overseasPath.p0.y);
          ctx.bezierCurveTo(
            overseasPath.p1.x, overseasPath.p1.y,
            overseasPath.p2.x, overseasPath.p2.y,
            overseasPath.p3.x, overseasPath.p3.y
          );
          ctx.strokeStyle = `rgba(255, 171, 64, ${pipeAlpha * 0.35})`;
          ctx.lineWidth = step >= 2 ? 8 : lerp(2, 8, entrance);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(domesticPath.p0.x, domesticPath.p0.y);
          ctx.bezierCurveTo(
            domesticPath.p1.x, domesticPath.p1.y,
            domesticPath.p2.x, domesticPath.p2.y,
            domesticPath.p3.x, domesticPath.p3.y
          );
          ctx.strokeStyle = `rgba(100, 100, 120, ${pipeAlpha * 0.2})`;
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(junctionX, junctionY, 6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 215, 64, ${pipeAlpha * 0.4})`;
          ctx.fill();

          const annAlpha = step === 1 ? entrance : 1;
          if (annAlpha > 0.01) {
            ctx.save();
            ctx.font = "700 14px 'JetBrains Mono', monospace";
            ctx.textAlign = 'center';
            ctx.fillStyle = `rgba(255, 171, 64, ${annAlpha * 0.85})`;
            ctx.fillText('75%', junctionX, junctionY - 20);
            ctx.font = "400 11px 'Plus Jakarta Sans', sans-serif";
            ctx.fillStyle = `rgba(180, 180, 180, ${annAlpha * 0.65})`;
            ctx.fillText('imported hardware', junctionX, junctionY - 6);
            ctx.font = "700 12px 'JetBrains Mono', monospace";
            ctx.fillStyle = `rgba(100, 100, 120, ${annAlpha * 0.6})`;
            ctx.fillText('25%', junctionX + 20, junctionY + 30);
            ctx.restore();
          }
        }
      }

      // Destination buckets (step 2+)
      if (step >= 2) {
        const destAlpha = step === 2 ? entrance : 1;

        if (destAlpha > 0.01) {
          // Taiwan/Korea bucket
          const obx = overseasX - bucketW / 2;
          const oby = overseasY - bucketH / 2;
          ctx.strokeStyle = `rgba(255, 171, 64, ${destAlpha * 0.5})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          const obr = 10;
          ctx.moveTo(obx + obr, oby);
          ctx.lineTo(obx + bucketW - obr, oby);
          ctx.arcTo(obx + bucketW, oby, obx + bucketW, oby + obr, obr);
          ctx.lineTo(obx + bucketW, oby + bucketH - obr);
          ctx.arcTo(obx + bucketW, oby + bucketH, obx + bucketW - obr, oby + bucketH, obr);
          ctx.lineTo(obx + obr, oby + bucketH);
          ctx.arcTo(obx, oby + bucketH, obx, oby + bucketH - obr, obr);
          ctx.lineTo(obx, oby + obr);
          ctx.arcTo(obx, oby, obx + obr, oby, obr);
          ctx.closePath();
          ctx.stroke();

          const oFill = step === 2 ? entrance : 1;
          const oFillH = bucketH * oFill * 0.8;
          const oGrad = ctx.createLinearGradient(0, oby + bucketH - oFillH, 0, oby + bucketH);
          oGrad.addColorStop(0, `rgba(255, 171, 64, ${destAlpha * 0.15})`);
          oGrad.addColorStop(1, `rgba(255, 171, 64, ${destAlpha * 0.05})`);
          ctx.fillStyle = oGrad;
          ctx.fillRect(obx + 2, oby + bucketH - oFillH - 2, bucketW - 4, oFillH);

          ctx.save();
          ctx.font = `800 ${Math.min(28, w * 0.032)}px 'JetBrains Mono', monospace`;
          ctx.textAlign = 'center';
          ctx.fillStyle = `rgba(255, 171, 64, ${destAlpha * 0.9})`;
          ctx.fillText('$380B+', overseasX, overseasY - 4);
          ctx.font = "500 11px 'Plus Jakarta Sans', sans-serif";
          ctx.fillStyle = `rgba(180, 180, 180, ${destAlpha * 0.7})`;
          ctx.fillText('flowing overseas', overseasX, overseasY + 16);
          ctx.restore();

          ctx.font = "600 11px 'Plus Jakarta Sans', sans-serif";
          ctx.textAlign = 'center';
          ctx.fillStyle = `rgba(200, 200, 200, ${destAlpha * 0.6})`;
          ctx.fillText('TAIWAN / KOREA', overseasX, overseasY + bucketH / 2 + 24);

          // US Economy bucket
          const dbx = domesticX - bucketW / 2;
          const dby = domesticY - bucketH / 2;
          ctx.strokeStyle = `rgba(80, 80, 100, ${destAlpha * 0.3})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(dbx + obr, dby);
          ctx.lineTo(dbx + bucketW - obr, dby);
          ctx.arcTo(dbx + bucketW, dby, dbx + bucketW, dby + obr, obr);
          ctx.lineTo(dbx + bucketW, dby + bucketH - obr);
          ctx.arcTo(dbx + bucketW, dby + bucketH, dbx + bucketW - obr, dby + bucketH, obr);
          ctx.lineTo(dbx + obr, dby + bucketH);
          ctx.arcTo(dbx, dby + bucketH, dbx, dby + bucketH - obr, obr);
          ctx.lineTo(dbx, dby + obr);
          ctx.arcTo(dbx, dby, dbx + obr, dby, obr);
          ctx.closePath();
          ctx.stroke();

          const dFillH = bucketH * 0.03;
          ctx.fillStyle = `rgba(80, 80, 100, ${destAlpha * 0.08})`;
          ctx.fillRect(dbx + 2, dby + bucketH - dFillH - 2, bucketW - 4, dFillH);

          ctx.font = "600 11px 'Plus Jakarta Sans', sans-serif";
          ctx.textAlign = 'center';
          ctx.fillStyle = `rgba(130, 130, 150, ${destAlpha * 0.5})`;
          ctx.fillText('US ECONOMY', domesticX, domesticY + bucketH / 2 + 24);
        }
      }

      // Flowing dollar particles (step 2+)
      if (step >= 2) {
        const particleAlpha = step === 2 ? entrance : 1;

        if (particleAlpha > 0.01) {
          particlesRef.current.forEach((p) => {
            p.t += p.speed;
            if (p.t > 1) p.t -= 1;

            const path = p.path === 'overseas' ? overseasPath : domesticPath;
            const pt = bezierPoint(path.p0, path.p1, path.p2, path.p3, p.t);

            const pt2 = bezierPoint(path.p0, path.p1, path.p2, path.p3, Math.min(1, p.t + 0.01));
            const dx = pt2.x - pt.x;
            const dy = pt2.y - pt.y;
            const len = Math.sqrt(dx * dx + dy * dy) || 1;
            const nx = -dy / len;
            const ny = dx / len;

            const px = pt.x + nx * p.offset;
            const py = pt.y + ny * p.offset;

            const color = p.path === 'overseas' ? '255, 171, 64' : '100, 100, 120';
            const alpha = particleAlpha * p.opacity * (0.5 + Math.sin(elapsed * 2 + p.t * 10) * 0.3);

            ctx.font = `${p.size}px 'JetBrains Mono', monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = `rgba(${color}, ${alpha})`;
            ctx.fillText('$', px, py);
          });
        }
      }

      // GDP zero (step 3 only — exclusive, not step 4)
      if (step === 3) {
        const zeroAlpha = step === 3 ? entrance : 1;
        const pulse = 0.9 + Math.sin(elapsed * 1.2) * 0.1;

        ctx.save();
        ctx.font = `800 ${Math.min(60, w * 0.06) * pulse}px 'JetBrains Mono', monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = `rgba(255, 82, 82, ${zeroAlpha * 0.9})`;
        ctx.shadowColor = 'rgba(255, 82, 82, 0.4)';
        ctx.shadowBlur = 15;
        ctx.fillText('~0%', domesticX, domesticY - 6);
        ctx.shadowBlur = 0;

        ctx.font = "500 13px 'Plus Jakarta Sans', sans-serif";
        ctx.fillStyle = `rgba(200, 200, 200, ${zeroAlpha * 0.7})`;
        ctx.fillText('GDP contribution', domesticX, domesticY + 24);
        ctx.fillText('from AI (2025)', domesticX, domesticY + 40);

        const lineY = domesticY + 64;
        const lineW = bucketW * 0.8;
        ctx.beginPath();
        ctx.moveTo(domesticX - lineW / 2, lineY);
        ctx.lineTo(domesticX + lineW / 2, lineY);
        ctx.strokeStyle = `rgba(255, 82, 82, ${zeroAlpha * 0.4})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.font = "400 9px 'JetBrains Mono', monospace";
        ctx.fillStyle = `rgba(255, 82, 82, ${zeroAlpha * 0.5})`;
        ctx.fillText('flat', domesticX + lineW / 2 + 16, lineY + 3);

        ctx.restore();
      }

      // Step indicator dots
      const dotY = h - 30;
      for (let i = 0; i < 5; i++) {
        const dx = w / 2 + (i - 2) * 16;
        const isActive = step === i;
        ctx.beginPath();
        ctx.arc(dx, dotY, isActive ? 3 : 2, 0, Math.PI * 2);
        ctx.fillStyle = isActive ? 'rgba(255, 171, 64, 0.6)' : 'rgba(255,255,255, 0.1)';
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    window.addEventListener('resize', resize);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [initParticles]);

  return (
    <div ref={containerRef} className="absolute inset-0">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
    </div>
  );
}
