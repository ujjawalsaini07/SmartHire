import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Briefcase, Users, Zap } from 'lucide-react';

const CTASection = () => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section className="py-24 overflow-hidden" ref={ref}>
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[var(--radius-2xl)] px-8 py-16 sm:px-16 sm:py-20 text-center"
          style={{
            background: 'linear-gradient(-45deg, #0D2137 0%, #00796B 40%, #00C9B1 70%, #003D36 100%)',
            backgroundSize: '300% 300%',
            animation: 'gradientShift 10s ease infinite',
          }}
        >
          {/* Mesh blobs */}
          <div
            className="pointer-events-none absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, rgba(170,255,199,0.7) 0%, transparent 70%)' }}
          />
          <div
            className="pointer-events-none absolute -bottom-24 -left-24 w-[350px] h-[350px] rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, rgba(0,201,177,0.7) 0%, transparent 70%)' }}
          />
          {/* Grid */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.06]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="cta-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cta-grid)" />
          </svg>

          {/* Content */}
          <div className="relative z-10 max-w-3xl mx-auto">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/25 mb-8">
              <Zap className="w-3.5 h-3.5 text-[var(--color-mint)]" aria-hidden="true" />
              <span className="text-sm font-medium text-white">Start free • No credit card required</span>
            </div>

            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance"
              style={{ fontFamily: 'var(--font-display)', lineHeight: 1.1 }}
            >
              Ready to take the{' '}
              <span style={{ color: 'var(--color-mint)' }}>next step?</span>
            </h2>

            <p className="text-lg text-white/75 max-w-xl mx-auto mb-10">
              Whether you're chasing your next opportunity or building a world-class team, SmartHire powers the connection.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/register?role=jobseeker')}
                className="btn btn-lg w-full sm:w-auto group"
                style={{
                  background: 'white',
                  color: 'var(--color-navy)',
                  border: '2px solid white',
                  fontWeight: 700,
                }}
              >
                <Briefcase className="w-5 h-5" aria-hidden="true" />
                Find a Job
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </button>

              <button
                onClick={() => navigate('/register?role=recruiter')}
                className="btn btn-lg w-full sm:w-auto"
                style={{
                  background: 'transparent',
                  color: 'white',
                  border: '2px solid rgba(255,255,255,0.45)',
                }}
              >
                <Users className="w-5 h-5" aria-hidden="true" />
                Start Hiring
              </button>
            </div>

            {/* Social proof */}
            <p className="mt-8 text-sm text-white/50">
              Trusted by 50,000+ professionals at Google, Stripe, Figma, and more.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
