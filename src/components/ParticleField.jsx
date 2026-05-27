import { useEffect, useRef } from 'react';

export default function ParticleField({ count = 60, color = '#00e676', speed = 0.3, connectDistance = 120, mouseReactive = true }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };

    const initParticles = () => {
      particles = [];
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          r: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.5 + 0.2,
        });
      }
    };

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Update & draw particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // Mouse interaction — particles flee from cursor
        if (mouseReactive && mx > 0) {
          const dmx = p.x - mx;
          const dmy = p.y - my;
          const dm = Math.sqrt(dmx * dmx + dmy * dmy);
          if (dm < 100 && dm > 0) {
            const force = (100 - dm) / 100 * 1.5;
            p.x += (dmx / dm) * force;
            p.y += (dmy / dm) * force;
          }
        }

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectDistance) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = color;
            ctx.globalAlpha = (1 - dist / connectDistance) * 0.15;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Mouse attraction lines — connect nearby particles to cursor
      if (mouseReactive && mx > 0) {
        for (const p of particles) {
          const dmx = p.x - mx;
          const dmy = p.y - my;
          const dm = Math.sqrt(dmx * dmx + dmy * dmy);
          if (dm < connectDistance * 1.2) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mx, my);
            ctx.strokeStyle = color;
            ctx.globalAlpha = (1 - dm / (connectDistance * 1.2)) * 0.1;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(draw);
    };

    resize();
    initParticles();
    draw();

    // Mouse tracking on the parent section
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    // Listen on the parent element so pointer-events-none on canvas doesn't block
    const parent = canvas.parentElement;
    if (parent && mouseReactive) {
      parent.addEventListener('mousemove', handleMouseMove);
      parent.addEventListener('mouseleave', handleMouseLeave);
    }

    window.addEventListener('resize', () => { resize(); initParticles(); });
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      if (parent && mouseReactive) {
        parent.removeEventListener('mousemove', handleMouseMove);
        parent.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [count, color, speed, connectDistance, mouseReactive]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}
