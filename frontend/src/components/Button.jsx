import { Link } from 'react-router-dom';

const baseClasses =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-vittas-blue focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60';

const variants = {
  primary: 'bg-vittas-blue text-white hover:bg-vittas-navy',
  secondary: 'bg-vittas-green text-white hover:bg-vittas-greenDark',
  soft: 'bg-vittas-blueSoft text-vittas-navy hover:bg-blue-100',
  ghost: 'bg-white text-vittas-navy ring-1 ring-vittas-border hover:bg-vittas-slate',
  danger: 'bg-vittas-danger text-white hover:bg-red-700',
};

function Button({ children, className = '', variant = 'primary', to, type = 'button', ...props }) {
  const classes = `${baseClasses} ${variants[variant] || variants.primary} ${className}`;

  if (to) {
    return (
      <Link className={classes} to={to} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} type={type} {...props}>
      {children}
    </button>
  );
}

export default Button;
