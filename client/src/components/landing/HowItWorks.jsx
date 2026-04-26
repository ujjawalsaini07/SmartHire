import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { UserPlus, Search, Send, CheckCircle, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    step: '01',
    title: 'Create your profile',
    description: 'Sign up in 2 minutes. Add your experience, skills, and career goals to build a compelling profile that gets noticed.',
    accent: 'var(--color-teal)',
    bg: 'rgba(0,201,177,0.10)',
  },
  {
    icon: Search,
    step: '02',
    title: 'Discover opportunities',
    description: 'Browse thousands of verified jobs — filtered by role, location, salary, and job type. Save the ones you love.',
    accent: '#3B82F6',
    bg: 'rgba(59,130,246,0.10)',
  },
  {
    icon: Send,
    step: '03',
    title: 'Apply in one click',
    description: 'Apply instantly using your SmartHire profile. Track each application with real-time status updates.',
    accent: '#7C3AED',
    bg: 'rgba(124,58,237,0.10)',
  },
  {
    icon: CheckCircle,
    step: '04',
    title: 'Get hired',
    description: 'Schedule interviews, receive offers, and start your new chapter — all from one unified platform.',
    accent: '#10B981',
    bg: 'rgba(16,185,129,0.10)',
  },
];

const HowItWorks = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      ref={ref}
      className="py-24"
      style={{
        background: 'linear-gradient(135deg, var(--color-bg-subtle) 0%, var(--color-bg-base) 100%)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div className="container-custom">

        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="section-label justify-center"
          >
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            How It Works
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.06 }}
            className="text-4xl md:text-5xl font-bold mb-4 text-balance"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Your dream job in{' '}
            <span className="gradient-text">four steps</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="text-[var(--color-text-secondary)] dark:text-[var(--dm-text-secondary)] text-lg"
          >
            We've made the job search process simple, transparent, and fast so you can focus on what matters — landing the role.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line — desktop */}
          <div
            className="absolute top-[36px] left-[12.5%] right-[12.5%] h-[2px] hidden lg:block"
            style={{
              background: 'linear-gradient(90deg, var(--color-teal), #3B82F6, #7C3AED, #10B981)',
              opacity: 0.25,
              zIndex: 0,
            }}
          />

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 relative z-10">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 28 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.55, delay: i * 0.10, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col items-center text-center"
                >
                  {/* Icon circle */}
                  <div className="relative mb-6">
                    <div
                      className="w-[72px] h-[72px] rounded-full flex items-center justify-center shadow-md"
                      style={{ background: 'var(--color-bg-card)', border: '2px solid var(--color-border)' }}
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ background: step.bg }}
                      >
                        <Icon className="w-6 h-6" style={{ color: step.accent }} aria-hidden="true" />
                      </div>
                    </div>
                    {/* Step number */}
                    <div
                      className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
                      style={{ background: step.accent }}
                    >
                      {i + 1}
                    </div>
                  </div>

                  <h3
                    className="text-lg font-bold mb-2 text-[var(--color-text-primary)] dark:text-[var(--dm-text-primary)]"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)] dark:text-[var(--dm-text-secondary)] leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
