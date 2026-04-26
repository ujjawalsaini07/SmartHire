import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Github, Mail, ArrowUpRight } from 'lucide-react';
import Logo from '@components/common/Logo';

const footerLinks = {
  'Job Seekers': [
    { label: 'Browse Jobs', to: '/jobs' },
    { label: 'Career Advice', to: '/about' },
    { label: 'Resume Tips', to: '/about' },
    { label: 'Interview Prep', to: '/about' },
  ],
  'Employers': [
    { label: 'Post a Job', to: '/register?role=recruiter' },
    { label: 'Hiring Guide', to: '/about' },
    { label: 'Recruiter Resources', to: '/contact' },
    { label: 'Candidate Search', to: '/recruiter/candidates' },
  ],
  'Company': [
    { label: 'About Us', to: '/about' },
    { label: 'Contact', to: '/contact' },
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Terms of Service', to: '/terms' },
  ],
};

const socialLinks = [
  { icon: Twitter,  href: 'https://twitter.com',  label: 'Twitter'  },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: Github,   href: 'https://github.com',   label: 'GitHub'   },
  { icon: Mail,     href: 'mailto:support@smarthire.io', label: 'Email' },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative mt-20 border-t"
      style={{
        borderColor: 'var(--color-border)',
        backgroundColor: 'var(--color-bg-card)',
      }}
    >
      {/* Gradient top line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: 'linear-gradient(90deg, transparent 0%, var(--color-teal) 40%, var(--color-mint) 60%, transparent 100%)' }}
      />

      <div className="container-custom py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <Logo size="md" className="mb-5" />

            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] dark:text-[var(--dm-text-secondary)] mb-6 max-w-xs">
              The modern platform connecting ambitious talent with world-class companies. Smarter hiring starts here.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-2">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="
                    w-9 h-9 flex items-center justify-center rounded-[var(--radius-lg)]
                    border border-[var(--color-border)] dark:border-[var(--dm-border)]
                    bg-[var(--color-bg-base)] dark:bg-[var(--dm-bg-elevated)]
                    text-[var(--color-text-muted)] dark:text-[var(--dm-text-muted)]
                    hover:border-[var(--color-teal)] hover:text-[var(--color-teal)]
                    dark:hover:border-[var(--dm-accent-teal)] dark:hover:text-[var(--dm-accent-teal)]
                    hover:-translate-y-0.5 transition-all duration-200
                  "
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3
                className="text-xs font-bold uppercase tracking-[0.10em] mb-4"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {title}
              </h3>
              <ul className="space-y-2.5">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="
                        text-sm text-[var(--color-text-secondary)] dark:text-[var(--dm-text-secondary)]
                        hover:text-[var(--color-teal)] dark:hover:text-[var(--dm-accent-teal)]
                        transition-colors duration-200 inline-flex items-center gap-1
                      "
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <p className="text-xs text-[var(--color-text-muted)] dark:text-[var(--dm-text-muted)]">
            © {year} SmartHire. All rights reserved.
          </p>
          <a
            href="mailto:support@smarthire.io"
            className="inline-flex items-center gap-2 text-xs text-[var(--color-text-muted)] dark:text-[var(--dm-text-muted)] hover:text-[var(--color-teal)] dark:hover:text-[var(--dm-accent-teal)] transition-colors"
          >
            <Mail className="w-3.5 h-3.5" aria-hidden="true" />
            support@smarthire.io
            <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
