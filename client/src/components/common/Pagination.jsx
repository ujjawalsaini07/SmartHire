import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  hasNext,
  hasPrev 
}) => {
  const pages = [];
  const maxPagesToShow = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
  
  if (endPage - startPage < maxPagesToShow - 1) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  
  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrev}
        className="rounded-xl border border-light-border bg-white p-2 text-light-text transition-colors hover:border-primary-300 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-border dark:bg-dark-bg-secondary dark:text-dark-text dark:hover:border-primary-500 dark:hover:bg-dark-hover dark:hover:text-primary-300"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="rounded-xl border border-light-border bg-white px-4 py-2 text-light-text transition-colors hover:border-primary-300 hover:text-primary-600 dark:border-dark-border dark:bg-dark-bg-secondary dark:text-dark-text dark:hover:border-primary-500 dark:hover:bg-dark-hover dark:hover:text-primary-300"
          >
            1
          </button>
          {startPage > 2 && <span className="px-2">...</span>}
        </>
      )}
      
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`rounded-xl border px-4 py-2 font-semibold transition-colors ${
            page === currentPage
              ? 'border-primary-600 bg-primary-600 text-white'
              : 'border-light-border bg-white text-light-text hover:border-primary-300 hover:text-primary-600 dark:border-dark-border dark:bg-dark-bg-secondary dark:text-dark-text dark:hover:border-primary-500 dark:hover:bg-dark-hover dark:hover:text-primary-300'
          }`}
        >
          {page}
        </button>
      ))}
      
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="rounded-xl border border-light-border bg-white px-4 py-2 text-light-text transition-colors hover:border-primary-300 hover:text-primary-600 dark:border-dark-border dark:bg-dark-bg-secondary dark:text-dark-text dark:hover:border-primary-500 dark:hover:bg-dark-hover dark:hover:text-primary-300"
          >
            {totalPages}
          </button>
        </>
      )}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        className="rounded-xl border border-light-border bg-white p-2 text-light-text transition-colors hover:border-primary-300 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-border dark:bg-dark-bg-secondary dark:text-dark-text dark:hover:border-primary-500 dark:hover:bg-dark-hover dark:hover:text-primary-300"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Pagination;
