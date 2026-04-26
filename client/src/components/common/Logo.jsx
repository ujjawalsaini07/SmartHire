import { Link } from 'react-router-dom';

/**
 * SmartHire Logo
 * @param {'full' | 'icon'} variant  - full = icon + wordmark, icon = icon only
 * @param {'sm' | 'md' | 'lg'}  size
 * @param {boolean} linkTo           - wraps in Link to="/"
 */
const Logo = ({ variant = 'full', size = 'md', className = '', linkTo = true }) => {
  const sizes = {
    sm: { icon: 28, text: '15px',  gap: 8  },
    md: { icon: 34, text: '17px',  gap: 10 },
    lg: { icon: 42, text: '22px',  gap: 12 },
  };
  const s = sizes[size] || sizes.md;

  const icon = (
    <svg
      width={s.icon}
      height={s.icon}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="sh-grad-a" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00C9B1"/>
          <stop offset="1" stopColor="#007A6B"/>
        </linearGradient>
        <linearGradient id="sh-grad-b" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#AAFFC7" stopOpacity="0.9"/>
          <stop offset="1" stopColor="#00C9B1"/>
        </linearGradient>
      </defs>
      {/* Background rounded square */}
      <rect width="40" height="40" rx="10" fill="url(#sh-grad-a)"/>
      {/* Briefcase shape */}
      <rect x="9" y="16" width="22" height="15" rx="2.5" fill="white" fillOpacity="0.95"/>
      {/* Briefcase handle */}
      <path d="M15 16v-2.5a5 5 0 0 1 10 0V16" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
      {/* Center divider line of briefcase */}
      <line x1="9" y1="22.5" x2="31" y2="22.5" stroke="url(#sh-grad-a)" strokeWidth="1.8" strokeOpacity="0.7"/>
      {/* Center latch */}
      <rect x="18" y="20.5" width="4" height="4" rx="1" fill="url(#sh-grad-a)"/>
      {/* Sparkle dot top-right */}
      <circle cx="30.5" cy="10" r="2" fill="url(#sh-grad-b)"/>
    </svg>
  );

  const wordmark = (
    <span
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: s.text,
        fontWeight: 800,
        letterSpacing: '-0.03em',
        color: 'var(--color-text-primary)',
        lineHeight: 1,
      }}
      className="dark:[color:var(--dm-text-primary)] select-none"
    >
      Smart<span style={{ color: 'var(--color-teal)' }}>Hire</span>
    </span>
  );

  const content = (
    <span
      className={`inline-flex items-center ${className}`}
      style={{ gap: s.gap }}
    >
      {icon}
      {variant === 'full' && wordmark}
    </span>
  );

  if (linkTo) {
    return (
      <Link to="/" aria-label="SmartHire — Home" className="outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)] focus-visible:ring-offset-2 rounded-[var(--radius-md)]">
        {content}
      </Link>
    );
  }
  return content;
};

export default Logo;
