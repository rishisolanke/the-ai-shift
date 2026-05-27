import { useEffect, useRef, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';

/*
  Atmosphere CO2 Visualization
  Two side-by-side jar/atmosphere containers:
  - Left: "AI Emissions" — grey particles fill to 3.1% (44 Mt out of 1,400 Mt scale)
  - Right: "AI Can Reduce" — green particles flood to 100% (1,400 Mt)
  Canvas-based for smooth particle animation.
*/

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export default function AtmosphereCO2() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-60px' });
  const animRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const stateRef = useRef({
    progress: 0,        // overall entrance progress 0→1
    emissionFill: 0,    // left jar fill 0→0.031
    reductionFill: 0,   // right jar fill 0→1
    phase: 'idle',      // idle → emissions → pause → reduction → done
    phaseTime: 0,
    particles: [],
  });

  const initParticles = useCallback((w, h) => {
    const rng = seededRandom(42);
    const particles = [];
    const jarW = w * 0.35;
    const jarH = h * 0.7;
    const leftJarX = w * 0.25 - jarW / 2;
    const rightJarX = w * 0.75 - jarW / 2;
    const jarY = h * 0.18;

    // Emission particles (grey/red) — for left jar
    for (let i = 0; i < 120; i++) {
      particles.push({
        type: 'emission',
        x: leftJarX + rng() * jarW,
        y: jarY + jarH - rng() * jarH * 0.05, // start at bottom
        homeX: leftJarX + rng() * jarW,
        homeY: jarY + jarH - rng() * jarH * 0.031, // settle in bottom 3.1%
        r: rng() * 2.2 + 0.8,
        opacity: rng() * 0.5 + 0.3,
        phase: rng() * Math.PI * 2,
        speed: rng() * 0.5 + 0.3,
        vx: (rng() - 0.5) * 0.3,
      });
    }

    // Reduction particles (green) — for right jar
    for (let i = 0; i < 400; i++) {
      particles.push({
        type: 'reduction',
        x: rightJarX + rng() * jarW,
        y: jarY + rng() * jarH,
        homeX: rightJarX + rng() * jarW,
        homeY: jarY + rng() * jarH,
        r: rng() * 2 + 0.6,
        opacity: rng() * 0.6 + 0.2,
        phase: rng() * Math.PI * 2,
        speed: rng() * 0.4 + 0.2,
        vx: (rng() - 0.5) * 0.2,
      });
    }

    stateRef.current.particles = particles;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const dpr = window.devicePixelRatio || 1;
    let w, h;

    const resize = () => {
      w = container.offsetWidth;
      h = Math.max(320, Math.min(w * 0.55, 440));
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      initParticles(w, h);
    };

    resize();

    const ctx = canvas.getContext('2d');
    let startTime = null;

    function drawJar(ctx, x, y, jw, jh, glowColor, fillLevel, label, value) {
      const cornerR = 16;
      const neckW = jw * 0.7;
      const neckH = 20;
      const neckX = x + (jw - neckW) / 2;

      // Jar body outline
      ctx.beginPath();
      ctx.moveTo(neckX, y);
      ctx.lineTo(neckX + neckW, y);
      ctx.lineTo(x + jw - cornerR, y + neckH);
      ctx.quadraticCurveTo(x + jw, y + neckH, x + jw, y + neckH + cornerR);
      ctx.lineTo(x + jw, y + jh - cornerR);
      ctx.quadraticCurveTo(x + jw, y + jh, x + jw - cornerR, y + jh);
      ctx.lineTo(x + cornerR, y + jh);
      ctx.quadraticCurveTo(x, y + jh, x, y + jh - cornerR);
      ctx.lineTo(x, y + neckH + cornerR);
      ctx.quadraticCurveTo(x, y + neckH, x + cornerR, y + neckH);
      ctx.lineTo(neckX, y);
      ctx.closePath();

      // Subtle fill background
      ctx.fillStyle = 'rgba(20, 20, 20, 0.5)';
      ctx.fill();

      // Outline stroke
      ctx.strokeStyle = `rgba(${glowColor}, 0.3)`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Fill level indicator (subtle colored region at the bottom)
      if (fillLevel > 0) {
        const fillH = jh * fillLevel;
        const fillY = y + jh - fillH;

        ctx.save();
        // Clip to jar shape
        ctx.beginPath();
        ctx.moveTo(neckX, y);
        ctx.lineTo(neckX + neckW, y);
        ctx.lineTo(x + jw - cornerR, y + neckH);
        ctx.quadraticCurveTo(x + jw, y + neckH, x + jw, y + neckH + cornerR);
        ctx.lineTo(x + jw, y + jh - cornerR);
        ctx.quadraticCurveTo(x + jw, y + jh, x + jw - cornerR, y + jh);
        ctx.lineTo(x + cornerR, y + jh);
        ctx.quadraticCurveTo(x, y + jh, x, y + jh - cornerR);
        ctx.lineTo(x, y + neckH + cornerR);
        ctx.quadraticCurveTo(x, y + neckH, x + cornerR, y + neckH);
        ctx.lineTo(neckX, y);
        ctx.closePath();
        ctx.clip();

        // Gradient fill
        const grad = ctx.createLinearGradient(x, fillY, x, y + jh);
        grad.addColorStop(0, `rgba(${glowColor}, 0.15)`);
        grad.addColorStop(1, `rgba(${glowColor}, 0.35)`);
        ctx.fillStyle = grad;
        ctx.fillRect(x, fillY, jw, fillH);

        // Glow at fill line
        const glowGrad = ctx.createLinearGradient(x, fillY - 8, x, fillY + 8);
        glowGrad.addColorStop(0, `rgba(${glowColor}, 0)`);
        glowGrad.addColorStop(0.5, `rgba(${glowColor}, 0.4)`);
        glowGrad.addColorStop(1, `rgba(${glowColor}, 0)`);
        ctx.fillStyle = glowGrad;
        ctx.fillRect(x, fillY - 8, jw, 16);

        ctx.restore();
      }

      // Label below jar
      ctx.font = "600 13px 'Plus Jakarta Sans', sans-serif";
      ctx.textAlign = 'center';
      ctx.fillStyle = `rgba(${glowColor}, 0.9)`;
      ctx.fillText(label, x + jw / 2, y + jh + 28);

      // Value label
      ctx.font = "700 18px 'JetBrains Mono', monospace";
      ctx.fillText(value, x + jw / 2, y + jh + 50);
    }

    const draw = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;
      const state = stateRef.current;

      // Progress animation when in view
      if (isInView && state.progress < 1) {
        state.progress = Math.min(1, state.progress + 0.012);
      }

      // Phase state machine
      if (isInView && state.phase === 'idle' && state.progress > 0.3) {
        state.phase = 'emissions';
        state.phaseTime = elapsed;
      }
      if (state.phase === 'emissions') {
        const t = (elapsed - state.phaseTime) / 2; // 2 seconds to fill
        state.emissionFill = Math.min(0.031, t * 0.031);
        if (state.emissionFill >= 0.031) {
          state.phase = 'pause';
          state.phaseTime = elapsed;
        }
      }
      if (state.phase === 'pause' && elapsed - state.phaseTime > 1) {
        state.phase = 'reduction';
        state.phaseTime = elapsed;
      }
      if (state.phase === 'reduction') {
        const t = (elapsed - state.phaseTime) / 2.5; // 2.5 seconds to fill
        state.reductionFill = Math.min(1, t);
        if (state.reductionFill >= 1) {
          state.phase = 'done';
        }
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const progress = state.progress;
      if (progress <= 0) {
        animRef.current = requestAnimationFrame(draw);
        return;
      }

      const jarW = w * 0.32;
      const jarH = h * 0.6;
      const leftJarX = w * 0.25 - jarW / 2;
      const rightJarX = w * 0.75 - jarW / 2;
      const jarY = h * 0.12;

      // Draw left jar (emissions)
      drawJar(
        ctx, leftJarX, jarY, jarW, jarH,
        '255, 82, 82', // red
        state.emissionFill,
        'AI Emissions (2030)',
        '44 Mt CO₂/yr'
      );

      // Draw right jar (reductions)
      drawJar(
        ctx, rightJarX, jarY, jarW, jarH,
        '0, 230, 118', // green
        state.reductionFill,
        'AI Can Reduce (2035)',
        '1,400 Mt CO₂/yr'
      );

      // Draw particles
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      state.particles.forEach((p) => {
        let show = false;
        let alpha = 0;

        if (p.type === 'emission' && state.emissionFill > 0) {
          show = true;
          alpha = p.opacity * Math.min(1, state.emissionFill / 0.015);
          // Constrain particles to fill level
          const maxY = jarY + jarH;
          const minY = jarY + jarH - jarH * state.emissionFill;
          p.x = p.homeX + Math.sin(elapsed * p.speed + p.phase) * 4 + p.vx * Math.sin(elapsed * 0.3);
          p.y = minY + (maxY - minY) * ((p.homeY - (jarY + jarH * 0.97)) / (jarH * 0.031));
          p.y = Math.max(minY, Math.min(maxY - 2, p.y));
          p.y += Math.sin(elapsed * 0.8 + p.phase) * 2;
        }

        if (p.type === 'reduction' && state.reductionFill > 0) {
          show = true;
          alpha = p.opacity * Math.min(1, state.reductionFill * 2);
          // Particles appear from bottom as fill rises
          const maxY = jarY + jarH;
          const minY = jarY + jarH - jarH * state.reductionFill;
          const normalizedY = (p.homeY - jarY) / jarH;
          const particleY = minY + normalizedY * (maxY - minY);

          if (particleY < minY) {
            alpha = 0;
          } else {
            p.x = p.homeX + Math.sin(elapsed * p.speed + p.phase) * 3;
            p.y = particleY + Math.cos(elapsed * 0.6 + p.phase) * 2;
          }
        }

        if (!show || alpha <= 0) return;

        // Mouse repulsion
        const dmx = p.x - mx;
        const dmy = p.y - my;
        const dm = Math.sqrt(dmx * dmx + dmy * dmy);
        if (dm < 60 && dm > 0) {
          const force = (60 - dm) / 60 * 5;
          p.x += (dmx / dm) * force;
          p.y += (dmy / dm) * force;
        }

        const color = p.type === 'emission' ? '150, 150, 150' : '0, 230, 118';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${alpha})`;
        ctx.fill();
      });

      // Draw percentage labels inside jars
      if (state.emissionFill > 0.01) {
        ctx.save();
        ctx.font = "700 28px 'JetBrains Mono', monospace";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = `rgba(255, 82, 82, ${Math.min(1, state.emissionFill / 0.02)})`;
        ctx.fillText('3.1%', leftJarX + jarW / 2, jarY + jarH * 0.45);
        ctx.font = "500 11px 'Plus Jakarta Sans', sans-serif";
        ctx.fillStyle = `rgba(200, 200, 200, ${Math.min(1, state.emissionFill / 0.02) * 0.7})`;
        ctx.fillText('of capacity', leftJarX + jarW / 2, jarY + jarH * 0.45 + 22);
        ctx.restore();
      }

      if (state.reductionFill > 0.3) {
        ctx.save();
        ctx.font = "700 28px 'JetBrains Mono', monospace";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = `rgba(0, 230, 118, ${Math.min(1, (state.reductionFill - 0.3) / 0.3)})`;
        ctx.fillText('100%', rightJarX + jarW / 2, jarY + jarH * 0.45);
        ctx.font = "500 11px 'Plus Jakarta Sans', sans-serif";
        ctx.fillStyle = `rgba(200, 200, 200, ${Math.min(1, (state.reductionFill - 0.3) / 0.3) * 0.7})`;
        ctx.fillText('full potential', rightJarX + jarW / 2, jarY + jarH * 0.45 + 22);
        ctx.restore();
      }

      // Draw "32x" comparison in the middle when done
      if (state.phase === 'done') {
        const midX = w / 2;
        const midY = jarY + jarH * 0.5;
        const pulseAlpha = 0.7 + Math.sin(elapsed * 2) * 0.3;

        ctx.save();
        ctx.font = "800 36px 'JetBrains Mono', monospace";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = `rgba(0, 230, 118, ${pulseAlpha})`;
        ctx.fillText('32x', midX, midY - 10);

        ctx.font = "500 11px 'Plus Jakarta Sans', sans-serif";
        ctx.fillStyle = `rgba(200, 200, 200, 0.7)`;
        ctx.fillText('more reduction', midX, midY + 14);
        ctx.fillText('than pollution', midX, midY + 28);
        ctx.restore();

        // Arrow from left to right
        ctx.beginPath();
        ctx.moveTo(leftJarX + jarW + 12, midY - 10);
        ctx.lineTo(midX - 30, midY - 10);
        ctx.strokeStyle = 'rgba(255, 82, 82, 0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.beginPath();
        ctx.moveTo(midX + 30, midY - 10);
        ctx.lineTo(rightJarX - 12, midY - 10);
        ctx.strokeStyle = 'rgba(0, 230, 118, 0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Top title
      if (progress > 0.2) {
        const titleAlpha = Math.min(1, (progress - 0.2) / 0.3);
        ctx.save();
        ctx.font = "500 12px 'Plus Jakarta Sans', sans-serif";
        ctx.textAlign = 'center';
        ctx.fillStyle = `rgba(160, 160, 160, ${titleAlpha * 0.8})`;
        ctx.fillText('Scale: Each container represents 1,400 Mt CO₂ capacity', w / 2, h - 12);
        ctx.restore();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    if (isInView) {
      animRef.current = requestAnimationFrame(draw);
    }

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
  }, [isInView, initParticles]);

  return (
    <div ref={containerRef} className="relative w-full">
      <canvas
        ref={canvasRef}
        className="w-full cursor-crosshair"
        style={{ minHeight: 320 }}
      />
      <div className="absolute bottom-6 left-0 right-0 flex justify-center">
        <motion.p
          className="text-xs text-text-secondary/60 text-center max-w-md"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 6, duration: 0.5 }}
        >
          AI creates just 3.1% of the pollution it could help eliminate.
          The green jar fills completely only if companies use AI for climate goals.
        </motion.p>
      </div>
    </div>
  );
}
