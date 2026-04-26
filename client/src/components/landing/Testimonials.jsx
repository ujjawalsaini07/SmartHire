import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Quote, MessageSquare } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'UX Designer',
    company: 'Airbnb',
    content: 'SmartHire made my job search incredibly smooth. Within a week of creating my profile I had three interviews scheduled — and I landed my dream role.',
    rating: 5,
    initials: 'SJ',
    accent: 'var(--color-teal)',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Senior Engineer',
    company: 'Stripe',
    content: 'The skills assessment feature was a game-changer. Recruiters knew exactly what I could bring before we spoke — no more wasted screening calls.',
    rating: 5,
    initials: 'MC',
    accent: '#3B82F6',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Hiring Manager',
    company: 'Figma',
    content: 'As a recruiter, the candidate quality on SmartHire blows every other platform out of the water. The pipeline tools save us hours every week.',
    rating: 5,
    initials: 'ER',
    accent: '#7C3AED',
  },
];

const Testimonials = () => {
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
        <div className="max-w-2xl mx-auto text-center mb-14">
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="section-label justify-center"
          >
            <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
            Testimonials
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.06 }}
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            People{' '}
            <span className="gradient-text">love</span>
            {' '}SmartHire
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.12 }}
            className="text-[var(--color-text-secondary)] dark:text-[var(--dm-text-secondary)] text-lg"
          >
            Join over 50,000 professionals who found their next opportunity here.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.article
              key={t.id}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.52, delay: i * 0.10, ease: [0.22, 1, 0.36, 1] }}
              className="card p-7 flex flex-col gap-5 relative"
            >
              {/* Quote icon */}
              <div
                className="absolute top-6 right-6 w-8 h-8 rounded-[var(--radius-md)] flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,0.05)' }}
              >
                <Quote className="w-4 h-4 text-[var(--color-text-muted)] dark:text-[var(--dm-text-muted)]" aria-hidden="true" />
              </div>

              {/* Stars */}
              <div className="flex gap-0.5" aria-label={`${t.rating} out of 5 stars`} role="img">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className={`w-4 h-4 ${j < t.rating ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-[var(--color-border)]'}`}
                    aria-hidden="true"
                  />
                ))}
              </div>

              {/* Content */}
              <blockquote className="text-[15px] text-[var(--color-text-primary)] dark:text-[var(--dm-text-primary)] leading-relaxed flex-1">
                "{t.content}"
              </blockquote>

              {/* Divider */}
              <div className="h-px" style={{ background: 'var(--color-border)' }} />

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ background: t.accent }}
                >
                  {t.initials}
                </div>
                <div>
                  <p
                    className="text-sm font-semibold text-[var(--color-text-primary)] dark:text-[var(--dm-text-primary)]"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {t.name}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] dark:text-[var(--dm-text-muted)]">
                    {t.role} · {t.company}
                  </p>
                </div>
              </div>

              {/* Accent bar at bottom */}
              <div
                className="absolute bottom-0 left-0 right-0 h-[3px] rounded-b-[var(--radius-xl)]"
                style={{ background: t.accent, opacity: 0.7 }}
              />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
