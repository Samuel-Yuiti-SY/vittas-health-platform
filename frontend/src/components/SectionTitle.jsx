function SectionTitle({ align = 'left', description, eyebrow, title }) {
  const centered = align === 'center';

  return (
    <div className={centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      {eyebrow && <p className="text-sm font-bold uppercase tracking-normal text-vittas-green">{eyebrow}</p>}
      <h2 className="mt-2 text-2xl font-extrabold tracking-normal text-vittas-navy sm:text-3xl">{title}</h2>
      {description && <p className="mt-3 text-base leading-7 text-vittas-muted">{description}</p>}
    </div>
  );
}

export default SectionTitle;
