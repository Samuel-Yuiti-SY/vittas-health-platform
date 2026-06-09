function Card({ children, className = '', ...props }) {
  return (
    <div className={`rounded-lg border border-vittas-border bg-white p-4 shadow-sm ${className}`} {...props}>
      {children}
    </div>
  );
}

export default Card;
