import { useEffect, useRef } from 'react';

/*
  EducationDivideScrolly — Full-viewport Canvas visualization for Skills Gap section.

  Driven by currentStep prop (0-2) from ScrollySection:
    0: The 11x gap — three circles sized by risk (22%, 12%, 2%)
    1: What skills pay — horizontal skill bars (lollipop style)
    2: What employers want — WEF top 8 skills ranked cards
*/

function lerp(a, b, t) {
  return a + (b - a) * Math.min(1, Math.max(0, t));
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
}

const SKILLS = [
  { skill: 'Data Analysis', demand: 58263, pay: '$170K' },
  { skill: 'Machine Learning', demand: 42150, pay: '$165K' },
  { skill: 'Python Programming', demand: 38920, pay: '$155K' },
  { skill: 'NLP', demand: 28450, pay: '$172K' },
  { skill: 'Cloud Computing (AI/ML)', demand: 25800, pay: '$160K' },
  { skill: 'Computer Vision', demand: 18200, pay: '$168K' },
  { skill: 'AI Ethics', demand: 12400, pay: '$145K' },
  { skill: 'Prompt Engineering', demand: 9800, pay: '$130K' },
];

const WEF_SKILLS = [
  { skill: 'Analytical Thinking', rank: 1, note: '#1 - above AI itself' },
  { skill: 'Resilience & Flexibility', rank: 2, note: 'Human advantage' },
  { skill: 'AI & Big Data', rank: 3, note: 'Technical foundation' },
  { skill: 'Leadership', rank: 4, note: 'Human advantage' },
  { skill: 'Creative Thinking', rank: 5, note: 'Human advantage' },
  { skill: 'Technology Literacy', rank: 6, note: 'Baseline requirement' },
  { skill: 'Curiosity & Learning', rank: 7, note: 'Human advantage' },
  { skill: 'Systems Thinking', rank: 8, note: 'Human advantage' },
];

