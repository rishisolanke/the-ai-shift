import { useRef, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

/**
 * ScrollySection — the core Pudding.cool-style scrollytelling primitive.
 *
 * Pins a visualization to the viewport while narrative text panels scroll past.
 * Each text panel triggers a new `currentStep` in the visualization.
 *
 * Props:
 *   id            – section anchor for navigation
 *   sectionLabel  – e.g. "Dimension 4"
 *   sectionColor  – accent color for the section
 *   title         – section heading
 *   steps         – array of { title, text, source? }
 *   renderVisualization – (currentStep, progress) => JSX
 *   layout        – 'side' | 'overlay' | 'full'
 *   children      – optional content rendered after the scrolly (e.g. SourceCitation)
 */
export default function ScrollySection({
  id,
  sectionLabel,
  sectionColor = '#00e676',
  title,
  steps = [],
  renderVisualization,
  layout = 'overlay',
  children,
}) {
  const containerRef = useRef(null);
  const [currentStep, setCurrentStep] = useState(0);

  // Track scroll progress through the entire container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Map continuous scroll progress to step indices
  const breakpoints = useMemo(() => {
    const n = steps.length;
    if (n === 0) return [0, 1];
    // Each step gets an equal portion of scroll range
    // Add small buffer at start and end
    return steps.map((_, i) => (i + 0.5) / (n + 1));
  }, [steps.length]);

  const stepValues = useMemo(() => steps.map((_, i) => i), [steps.length]);

  const stepProgress = useTransform(
    scrollYProgress,
    [0, ...breakpoints, 1],
    [0, ...stepValues, steps.length - 1]
  );

  // Update currentStep when scroll changes
  useMotionValueEvent(stepProgress, 'change', (latest) => {
    const rounded = Math.round(Math.max(0, Math.min(latest, steps.length - 1)));
    setCurrentStep(rounded);
  });

  // Container height: enough scroll space for each step
  const containerHeight = `${(steps.length + 1) * 100}vh`;

  if (layout === 'side') {
    return (
      <section id={id}>
        <div
          ref={containerRef}
          className="relative"
          style={{ minHeight: containerHeight }}
        >
          {/* Sticky visualization — left side */}
          <div className="sticky top-0 h-screen w-full">
            <div className="absolute inset-0 flex">
              {/* Viz area: full width on mobile, 60% on desktop */}
              <div className="w-full lg:w-[60%] h-full relative">
                {renderVisualization(currentStep, scrollYProgress)}
              </div>

              {/* Steps area: desktop only — gradient scrim for visual separation */}
              <div className="hidden lg:block w-[40%] h-full bg-gradient-to-l from-black/60 via-black/30 to-transparent" />
            </div>
          </div>

          {/* Scrolling text steps */}
          <div className="relative z-10 pointer-events-none">
            {/* Section header step */}
            <div className="h-screen flex items-end lg:items-center justify-center lg:justify-end px-4 lg:px-0 pb-20 lg:pb-0">
              <div className="lg:w-[40%] lg:pr-12 pointer-events-auto">
                <div className="bg-black/90 lg:bg-black/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8 max-w-md ml-auto">
                  <span
                    className="text-xs font-mono uppercase tracking-wider"
                    style={{ color: sectionColor }}
                  >
                    {sectionLabel}
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-bold mt-2 text-white">
                    {title}
                  </h2>
                </div>
              </div>
            </div>

            {/* Narrative steps */}
            {steps.map((step, i) => (
              <StepCard
                key={i}
                step={step}
                index={i}
                currentStep={currentStep}
                sectionColor={sectionColor}
                layout="side"
              />
            ))}
          </div>
        </div>

        {/* After-scrolly content (SourceCitation, etc.) */}
        {children && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {children}
          </div>
        )}
      </section>
    );
  }

  // overlay or full layout
  return (
    <section id={id}>
      <div
        ref={containerRef}
        className="relative"
        style={{ minHeight: containerHeight }}
      >
        {/* Sticky visualization — full viewport */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {renderVisualization(currentStep, scrollYProgress)}
        </div>

        {/* Scrolling text steps */}
        <div className="relative z-10 pointer-events-none" style={{ marginTop: '-100vh' }}>
          {/* Section header step */}
          <div className="h-screen flex items-end pb-24 px-4 sm:px-8">
            <div className="pointer-events-auto max-w-lg">
              <motion.div
                className="bg-black/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20%' }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <span
                  className="text-xs font-mono uppercase tracking-wider"
                  style={{ color: sectionColor }}
                >
                  {sectionLabel}
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold mt-2 text-white">
                  {title}
                </h2>
              </motion.div>
            </div>
          </div>

          {/* Narrative steps */}
          {steps.map((step, i) => (
            <StepCard
              key={i}
              step={step}
              index={i}
              currentStep={currentStep}
              sectionColor={sectionColor}
              layout={layout}
            />
          ))}
        </div>
      </div>

      {/* After-scrolly content */}
      {children && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {children}
        </div>
      )}
    </section>
  );
}

function StepCard({ step, index, currentStep, sectionColor, layout }) {
  const isActive = currentStep === index;

  const alignment = layout === 'side'
    ? 'items-end lg:items-center justify-center lg:justify-end px-4 lg:px-0 pb-20 lg:pb-0'
    : layout === 'full'
      ? 'justify-center px-4'
      : 'justify-start px-4 sm:px-8';

  const cardWidth = layout === 'side'
    ? 'lg:w-[40%] lg:pr-12'
    : '';

  const cardAlignment = layout === 'side'
    ? 'ml-auto'
    : '';

  return (
    <div className={`min-h-screen flex items-center ${alignment}`}>
      <div className={cardWidth}>
        <motion.div
          className={`pointer-events-auto max-w-md ${cardAlignment}`}
          animate={{
            opacity: isActive ? 1 : 0.15,
            scale: isActive ? 1 : 0.97,
            y: isActive ? 0 : 10,
          }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={`backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 sm:p-8 ${layout === 'side' ? 'bg-black/90 lg:bg-black/80' : 'bg-black/80'}`}>
            {step.title && (
              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: sectionColor }}
              >
                {step.title}
              </h3>
            )}
            <p className="text-[#c0c0c0] text-[15px] leading-relaxed">
              {step.text}
            </p>
            {step.source && (
              <p className="mt-4 text-xs text-[#555]">
                Source: {step.source}
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
