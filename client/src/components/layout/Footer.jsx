import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Sparkles } from 'lucide-react';

const Footer = () => {
  const footerLinks = {
    'For Job Seekers': [
      { label: 'Browse Jobs', to: '/jobs' },
      { label: 'Career Advice', to: '/about' },
      { label: 'Resume Tips', to: '/about' },
      { label: 'Interview Prep', to: '/about' },
    ],
    'For Employers': [
      { label: 'Post a Job', to: '/recruiter/post-job' },
      { label: 'Hiring Guide', to: '/about' },
      { label: 'Recruiter Resources', to: '/contact' },
      { label: 'Candidate Search', to: '/recruiter/candidates' },
    ],
    Company: [
      { label: 'About Us', to: '/about' },
      { label: 'Contact', to: '/contact' },
      { label: 'Platform Story', to: '/about' },
      { label: 'Security', to: '/privacy' },
    ],
    Legal: [
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Terms of Service', to: '/terms' },
      { label: 'Cookie Policy', to: '/privacy' },
      { label: 'Accessibility', to: '/contact' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, to: 'https://facebook.com', label: 'Facebook' },
    { icon: Twitter, to: 'https://twitter.com', label: 'Twitter' },
    { icon: Linkedin, to: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Instagram, to: 'https://instagram.com', label: 'Instagram' },
  ];

  return (
    <footer className="relative mt-16 border-t border-light-border/70 bg-light-bg-tertiary/70 backdrop-blur-md dark:border-dark-border/70 dark:bg-dark-bg-secondary/40">
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary-300 to-transparent opacity-70" />

      <div className="container-custom py-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Link to="/" className="mb-5 flex items-center space-x-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-600 shadow-soft">
                <span className="text-xl font-bold text-white">S</span>
              </div>
              <span className="text-2xl font-bold text-light-text dark:text-dark-text">SmartHire</span>
            </Link>

            <p className="mb-5 text-sm leading-relaxed text-light-text-secondary dark:text-dark-text-secondary">
              Precision hiring experiences for ambitious teams and world-class candidates.
            </p>

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700 dark:border-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
              <Sparkles className="h-3.5 w-3.5" />
              Trusted by modern hiring teams
            </div>

            <div className="flex items-center space-x-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.to}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-light-border bg-white p-2.5 text-light-text-secondary transition-all hover:-translate-y-0.5 hover:border-primary-300 hover:text-primary-600 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text-secondary dark:hover:border-primary-500 dark:hover:text-primary-300"
                    aria-label={social.label}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.08em] text-light-text dark:text-dark-text">
                {title}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-light-text-secondary transition-colors hover:text-primary-700 dark:text-dark-text-secondary dark:hover:text-primary-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-light-border/80 pt-6 text-sm text-light-text-secondary dark:border-dark-border/80 dark:text-dark-text-secondary md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} SmartHire. All rights reserved.</p>
          <div className="inline-flex items-center gap-2 rounded-full border border-light-border bg-white px-3 py-1 dark:border-dark-border dark:bg-dark-bg">
            <Mail className="h-4 w-4" />
            <span>support@smarthire.io</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
