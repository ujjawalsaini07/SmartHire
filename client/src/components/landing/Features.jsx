import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Zap, ShieldCheck, Rocket, BarChart3, Sparkles, Globe } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'AI-Powered Matching',
    description: 'Our intelligent algorithm surfaces roles that align with your skills, experience, and career goals — not just keywords.',
    accent: 'var(--color-teal)',
    bg: 'rgba(0,201,177,0.10)',
  },
  {
    icon: ShieldCheck,
    title: 'Verified Employers',
    description: 'Every company on SmartHire goes through our verification process — so you only see legitimate, quality opportunities.',
    accent: '#3B82F6',
    bg: 'rgba(59,130,246,0.10)',
  },
  {
    icon: Rocket,
    title: 'One-Click Apply',
    description: 'Apply to multiple roles in seconds using your saved SmartHire profile and resume — no re-filling forms.',
    accent: '#7C3AED',
    bg: 'rgba(124,58,237,0.10)',
  },
  {
    icon: BarChart3,
    title: 'Application Analytics',
    description: 'Track every application with real-time status updates, interview schedules, and offer timelines in one place.',
    accent: '#F59E0B',
    bg: 'rgba(245,158,11,0.10)',
  },
  {
    icon: Globe,
    title: 'Remote-First Network',
    description: '50,000+ companies offering remote and hybrid positions. Work from anywhere while building your dream career.',
    accent: '#EF4444',
    bg: 'rgba(239,68,68,0.10)',
  },
  {
    icon: Sparkles,
    title: 'Skill Assessments',
    description: 'Stand out from the crowd with verified skill badges that show recruiters exactly what you bring to the table.',
    accent: '#10B981',
    bg: 'rgba(16,185,129,0.10)',
  },
];

const Features = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-24" ref={ref}>
      <div className="container-custom">

        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="section-label justify-center"
          >
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            Why SmartHire
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="text-4xl md:text-5xl font-bold mb-4 text-balance"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Built for the way{' '}
            <span className="gradient-text">people hire</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="text-[var(--color-text-secondary)] dark:text-[var(--dm-text-secondary)] text-lg"
          >
            From discovery to offer letter, SmartHire streamlines every step of the hiring process for both candidates and companies.
          </motion.p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.article
                key={feat.title}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className="card card-hover p-7 group"
              >
                <div
                  className="w-12 h-12 rounded-[var(--radius-lg)] flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: feat.bg }}
                >
                  <Icon className="w-6 h-6" style={{ color: feat.accent }} aria-hidden="true" />
                </div>

                <h3
                  className="text-lg font-bold mb-2.5 text-[var(--color-text-primary)] dark:text-[var(--dm-text-primary)]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {feat.title}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] dark:text-[var(--dm-text-secondary)] leading-relaxed">
                  {feat.description}
                </p>

                {/* Accent corner line */}
                <div
                  className="mt-5 h-0.5 w-0 group-hover:w-10 rounded-full transition-all duration-500"
                  style={{ background: feat.accent }}
                />
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
