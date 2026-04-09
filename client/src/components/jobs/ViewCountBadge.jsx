import { Eye } from 'lucide-react';

const ViewCountBadge = ({ count = 0, size = 'md', className = '' }) => {
  const sizes = {
    sm: {
      container: 'px-2 py-1',
      icon: 'w-3 h-3',
      text: 'text-xs',
    },
    md: {
      container: 'px-3 py-1.5',
      icon: 'w-4 h-4',
      text: 'text-sm',
    },
    lg: {
      container: 'px-4 py-2',
      icon: 'w-5 h-5',
      text: 'text-base',
    },
  };

  const sizeClasses = sizes[size] || sizes.md;

  // Format count for display (e.g., 1.2k, 5.3k, etc.)
  const formatCount = (num) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return (
    <div
      className={`
        inline-flex flex-shrink-0 items-center space-x-1 rounded-full
        bg-gray-100 dark:bg-dark-bg-secondary border border-gray-200 dark:border-dark-border
        text-gray-500 dark:text-gray-400
        ${sizeClasses.container}
        ${className}
      `}
      title={`${count.toLocaleString()} ${count === 1 ? 'view' : 'views'}`}
    >
      <Eye className={`${sizeClasses.icon} opacity-70`} />
      <span className={`${sizeClasses.text} font-medium tracking-wide`}>
        {formatCount(count)}
      </span>
    </div>
  );
};

export default ViewCountBadge;
