import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';

/*
  Dense particle scatter — like a fintech particle cloud.
  Each data category = a cloud of hundreds of tiny dots.
  Curved arcs connect clusters. Labels float above.
  Canvas-based for performance (renders ~2000+ particles).
*/

const SECTOR_CLUSTERS = [
  { name: 'Tech', value: 37.2, particles: 450, color: [79, 195, 247], x: 0.22, y: 0.3 },
  { name: 'Finance', value: 29.8, particles: 360, color: [0, 230, 118], x: 0.72, y: 0.25 },
  { name: 'Professional', value: 26.4, particles: 320, color: [179, 136, 255], x: 0.18, y: 0.7 },
  { name: 'Healthcare', value: 18.9, particles: 230, color: [24, 255, 255], x: 0.5, y: 0.52 },
  { name: 'Manufacturing', value: 16.3, particles: 200, color: [255, 215, 64], x: 0.78, y: 0.68 },
  { name: 'Retail', value: 14.7, particles: 180, color: [255, 171, 64], x: 0.45, y: 0.82 },
];

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export default function ParticleDataCloud() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-60px' });
  const animRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const progressRef = useRef(0);
  const particlesRef = useRef([]);
  const arcsRef = useRef([]);
  const [hoveredCluster, setHoveredCluster] = useState(null);

  const initParticles = useCallback((w, h) => {
    const rng = seededRandom(123);
    const particles = [];
    const dpr = window.devicePixelRatio || 1;

    SECTOR_CLUSTERS.forEach((cluster, ci) => {
      const cx = cluster.x * w;
      const cy = cluster.y * h;
      // Spread proportional to particle count
      const spread = Math.sqrt(cluster.particles) * 2.8;

      for (let i = 0; i < cluster.particles; i++) {
        // Gaussian-ish distribution for organic cloud shape
        const angle = rng() * Math.PI * 2;
        const dist = (rng() + rng() + rng()) / 3 * spread;
        const px = cx + Math.cos(angle) * dist;
        const py = cy + Math.sin(angle) * dist;

        particles.push({
          x: px,
          y: py,
          homeX: px,
          homeY: py,
          r: rng() * 1.8 + 0.3,
          opacity: rng() * 0.6 + 0.2,
          color: cluster.color,
          cluster: ci,
          vx: (rng() - 0.5) * 0.15,
          vy: (rng() - 0.5) * 0.15,
          phase: rng() * Math.PI * 2,
        });
      }
    });

    // Generate curved arcs between nearby clusters
    const arcs = [];
    for (let i = 0; i < SECTOR_CLUSTERS.length; i++) {
      for (let j = i + 1; j < SECTOR_CLUSTERS.length; j++) {
        const a = SECTOR_CLUSTERS[i];
        const b = SECTOR_CLUSTERS[j];
        const dx = (a.x - b.x) * w;
        const dy = (a.y - b.y) * h;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < w * 0.55) {
          arcs.push({
            x1: a.x * w, y1: a.y * h,
            x2: b.x * w, y2: b.y * h,
            color1: a.color, color2: b.color,
            dist,
          });
        }
      }
    }

    particlesRef.current = particles;
    arcsRef.current = arcs;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const dpr = window.devicePixelRatio || 1;
    let w, h;

    const resize = () => {
      w = container.offsetWidth;
      h = Math.max(400, Math.min(w * 0.65, 520));
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      initParticles(w, h);
    };

    resize();

    const ctx = canvas.getContext('2d');
    let startTime = null;

    const draw = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;

      // Animate entrance
      if (isInView && progressRef.current < 1) {
        progressRef.current = Math.min(1, progressRef.current + 0.015);
      }
      const progress = progressRef.current;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Draw arcs first (behind particles)
      const arcProgress = Math.max(0, (progress - 0.3) / 0.7);
      if (arcProgress > 0) {
        arcsRef.current.forEach((arc) => {
          const midX = (arc.x1 + arc.x2) / 2;
          const midY = (arc.y1 + arc.y2) / 2;
          const offsetX = (arc.y2 - arc.y1) * 0.25;
          const offsetY = -(arc.x2 - arc.x1) * 0.25;

          ctx.beginPath();
          ctx.moveTo(arc.x1, arc.y1);
          ctx.quadraticCurveTo(midX + offsetX, midY + offsetY, arc.x2, arc.y2);
          const grad = ctx.createLinearGradient(arc.x1, arc.y1, arc.x2, arc.y2);
          grad.addColorStop(0, `rgba(${arc.color1.join(',')}, ${0.12 * arcProgress})`);
          grad.addColorStop(1, `rgba(${arc.color2.join(',')}, ${0.12 * arcProgress})`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Traveling dot along arc
          const t = (elapsed * 0.3 + arc.dist * 0.001) % 1;
          const dotX = (1 - t) * (1 - t) * arc.x1 + 2 * (1 - t) * t * (midX + offsetX) + t * t * arc.x2;
          const dotY = (1 - t) * (1 - t) * arc.y1 + 2 * (1 - t) * t * (midY + offsetY) + t * t * arc.y2;
          ctx.beginPath();
          ctx.arc(dotX, dotY, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${arc.color1.join(',')}, ${0.6 * arcProgress})`;
          ctx.fill();
        });
      }

      // Draw particles
      particlesRef.current.forEach((p) => {
        // Gentle drift
        p.x = p.homeX + Math.sin(elapsed * 0.5 + p.phase) * 3 + p.vx * elapsed * 10;
        p.y = p.homeY + Math.cos(elapsed * 0.4 + p.phase) * 3 + p.vy * elapsed * 10;

        // Mouse repulsion
        const dmx = p.x - mx;
        const dmy = p.y - my;
        const dm = Math.sqrt(dmx * dmx + dmy * dmy);
        if (dm < 80 && dm > 0) {
          const force = (80 - dm) / 80 * 8;
          p.x += (dmx / dm) * force;
          p.y += (dmy / dm) * force;
        }

        const alpha = p.opacity * progress;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color.join(',')}, ${alpha})`;
        ctx.fill();
      });

      // Draw cluster labels
      if (progress > 0.5) {
        const labelAlpha = Math.min(1, (progress - 0.5) * 2);
        SECTOR_CLUSTERS.forEach((cluster, ci) => {
          const cx = cluster.x * w;
          const cy = cluster.y * h;
          const spread = Math.sqrt(cluster.particles) * 2.8;
          const isHovered = hoveredCluster === ci;

          // Label background
          ctx.save();
          const labelY = cy - spread - 18;
          const text = `${cluster.name}  ${cluster.value}%`;
          ctx.font = `${isHovered ? '600' : '500'} ${isHovered ? 13 : 11}px 'Plus Jakarta Sans', sans-serif`;
          const metrics = ctx.measureText(text);
          const pad = 8;

          ctx.fillStyle = `rgba(13, 13, 13, ${0.85 * labelAlpha})`;
          ctx.beginPath();
          const rx = cx - metrics.width / 2 - pad;
          const ry = labelY - 8;
          const rw = metrics.width + pad * 2;
          const rh = 22;
          ctx.roundRect(rx, ry, rw, rh, 6);
          ctx.fill();

          ctx.strokeStyle = `rgba(${cluster.color.join(',')}, ${0.4 * labelAlpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.fillStyle = `rgba(${cluster.color.join(',')}, ${labelAlpha})`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(text, cx, labelY);
          ctx.restore();
        });
      }

      animRef.current = requestAnimationFrame(draw);
    };

    if (isInView) {
      animRef.current = requestAnimationFrame(draw);
    }

    const handleMouse = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };

      // Check cluster hover
      let found = null;
      SECTOR_CLUSTERS.forEach((cluster, ci) => {
        const cx = cluster.x * w;
        const cy = cluster.y * h;
        const spread = Math.sqrt(cluster.particles) * 3;
        const dx = mouseRef.current.x - cx;
        const dy = mouseRef.current.y - cy;
        if (Math.sqrt(dx * dx + dy * dy) < spread) {
          found = ci;
        }
      });
      setHoveredCluster(found);
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
      setHoveredCluster(null);
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
  }, [isInView, initParticles, hoveredCluster]);

  return (
    <div ref={containerRef} className="relative w-full">
      <canvas
        ref={canvasRef}
        className="w-full cursor-crosshair"
        style={{ minHeight: 400 }}
      />
      {hoveredCluster !== null && (
        <motion.div
          className="absolute bottom-4 left-4 bg-[#0d0d0d]/90 border border-white/10 rounded-xl px-4 py-3 pointer-events-none"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-sm font-semibold" style={{ color: `rgb(${SECTOR_CLUSTERS[hoveredCluster].color.join(',')})` }}>
            {SECTOR_CLUSTERS[hoveredCluster].name}
          </p>
          <p className="text-xs text-[#a0a0a0] mt-1">
            AI Adoption: <span className="text-white font-mono">{SECTOR_CLUSTERS[hoveredCluster].value}%</span>
          </p>
          <p className="text-xs text-[#666] mt-0.5">
            {SECTOR_CLUSTERS[hoveredCluster].particles} data points visualized
          </p>
        </motion.div>
      )}
    </div>
  );
}
