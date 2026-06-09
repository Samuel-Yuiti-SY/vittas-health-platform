const sizeClasses = {
  sm: {
    mark: 'h-9 w-9',
    title: 'text-base',
    subtitle: 'text-[10px]',
  },
  md: {
    mark: 'h-11 w-11',
    title: 'text-lg',
    subtitle: 'text-xs',
  },
  lg: {
    mark: 'h-14 w-14',
    title: 'text-2xl',
    subtitle: 'text-sm',
  },
};

function LogoVittas({ className = '', markOnly = false, showSubtitle = true, size = 'md' }) {
  const sizes = sizeClasses[size] || sizeClasses.md;

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <span className={`inline-flex ${sizes.mark} items-center justify-center rounded-lg bg-vittas-blue text-white shadow-sm`}>
        <svg aria-hidden="true" className="h-2/3 w-2/3" fill="none" viewBox="0 0 48 48">
          <path
            d="M7 25h7l4-10 7 20 5-13h11"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
          />
          <path
            d="M24 8c-4-5-13-3-15 4-3 10 8 19 15 27 7-8 18-17 15-27-2-7-11-9-15-4Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
          />
        </svg>
      </span>
      {!markOnly && (
        <span className="min-w-0">
          <span className={`block font-extrabold leading-none tracking-normal text-vittas-navy ${sizes.title}`}>VITTAS</span>
          {showSubtitle && (
            <span className={`mt-1 block font-semibold leading-none text-vittas-green ${sizes.subtitle}`}>
              Saude publica digital
            </span>
          )}
        </span>
      )}
    </span>
  );
}

export default LogoVittas;