export default function EducationDivideScrolly({ currentStep = 0 }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animRef = useRef(null);
  const stepRef = useRef(currentStep);
  const prevStepRef = useRef(-1);
  const stepStartRef = useRef(null);
  const startTimeRef = useRef(null);

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

      // ====== STEP 0: EDUCATION RISK CIRCLES ======
      if (step === 0) {
        const circAlpha = entrance;

        if (circAlpha > 0.01) {
          const centerY = h * 0.42;
          const maxR = Math.min(w * 0.14, 110);
          const grow = entrance;

          const tiers = [
            { label: 'No Degree', sublabel: 'Lower Secondary', risk: 22, color: '255, 82, 82', x: w * 0.22 },
            { label: "Bachelor's", sublabel: 'Upper Secondary', risk: 12, color: '255, 215, 64', x: w * 0.5 },
            { label: 'Graduate+', sublabel: 'University+', risk: 2, color: '0, 230, 118', x: w * 0.78 },
          ];

          tiers.forEach((tier) => {
            const r = (tier.risk / 22) * maxR * grow;
            const pulse = 1 + Math.sin(elapsed * 1.5 + tier.x * 0.01) * 0.03;
            const rr = r * pulse;

            // Outer glow
            ctx.beginPath();
            ctx.arc(tier.x, centerY, rr + 8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${tier.color}, ${circAlpha * 0.04})`;
            ctx.fill();

            // Main circle
            ctx.beginPath();
            ctx.arc(tier.x, centerY, rr, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${tier.color}, ${circAlpha * 0.1})`;
            ctx.fill();
            ctx.strokeStyle = `rgba(${tier.color}, ${circAlpha * 0.5})`;
            ctx.lineWidth = 2;
            ctx.stroke();

            // Risk %
            const fontSize = Math.max(18, rr * 0.45);
            ctx.font = `800 ${fontSize}px 'JetBrains Mono', monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = `rgba(${tier.color}, ${circAlpha * 0.95})`;
            ctx.fillText(`${tier.risk}%`, tier.x, centerY);

            // Labels
            ctx.font = "600 13px 'Plus Jakarta Sans', sans-serif";
            ctx.fillStyle = `rgba(220, 220, 220, ${circAlpha * 0.8})`;
            ctx.fillText(tier.label, tier.x, centerY + rr + 25);
            ctx.font = "400 10px 'Plus Jakarta Sans', sans-serif";
            ctx.fillStyle = `rgba(150, 150, 160, ${circAlpha * 0.5})`;
            ctx.fillText(tier.sublabel, tier.x, centerY + rr + 42);
          });

          // 11x connector
          if (grow > 0.5) {
            const connAlpha = circAlpha * easeOutCubic((grow - 0.5) * 2);
            const r1 = (22 / 22) * maxR * grow;
            const r3 = (2 / 22) * maxR * grow;

            ctx.beginPath();
            ctx.setLineDash([5, 5]);
            ctx.moveTo(tiers[0].x + r1 + 12, centerY);
            ctx.lineTo(tiers[2].x - r3 - 12, centerY);
            ctx.strokeStyle = `rgba(255, 255, 255, ${connAlpha * 0.15})`;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.font = "800 28px 'JetBrains Mono', monospace";
            ctx.textAlign = 'center';
            ctx.fillStyle = `rgba(255, 215, 64, ${connAlpha * 0.85})`;
            ctx.shadowColor = 'rgba(255, 215, 64, 0.3)';
            ctx.shadowBlur = 10;
            ctx.fillText('11×', w * 0.5, centerY - 14);
            ctx.shadowBlur = 0;
            ctx.font = "500 12px 'Plus Jakarta Sans', sans-serif";
            ctx.fillStyle = `rgba(200, 200, 200, ${connAlpha * 0.65})`;
            ctx.fillText('higher displacement risk', w * 0.5, centerY + 6);
          }

          // Section title
          ctx.font = "600 14px 'Plus Jakarta Sans', sans-serif";
          ctx.textAlign = 'center';
          ctx.fillStyle = `rgba(200, 200, 200, ${circAlpha * 0.6})`;
          ctx.fillText('Automation Risk by Education Level', w / 2, h * 0.15);
          ctx.font = "400 11px 'Plus Jakarta Sans', sans-serif";
          ctx.fillStyle = `rgba(140, 140, 150, ${circAlpha * 0.45})`;
          ctx.fillText('Source: OECD Employment Outlook', w / 2, h * 0.15 + 20);
        }
      }

      // ====== STEP 1: SKILLS DEMAND BARS ======
      if (step === 1) {
        const barAlpha = entrance;

        if (barAlpha > 0.01) {
          const chartLeft = w * 0.3;
          const chartRight = w * 0.85;
          const chartTop = h * 0.15;
          const barH = 24;
          const gap = 12;
          const maxDemand = 58263;
          const barGrow = easeOutCubic(Math.min(1, stepAge / 1.0));

          // Title
          ctx.save();
          ctx.font = "600 14px 'Plus Jakarta Sans', sans-serif";
          ctx.textAlign = 'center';
          ctx.fillStyle = `rgba(200, 200, 200, ${barAlpha * 0.7})`;
          ctx.fillText('Top AI Skills by Job Demand', w * 0.55, chartTop - 5);

          SKILLS.forEach((s, i) => {
            const y = chartTop + 25 + i * (barH + gap);
            const barW = (s.demand / maxDemand) * (chartRight - chartLeft) * barGrow;

            // Skill name (left)
            ctx.font = "500 11px 'Plus Jakarta Sans', sans-serif";
            ctx.textAlign = 'right';
            ctx.fillStyle = `rgba(200, 200, 200, ${barAlpha * 0.75})`;
            ctx.fillText(s.skill, chartLeft - 12, y + barH / 2 + 1);

            // Bar
            const grad = ctx.createLinearGradient(chartLeft, 0, chartLeft + barW, 0);
            grad.addColorStop(0, `rgba(79, 125, 242, ${barAlpha * 0.5})`);
            grad.addColorStop(1, `rgba(160, 120, 255, ${barAlpha * 0.4})`);
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.roundRect(chartLeft, y, barW, barH, 4);
            ctx.fill();

            // Lollipop dot
            ctx.beginPath();
            ctx.arc(chartLeft + barW, y + barH / 2, 5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(160, 120, 255, ${barAlpha * 0.8})`;
            ctx.fill();

            // Demand count + pay
            ctx.font = "700 10px 'JetBrains Mono', monospace";
            ctx.textAlign = 'left';
            ctx.fillStyle = `rgba(160, 120, 255, ${barAlpha * 0.8})`;
            ctx.fillText(`${(s.demand / 1000).toFixed(0)}K jobs`, chartLeft + barW + 12, y + barH / 2 - 4);
            ctx.font = "400 9px 'JetBrains Mono', monospace";
            ctx.fillStyle = `rgba(0, 230, 118, ${barAlpha * 0.6})`;
            ctx.fillText(s.pay, chartLeft + barW + 12, y + barH / 2 + 10);
          });

          ctx.restore();
        }
      }

      // ====== STEP 2: WEF SKILLS RANKED ======
      if (step === 2) {
        const cardAlpha = entrance;

        if (cardAlpha > 0.01) {
          const startY = h * 0.12;
          const centerX = w * 0.5;
          const cardW = Math.min(360, w * 0.6);
          const cardH = 42;
          const gap = 8;

          // Title
          ctx.save();
          ctx.font = "600 14px 'Plus Jakarta Sans', sans-serif";
          ctx.textAlign = 'center';
          ctx.fillStyle = `rgba(200, 200, 200, ${cardAlpha * 0.7})`;
          ctx.fillText('WEF: Top Skills Employers Want by 2030', centerX, startY);

          const cardGrow = easeOutCubic(Math.min(1, stepAge / 1.0));

          WEF_SKILLS.forEach((s, i) => {
            const stagger = easeOutCubic(Math.max(0, (cardGrow - i * 0.08)));
            if (stagger <= 0) return;

            const y = startY + 20 + i * (cardH + gap);
            const cx = centerX - cardW / 2;

            // Card background
            ctx.fillStyle = `rgba(20, 20, 30, ${cardAlpha * stagger * 0.7})`;
            ctx.beginPath();
            ctx.roundRect(cx, y, cardW, cardH, 8);
            ctx.fill();
            ctx.strokeStyle = `rgba(255,255,255, ${cardAlpha * stagger * 0.06})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Rank number
            const isTop3 = s.rank <= 3;
            const rankColor = isTop3 ? '160, 120, 255' : '100, 100, 120';
            ctx.beginPath();
            ctx.arc(cx + 24, y + cardH / 2, 14, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${rankColor}, ${cardAlpha * stagger * 0.2})`;
            ctx.fill();
            ctx.font = "700 14px 'JetBrains Mono', monospace";
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = `rgba(${rankColor}, ${cardAlpha * stagger * 0.9})`;
            ctx.fillText(s.rank, cx + 24, y + cardH / 2);

            // Skill name
            ctx.font = "600 13px 'Plus Jakarta Sans', sans-serif";
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = `rgba(220, 220, 220, ${cardAlpha * stagger * 0.85})`;
            ctx.fillText(s.skill, cx + 48, y + cardH / 2);

            // Note
            ctx.font = "400 10px 'Plus Jakarta Sans', sans-serif";
            ctx.textAlign = 'right';
            const noteColor = s.note.includes('Human') ? '0, 230, 118' : s.note.includes('#1') ? '255, 215, 64' : '140, 140, 160';
            ctx.fillStyle = `rgba(${noteColor}, ${cardAlpha * stagger * 0.6})`;
            ctx.fillText(s.note, cx + cardW - 12, y + cardH / 2);
          });

          // Highlight callout
          if (cardGrow > 0.5) {
            const hlAlpha = cardAlpha * easeOutCubic((cardGrow - 0.5) * 2);
            ctx.font = "500 11px 'Plus Jakarta Sans', sans-serif";
            ctx.textAlign = 'center';
            ctx.fillStyle = `rgba(255, 215, 64, ${hlAlpha * 0.6})`;
            const bottomY = startY + 20 + WEF_SKILLS.length * (cardH + gap) + 16;
            ctx.fillText('5 of 8 top skills are uniquely human, not technical', centerX, bottomY);
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
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
